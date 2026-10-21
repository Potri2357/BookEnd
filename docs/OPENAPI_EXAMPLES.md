# Postern API Examples & Reference

All endpoints are hosted under `/v1`. In production, supply either:
- `Authorization: Bearer <JWT_OR_API_KEY>`
- `X-API-Key: <PER_TENANT_API_KEY>`

---

## 1. Authentication & Multi-Tenancy

### 1.1 SSO / OIDC Login
```bash
curl -X POST http://localhost:8008/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "analyst_lead_01",
    "name": "Priya Sharma",
    "email": "priya.sharma@meridian.internal",
    "role": "analyst",
    "tenant_id": "meridian-finance"
  }'
```

### 1.2 Provision Per-Tenant API Key (Admin Only)
```bash
curl -X POST http://localhost:8008/v1/auth/api-keys \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Harbor Logistics Splunk Forwarder",
    "tenant_id": "harbor-logistics",
    "role": "analyst"
  }'
```

---

## 2. Ingestion & Connectors

### 2.1 Upload CSV Telemetry Logs
```bash
curl -X POST http://localhost:8008/v1/connectors/upload \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "vpn_firewall_events.csv",
    "tenant_id": "meridian-finance",
    "host_name": "meridian-vpn-gw-01",
    "raw_content": "timestamp,host_name,source_type,event_action,src_ip,dst_ip,user_name,process_name\n2026-10-18 09:30:00,meridian-vpn-gw-01,web,login_attempt,198.51.100.22,192.0.2.1,admin,sshd"
  }'
```

### 2.2 Test SIEM Connector Reachability
```bash
curl -X POST http://localhost:8008/v1/connectors/test \
  -H "Content-Type: application/json" \
  -d '{
    "connector_id": "wazuh",
    "endpoint_url": "https://wazuh.internal.local:55000",
    "api_key": "optional_wazuh_jwt"
  }'
```

---

## 3. Decision Queue & Asset Forensics

### 3.1 Prioritized Queue with Search & Filters
```bash
# Query emergency items with pagination
curl -X GET "http://localhost:8008/v1/queue?saved_view=emergency&paginate=true&page=1&page_size=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 3.2 Full Forensic Asset Story & Verdict
```bash
curl -X GET "http://localhost:8008/v1/assets/meridian-vpn-gw-01/story" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### 3.3 Apply Gate Override (Approver or Admin Only)
```bash
curl -X POST http://localhost:8008/v1/decisions/override \
  -H "Authorization: Bearer <APPROVER_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "meridian-vpn-gw-01",
    "approver": "sec_lead@enterprise.local",
    "reason": "Compensating controls active: isolated management VLAN and 24/7 EDR active hunt."
  }'
```

---

## 4. Cryptographic Proof Packs & Public Verification

### 4.1 Generate Proof Pack Bundle
```bash
curl -X GET "http://localhost:8008/v1/proof-packs/meridian-vpn-gw-01" \
  -H "Authorization: Bearer <JWT_TOKEN>" > proof_pack.json
```

### 4.2 Verify Proof Pack with Standalone CLI
```bash
python verify_proofpack.py proof_pack.json
```

### 4.3 Published Public Keys & Rotation Certificates
```bash
curl -X GET http://localhost:8008/v1/crypto/public-keys
```

### 4.4 Rotate Notary Key (Admin Only)
```bash
curl -X POST http://localhost:8008/v1/crypto/rotate-key \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

## 5. Threat Intelligence (CISA KEV & EPSS)

### 5.1 Query CVE Threat Intel
```bash
curl -X GET http://localhost:8008/v1/cve/CVE-2024-3400
```

### 5.2 Trigger Live CISA KEV Sync
```bash
curl -X POST http://localhost:8008/v1/cve/sync \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

---

## 6. Workflows, Backups & Exports

### 6.1 Create Jira Ticket
```bash
curl -X POST http://localhost:8008/v1/integrations/jira \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "meridian-vpn-gw-01",
    "project_key": "SEC"
  }'
```

### 6.2 Export Decision Queue to CSV
```bash
curl -X GET "http://localhost:8008/v1/reports/queue/export.csv" \
  -H "Authorization: Bearer <JWT_TOKEN>" -o queue_export.csv
```

### 6.3 Trigger Persistent Database Backup (Admin Only)
```bash
curl -X POST http://localhost:8008/v1/system/backup \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```
