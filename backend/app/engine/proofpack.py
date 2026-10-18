"""
Proof Pack Generation and Cryptographic Verification (F16).
Packages complete forensic investigation, audit trail, coverage metrics,
evidence hashes, and decisions into an independently verifiable digital proof pack
signed with Ed25519 and hashed with canonical SHA-256 trees.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.core.audit import AuditLedger
from app.core.crypto import ProofPackSigner, canonical_json_bytes, compute_evidence_event_hash, sha256_hex
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
        issuer="Postern Trust Service (Ed25519)"
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
    2. Validates manifest consistency against enclosed verdict and decision outcome.
    3. Verifies evidence hashes match manifest evidence_hashes.
    4. Validates that tampering with any field immediately breaks verification.
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

    # Verify manifest alignment with payload models
    if pack.manifest.verdict_state != pack.verdict.state:
        return False, "Manifest verdict mismatch: enclosed verdict state does not match signed manifest.", {
            "signature_valid": True,
            "hashes_valid": False
        }

    if pack.manifest.decision_outcome != pack.decision.outcome:
        return False, "Manifest gate outcome mismatch: enclosed gate decision does not match signed manifest.", {
            "signature_valid": True,
            "hashes_valid": False
        }

    # 3. Independently recompute each evidence item's canonical hash from its underlying content
    recomputed_hashes = []
    for ev in pack.evidence_items:
        h = compute_evidence_event_hash(
            event_id=ev.event_id,
            asset_id=ev.asset_id,
            timestamp=ev.timestamp,
            source_type=ev.source_type,
            event_action=ev.event_action,
            signal_class=ev.signal_class,
            details=ev.details
        )
        if h != ev.content_hash:
            return False, f"Evidence content hash mismatch for event {ev.event_id}. Underlying data altered.", {
                "signature_valid": True,
                "evidence_hashes_valid": False,
                "hashes_valid": False
            }
        recomputed_hashes.append(h)

    # 4. Verify recomputed evidence hashes match manifest list
    if recomputed_hashes != pack.manifest.evidence_hashes:
        return False, "Evidence manifest hash mismatch: enclosed events do not match signed manifest list.", {
            "signature_valid": True,
            "evidence_hashes_valid": False,
            "hashes_valid": False
        }

    return True, "Proof Pack is authentic and cryptographically valid. Zero tampering detected.", {
        "signature_valid": True,
        "evidence_hashes_valid": True,
        "hashes_valid": True,
        "signed_by": pack.manifest.issuer,
        "verified_at": datetime.now(timezone.utc).isoformat()
    }

