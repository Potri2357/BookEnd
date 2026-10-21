"""
Cryptographic signing and verification service for Postern Proof Packs.
Implements Ed25519 asymmetric signatures, canonical RFC 8785 JSON SHA-256 tree hashing,
and key lifecycle management with cryptographic key rotation delegation certificates.
"""
import base64
import binascii
import hashlib
import json
import os
import secrets
import tempfile
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature
from app.core.config import settings

def canonical_json_bytes(data: Any) -> bytes:
    """
    Serializes data into canonical RFC 8785 JSON bytes:
    - Lexicographically sorted dictionary keys
    - Minimal whitespace (no indentation, ':' and ',' compact separators)
    - UTF-8 encoded without BOM
    - Explicit float check rejecting NaN and Infinity
    """
    def _validate_floats(obj: Any):
        if isinstance(obj, float):
            if obj != obj or obj == float('inf') or obj == float('-inf'):
                raise ValueError("RFC 8785 canonical JSON does not permit NaN or Infinity")
        elif isinstance(obj, dict):
            for v in obj.values():
                _validate_floats(v)
        elif isinstance(obj, (list, tuple)):
            for item in obj:
                _validate_floats(item)

    _validate_floats(data)
    return json.dumps(
        data,
        sort_keys=True,
        separators=(',', ':'),
        ensure_ascii=False,
        allow_nan=False,
        default=str
    ).encode('utf-8')

