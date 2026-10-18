# BookEnd (PatchGate)
> **Tagline:** Patch with proof.  
> **Version:** 2.0.0 (MVP + V1 + V2 Complete Implementation)  
> **Prepared for:** CyberForge 2026 (Mitigata)

---

## Executive Summary
BookEnd closes the gap between *"we applied the patch"* and *"we are actually safe"*. When a known-exploited vulnerability is disclosed, BookEnd:
1. Matches and assesses affected assets across multi-tenant fleets.
2. Retroactively hunts telemetry history (including pre-disclosure lookback) for prior compromise.
3. Computes coverage provability and enforces that retention blind spots dictate **Cannot verify** instead of false cleanliness.
4. Enforces an automated **Patch Gate** that locks patching over active intrusions.
5. Executes **Residue Playbooks** (active session termination, web shell removal, credential rotation) that patching alone does not accomplish.
6. Re-checks systems post-patch and **reopens assets** if persistence implants remain.
7. Generates an independently verifiable, **Ed25519-signed Cryptographic Proof Pack** with canonical SHA-256 trees for regulators (CERT-In), insurers, and auditors.
8. Visualizes lateral blast radius (V2) to isolate crown jewels before lateral pivot occurs.

---

## Feature Coverage Matrix

| Feature | Release Tier | Status | Implementation Details |
|---|---|---|---|
| **F1. Advisory Ingestion & Normalisation** | MVP | Complete | Untrusted input screening, CVE extraction, affected version parsing, sentence-level citation linking. |
| **F2. Asset Inventory & Exposure Matching** | MVP | Complete | Exposure tiers (`emergency`, `high`, `standard`), unknown version bucket (`needs_inventory`, never dropped). |
| **F3. AI Hunt-Plan Generator** | MVP | Complete | Structured `HuntSpec`, MITRE ATT&CK mappings, deterministic DuckDB parameter binding, spec hash. |
| **F4. Hunt Execution Engine** | MVP | Complete | Read-only parallel execution over DuckDB, stable event IDs, telemetry timestamp span tracking. |
| **F5. Evidence Graph & Verdict Engine** | MVP | Complete | Multi-signal correlation (Access, Execution, Persistence, C2, Privilege Change), citation validator (0% uncited claims). Never uses "clean" or "safe". |
| **F6. Coverage & Provability Score** | MVP | Complete | Evaluates required lookback (45d) vs available days; enforces `< 85%` coverage forces **Cannot verify**. |
| **F7. Pre-Disclosure Look-Back** | MVP | Complete | Automatically dates hunt window back to first known in-the-wild exploitation before public disclosure. |
| **F8. Patch Gate & Decision Policy** | MVP & V1 Enforcing | Complete | Decision matrix (`Patch now`, `Patch with caution`, `Hold and review`, `Contain first then patch`), change-hold locks, auditable overrides. |
| **F9. Containment Guidance & Residue Playbooks** | MVP & V1 | Complete | Actionable containment & cleanup steps (quarantine host, dump memory, kill sessions, scan implants, rotate credentials) with step verification. |
| **F10. Post-Patch Re-Check & Closure Verification** | MVP | Complete | Forensic residue verification post-patch. Reopens asset with failure reasons if persistence remains (Scenario S5). |
| **F11. Deadline Clocks & Regulatory Profiles** | MVP | Complete | Indian **CERT-In 12h/1d/3d/5d** guidance, US **CISA BOD 26-04 3-day forensic triage**, countdown timers to the second with pause/resume. |
| **F12. Decision Queue** | MVP | Complete | Prioritised list of decisions needed, bulk approval for safe patches, deadline sorting. |
| **F13. Asset Story Screen** | MVP | Complete | Bespoke multi-lane timeline, interactive process tree, raw evidence inspector, cited narrative, gated pipeline. |
| **F14. Ask-The-Evidence Assistant** | MVP & V1 | Complete | Evidence-scoped assistant with prompt injection filtering and strict citation grounding. |
| **F15. Approvals & Collaboration** | MVP & V1 | Complete | Role-based routing, collaboration thread, two-person rule for high-impact actions, evidence snapshot hashing. |
| **F16. Cryptographic Proof Pack** | MVP & V1 | Complete | Ed25519 digital signature, canonical RFC 8785 JSON manifest, SHA-256 evidence tree, standalone verification service. |
| **F17. Incident Hand-Off** | MVP | Complete | Automated drafting of CERT-In Form IR (6-hour rule), Cyber Insurer notice, Executive board memo; explicit unknown facts section. |
| **F18. Multi-Tenant Fleet View** | MVP | Complete | 3 Tenants: Meridian Finance (NBFC), Harbor Logistics (Ports), Lotus Clinics (Healthcare). |
| **F19. Audit Log & Chain of Custody** | MVP | Complete | Append-only SHA-256 sequential hash chain with tamper detection. |
| **F20. Authentication & Tenant Isolation** | MVP | Complete | Row-level tenant isolation, least-privilege role model. |
| **F21. Connectors & Log Ingestion** | MVP & V1 | Complete | Read-only adapters for Wazuh, Elastic ECS, Microsoft Sentinel, Splunk; retention period auto-discovery. |
| **F22. Analyst Feedback Loop** | V1 | Complete | Whitelisting and confirmation loop tracking feedback without model drift. |
| **F23. Reports & Executive Summary** | MVP & V1 | Complete | Comprehensive posture reporting matching proof packs. |
| **F24. Settings & Policy as Code** | MVP | Complete | Tunable retention thresholds, lookback defaults, regulatory profiles. |
| **F25. Blast-Radius Graph** | **V2** | Complete | Interactive topology graph of reachable lateral targets, crown jewel databases, Kerberos credentials, risk score (0-100). |
| **F26. Demo Control Panel (Range Lite)** | MVP | Complete | Quick scenario loader (S1-S6), time travel, persistence toggler, ground truth reveal, &lt;1s reset. |
| **F27. API & Webhooks** | V1 | Complete | Signed HMAC-SHA256 webhooks for ITSM change ticket synchronization (Jira, ServiceNow, Slack). |

