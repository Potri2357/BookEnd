"""
Deadline Clocks and Regulatory Profiles Engine (F11).
Maintains real-time countdown clocks against regulatory profiles:
- CERT-In (May 2026 guidance: 12-hour emergency internet-facing, 24h high, 72h standard)
- CISA BOD 26-04 (June 2026: 3-day forensic triage)
- Custom Internal SLAs
Supports pause and resume with auditable justifications.
"""
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional
from app.core.audit import AuditLedger
from app.models.schemas import Asset, DeadlineClock

class ClockManager:
    _instance = None

    def __init__(self):
        self.clocks: Dict[str, DeadlineClock] = {}

    @classmethod
    def get_instance(cls) -> "ClockManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def initialize_clock_for_asset(
        self,
        asset: Asset,
        advisory_id: str,
        profile: str = "CERT-In 12h/1d/3d/5d",
        start_time_iso: Optional[str] = None
    ) -> DeadlineClock:
        """Initializes a countdown clock based on the asset's exposure tier and regulatory profile."""
        now = datetime.now(timezone.utc)
        start_dt = datetime.fromisoformat(start_time_iso) if start_time_iso else now

        if profile == "CERT-In 12h/1d/3d/5d":
            if asset.exposure_tier == "emergency":
                duration_hours = 12
                tier = "emergency (12h)"
            elif asset.exposure_tier == "high":
                duration_hours = 24
                tier = "high (24h)"
            else:
                duration_hours = 72
                tier = "standard (72h)"
        elif profile == "CISA BOD 26-04":
            duration_hours = 72
            tier = "forensic triage (72h)"
        else:
            duration_hours = 48
            tier = "internal SLA (48h)"

        deadline_dt = start_dt + timedelta(hours=duration_hours)
        sec_rem = max(0, int((deadline_dt - now).total_seconds()))

        clock = DeadlineClock(
            asset_id=asset.id,
            advisory_id=advisory_id,
            profile=profile,
            target_tier=tier,
            start_time=start_dt.isoformat(),
            deadline_time=deadline_dt.isoformat(),
            seconds_remaining=sec_rem,
            is_paused=False,
            is_breached=(sec_rem <= 0)
        )
        self.clocks[asset.id] = clock
        return clock

    def update_clock(self, asset_id: str) -> Optional[DeadlineClock]:
        """Calculates current remaining seconds and breach status."""
        clock = self.clocks.get(asset_id)
        if not clock:
            return None

        if not clock.is_paused:
            now = datetime.now(timezone.utc)
            dl_dt = datetime.fromisoformat(clock.deadline_time)
            sec_rem = int((dl_dt - now).total_seconds())
            clock.seconds_remaining = max(0, sec_rem)
            clock.is_breached = (sec_rem <= 0)

        return clock

    def pause_clock(self, asset_id: str, reason: str, actor: str) -> Optional[DeadlineClock]:
        clock = self.clocks.get(asset_id)
        if not clock:
            return None

        clock.is_paused = True
        clock.pause_reason = reason

        AuditLedger.get_ledger().append(
            actor=actor,
            role="ClockOperator",
            action="PAUSE_DEADLINE_CLOCK",
            object_id=asset_id,
            details={"reason": reason, "seconds_remaining": clock.seconds_remaining}
        )
        return clock

    def resume_clock(self, asset_id: str, actor: str) -> Optional[DeadlineClock]:
        clock = self.clocks.get(asset_id)
        if not clock:
            return None

        clock.is_paused = False
        now = datetime.now(timezone.utc)
        clock.deadline_time = (now + timedelta(seconds=clock.seconds_remaining)).isoformat()
        clock.pause_reason = None

        AuditLedger.get_ledger().append(
            actor=actor,
            role="ClockOperator",
            action="RESUME_DEADLINE_CLOCK",
            object_id=asset_id,
            details={"resumed_seconds": clock.seconds_remaining}
        )
        return clock