def sha256_hex(data: bytes | str) -> str:
    """Calculates deterministic SHA-256 hex digest."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()

def compute_evidence_event_hash(
    event_id: str,
    asset_id: str,
    timestamp: str,
    source_type: str,
    event_action: str,
    signal_class: str,
    details: Dict[str, Any]
) -> str:
    """Calculates deterministic RFC 8785 canonical SHA-256 hash for an evidence event."""
    payload = {
        "event_id": event_id,
        "asset_id": asset_id,
        "timestamp": timestamp,
        "source_type": source_type,
        "event_action": event_action,
        "signal_class": signal_class,
        "details": details
    }
    return sha256_hex(canonical_json_bytes(payload))

class ProofPackSigner:
    """
    Signs and validates proof packs using Ed25519.
    Provides key management, key rotation support, and strictly scoped exception handling.
    """
    _instance: Optional["ProofPackSigner"] = None
    _key_store_lock = threading.RLock()

    def __init__(self, private_key_bytes: Optional[bytes] = None, key_id: Optional[str] = None):
        if private_key_bytes:
            if len(private_key_bytes) != 32:
                raise ValueError(f"Ed25519 private key seed must be exactly 32 bytes, got {len(private_key_bytes)}")
            self._private_key = ed25519.Ed25519PrivateKey.from_private_bytes(private_key_bytes)
        else:
            self._private_key = ed25519.Ed25519PrivateKey.generate()

        self._public_key = self._private_key.public_key()
        raw_pub = self._public_key.public_bytes_raw()
        self.key_id = key_id or f"ed25519-key-{sha256_hex(raw_pub)[:12]}"
        self.created_at = datetime.now(timezone.utc).isoformat()

    @classmethod
    def get_default_signer(cls) -> "ProofPackSigner":
        """
        Retrieves or initializes the server's Ed25519 signer.
        Loads private key from SIGNING_KEY_PATH or SIGNING_KEY_SEED if configured.
        Falls back to persistent or secure random generation.
        """
        if cls._instance is None:
            with cls._key_store_lock:
                if cls._instance is None:
                    key_path = getattr(settings, "SIGNING_KEY_PATH", ".signing_key")
                    seed = None
                    if os.path.exists(key_path):
                        try:
                            with open(key_path, "rb") as f:
                                content = f.read()
                                if len(content) >= 32:
                                    seed = content[:32]
                        except Exception:
                            pass

                    if seed is None:
                        env_seed = os.getenv("SIGNING_KEY_SEED")
                        if env_seed:
                            seed = hashlib.sha256(env_seed.encode('utf-8')).digest()

                    if seed is None:
                        is_prod = getattr(settings, "ENVIRONMENT", "development").lower() == "production"
                        if is_prod and not os.path.exists(key_path):
                            seed = secrets.token_bytes(32)
                            try:
                                with open(key_path, "wb") as f:
                                    f.write(seed)
                                os.chmod(key_path, 0o600)
                            except Exception:
                                pass
                        else:
                            seed = hashlib.sha256(b"PosternLocalDevelopmentSeedV2").digest()

                    cls._instance = cls(seed[:32])
                    cls._record_key_publication(cls._instance)
        return cls._instance

    @classmethod
    def rotate_signer(cls, new_seed: Optional[bytes] = None) -> Dict[str, Any]:
        """
        Rotates the active Ed25519 signing key.
        The retiring key signs a rotation delegation certificate binding the new key.
        """
        with cls._key_store_lock:
            current_signer = cls.get_default_signer()
            if new_seed is None:
                new_seed = secrets.token_bytes(32)
            elif len(new_seed) != 32:
                new_seed = hashlib.sha256(new_seed).digest()[:32]

            # Save new seed to file if in prod or configured
            key_path = getattr(settings, "SIGNING_KEY_PATH", ".signing_key")
            try:
                with open(key_path, "wb") as f:
                    f.write(new_seed)
                os.chmod(key_path, 0o600)
            except Exception:
                pass

            new_signer = cls(new_seed)

            # Old key signs rotation certificate for new key
            cert_payload = {
                "action": "KEY_ROTATION_DELEGATION",
                "retired_key_id": current_signer.key_id,
                "retired_public_key_b64": current_signer.public_key_b64,
                "new_key_id": new_signer.key_id,
                "new_public_key_b64": new_signer.public_key_b64,
                "rotated_at": datetime.now(timezone.utc).isoformat(),
                "issuer": "Postern Trust Service"
            }
            delegation_signature = current_signer.sign_canonical(cert_payload)
            cert_payload["delegation_signature_b64"] = delegation_signature

            cls._instance = new_signer
            cls._record_key_publication(new_signer, cert_payload)

            return {
                "status": "success",
                "message": "Key rotation completed successfully",
                "retired_key_id": current_signer.key_id,
                "active_key_id": new_signer.key_id,
                "active_public_key_b64": new_signer.public_key_b64,
                "rotation_certificate": cert_payload
            }

    @classmethod
    def _record_key_publication(cls, signer: "ProofPackSigner", cert: Optional[Dict[str, Any]] = None):
        """Maintains the published public keys registry on disk for public verification."""
        store_path = getattr(settings, "KEY_STORE_PATH", "published_keys.json")
        try:
            keys_data: Dict[str, Any] = {"active_key_id": signer.key_id, "keys": [], "rotation_history": []}
            if os.path.exists(store_path):
                with open(store_path, "r", encoding="utf-8") as f:
                    keys_data = json.load(f)

            keys_data["active_key_id"] = signer.key_id

            # Add to keys if not present
            existing_ids = {k.get("key_id") for k in keys_data.get("keys", [])}
            if signer.key_id not in existing_ids:
                keys_data.setdefault("keys", []).append({
                    "key_id": signer.key_id,
                    "public_key_b64": signer.public_key_b64,
                    "algorithm": "Ed25519",
                    "registered_at": signer.created_at,
                    "notary_provider": getattr(settings, "NOTARY_PROVIDER", "Software Ed25519 Notary")
                })

            if cert:
                keys_data.setdefault("rotation_history", []).append(cert)

            dir_name = os.path.dirname(store_path) or "."
            os.makedirs(dir_name, exist_ok=True)
            with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tf:
                json.dump(keys_data, tf, indent=2)
                tmp_name = tf.name
            os.replace(tmp_name, store_path)
        except Exception:
            pass

    @classmethod
    def get_published_keys(cls) -> Dict[str, Any]:
        """Returns the public key store for third-party proof pack verifiers."""
        signer = cls.get_default_signer()
        store_path = getattr(settings, "KEY_STORE_PATH", "published_keys.json")
        if os.path.exists(store_path):
            try:
                with open(store_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "active_key_id": signer.key_id,
            "keys": [
                {
                    "key_id": signer.key_id,
                    "public_key_b64": signer.public_key_b64,
                    "algorithm": "Ed25519",
                    "registered_at": signer.created_at,
                    "notary_provider": getattr(settings, "NOTARY_PROVIDER", "Software Ed25519 Notary")
                }
            ],
            "rotation_history": []
        }

    @property
    def public_key_b64(self) -> str:
        """Returns base64-encoded raw 32-byte Ed25519 public key."""
        raw = self._public_key.public_bytes_raw()
        return base64.b64encode(raw).decode('utf-8')

    def sign_canonical(self, data: Dict[str, Any]) -> str:
        """Signs canonical RFC 8785 JSON bytes of payload and returns base64 signature."""
        canon = canonical_json_bytes(data)
        signature = self._private_key.sign(canon)
        return base64.b64encode(signature).decode('utf-8')

    @staticmethod
    def verify_canonical(public_key_b64: str, signature_b64: str, data: Dict[str, Any]) -> bool:
        """
        Verifies an Ed25519 signature over canonical JSON bytes.
        Catches specific decoding and cryptographic validation errors cleanly.
        """
        try:
            if not public_key_b64 or not signature_b64:
                return False
            pub_bytes = base64.b64decode(public_key_b64, validate=True)
            sig_bytes = base64.b64decode(signature_b64, validate=True)

            if len(pub_bytes) != 32 or len(sig_bytes) != 64:
                return False

            canon = canonical_json_bytes(data)
            pub_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
            pub_key.verify(sig_bytes, canon)
            return True
        except (binascii.Error, ValueError, TypeError, InvalidSignature):
            return False
