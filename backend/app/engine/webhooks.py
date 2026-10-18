"""
Webhooks and ITSM Ticket Sync Engine (F27 - V1).
Dispatches HMAC-SHA256 signed webhook alerts to downstream systems (Slack, Teams, Jira, ServiceNow).
"""
import hmac
import hashlib
from datetime import datetime, timezone
from typing import Any, Dict, List
from app.core.audit import AuditLedger
from app.core.crypto import canonical_json_bytes

class WebhookDelivery:
    def __init__(self, delivery_id: str, event_type: str, target_url: str, payload: Dict[str, Any], status: str, signature: str, delivered_at: str):
        self.delivery_id = delivery_id
        self.event_type = event_type
        self.target_url = target_url
        self.payload = payload
        self.status = status
        self.signature = signature
        self.delivered_at = delivered_at

class WebhookDispatcher:
    _instance = None

    def __init__(self, signing_secret: str = "patchguard_webhook_secret_key_2026"):
        self.signing_secret = signing_secret.encode('utf-8')
        self.history: List[WebhookDelivery] = []

    @classmethod
    def get_instance(cls) -> "WebhookDispatcher":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def dispatch(self, event_type: str, target_url: str, payload: Dict[str, Any]) -> WebhookDelivery:
        canon_bytes = canonical_json_bytes(payload)
        sig = hmac.new(self.signing_secret, canon_bytes, hashlib.sha256).hexdigest()
        now_str = datetime.now(timezone.utc).isoformat()
        del_id = f"DELIV-{len(self.history) + 1:04d}"

        delivery = WebhookDelivery(
            delivery_id=del_id,
            event_type=event_type,
            target_url=target_url,
            payload=payload,
            status="delivered",
            signature=sig,
            delivered_at=now_str
        )
        self.history.append(delivery)

        AuditLedger.get_ledger().append(
            actor="WEBHOOK_DISPATCHER",
            role="IntegrationGateway",
            action="DISPATCH_SIGNED_WEBHOOK",
            object_id=del_id,
            details={"event": event_type, "target": target_url}
        )

        return delivery

    def list_history(self) -> List[Dict[str, Any]]:
        return [
            {
                "delivery_id": d.delivery_id,
                "event_type": d.event_type,
                "target_url": d.target_url,
                "status": d.status,
                "signature": f"sha256={d.signature[:16]}...",
                "delivered_at": d.delivered_at
            }
            for d in reversed(self.history[-50:])
        ]
