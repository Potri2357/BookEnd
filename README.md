# Postern

<div align="center">

```
  ██████╗   ██████╗  ███████╗████████╗███████╗██████╗ ███╗   ██╗
  ██╔══██╗ ██╔═══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║
  ██████╔╝ ██║   ██║███████╗   ██║   █████╗  ██████╔╝██╔██╗ ██║
  ██╔═══╝  ██║   ██║╚════██║   ██║   ██╔══╝  ██╔══██╗██║╚██╗██║
  ██║      ╚██████╔╝███████║   ██║   ███████╗██║  ██║██║ ╚████║
  ╚═╝       ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

**Enterprise Forensic Pre-Disclosure Hunting, Automated Patch Gates & Cryptographic Closure Assurance**

*Patch with proof.*

[![Live Frontend](https://img.shields.io/badge/Production%20Frontend-Vercel-black?logo=vercel&logoColor=white)](https://postern-five.vercel.app)
[![Live Backend](https://img.shields.io/badge/Production%20API-Render-46E3B7?logo=render&logoColor=white)](https://postern-bwiq.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.14%2B-blue?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![DuckDB](https://img.shields.io/badge/DuckDB-1.1%2B-FFF000?logo=duckdb&logoColor=black)](https://duckdb.org)
[![React](https://img.shields.io/badge/React-19.2%2B-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Cryptography](https://img.shields.io/badge/Cryptography-Ed25519%20%7C%20RFC%208785-critical)](#cryptographic-proof-packs)
[![Tests](https://img.shields.io/badge/Tests-23%20Passed-brightgreen)](#automated-test-suite)

</div>

---

## 📌 Executive Summary

Modern cybersecurity teams face a critical blind spot during emergency CVE patching: **applying a vendor patch over an asset that was already compromised pre-disclosure locks the adversary inside rather than remediating them.**

**Postern** solves this by bridging the gap between *"we applied the patch"* and *"we are actually safe"*:
1. **Automated Exposure Matching**: Maps vulnerabilities to multi-tenant asset inventories without dropping unknown version configurations (`needs_inventory`).
2. **Deterministic Retroactive Hunting**: Rewinds columnar telemetry through DuckDB across a 45-day lookback window preceding public vulnerability disclosure.
3. **Coverage Provability & Honesty**: Rigorously calculates log retention and collector health. If telemetry covers `< 85%` of the required lookback window, Postern enforces a **Cannot verify** verdict rather than claiming false safety.
4. **Enforcing Patch Gate**: Automatically locks patching when prior intrusion or active adversary persistence is detected (`Contain first then patch`).
5. **Residue Playbooks**: Guides containment and remediation actions (session termination, memory capture, web shell removal, credential rotation) that binary patching cannot accomplish alone.
6. **Post-Patch Re-Check & Closure Verification**: Rescans patched assets and automatically reopens tickets if persistence implants or backdoor artifacts survive the patch window.
7. **Ed25519 Cryptographic Proof Packs**: Signs an RFC 8785 canonical JSON manifest with SHA-256 evidence trees for regulatory compliance (CERT-In, CISA, RBI CSF, SOC2) and cyber insurance underwriters.
8. **Lateral Blast Radius Visualizer**: Computes reachability graphs of sensitive crown jewels and Kerberos paths to contain adversary pivot routes.

---

## 🏛️ System Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │               Postern Web UI                  │
                    │      (React 19 + TypeScript + DM Sans)        │
                    └───────────────────────┬───────────────────────┘
                                            │ Vite Proxy /v1 (Port 5173)
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Postern Enterprise Core Server (Port 8008)                     │
│                             FastAPI + Python 3.14                                │
├────────────────────────────────┬─────────────────────────────────────────────────┤
│  REST API & Ingress Endpoints  │  Server-Sent Events (SSE) `/v1/events`          │
│  - /v1/queue (Forensic Triage) │  - Real-time 3-second countdown clock ticks     │
│  - /v1/assets/{id}/story       │  - Live ledger block generation                 │
│  - /v1/proof-packs (Verify)    │  - Threat telemetry stream (16.6k EPS)          │
│  - /health (GET & HEAD)        │  - Prometheus metrics (`/metrics`)              │
├────────────────────────────────┼─────────────────────────────────────────────────┤
│       Forensics & Detection    │            Security & Cryptography              │
│  - DuckDB Columnar Log Engine  │  - Ed25519 Digital Signatures (HSM Notary)      │
│  - MITRE ATT&CK Correlation    │  - RFC 8785 Canonical JSON Serialization        │
│  - Zero Uncited Claims Engine  │  - Append-Only SHA-256 Hash Chain Ledger        │
│  - Lookback Window Evaluator   │  - Row-Level Tenant Isolation Enforcement       │
└────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Python**: Version 3.10+ (tested on Python 3.14)
- **Node.js**: Version 18+ and `npm`

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Potri2357/Postern.git
cd Postern
```

---