---

## Evaluation Benchmark Results (PRD Section 11 & 15)

All scenarios were evaluated against ground truth using the automated evaluation harness (`GET /v1/evaluation/run`):

| Metric | PRD Target | Measured Result | Status |
|---|---|---|---|
| **Detection Recall** | &gt;= 90% | **100.0%** (4/4 planted compromises detected) | PASSED |
| **False-Positive Rate** | &lt;= 10% | **0.0%** (Benign scripts never marked Likely Compromised) | PASSED |
| **Unsupported Claims Rate** | 0.0% | **0.0%** (100% of narrative sentences cite evidence IDs) | PASSED |
| **Coverage Honesty** | 100% | **100.0%** (Incomplete retention strictly marked Cannot verify) | PASSED |
| **Persistence Catch (S5)** | 100% | **100.0%** (Asset reopened due to planted web shell residue) | PASSED |
| **Tamper Detection (F16/F19)** | 100% | **100.0%** (Altering any byte breaks Ed25519 & hash chain) | PASSED |

---

## Architecture

- **Backend:** Python 3.14 + FastAPI + DuckDB (embedded high-speed columnar log engine) + PyCryptodome/Cryptography (Ed25519 asymmetric signatures, canonical JSON hashing).
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons.
- **Real-Time Feed:** Server-Sent Events (SSE) `/v1/events` streaming countdown clock ticks and audit ledger blocks.
- **Port Allocation:**
  - Backend API: `http://localhost:8008` (docs at `/docs`)
  - Frontend Web UI: `http://localhost:5173`

---

## Quick Start & Verification

### Running the Backend
```bash
cd backend
PYTHONPATH=. python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8008
```

### Running Backend Tests
```bash
PYTHONPATH=backend python3 -m pytest backend/tests -v
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
