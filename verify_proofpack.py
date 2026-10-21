#!/usr/bin/env python3
"""
Postern Standalone Proof Pack Verifier CLI.
Independent, offline cryptographic verification of Postern Proof Packs.
Validates Ed25519 signature over canonical RFC 8785 JSON manifest and SHA-256 evidence tree hashes.

Usage:
    python verify_proofpack.py path/to/proof_pack.json
    cat proof_pack.json | python verify_proofpack.py -
"""
import base64
import binascii
import hashlib
import json
import sys
from typing import Any, Dict, List, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.exceptions import InvalidSignature

def canonical_json_bytes(data: Any) -> bytes:
    """Canonical RFC 8785 JSON serializer."""
    def _validate(obj):
        if isinstance(obj, float):
            if obj != obj or obj == float('inf') or obj == float('-inf'):
                raise ValueError("RFC 8785 canonical JSON does not permit NaN or Infinity")
        elif isinstance(obj, dict):
            for v in obj.values():
                _validate(v)
        elif isinstance(obj, (list, tuple)):
            for item in obj:
                _validate(item)
    _validate(data)
    return json.dumps(
        data,
        sort_keys=True,
        separators=(',', ':'),
        ensure_ascii=False,
        allow_nan=False,
        default=str
    ).encode('utf-8')

def sha256_hex(data: bytes | str) -> str:
    if isinstance(data, str):
        data = data.encode('utf-8')
    return hashlib.sha256(data).hexdigest()

def compute_evidence_event_hash(ev: Dict[str, Any]) -> str:
    payload = {
        "event_id": ev.get("event_id"),
        "asset_id": ev.get("asset_id"),
        "timestamp": ev.get("timestamp"),
        "source_type": ev.get("source_type"),
        "event_action": ev.get("event_action"),
        "signal_class": ev.get("signal_class"),
        "details": ev.get("details", {})
    }
    return sha256_hex(canonical_json_bytes(payload))

def verify_proof_pack_data(pack: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
    manifest = pack.get("manifest")
    sig_b64 = pack.get("signature_b64")
    pub_key_b64 = pack.get("public_key_b64")

    if not manifest or not sig_b64 or not pub_key_b64:
        return False, "Missing required fields in Proof Pack (manifest, signature_b64, public_key_b64)", {}

    # 1. Verify Ed25519 signature over canonical manifest
    try:
        pub_bytes = base64.b64decode(pub_key_b64, validate=True)
        sig_bytes = base64.b64decode(sig_b64, validate=True)
        if len(pub_bytes) != 32 or len(sig_bytes) != 64:
            return False, f"Invalid key/signature length: pub={len(pub_bytes)} (req 32), sig={len(sig_bytes)} (req 64)", {}

        canon_manifest = canonical_json_bytes(manifest)
        ed_key = ed25519.Ed25519PublicKey.from_public_bytes(pub_bytes)
        ed_key.verify(sig_bytes, canon_manifest)
    except InvalidSignature:
        return False, "Ed25519 Signature Verification FAILED! The manifest was altered or signature is invalid.", {}
    except Exception as e:
        return False, f"Cryptographic verification error: {str(e)}", {}

    # 2. Check enclosed verdict alignment
    verdict = pack.get("verdict", {})
    if manifest.get("verdict_state") != verdict.get("state"):
        return False, f"Verdict mismatch: manifest '{manifest.get('verdict_state')}' != payload '{verdict.get('state')}'", {}

    # 3. Check enclosed decision alignment
    decision = pack.get("decision", {})
    if manifest.get("decision_outcome") != decision.get("outcome"):
        return False, f"Gate outcome mismatch: manifest '{manifest.get('decision_outcome')}' != payload '{decision.get('outcome')}'", {}

    # 4. Check evidence hashes
    evidence_items = pack.get("evidence_items", [])
    recomputed = []
    for ev in evidence_items:
        h = compute_evidence_event_hash(ev)
        if h != ev.get("content_hash"):
            return False, f"Tampered evidence event: {ev.get('event_id')} hash recomputed={h} != enclosed={ev.get('content_hash')}", {}
        recomputed.append(h)

    manifest_evidence_hashes = manifest.get("evidence_hashes", [])
    if recomputed != manifest_evidence_hashes:
        return False, "Evidence tree hash mismatch against manifest list", {}

    return True, "Proof Pack is AUTHENTIC and cryptographically verified. Zero tampering detected.", {
        "pack_id": manifest.get("pack_id"),
        "asset_id": manifest.get("asset_id"),
        "tenant_id": manifest.get("tenant_id"),
        "verdict_state": manifest.get("verdict_state"),
        "decision_outcome": manifest.get("decision_outcome"),
        "issuer": manifest.get("issuer"),
        "evidence_events_count": len(evidence_items)
    }

def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print("Usage: python verify_proofpack.py <path_to_proofpack.json | ->")
        sys.exit(0)

    arg = sys.argv[1]
    try:
        if arg == "-":
            raw_content = sys.stdin.read()
        else:
            with open(arg, "r", encoding="utf-8") as f:
                raw_content = f.read()

        pack = json.loads(raw_content)
    except Exception as e:
        print(f"[-] Error reading Proof Pack: {e}")
        sys.exit(1)

    print("==================================================")
    print("Postern Cryptographic Proof Pack Verifier (Ed25519)")
    print("==================================================")
    is_valid, msg, details = verify_proof_pack_data(pack)

    if is_valid:
        print(f"[+] STATUS: VALID")
        print(f"[+] MESSAGE: {msg}")
        for k, v in details.items():
            print(f"    - {k}: {v}")
        print("==================================================")
        sys.exit(0)
    else:
        print(f"[-] STATUS: INVALID / TAMPERED")
        print(f"[-] FAILURE: {msg}")
        print("==================================================")
        sys.exit(2)

if __name__ == "__main__":
    main()
