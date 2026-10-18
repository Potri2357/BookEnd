"""
Patch Gate and Decision Policy Engine (F8).
Maps forensic verdicts, exposure tiers, and coverage into actionable patch gate outcomes:
- Patch now
- Patch with caution
- Hold and review
- Contain first then patch
Enforces change-hold locks, overrides with auditable justification, and approval routing.
"""
from datetime import datetime, timezone
from typing import Optional, Tuple
from app.core.audit import AuditLedger
from app.models.schemas import Asset, DecisionGate, Verdict

OUTCOME_PATCH_NOW = "Patch now"
OUTCOME_PATCH_CAUTION = "Patch with caution"
OUTCOME_HOLD_REVIEW = "Hold and review"
OUTCOME_CONTAIN_FIRST = "Contain first then patch"

def evaluate_patch_gate(
    asset: Asset,
    verdict: Verdict,
    audit_actor: str = "POLICY_ENGINE"
) -> DecisionGate:
    """
    Evaluates policy decision matrix:
    - Likely compromised -> Contain first then patch (Gate LOCKED, requires Incident Lead + Approver)
    - Suspicious -> Hold and review (Gate LOCKED, requires Senior Analyst)
    - Cannot verify -> Patch with caution (Gate UNLOCKED with assume-breach controls, requires Asset Owner)
    - No evidence found -> Patch now (Gate UNLOCKED, requires Asset Owner)
    """
    if verdict.state == "Likely compromised":
        outcome = OUTCOME_CONTAIN_FIRST
        gate_locked = True
        roles = ["Incident_Lead", "Security_Approver"]
    elif verdict.state == "Suspicious":
        outcome = OUTCOME_HOLD_REVIEW
        gate_locked = True
        roles = ["Senior_Analyst", "Security_Approver"]
    elif verdict.state == "Cannot verify":
        outcome = OUTCOME_PATCH_CAUTION
        gate_locked = False
        roles = ["Asset_Owner", "Analyst"]
    else:  # No evidence found
        outcome = OUTCOME_PATCH_NOW
        gate_locked = False
        roles = ["Asset_Owner"]

    gate = DecisionGate(
        asset_id=asset.id,
        advisory_id=verdict.advisory_id,
        outcome=outcome,
        gate_locked=gate_locked,
        required_roles=roles,
        override_applied=False,
        status="pending",
        created_at=datetime.now(timezone.utc).isoformat()
    )

    # Log gate calculation to audit ledger
    AuditLedger.get_ledger().append(
        actor=audit_actor,
        role="PolicyEngine",
        action="EVALUATE_PATCH_GATE",
        object_id=asset.id,
        details={
            "verdict": verdict.state,
            "exposure_tier": asset.exposure_tier,
            "outcome": outcome,
            "gate_locked": gate_locked
        }
    )

    return gate

def apply_gate_override(
    gate: DecisionGate,
    approver: str,
    reason: str,
    role: str = "Security_Approver"
) -> DecisionGate:
    """
    Applies an administrative emergency override to unlock the patch gate.
    Requires recorded reason and creates an immutable audit trail entry.
    """
    updated_gate = gate.model_copy(update={
        "gate_locked": False,
        "override_applied": True,
        "override_reason": reason,
        "override_approver": approver,
        "status": "overridden"
    })

    AuditLedger.get_ledger().append(
        actor=approver,
        role=role,
        action="OVERRIDE_PATCH_GATE",
        object_id=gate.asset_id,
        details={
            "previous_outcome": gate.outcome,
            "override_reason": reason,
            "unlocked": True
        }
    )

    return updated_gate
