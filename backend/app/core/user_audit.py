"""
User Action Audit Logger.
Tracks user and administrative operations:
- Who viewed an asset story (VIEW_ASSET)
- Who exported reports or proof packs (EXPORT_REPORT, EXPORT_PROOF_PACK)
- Who overrode or approved a patch gate (OVERRIDE_GATE, APPROVE_GATE)
- Who rotated keys or modified configurations (ROTATE_KEYS, SYSTEM_ACTION)
- Who ingested custom logs (INGEST_LOGS)
Persists to a durable JSON log file with in-memory caching and search/filter support.
"""
import json
import os
import tempfile
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from app.core.config import settings

class UserActionEntry(BaseModel):
    id: str
    timestamp: str
    user_id: str
    user_name: str
    user_email: str
    role: str
    tenant_id: str
    action: str  # VIEW_ASSET, EXPORT_REPORT, EXPORT_PROOF_PACK, OVERRIDE_GATE, APPROVE_GATE, etc.
    target_id: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Dict[str, Any] = {}

class UserAuditLogger:
    _instance: Optional["UserAuditLogger"] = None
    _lock = threading.RLock()

    def __init__(self, log_path: Optional[str] = None):
        self.log_path = log_path or settings.USER_AUDIT_LOG_PATH
        self.entries: List[UserActionEntry] = []
        self._load()

    @classmethod
    def get_logger(cls) -> "UserAuditLogger":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def _load(self):
        with self._lock:
            if os.path.exists(self.log_path):
                try:
                    with open(self.log_path, "r", encoding="utf-8") as f:
                        raw = json.load(f)
                    self.entries = [UserActionEntry(**item) for item in raw]
                except Exception:
                    self.entries = []

    def _persist(self):
        if not self.log_path:
            return
        try:
            dir_name = os.path.dirname(self.log_path) or "."
            os.makedirs(dir_name, exist_ok=True)
            data = [e.model_dump() for e in self.entries]
            with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tf:
                json.dump(data, tf, indent=2)
                temp_name = tf.name
            os.replace(temp_name, self.log_path)
        except Exception:
            pass

    def log_action(
        self,
        user_id: str,
        user_name: str,
        user_email: str,
        role: str,
        tenant_id: str,
        action: str,
        target_id: str,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> UserActionEntry:
        with self._lock:
            now_iso = datetime.now(timezone.utc).isoformat()
            entry_id = f"act_{int(datetime.now(timezone.utc).timestamp()*1000)}_{len(self.entries)+1}"
            entry = UserActionEntry(
                id=entry_id,
                timestamp=now_iso,
                user_id=user_id,
                user_name=user_name,
                user_email=user_email,
                role=role,
                tenant_id=tenant_id,
                action=action,
                target_id=target_id,
                ip_address=ip_address,
                user_agent=user_agent,
                details=details or {}
            )
            self.entries.append(entry)
            self._persist()
            return entry

    def query(
        self,
        tenant_id: Optional[str] = None,
        action: Optional[str] = None,
        user_id: Optional[str] = None,
        target_id: Optional[str] = None,
        limit: int = 100
    ) -> List[UserActionEntry]:
        with self._lock:
            res = self.entries
            if tenant_id and tenant_id != "*":
                res = [e for e in res if e.tenant_id in (tenant_id, "*")]
            if action:
                res = [e for e in res if e.action.upper() == action.upper()]
            if user_id:
                res = [e for e in res if e.user_id == user_id]
            if target_id:
                res = [e for e in res if target_id in e.target_id]
            return list(reversed(res[-limit:]))
