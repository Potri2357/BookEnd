"""
Containment Guidance and Residue Playbooks (F9).
Guides essential steps that patching alone does not accomplish:
host isolation, memory/evidence preservation, active session invalidation,
credential rotation, and persistence removal with step verification.
"""
from datetime import datetime, timezone
from typing import List, Optional
from app.core.audit import AuditLedger
from app.models.schemas import Advisory, Asset, Playbook, PlaybookStep

def generate_playbook_for_asset(asset: Asset, advisory: Advisory) -> Playbook:
    """
    Generates a tailored containment & cleanup playbook for an asset under investigation.
    """
    steps: List[PlaybookStep] = [
        PlaybookStep(
            step_id="STEP-CONT-01",
            title="Network Containment / VLAN Isolation",
            phase="containment",
            description=f"Isolate {asset.host_name} ({asset.ip_address}) from production network to quarantine VLAN to prevent lateral movement.",
            owner="secops-analyst@postern.local",
            status="pending",
            verification_method="Verify ping loss from internal LAN subnet while preserving access via out-of-band management."
        ),
        PlaybookStep(
            step_id="STEP-CONT-02",
            title="Forensic Evidence Preservation",
            phase="containment",
            description="Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
            owner="dfir-lead@postern.local",
            status="pending",
            verification_method="Confirm cryptographic SHA-256 hash generated for memory dump image."
        ),
        PlaybookStep(
            step_id="STEP-CLEAN-01",
            title="Terminate All Stolen Active Sessions",
            phase="cleanup",
            description="Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
            owner="sysadmin@postern.local",
            status="pending",
            verification_method="Query auth daemon session table to confirm 0 active sessions remain."
        ),
        PlaybookStep(
            step_id="STEP-CLEAN-02",
            title="Remove Unauthorized Web Shells & Implants",
            phase="cleanup",
            description="Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
            owner="sysadmin@postern.local",
            status="pending",
            verification_method="Run file integrity checker to verify directory matches pristine distribution hash."
        ),
        PlaybookStep(
            step_id="STEP-CLEAN-03",
            title="Rotate Administrator & Service Credentials",
            phase="cleanup",
            description="Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
            owner="iam-admin@postern.local",
            status="pending",
            verification_method="Check password last-changed timestamp in directory service."
        ),
        PlaybookStep(
            step_id="STEP-CLEAN-04",
            title="Audit Local Accounts for Dormant Backdoors",
            phase="cleanup",
            description="Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
            owner="secops-analyst@postern.local",
            status="pending",
            verification_method="Verify diff against baseline authorized user manifest."
        )
    ]

    return Playbook(
        id=f"PLAYBOOK-{asset.id}-{advisory.cve_id}",
        advisory_id=advisory.id,
        asset_id=asset.id,
        steps=steps
    )

def update_playbook_step_status(
    playbook: Playbook,
    step_id: str,
    new_status: str,
    verified_by: str
) -> Playbook:
    """Updates a step status and records verified timestamp and verifier."""
    updated_steps = []
    now_str = datetime.now(timezone.utc).isoformat()
    for s in playbook.steps:
        if s.step_id == step_id:
            updated = s.model_copy(update={
                "status": new_status,
                "verified_by": verified_by,
                "verified_at": now_str if new_status == "verified" else None
            })
            updated_steps.append(updated)
        else:
            updated_steps.append(s)

    AuditLedger.get_ledger().append(
        actor=verified_by,
        role="PlaybookOperator",
        action="UPDATE_PLAYBOOK_STEP",
        object_id=f"{playbook.asset_id}:{step_id}",
        details={"status": new_status, "step_id": step_id}
    )

    return playbook.model_copy(update={"steps": updated_steps})
