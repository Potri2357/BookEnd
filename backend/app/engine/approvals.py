"""
Approvals and Collaboration Engine (F15).
Role-based approval routing, in-app collaboration threads, two-person rule enforcement
for high-impact containment/overrides, and immutable snapshot hashing of what was viewed.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.core.audit import AuditLedger
from app.core.crypto import sha256_hex, canonical_json_bytes

class ApprovalRequest:
    def __init__(
        self,
        request_id: str,
        asset_id: str,
        action_type: str,  # "contain_host", "approve_patch", "override_gate"
        requested_by: str,
        required_role: str,
        evidence_snapshot_hash: str,
        status: str = "pending",  # pending, approved, rejected
        approved_by: Optional[str] = None,
        second_approver: Optional[str] = None,
        approval_notes: Optional[str] = None,
        created_at: Optional[str] = None
    ):
        self.request_id = request_id
        self.asset_id = asset_id
        self.action_type = action_type
        self.requested_by = requested_by
        self.required_role = required_role
        self.evidence_snapshot_hash = evidence_snapshot_hash
        self.status = status
        self.approved_by = approved_by
        self.second_approver = second_approver
        self.approval_notes = approval_notes
        self.created_at = created_at or datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "request_id": self.request_id,
            "asset_id": self.asset_id,
            "action_type": self.action_type,
            "requested_by": self.requested_by,
            "required_role": self.required_role,
            "evidence_snapshot_hash": self.evidence_snapshot_hash,
            "status": self.status,
            "approved_by": self.approved_by,
            "second_approver": self.second_approver,
            "approval_notes": self.approval_notes,
            "created_at": self.created_at
        }

class CollaborationMessage:
    def __init__(self, msg_id: str, asset_id: str, sender: str, role: str, content: str, timestamp: str):
        self.msg_id = msg_id
        self.asset_id = asset_id
        self.sender = sender
        self.role = role
        self.content = content
        self.timestamp = timestamp

    def to_dict(self) -> Dict[str, Any]:
        return {
            "msg_id": self.msg_id,
            "asset_id": self.asset_id,
            "sender": self.sender,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp
        }

class ApprovalsManager:
    _instance = None

    def __init__(self):
        self.requests: Dict[str, ApprovalRequest] = {}
        self.messages: List[CollaborationMessage] = []

    @classmethod
    def get_instance(cls) -> "ApprovalsManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def create_request(
        self,
        asset_id: str,
        action_type: str,
        requested_by: str,
        required_role: str,
        evidence_data: Any
    ) -> ApprovalRequest:
        req_id = f"REQ-{len(self.requests) + 1:04d}"
        snap_hash = sha256_hex(canonical_json_bytes(evidence_data))
        req = ApprovalRequest(
            request_id=req_id,
            asset_id=asset_id,
            action_type=action_type,
            requested_by=requested_by,
            required_role=required_role,
            evidence_snapshot_hash=snap_hash
        )
        self.requests[req_id] = req

        # Add initial collaboration thread message
        self.add_message(
            asset_id=asset_id,
            sender="SYSTEM",
            role="PolicyEngine",
            content=f"Approval request [{req_id}] opened for action '{action_type}'. Evidence snapshot hash: {snap_hash[:16]}..."
        )

        AuditLedger.get_ledger().append(
            actor=requested_by,
            role="Requester",
            action="CREATE_APPROVAL_REQUEST",
            object_id=req_id,
            details={"asset_id": asset_id, "action": action_type, "snapshot_hash": snap_hash}
        )

        return req

    def respond_request(
        self,
        request_id: str,
        action: str,  # "approve" | "reject"
        approver: str,
        role: str,
        notes: str,
        second_approver: Optional[str] = None
    ) -> Optional[ApprovalRequest]:
        req = self.requests.get(request_id)
        if not req:
            return None

        # Two-person rule enforcement for high-impact actions
        if req.action_type in ["contain_host", "override_gate"] and not second_approver:
            # First approval recorded, still pending second approver
            req.approved_by = approver
            req.approval_notes = f"{notes} (Awaiting 2nd approver verification)"
            req.status = "pending_second_approval"
        else:
            req.status = "approved" if action == "approve" else "rejected"
            req.approved_by = approver
            if second_approver:
                req.second_approver = second_approver
            req.approval_notes = notes

        self.add_message(
            asset_id=req.asset_id,
            sender=approver,
            role=role,
            content=f"Decision on [{request_id}]: {req.status.upper()}. Notes: {notes}"
        )

        AuditLedger.get_ledger().append(
            actor=approver,
            role=role,
            action=f"{action.upper()}_APPROVAL_REQUEST",
            object_id=request_id,
            details={"status": req.status, "notes": notes, "second_approver": second_approver}
        )

        return req

    def add_message(self, asset_id: str, sender: str, role: str, content: str) -> CollaborationMessage:
        msg_id = f"MSG-{len(self.messages) + 1:05d}"
        now_ts = datetime.now(timezone.utc).isoformat()
        msg = CollaborationMessage(msg_id, asset_id, sender, role, content, now_ts)
        self.messages.append(msg)
        return msg

    def get_messages_for_asset(self, asset_id: str) -> List[Dict[str, Any]]:
        return [m.to_dict() for m in self.messages if m.asset_id == asset_id]

    def list_requests_for_asset(self, asset_id: str) -> List[Dict[str, Any]]:
        return [r.to_dict() for r in self.requests.values() if r.asset_id == asset_id]
