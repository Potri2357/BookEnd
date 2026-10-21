"""
Comprehensive tests for enterprise features:
- Authentication & SSO JWT Tokens
- RBAC role enforcement & per-tenant API keys
- Strict tenant isolation
- Rate limiting & SSRF protection
- Universal CSV / JSON log upload into DuckDB
- CISA KEV & EPSS threat intelligence
- Cryptographic key rotation & published public keys
- Standalone CLI proof pack verification
- Jira & ServiceNow ITSM ticket workflows
- Slack & Teams notifications
- Persistent database point-in-time backups
- User action audit logging
- Decision queue search, filters, saved views, and pagination
"""
import os
import json
import subprocess
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.auth import Role, AuthManager
from app.core.security import validate_safe_url, RateLimiter
from app.engine.connectors import parse_and_normalize_log_file

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

def test_sso_login_and_jwt_issuance(client):
    res = client.post("/v1/auth/login", json={
        "user_id": "analyst_lead_01",
        "name": "Priya Sharma",
        "email": "priya.sharma@meridian.internal",
        "role": "analyst",
        "tenant_id": "meridian-finance"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "Bearer"
    token = data["access_token"]

    # Use token on /auth/me
    me_res = client.get("/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me = me_res.json()
    assert me["email"] == "priya.sharma@meridian.internal"
    assert me["role"] == "analyst"
    assert me["tenant_id"] == "meridian-finance"

def test_per_tenant_api_key_auth_and_provisioning(client):
    auth_mgr = AuthManager.get_instance()
    new_key = auth_mgr.create_api_key(
        name="Harbor Ingestion Key",
        tenant_id="harbor-logistics",
        role="analyst"
    )
    raw_key = new_key["raw_key"]

    # Authenticate via X-API-Key header
    res = client.get("/v1/auth/me", headers={"X-API-Key": raw_key})
    assert res.status_code == 200
    user = res.json()
    assert user["tenant_id"] == "harbor-logistics"
    assert user["role"] == "analyst"

def test_tenant_isolation_enforcement(client):
    # Log in as Meridian Finance analyst
    token = client.post("/v1/auth/login", json={
        "user_id": "meridian_user",
        "role": "analyst",
        "tenant_id": "meridian-finance"
    }).json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # Access meridian asset -> allowed
    m_res = client.get("/v1/assets/meridian-vpn-gw-01/story", headers=headers)
    assert m_res.status_code == 200

    # Access harbor asset -> forbidden (403)
    h_res = client.get("/v1/assets/harbor-vpn-gw-01/story", headers=headers)
    assert h_res.status_code == 403
    assert "Tenant access denied" in h_res.json()["detail"]

def test_rbac_admin_key_rotation_authorization(client):
    # Analyst cannot rotate keys
    analyst_token = client.post("/v1/auth/login", json={
        "role": "analyst",
        "tenant_id": "meridian-finance"
    }).json()["access_token"]

    deny_res = client.post("/v1/crypto/rotate-key", headers={"Authorization": f"Bearer {analyst_token}"})
    assert deny_res.status_code == 403

    # Admin can rotate keys
    admin_token = client.post("/v1/auth/login", json={
        "role": "admin",
        "tenant_id": "*"
    }).json()["access_token"]

    allow_res = client.post("/v1/crypto/rotate-key", headers={"Authorization": f"Bearer {admin_token}"})
    assert allow_res.status_code == 200
    rot_data = allow_res.json()
    assert rot_data["status"] == "success"
    assert "rotation_certificate" in rot_data

    # Check published keys endpoint
    pub_res = client.get("/v1/crypto/public-keys")
    assert pub_res.status_code == 200
    pub_data = pub_res.json()
    assert len(pub_data["keys"]) >= 1
    assert len(pub_data["rotation_history"]) >= 1

def test_ssrf_protection_validation():
    # Loopback IP
    safe, msg = validate_safe_url("http://127.0.0.1:8080/admin", allow_loopback=False)
    assert safe is False
    assert "Loopback" in msg

    # Cloud metadata IP
    safe, msg = validate_safe_url("http://169.254.169.254/latest/meta-data/", allow_loopback=False)
    assert safe is False
    assert "metadata" in msg.lower()

    # Public web url -> safe
    safe, msg = validate_safe_url("https://www.google.com/test", allow_loopback=False)
    assert safe is True

def test_csv_log_upload_and_duckdb_ingestion(client):
    csv_content = """timestamp,host_name,source_type,event_action,src_ip,dst_ip,user_name,process_name
2026-10-18 09:30:00,uploaded-vpn-01,web,login_attempt,198.51.100.22,192.0.2.1,admin,sshd
2026-10-18 09:31:00,uploaded-vpn-01,endpoint,file_create,198.51.100.22,192.0.2.1,root,touch
"""
    res = client.post("/v1/connectors/upload", json={
        "raw_content": csv_content,
        "filename": "firewall_logs.csv",
        "tenant_id": "meridian-finance",
        "host_name": "uploaded-vpn-01"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["accepted"] >= 2
    assert data["parsed_events_count"] == 2

def test_cve_intel_and_cisa_kev_endpoints(client):
    res = client.get("/v1/cve/kev")
    assert res.status_code == 200
    data = res.json()
    assert data["count"] >= 1

    # Query EPSS & KEV for specific CVE
    cve_res = client.get("/v1/cve/CVE-2024-3400")
    assert cve_res.status_code == 200
    cve_data = cve_res.json()
    assert cve_data["in_cisa_kev"] is True
    assert "epss" in cve_data
    assert cve_data["epss"]["epss"] > 0.5

def test_ticketing_and_notifications(client):
    # Jira issue creation
    jira_res = client.post("/v1/integrations/jira", json={
        "asset_id": "meridian-vpn-gw-01",
        "project_key": "SEC"
    })
    assert jira_res.status_code == 200
    jira_data = jira_res.json()
    assert jira_data["system"] == "jira"
    assert jira_data["key"].startswith("SEC-")

    # ServiceNow incident creation
    snow_res = client.post("/v1/integrations/servicenow", json={
        "asset_id": "meridian-vpn-gw-01"
    })
    assert snow_res.status_code == 200
    snow_data = snow_res.json()
    assert snow_data["system"] == "servicenow"
    assert snow_data["key"].startswith("INC")

    # Slack notification
    slack_res = client.post("/v1/notifications/slack", json={
        "webhook_url": "https://hooks.slack.com/services/TEST/TEST/TEST",
        "asset_id": "meridian-vpn-gw-01"
    })
    assert slack_res.status_code == 200

def test_queue_search_filters_and_pagination(client):
    # 1. Search by hostname
    search_res = client.get("/v1/queue?search=meridian-vpn-gw-01")
    assert search_res.status_code == 200
    items = search_res.json()
    assert len(items) == 1
    assert items[0]["host_name"] == "meridian-vpn-gw-01"

    # 2. Filter by verdict
    filt_res = client.get("/v1/queue?verdict=Likely compromised")
    assert filt_res.status_code == 200
    filt_items = filt_res.json()
    assert all(i["verdict_state"] == "Likely compromised" for i in filt_items)

    # 3. Saved view: emergency
    sv_res = client.get("/v1/queue?saved_view=emergency")
    assert sv_res.status_code == 200
    assert all(i["exposure_tier"] == "emergency" for i in sv_res.json())

    # 4. Pagination
    pag_res = client.get("/v1/queue?paginate=true&page=1&page_size=5")
    assert pag_res.status_code == 200
    pag_data = pag_res.json()
    assert "items" in pag_data
    assert len(pag_data["items"]) <= 5
    assert pag_data["total"] > 0
    assert pag_data["page"] == 1

def test_user_action_audit_and_csv_export(client):
    # View asset story to trigger action
    client.get("/v1/assets/meridian-vpn-gw-01/story")

    # Check user actions log
    act_res = client.get("/v1/audit/actions?action=VIEW_ASSET")
    assert act_res.status_code == 200
    actions = act_res.json()
    assert len(actions) > 0
    assert actions[0]["action"] == "VIEW_ASSET"

    # Export queue CSV
    q_csv = client.get("/v1/reports/queue/export.csv")
    assert q_csv.status_code == 200
    assert "text/csv" in q_csv.headers["content-type"]
    assert "Host Name" in q_csv.text

    # Export audit CSV
    a_csv = client.get("/v1/reports/audit/export.csv")
    assert a_csv.status_code == 200
    assert "text/csv" in a_csv.headers["content-type"]
    assert "Hash" in a_csv.text

def test_persistent_database_backup(client):
    admin_token = client.post("/v1/auth/login", json={
        "role": "admin",
        "tenant_id": "*"
    }).json()["access_token"]

    res = client.post("/v1/system/backup", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "backup_id" in data
    assert data["status"] == "completed"

    list_res = client.get("/v1/system/backups", headers={"Authorization": f"Bearer {admin_token}"})
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

def test_standalone_cli_proofpack_verification(client):
    # Generate proof pack
    pack_res = client.get("/v1/proof-packs/meridian-vpn-gw-01")
    assert pack_res.status_code == 200
    pack = pack_res.json()

    # Run verify_proofpack.py CLI tool via subprocess with JSON over stdin
    cli_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../verify_proofpack.py"))
    if not os.path.exists(cli_path):
        cli_path = "verify_proofpack.py"

    proc = subprocess.run(
        ["python3", cli_path, "-"],
        input=json.dumps(pack),
        text=True,
        capture_output=True
    )
    assert proc.returncode == 0
    assert "STATUS: VALID" in proc.stdout
    assert "Zero tampering detected" in proc.stdout

    # Run with tampered pack -> must exit with non-zero code
    tampered_pack = dict(pack)
    tampered_pack["manifest"]["verdict_state"] = "Forged Clean Verdict"
    bad_proc = subprocess.run(
        ["python3", cli_path, "-"],
        input=json.dumps(tampered_pack),
        text=True,
        capture_output=True
    )
    assert bad_proc.returncode != 0
    assert "STATUS: INVALID" in bad_proc.stdout
