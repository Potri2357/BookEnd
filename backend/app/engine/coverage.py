"""
Coverage and Provability Score Engine (F6).
Compares required exposure window days with available log retention across telemetry sources.
Surfaces blind spots and enforces that coverage < 85% forces a 'Cannot verify' verdict state.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List
from app.core.config import settings
from app.models.schemas import Asset, CoverageReport, LogCoverageDetail

REQUIRED_LOG_SOURCES = ["web", "endpoint", "auth", "network", "file"]

def calculate_log_coverage(
    simulator_con: Any,
    asset: Asset,
    required_lookback_days: int = 45
) -> CoverageReport:
    """
    Computes exact log retention days and gaps per source type from DuckDB data.
    """
    source_details: List[LogCoverageDetail] = []
    blind_spots: List[str] = []
    recommendations: List[str] = []

    sql = """
        SELECT source_type,
               min(timestamp) as min_ts,
               max(timestamp) as max_ts,
               count(distinct date_trunc('day', timestamp)) as active_days
        FROM telemetry_events
        WHERE host_name = ?
        GROUP BY source_type
    """
    rows = simulator_con.execute(sql, [asset.host_name]).fetchall()
    source_map = {r[0]: {"min": r[1], "max": r[2], "days": r[3]} for r in rows}

    total_ratio_sum = 0.0

    for src in REQUIRED_LOG_SOURCES:
        if src in source_map:
            min_ts = source_map[src]["min"]
            max_ts = source_map[src]["max"]
            if min_ts and max_ts:
                span_days = max(1, (max_ts - min_ts).days + 1)
                avail_days = min(required_lookback_days, span_days)
            else:
                avail_days = min(required_lookback_days, int(source_map[src]["days"]))
        else:
            # Fallback if logs for this source are under file/endpoint
            if src == "file" and "endpoint" in source_map:
                e_min = source_map["endpoint"]["min"]
                e_max = source_map["endpoint"]["max"]
                avail_days = min(required_lookback_days, max(1, (e_max - e_min).days + 1)) if (e_min and e_max) else 0
            elif src == "endpoint" and "file" in source_map:
                f_min = source_map["file"]["min"]
                f_max = source_map["file"]["max"]
                avail_days = min(required_lookback_days, max(1, (f_max - f_min).days + 1)) if (f_min and f_max) else 0
            else:
                avail_days = 0

        ratio = min(1.0, avail_days / max(1, required_lookback_days))
        total_ratio_sum += ratio

        gaps = []
        has_blindspot = False
        if avail_days < required_lookback_days:
            gap_days = required_lookback_days - avail_days
            gaps.append(f"Missing {gap_days} days of historical telemetry ({avail_days}/{required_lookback_days} days retained)")
            has_blindspot = True
            blind_spots.append(f"{src.upper()}: Only {avail_days} of {required_lookback_days} days available")

        source_details.append(LogCoverageDetail(
            source_type=src,
            required_days=required_lookback_days,
            available_days=avail_days,
            coverage_ratio=round(ratio, 3),
            gaps=gaps,
            has_retention_blindspot=has_blindspot
        ))

    overall_coverage = round(total_ratio_sum / len(REQUIRED_LOG_SOURCES), 3)
    adequate = overall_coverage >= settings.COVERAGE_THRESHOLD

    if not adequate:
        recommendations.append("Extend log retention to at least 90 days across network edge and endpoint telemetry.")
        recommendations.append("Execute assume-breach triage because historical pre-disclosure activity cannot be verified.")
        recommendations.append("Deploy targeted host-level forensic collector to inspect physical disk and registry.")
    else:
        recommendations.append("Log coverage is sufficient to assess pre-disclosure exploitation with high confidence.")

    return CoverageReport(
        asset_id=asset.id,
        overall_coverage=overall_coverage,
        sources=source_details,
        adequate=adequate,
        blind_spots=blind_spots,
        recommendations=recommendations
    )
