"""
Pydantic data models and schemas for Patch Assurance.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class Tenant(BaseModel):
    id: str
    name: str
    industry: str
    region: str = "India"
    created_at: str

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    tenant_id: str
    role: str  # Admin, Analyst, Approver, Viewer, Auditor, MSSP_Manager

class Asset(BaseModel):
    id: str
    host_name: str
    tenant_id: str
    owner: str
    product: str
    version: str
    internet_facing: bool
    criticality: str  # critical, high, medium, low
    timezone: str = "Asia/Kolkata"
    ip_address: str
    exposure_tier: str = "standard"  # emergency, high, standard
    status: str = "matched"  # needs_inventory, matched, hunting, decided, closed, reopened
    notes: Optional[str] = None

class SourceSentence(BaseModel):
    id: str
    sentence: str
    confidence: float = 0.95

class Advisory(BaseModel):
    id: str
    cve_id: str
    title: str
    vendor: str
    product: str
    affected_versions: List[str]
    vuln_class: str
    exploitation_status: str  # known_exploited, in_the_wild, poc_public
    disclosure_date: str
    first_known_exploitation_date: str
    vendor_mitigations: List[str] = []
    cleanup_notes: List[str] = []
    indicators: List[str] = []
    raw_text: str
    source_sentences: List[SourceSentence] = []
    created_at: str

class HuntHypothesis(BaseModel):
    id: str
    data_source: str  # web, endpoint, auth, network, dns, file
    name: str
    behavior_pattern: str
    query_template: str
    time_window_days: int
    threshold: int = 1
    rationale: str
    attack_technique: Optional[str] = None
    enabled: bool = True
    spec_hash: str = ""

class HuntSpec(BaseModel):
    id: str
    advisory_id: str
    hypotheses: List[HuntHypothesis]
    created_at: str
    overall_spec_hash: str

class EvidenceEvent(BaseModel):
    event_id: str
    asset_id: str
    tenant_id: str
    timestamp: str
    source_type: str
    event_action: str
    signal_class: str  # access, execution, persistence, outbound_control, privilege_change, anomaly
    confidence: str  # high, medium, low
    details: Dict[str, Any]
    content_hash: str

class LogCoverageDetail(BaseModel):
    source_type: str
    required_days: int
    available_days: int
    coverage_ratio: float
    gaps: List[str] = []
    has_retention_blindspot: bool = False

class CoverageReport(BaseModel):
    asset_id: str
    overall_coverage: float
    sources: List[LogCoverageDetail]
    adequate: bool
    blind_spots: List[str]
    recommendations: List[str]

class CitedReason(BaseModel):
    text: str
    evidence_ids: List[str]

class Verdict(BaseModel):
    asset_id: str
    advisory_id: str
    state: str  # "Likely compromised", "Suspicious", "No evidence found", "Cannot verify"
    confidence: str  # "high", "medium", "low"
    reasons: List[CitedReason]
    coverage_score: float
    coverage_report: CoverageReport
    evaluated_at: str
    verdict_hash: str

class PlaybookStep(BaseModel):
    step_id: str
    title: str
    phase: str  # containment, cleanup
    description: str
    owner: str
    status: str  # pending, in_progress, verified, failed
    verification_method: str
    verified_at: Optional[str] = None
    verified_by: Optional[str] = None

class Playbook(BaseModel):
    id: str
    advisory_id: str
    asset_id: str
    steps: List[PlaybookStep]

class DecisionGate(BaseModel):
    asset_id: str
    advisory_id: str
    outcome: str  # "Patch now", "Patch with caution", "Hold and review", "Contain first then patch"
    gate_locked: bool
    required_roles: List[str]
    override_applied: bool = False
    override_reason: Optional[str] = None
    override_approver: Optional[str] = None
    status: str = "pending"  # pending, approved, overridden, rejected
    created_at: str

class DeadlineClock(BaseModel):
    asset_id: str
    advisory_id: str
    profile: str  # "CERT-In 12h/1d/3d/5d", "CISA BOD 26-04", "Internal SLA"
    target_tier: str  # emergency (12h), high (24h), standard (72h)
    start_time: str
    deadline_time: str
    seconds_remaining: int
    is_paused: bool = False
    is_breached: bool = False
    pause_reason: Optional[str] = None

class ProofPackManifest(BaseModel):
    pack_id: str
    tenant_id: str
    asset_id: str
    advisory_id: str
    generated_at: str
    verdict_state: str
    coverage_score: float
    decision_outcome: str
    post_patch_status: str
    spec_hashes: List[str]
    evidence_hashes: List[str]
    limitations_statement: str
    issuer: str = "Patch Assurance Trust Service"

class ProofPack(BaseModel):
    manifest: ProofPackManifest
    signature_b64: str
    public_key_b64: str
    evidence_items: List[EvidenceEvent]
    verdict: Verdict
    decision: DecisionGate
    clock: DeadlineClock
    playbook: Optional[Playbook] = None
    audit_events: List[Dict[str, Any]] = []

class BlastRadiusNode(BaseModel):
    id: str
    label: str
    type: str  # host, user, credential, database, service, dc
    criticality: str
    compromised: bool

class BlastRadiusLink(BaseModel):
    source: str
    target: str
    relationship: str  # active_session, admin_access, trusts, network_egress, shared_secret
    risk_level: str  # high, medium, low

class BlastRadiusGraph(BaseModel):
    asset_id: str
    root_node_id: str
    nodes: List[BlastRadiusNode]
    links: List[BlastRadiusLink]
    blast_radius_score: int  # 0 to 100
    summary: str

class IncidentNotificationDraft(BaseModel):
    incident_id: str
    asset_id: str
    advisory_id: str
    cert_in_draft: Dict[str, Any]
    insurer_notice_draft: Dict[str, Any]
    executive_summary_draft: str
    generated_at: str
    missing_facts: List[str]

class AnalystFeedback(BaseModel):
    id: str
    asset_id: str
    advisory_id: str
    finding_id: str
    action: str  # confirm, dismiss, mark_benign
    analyst: str
    rationale: str
    timestamp: str
