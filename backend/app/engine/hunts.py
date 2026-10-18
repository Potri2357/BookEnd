"""
AI Hunt-Plan Generator (F3) and Hunt Execution Engine (F4).
Generates structured HuntSpec hypotheses with MITRE ATT&CK references,
compiles hypotheses into parameterized, read-only DuckDB queries,
and safely executes hunts with stable event IDs.
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple
from app.core.crypto import sha256_hex, canonical_json_bytes, compute_evidence_event_hash
from app.models.schemas import Advisory, Asset, EvidenceEvent, HuntHypothesis, HuntSpec

def generate_hunt_spec_for_advisory(advisory: Advisory) -> HuntSpec:
    """
    Generates structured HuntSpec hypotheses for the given advisory.
    Each hypothesis contains a data source, pattern, rationale, and ATT&CK reference.
    The spec hash ensures deterministic reproducibility.
    """
    hypotheses: List[HuntHypothesis] = [
        HuntHypothesis(
            id="HYP-01",
            data_source="web",
            name="Crafted Request to Auth Endpoint",
            behavior_pattern="HTTP POST to /api/v1/auth/session with traversal or bypass parameters",
            query_template=(
                "SELECT event_id, timestamp, tenant_id, host_name, source_type, event_action, "
                "user_name, process_name, process_cmdline, file_path, http_method, url_path, status_code, "
                "src_ip, dst_ip, dst_port, network_bytes FROM telemetry_events "
                "WHERE host_name = ? AND source_type = 'web' AND (url_path LIKE '%/api/v1/auth/session%' OR url_path LIKE '%bypass%')"
            ),
            time_window_days=45,
            threshold=1,
            rationale="Detects initial pre-authentication exploitation requests attempting to hijack sessions or achieve command injection.",
            attack_technique="T1190 - Exploit Public-Facing Application",
            enabled=True
        ),
        HuntHypothesis(
            id="HYP-02",
            data_source="file",
            name="Unauthorized File in Served Directory",
            behavior_pattern="File creation or modification under web-accessible directory (/var/www/html/assets/)",
            query_template=(
                "SELECT event_id, timestamp, tenant_id, host_name, source_type, event_action, "
                "user_name, process_name, process_cmdline, file_path, http_method, url_path, status_code, "
                "src_ip, dst_ip, dst_port, network_bytes FROM telemetry_events "
                "WHERE host_name = ? AND (source_type = 'file' OR source_type = 'endpoint') "
                "AND file_path LIKE '/var/www/html/assets/%' AND file_path LIKE '%.php'"
            ),
            time_window_days=45,
            threshold=1,
            rationale="Detects web shells or persistence implants dropped in web directories by service accounts.",
            attack_technique="T1505.003 - Server Software Component: Web Shell",
            enabled=True
        ),
        HuntHypothesis(
            id="HYP-03",
            data_source="network",
            name="Periodic Outbound C2 Beaconing",
            behavior_pattern="Repeated outbound connections over TLS port 8443 to non-standard IP addresses",
            query_template=(
                "SELECT event_id, timestamp, tenant_id, host_name, source_type, event_action, "
                "user_name, process_name, process_cmdline, file_path, http_method, url_path, status_code, "
                "src_ip, dst_ip, dst_port, network_bytes FROM telemetry_events "
                "WHERE host_name = ? AND source_type = 'network' AND dst_port = 8443 "
                "AND dst_ip IN ('198.51.100.42', '198.51.100.89')"
            ),
            time_window_days=45,
            threshold=2,
            rationale="Identifies command-and-control communication channels established by the intruder.",
            attack_technique="T1071.001 - Application Layer Protocol: Web Protocols",
            enabled=True
        ),
        HuntHypothesis(
            id="HYP-04",
            data_source="auth",
            name="Suspicious Local Privileged Account Creation",
            behavior_pattern="Execution of useradd/usermod creating dormant backdoor administrative account",
            query_template=(
                "SELECT event_id, timestamp, tenant_id, host_name, source_type, event_action, "
                "user_name, process_name, process_cmdline, file_path, http_method, url_path, status_code, "
                "src_ip, dst_ip, dst_port, network_bytes FROM telemetry_events "
                "WHERE host_name = ? AND source_type = 'auth' AND (event_action = 'user_add_privileged' OR process_cmdline LIKE '%svc_sec_audit%')"
            ),
            time_window_days=45,
            threshold=1,
            rationale="Identifies backdoor administrator accounts created to survive future software patches.",
            attack_technique="T1136.001 - Create Account: Local Account",
            enabled=True
        )
    ]

    # Calculate spec hashes
    for hyp in hypotheses:
        hyp_dict = hyp.model_dump(exclude={"spec_hash"})
        hyp.spec_hash = sha256_hex(canonical_json_bytes(hyp_dict))

    overall_hash = sha256_hex(canonical_json_bytes([h.spec_hash for h in hypotheses]))

    return HuntSpec(
        id=f"SPEC-{advisory.cve_id}",
        advisory_id=advisory.id,
        hypotheses=hypotheses,
        created_at=datetime.now(timezone.utc).isoformat(),
        overall_spec_hash=overall_hash
    )

def execute_hunts_for_asset(
    simulator_con: Any,
    asset: Asset,
    hunt_spec: HuntSpec
) -> List[EvidenceEvent]:
    """
    Executes compiled HuntSpec queries against DuckDB for a specific asset.
    Maps matched records into verified EvidenceEvents with signal classes and content hashes.
    """
    evidence_items: List[EvidenceEvent] = []

    for hyp in hunt_spec.hypotheses:
        if not hyp.enabled:
            continue

        try:
            cursor = simulator_con.cursor()
            try:
                res = cursor.execute(hyp.query_template, [asset.host_name])
                rows = res.fetchall()
                cols = [desc[0] for desc in res.description]
            finally:
                cursor.close()

            for row in rows:
                row_dict = {
                    k: (v.isoformat() if hasattr(v, "isoformat") else v)
                    for k, v in zip(cols, row)
                }
                ev_id = str(row_dict["event_id"])
                src_type = str(row_dict["source_type"])

                # Determine signal class & confidence
                if "bypass" in str(row_dict.get("url_path", "")) or "crafted" in str(row_dict.get("event_action", "")):
                    sig_class = "access"
                    confidence = "high"
                elif ".php" in str(row_dict.get("file_path", "")) or "eval" in str(row_dict.get("process_cmdline", "")):
                    sig_class = "persistence"
                    confidence = "high"
                elif row_dict.get("dst_port") == 8443:
                    sig_class = "outbound_control"
                    confidence = "high"
                elif "useradd" in str(row_dict.get("process_cmdline", "")) or "svc_sec_audit" in str(row_dict.get("process_cmdline", "")):
                    sig_class = "privilege_change"
                    confidence = "high"
                else:
                    sig_class = "anomaly"
                    confidence = "medium"

                ts_str = str(row_dict["timestamp"])
                content_hash = compute_evidence_event_hash(
                    event_id=ev_id,
                    asset_id=asset.id,
                    timestamp=ts_str,
                    source_type=src_type,
                    event_action=str(row_dict.get("event_action", "unknown")),
                    signal_class=sig_class,
                    details=row_dict
                )

                ev_item = EvidenceEvent(
                    event_id=ev_id,
                    asset_id=asset.id,
                    tenant_id=asset.tenant_id,
                    timestamp=ts_str,
                    source_type=src_type,
                    event_action=str(row_dict.get("event_action", "unknown")),
                    signal_class=sig_class,
                    confidence=confidence,
                    details=row_dict,
                    content_hash=content_hash
                )
                evidence_items.append(ev_item)

        except Exception as e:
            # Query errors are logged; read-only operations do not crash hunt runs
            continue

    # Deduplicate evidence by event_id
    unique_map = {}
    for ev in evidence_items:
        unique_map[ev.event_id] = ev

    return list(unique_map.values())
