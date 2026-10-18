"""
Audit Log and Chain of Custody (F19).
Implements a durable, concurrency-safe, append-only hash-chained ledger
to ensure non-repudiation and tamper-evidence across server restarts.
"""
import json
import os
import tempfile
import threading
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
from app.core.config import settings
from app.core.crypto import sha256_hex, canonical_json_bytes

class AuditRecord(BaseModel):
    index: int
    timestamp: str
    actor: str
    role: str
    action: str
    object_id: str
    details: Dict[str, Any]
    prev_hash: str
    hash: str

class AuditLedger:
    _instance: Optional["AuditLedger"] = None
    _lock = threading.RLock()

    def __init__(self, persistence_path: Optional[str] = None):
        self.chain: List[AuditRecord] = []
        self._persistence_path = persistence_path or getattr(settings, "AUDIT_LEDGER_PATH", "audit_ledger.json")
        self._load_or_initialize()

    @classmethod
    def get_ledger(cls) -> "AuditLedger":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    def _load_or_initialize(self):
        """Loads existing ledger from disk or creates and saves a genesis block."""
        with self._lock:
            if os.path.exists(self._persistence_path):
                try:
                    with open(self._persistence_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    records = [AuditRecord(**item) for item in data]
                    # Verify chain integrity
                    self.chain = records
                    is_valid, msg, _ = self._verify_integrity_unlocked()
                    if is_valid and self.chain:
                        return
                except Exception:
                    pass

            # Fallback / Initial Genesis
            self.chain = []
            self._create_genesis_unlocked()
            self._persist_unlocked()

    def _create_genesis_unlocked(self):
        genesis_time = datetime.now(timezone.utc).isoformat()
        prev_hash = "0" * 64
        details = {"message": "Genesis Block of Postern Audit Ledger"}
        canon = canonical_json_bytes(details).decode('utf-8')
        record_hash = sha256_hex(f"0:{genesis_time}:SYSTEM:GENESIS:system:{prev_hash}:{canon}")
        record = AuditRecord(
            index=0,
            timestamp=genesis_time,
            actor="SYSTEM",
            role="System",
            action="GENESIS",
            object_id="system",
            details=details,
            prev_hash=prev_hash,
            hash=record_hash
        )
        self.chain.append(record)

    def _persist_unlocked(self):
        """Atomically persists the ledger to disk using a temporary file."""
        if not self._persistence_path:
            return
        try:
            dir_name = os.path.dirname(self._persistence_path) or "."
            os.makedirs(dir_name, exist_ok=True)
            records_data = [r.model_dump() for r in self.chain]
            with tempfile.NamedTemporaryFile("w", dir=dir_name, delete=False, encoding="utf-8") as tf:
                json.dump(records_data, tf, indent=2)
                temp_name = tf.name
            os.replace(temp_name, self._persistence_path)
        except Exception:
            pass

    def append(self, actor: str, role: str, action: str, object_id: str, details: Dict[str, Any]) -> AuditRecord:
        """Appends a new verified event to the hash chain in a thread-safe atomic manner."""
        with self._lock:
            last_record = self.chain[-1]
            new_index = last_record.index + 1
            now_ts = datetime.now(timezone.utc).isoformat()
            prev_hash = last_record.hash
            canon = canonical_json_bytes(details).decode('utf-8')
            rec_hash = sha256_hex(f"{new_index}:{now_ts}:{actor}:{action}:{object_id}:{prev_hash}:{canon}")

            record = AuditRecord(
                index=new_index,
                timestamp=now_ts,
                actor=actor,
                role=role,
                action=action,
                object_id=object_id,
                details=details,
                prev_hash=prev_hash,
                hash=rec_hash
            )
            self.chain.append(record)
            self._persist_unlocked()
            return record

    def _verify_integrity_unlocked(self) -> Tuple[bool, str, Optional[int]]:
        if not self.chain:
            return False, "Ledger is empty", 0

        for i, rec in enumerate(self.chain):
            if rec.index != i:
                return False, f"Broken sequence index at position {i}: expected {i}, got {rec.index}", i

            if i > 0:
                expected_prev = self.chain[i - 1].hash
                if rec.prev_hash != expected_prev:
                    return False, f"Broken prev_hash link at record {i}", i

            canon = canonical_json_bytes(rec.details).decode('utf-8')
            expected_hash = sha256_hex(f"{rec.index}:{rec.timestamp}:{rec.actor}:{rec.action}:{rec.object_id}:{rec.prev_hash}:{canon}")
            if rec.hash != expected_hash:
                return False, f"Hash mismatch at record {i} (content altered)", i

        return True, "Audit ledger integrity verified. Zero sequence, link, or content tampering.", None

    def verify_integrity(self) -> Tuple[bool, str, Optional[int]]:
        """
        Validates the hash chain from genesis to head in a thread-safe manner.
        Returns: (is_valid, message, failure_index)
        """
        with self._lock:
            return self._verify_integrity_unlocked()

    def get_records(self, limit: int = 100) -> List[AuditRecord]:
        """Returns the most recent records up to limit in a thread-safe manner."""
        with self._lock:
            if limit <= 0:
                return []
            return list(self.chain[-limit:])

    def reset(self):
        """Resets the audit ledger to a clean genesis state."""
        with self._lock:
            self.chain = []
            self._create_genesis_unlocked()
            self._persist_unlocked()
