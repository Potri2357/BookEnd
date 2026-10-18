"""
Audit Log and Chain of Custody (F19).
Implements an append-only hash-chained ledger to ensure non-repudiation and tamper-evidence.
"""
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field
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
    _instance = None

    def __init__(self):
        self.chain: List[AuditRecord] = []
        # Create genesis record if empty
        if not self.chain:
            self._create_genesis()

    @classmethod
    def get_ledger(cls) -> "AuditLedger":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def _create_genesis(self):
        genesis_time = "2026-10-18T00:00:00Z"
        prev_hash = "0" * 64
        details = {"message": "Genesis Block of BookEnd Audit Ledger"}
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

    def append(self, actor: str, role: str, action: str, object_id: str, details: Dict[str, Any]) -> AuditRecord:
        """Appends a new verified event to the hash chain."""
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
        return record

    def verify_integrity(self) -> Tuple[bool, str, Optional[int]]:
        """
        Validates the hash chain from genesis to head.
        Returns: (is_valid, message, failure_index)
        """
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

        return True, "Audit chain integrity verified. Zero modifications detected.", None

    def get_records(self, limit: int = 100) -> List[AuditRecord]:
        return self.chain[-limit:]

    def reset(self):
        self.chain = []
        self._create_genesis()
