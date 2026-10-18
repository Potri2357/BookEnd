"""
Cryptographic signing and verification service for BookEnd Proof Packs.
Implements Ed25519 asymmetric signatures and canonical JSON SHA-256 tree hashing.
"""
import base64
import hashlib
import json
from typing import Any, Dict
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

def canonical_json_bytes(data: Any) -> bytes:
    """
    Serializes a dictionary or value into canonical RFC 8785 JSON bytes:
    Sorted keys, compact separators (no whitespace), UTF-8 encoded.
    """
    return json.dumps(
        data,
        sort_keys=True,
        separators=(',', ':'),
        ensure_ascii=False
    ).encode('utf-8')

def sha256_hex(data: bytes | str) -> str:
    """Calculates SHA-256 hex digest."""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()

class ProofPackSigner:
    """
    Signs proof packs using Ed25519.
    Provides key generation, deterministic verification, and key serialization.
    """
    _instance = None

    def __init__(self, private_key_bytes: bytes | None = None):
        if private_key_bytes:
            self._private_key = ed25519.Ed25519PrivateKey.from_private_bytes(private_key_bytes)
        else:
            self._private_key = ed25519.Ed25519PrivateKey.generate()
        self._public_key = self._private_key.public_key()

    @classmethod
    def get_default_signer(cls) -> "ProofPackSigner":
        if cls._instance is None:
            # Deterministic seed for demo consistency or dynamic generation
            seed = b"PatchGuardProofPackSigningKey_32B!"
            cls._instance = cls(seed[:32])
        return cls._instance

    @property
    def public_key_b64(self) -> str:
        raw = self._public_key.public_bytes_raw()
        return base64.b64encode(raw).decode('utf-8')

    def sign_canonical(self, data: Dict[str, Any]) -> str:
        """Signs canonical JSON bytes of payload and returns base64 signature."""
        canon = canonical_json_bytes(data)
        signature = self._private_key.sign(canon)
        return base64.b64encode(signature).decode('utf-8')

    @staticmethod
    def verify_canonical(public_key_b64: str, signature_b64: str, data: Dict[str, Any]) -> bool:
        """Verifies an Ed25519 signature over canonical JSON bytes."""
        try:
            pub_bytes = base64.b64decode(public_key_b64)
            sig_bytes = base64.b64decode(signature_b64)
            canon = canonical_json_bytes(data)
            pub_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
            pub_key.verify(sig_bytes, canon)
            return True
        except (ValueError, InvalidSignature, Exception):
            return False