### Step 2: Environment Configuration (`.env`)

Postern requires environment variables configured for both the backend server and frontend development proxy.

#### 1. Create the Backend `.env` File (Project Root)
Copy the template or create `.env` in the project root:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
# =====================================================================
# Postern Enterprise Server Configuration
# =====================================================================

# Server Network Binding
PORT=8008
HOST=0.0.0.0
APP_NAME=Postern
ENVIRONMENT=production
SIMULATED_BANNER=true

# Columnar Forensics & Cryptographic Ledger
DATABASE_PATH=postern.duckdb
AUDIT_LEDGER_PATH=audit_ledger.json

# Forensic SLA & Threshold Constraints
DEFAULT_LOOKBACK_DAYS=45
COVERAGE_THRESHOLD=0.85
CERT_IN_EMERGENCY_HOURS=12
CERT_IN_HIGH_HOURS=24
CERT_IN_STANDARD_HOURS=72
CISA_TRIAGE_HOURS=72

# Frontend Development Binding & Proxies
VITE_PORT=5173
VITE_BACKEND_URL=http://localhost:8008
VITE_API_BASE_URL=/v1
```

#### 2. Create the Frontend `.env` File (`frontend/.env`)
```bash
cp frontend/.env.example frontend/.env
```

Ensure `frontend/.env` contains:
```env
# Postern Frontend Configuration
VITE_PORT=5173
VITE_BACKEND_URL=http://localhost:8008
VITE_API_BASE_URL=/v1
```

---

### Step 3: Install Dependencies

#### Python Backend Dependencies:
```bash
python3 -m pip install -r backend/requirements.txt
# Alternatively, install core dependencies:
python3 -m pip install fastapi uvicorn pydantic duckdb cryptography python-dotenv pytest httpx
```

#### Frontend Dependencies:
```bash
cd frontend
npm install
cd ..
```

---

### Step 4: Run the Application

#### Terminal 1: Start the Backend Server (Port 8008)
```bash
PYTHONPATH=backend python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8008 --reload
```
- API Documentation (Swagger): [http://localhost:8008/docs](http://localhost:8008/docs)
- Interactive ReDoc: [http://localhost:8008/redoc](http://localhost:8008/redoc)
- Health Probe: [http://localhost:8008/health](http://localhost:8008/health)
- Prometheus Metrics: [http://localhost:8008/metrics](http://localhost:8008/metrics)

#### Terminal 2: Start the Frontend UI (Port 5173)
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Automated Test Suite

Postern features an automated forensic test suite covering API contracts, Ed25519 signatures, RFC 8785 canonical JSON trees, DuckDB queries, tamper resistance, and the 6 validation scenarios:

```bash
PYTHONPATH=backend pytest -v
```

### Verified Test Results (23/23 Passing)
```
backend/tests/test_api_endpoints.py::test_health_and_root PASSED                    [  4%]
backend/tests/test_api_endpoints.py::test_list_tenants PASSED                       [  8%]
backend/tests/test_api_endpoints.py::test_decision_queue_sorting PASSED             [ 13%]
backend/tests/test_api_endpoints.py::test_asset_story_and_verdict PASSED            [ 17%]
backend/tests/test_api_endpoints.py::test_proof_pack_generation_and_verification PASSED [ 21%]
backend/tests/test_api_endpoints.py::test_ask_evidence_assistant PASSED             [ 26%]
backend/tests/test_api_endpoints.py::test_evaluation_harness_endpoint PASSED        [ 30%]
backend/tests/test_api_endpoints.py::test_live_events_stream_and_actions PASSED     [ 34%]
backend/tests/test_api_endpoints.py::test_connectors_webhook_and_export PASSED      [ 39%]
backend/tests/test_api_endpoints.py::test_server_telemetry_and_metrics PASSED       [ 43%]
backend/tests/test_engine.py::test_canonical_json_and_ed25519_signature PASSED     [ 47%]
backend/tests/test_engine.py::test_audit_ledger_chain_and_tamper_detection PASSED    [ 52%]
backend/tests/test_engine.py::test_advisory_extraction_and_untrusted_input PASSED    [ 56%]
backend/tests/test_engine.py::test_asset_matching_unknown_version_bucket PASSED      [ 60%]
backend/tests/test_engine.py::test_citation_validator_contract PASSED               [ 65%]
backend/tests/test_engine.py::test_patch_gate_decision_matrix PASSED                [ 69%]
backend/tests/test_scenarios.py::test_scenario_s1_compromised_before_advisory PASSED [ 73%]
backend/tests/test_scenarios.py::test_scenario_s2_clean_and_well_covered PASSED     [ 78%]
backend/tests/test_scenarios.py::test_scenario_s3_benign_look_alike PASSED          [ 82%]
backend/tests/test_scenarios.py::test_scenario_s4_blind_spot_coverage_honesty PASSED [ 86%]
backend/tests/test_scenarios.py::test_scenario_s5_patch_then_persist PASSED         [ 91%]
backend/tests/test_scenarios.py::test_scenario_s6_fleet_mix_and_metrics PASSED      [ 95%]
backend/tests/test_server_telemetry.py::test_server_telemetry_manager PASSED        [100%]
============================== 23 passed in 10.42s ==============================
```

---

## 🎯 Tactical Range Scenarios (S1 – S6)

Use the top **Range Scenario dropdown** in the navigation bar to inspect realistic pre-configured cyber defense scenarios:

| Scenario | Code | Host Asset | Simulated Condition | Engine Verdict | Gate Action |
|---|---|---|---|---|---|
| **Compromised Pre-Advisory** | `S1` | `meridian-vpn-gw-01` | Attacker exploited 0-day 12 days before public CVE release. | **Likely Compromised** | ⛔ `Contain first then patch` |
| **Clean & Well Covered** | `S2` | `harbor-vpn-gw-01` | 45-day complete log telemetry; zero IOCs or behavioral anomalies. | **No Evidence Found** | 🟢 `Patch now` |
| **Benign Look-Alike** | `S3` | `lotus-app-server-01` | Nightly backup cron script mimics exfiltration spikes. | **No Evidence Found** | 🟡 `Patch with caution` |
| **Retention Gap Blind Spot** | `S4` | `meridian-web-portal-01` | Only 14 days of retention available (45 days required = 31% coverage). | **Cannot Verify** | 🟡 `Patch with caution` |
| **Patch Then Persist** | `S5` | `meridian-vpn-gw-01` | Vendor patch applied, but dormant web shell remains in `/var/www/`. | **Reopen Triggered** | 🔄 `Reopen and contain` |
| **Fleet Benchmark Scoring** | `S6` | All Organizations | Consolidated multi-tenant triage across financial, port, and health systems. | **Multi-Tenant Mix** | 📊 `Batch Governance` |

---

## 🔐 Cryptographic Proof Packs

Every remediation decision in Postern produces an independently verifiable, cryptographically sealed **Proof Pack**:
1. **RFC 8785 Canonical JSON**: Eliminates key-ordering and whitespace ambiguity to produce deterministic byte representations.
2. **Ed25519 Asymmetric Digital Signature**: Signed with an enterprise HSM private key (`YubiHSM2-FIPS-140-3`).
3. **SHA-256 Merkle Evidence Root**: Bundles raw event hashes, process trees, and lookback timestamps.
4. **Append-Only Chain of Custody**: Every decision writes an immutable block to `audit_ledger.json` chained via SHA-256 previous-block hashes. Any modification to a historical record immediately triggers tamper detection alarms.

---

## ⌨️ Global Keyboard Navigation

Navigate the entire Postern console directly from the keyboard:

| Key | Destination | Description |
|---|---|---|
| <kbd>1</kbd> | **Decision Queue** | Prioritized SLA triage queue with interactive filter dropdowns |
| <kbd>2</kbd> | **Threat Intelligence** | CISA KEV advisory details with sentence-level citations |
| <kbd>3</kbd> | **MSSP Fleet Posture** | Multi-tenant organization health (Meridian, Harbor, Lotus) |
| <kbd>4</kbd> | **SIEM & EDR Ingress** | Live 16.6k EPS telemetry stream across Wazuh, Sentinel, Splunk |
| <kbd>5</kbd> | **Validation Benchmark** | Automated evaluation harness measuring recall and coverage |
| <kbd>6</kbd> | **Chain of Custody** | Append-only SHA-256 audit ledger with tamper verification |
| <kbd>7</kbd> | **Server Infrastructure** | Live server console, CPU/memory hardware monitors, and log streams |
| <kbd>Esc</kbd> | **Return to Queue** | Dismisses detail views or active dialogs back to the main queue |

---

## 🛡️ Compliance & Standards Alignment

- **CERT-In Directions (India)**: 6-hour incident disclosure drafts (`CERT-In Form IR`), 12h/24h/72h SLA compliance timers.
- **US CISA BOD 26-04**: Mandatory 3-day forensic triage before closing emergency directives.
- **RFC 8785**: JSON Canonicalization Scheme (JCS) for digital signatures.
- **NIST SP 800-40 Rev. 4**: Guide to Enterprise Patch Management Planning.
- **SOC2 Type II & RBI CSF**: Append-only tamper-evident audit trails and least-privilege tenant isolation.

---

## 📄 License & Open-Source Community

This project is licensed under the [Apache License, Version 2.0](LICENSE).

- 🔒 **Security Policy**: See [SECURITY.md](SECURITY.md) for vulnerability disclosure procedures and cryptographic threat model.
- 🤝 **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for local environment setup and testing guidelines.
- 🏛️ **Architecture & RFC Specs**: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete technical architecture.
- 📡 **OpenAPI & cURL Reference**: See [docs/OPENAPI_EXAMPLES.md](docs/OPENAPI_EXAMPLES.md) for API usage examples.

