"""
Analyst Feedback Loop (F22 - V1).
Allows security analysts to confirm, dismiss, or mark findings as benign look-alikes.
Changes are auditable, versioned, and prevent silent model drift.
"""
from datetime import datetime, timezone
from typing import Dict, List
from app.core.audit import AuditLedger
from app.models.schemas import AnalystFeedback

class FeedbackManager:
    _instance = None

    def __init__(self):
        self.feedbacks: List[AnalystFeedback] = []

    @classmethod
    def get_instance(cls) -> "FeedbackManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def submit_feedback(
        self,
        asset_id: str,
        advisory_id: str,
        finding_id: str,
        action: str,  # confirm, dismiss, mark_benign
        analyst: str,
        rationale: str
    ) -> AnalystFeedback:
        fb_id = f"FB-{len(self.feedbacks) + 1:04d}"
        fb = AnalystFeedback(
            id=fb_id,
            asset_id=asset_id,
            advisory_id=advisory_id,
            finding_id=finding_id,
            action=action,
            analyst=analyst,
            rationale=rationale,
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        self.feedbacks.append(fb)

        AuditLedger.get_ledger().append(
            actor=analyst,
            role="SecurityAnalyst",
            action="SUBMIT_ANALYST_FEEDBACK",
            object_id=finding_id,
            details={
                "asset_id": asset_id,
                "action": action,
                "rationale": rationale
            }
        )
        return fb

    def list_feedback_for_asset(self, asset_id: str) -> List[AnalystFeedback]:
        return [f for f in self.feedbacks if f.asset_id == asset_id]
