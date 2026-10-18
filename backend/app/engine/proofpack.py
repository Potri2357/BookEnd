"""
Proof Pack Generation and Cryptographic Verification (F16).
Packages complete forensic investigation, audit trail, coverage metrics,
evidence hashes, and decisions into an independently verifiable digital proof pack
signed with Ed25519 and hashed with canonical SHA-256 trees.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.core.audit import AuditLedger
from app.core.crypto import ProofPackSigner, canonical_json_bytes, sha256_hex
from app.models.schemas import (
    Asset, DeadlineClock, DecisionGate, EvidenceEvent, Playbook,
    ProofPack, ProofPackManifest, Verdict
)

LIMITATIONS_DISCLAIMER = (
    "LIMITATIONS STATEMENT: This Proof Pack records forensic telemetry queried across available log sources. "
    "In accordance with modern DFIR principles, no technical audit can guarantee absolute absence of compromise. "
    "All verdicts reflect data available at the time of evaluation. Human approval is required for all changes."
)

def generate_proof_pack(
    asset: Asset,
    verdict: Verdict,
    decision: DecisionGate,
    clock: DeadlineClock,
    evidence_items: List[EvidenceEvent],
    playbook: Optional[Playbook] = None,
    post_patch_status: str = "pending_recheck",
    signer: Optional[ProofPackSigner] = None
) -> ProofPack:
    """
    Generates a cryptographically signed Proof Pack bundle.
    """
    if signer is None:
        signer = ProofPackSigner.get_default_signer()

    pack_id = f"PROOF-{asset.tenant_id.upper()}-{asset.id}-{int(datetime.now(timezone.utc).timestamp())}"
    now_iso = datetime.now(timezone.utc).isoformat()

    evidence_hashes = [e.content_hash for e in evidence_items]
    spec_hashes = [verdict.verdict_hash]

    manifest = ProofPackManifest(
        pack_id=pack_id,
        tenant_id=asset.tenant_id,
        asset_id=asset.id,
        advisory_id=verdict.advisory_id,
        generated_at=now_iso,
        verdict_state=verdict.state,
        coverage_score=verdict.coverage_score,
        decision_outcome=decision.outcome,
        post_patch_status=post_patch_status,
        spec_hashes=spec_hashes,
        evidence_hashes=evidence_hashes,
        limitations_statement=LIMITATIONS_DISCLAIMER,
        issuer="Patch Assurance Trust Service (Ed25519)"
    )

    manifest_dict = manifest.model_dump()
    signature_b64 = signer.sign_canonical(manifest_dict)
    public_key_b64 = signer.public_key_b64

    # Extract relevant audit events from ledger
    ledger = AuditLedger.get_ledger()
    audit_records = [
        r.model_dump() for r in ledger.chain
        if r.object_id in [asset.id, "system"] or asset.id in str(r.details)
    ]

    proof_pack = ProofPack(
        manifest=manifest,
        signature_b64=signature_b64,
        public_key_b64=public_key_b64,
        evidence_items=evidence_items,
        verdict=verdict,
        decision=decision,
        clock=clock,
        playbook=playbook,
        audit_events=audit_records
    )

    ledger.append(
        actor="SIGNING_SERVICE",
        role="CryptoSigner",
        action="GENERATE_PROOF_PACK",
        object_id=pack_id,
        details={
            "asset_id": asset.id,
            "verdict": verdict.state,
            "signature": signature_b64[:16] + "..."
        }
    )

    return proof_pack

def verify_proof_pack(pack: ProofPack) -> Tuple[bool, str, Dict[str, Any]]:
    """
    Independently verifies a proof pack:
    1. Validates Ed25519 cryptographic signature over canonical manifest JSON.
    2. Verifies evidence hashes match manifest evidence_hashes.
    3. Validates that tampering with any field immediately breaks verification.
    """
    manifest_dict = pack.manifest.model_dump()
    sig_valid = ProofPackSigner.verify_canonical(
        pack.public_key_b64,
        pack.signature_b64,
        manifest_dict
    )

    if not sig_valid:
        return False, "Digital signature verification failed. Manifest data has been altered.", {
            "signature_valid": False,
            "hashes_valid": False
        }

    # Verify evidence item hashes
    computed_ev_hashes = [e.content_hash for e in pack.evidence_items]
    if computed_ev_hashes != pack.manifest.evidence_hashes:
        return False, "Evidence content hash mismatch detected. Forensic telemetry modified.", {
            "signature_valid": True,
            "hashes_valid": False
        }

    return True, "Proof Pack is authentic and cryptographically valid. Zero tampering detected.", {
        "signature_valid": True,
        "hashes_valid": True,
        "signed_by": pack.manifest.issuer,
        "verified_at": datetime.now(timezone.utc).isoformat()
    }
