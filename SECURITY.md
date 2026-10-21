# Security Policy

## Supported Versions

| Version | Supported | Status |
|---|---|---|
| `3.5.x` | :white_check_mark: | Active Enterprise & Community Support |
| `3.4.x` | :white_check_mark: | Security Fixes Only |
| `< 3.4.0`| :x: | Deprecated |

---

## Reporting a Vulnerability

We take the security and cryptographic integrity of Postern seriously. If you discover a security vulnerability or potential tamper vector, please do not file a public GitHub issue.

Instead, please send an encrypted or direct email report to:
📧 **security@postern.io** (or contact the maintainers via private security advisory).

### Please include:
- A description of the vulnerability and attack vector (e.g. proof pack signature forgery, SSRF bypass, tenant isolation leak, rate limit bypass).
- Proof-of-concept (PoC) code or steps to reproduce.
- Affected endpoints or components.
- An assessment of the impact (confidentiality, integrity, availability).

We commit to:
- Acknowledge receipt within **24 hours**.
- Provide an initial technical assessment and mitigation timeline within **72 hours**.
- Coordinate public disclosure following deployment of the patched release.

---

## Cryptographic Security & Threat Model

Postern uses a defense-in-depth cryptographic assurance model:

1. **Digital Proof Packs**:
   - Asymmetric signatures generated using **Ed25519** (pure Ed25519, RFC 8032).
   - Canonical representation guaranteed by **RFC 8785 JSON Canonicalization Scheme (JCS)**.
   - Evidence events are individually tree-hashed using **SHA-256**.
   - Public keys are published at `/v1/crypto/public-keys` with verifiable key rotation delegation certificates.

2. **Immutable Audit Ledger**:
   - Concurrency-safe, append-only hash chain.
   - Each block links to its predecessor via `prev_hash` (`SHA-256`), preventing retroactive insertion or alteration.

3. **Tenant Isolation**:
   - Strict tenant binding on all asset operations.
   - Multi-tenant role-based access control (`admin`, `approver`, `analyst`, `auditor`, `viewer`).

4. **Network Boundaries & SSRF Mitigation**:
   - All outbound webhook and connector requests undergo rigorous SSRF validation.
   - Private RFC 1918 subnets, link-local addresses, loopback addresses, and cloud metadata IPs (`169.254.169.254`) are blocked.
