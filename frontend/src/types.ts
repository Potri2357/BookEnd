export interface Tenant {
  id: string
  name: string
  industry: string
  region: string
}

export interface Asset {
  id: string
  host_name: string
  tenant_id: string
  owner: string
  product: string
  version: string
  internet_facing: boolean
  criticality: 'critical' | 'high' | 'medium' | 'low'
  timezone: string
  ip_address: string
  exposure_tier: 'emergency' | 'high' | 'standard'
  status: 'needs_inventory' | 'matched' | 'unaffected' | 'closed' | 'reopened'
  notes?: string
}

export interface SourceSentence {
  id: string
  sentence: string
  confidence: number
}

export interface Advisory {
  id: string
  cve_id: string
  title: string
  vendor: string
  product: string
  affected_versions: string[]
  vuln_class: string
  exploitation_status: string
  disclosure_date: string
  first_known_exploitation_date: string
  vendor_mitigations: string[]
  cleanup_notes: string[]
  indicators: string[]
  raw_text: string
  source_sentences: SourceSentence[]
  created_at: string
}

export interface HuntHypothesis {
  id: string
  data_source: string
  name: string
  behavior_pattern: string
  query_template: string
  time_window_days: number
  threshold: number
  rationale: string
  attack_technique?: string
  enabled: boolean
  spec_hash: string
}

export interface HuntSpec {
  id: string
  advisory_id: string
  hypotheses: HuntHypothesis[]
  created_at: string
  overall_spec_hash: string
}

export interface EvidenceEvent {
  event_id: string
  asset_id: string
  tenant_id: string
  timestamp: string
  source_type: string
  event_action: string
  signal_class: 'access' | 'execution' | 'persistence' | 'outbound_control' | 'privilege_change' | 'anomaly'
  confidence: 'high' | 'medium' | 'low'
  details: Record<string, any>
  content_hash: string
}

export interface LogCoverageDetail {
  source_type: string
  required_days: number
  available_days: number
  coverage_ratio: number
  gaps: string[]
  has_retention_blindspot: boolean
}

export interface CoverageReport {
  asset_id: string
  overall_coverage: number
  sources: LogCoverageDetail[]
  adequate: boolean
  blind_spots: string[]
  recommendations: string[]
}

export interface CitedReason {
  text: string
  evidence_ids: string[]
}

export interface Verdict {
  asset_id: string
  advisory_id: string
  state: 'Likely compromised' | 'Suspicious' | 'No evidence found' | 'Cannot verify'
  confidence: 'high' | 'medium' | 'low'
  reasons: CitedReason[]
  coverage_score: number
  coverage_report: CoverageReport
  evaluated_at: string
  verdict_hash: string
}

export interface DecisionGate {
  asset_id: string
  advisory_id: string
  outcome: 'Patch now' | 'Patch with caution' | 'Hold and review' | 'Contain first then patch' | 'Approved & Released' | 'Overridden & Released' | string
  gate_locked: boolean
  required_roles: string[]
  override_applied: boolean
  override_reason?: string
  override_approver?: string
  status: string
  created_at: string
  is_approved?: boolean
}

export interface DeadlineClock {
  asset_id: string
  advisory_id: string
  profile: string
  target_tier: string
  start_time: string
  deadline_time: string
  seconds_remaining: number
  is_paused: boolean
  is_breached: boolean
  pause_reason?: string
}

export interface PlaybookStep {
  step_id: string
  title: string
  phase: 'containment' | 'cleanup'
  description: string
  owner: string
  status: 'pending' | 'in_progress' | 'verified' | 'failed'
  verification_method: string
  verified_at?: string
  verified_by?: string
}

export interface Playbook {
  id: string
  advisory_id: string
  asset_id: string
  steps: PlaybookStep[]
}

export interface BlastRadiusNode {
  id: string
  label: string
  type: 'host' | 'user' | 'credential' | 'database' | 'service' | 'dc'
  criticality: string
  compromised: boolean
}

export interface BlastRadiusLink {
  source: string
  target: string
  relationship: string
  risk_level: string
}

export interface BlastRadiusGraph {
  asset_id: string
  root_node_id: string
  nodes: BlastRadiusNode[]
  links: BlastRadiusLink[]
  blast_radius_score: number
  summary: string
}

export interface AssetStory {
  asset: Asset
  advisory: Advisory
  evidence: EvidenceEvent[]
  coverage: CoverageReport
  verdict: Verdict
  gate: DecisionGate
  clock: DeadlineClock
  playbook: Playbook
  blast_radius: BlastRadiusGraph
}

export interface QueueItem {
  asset_id: string
  host_name: string
  tenant_id: string
  owner: string
  exposure_tier: 'emergency' | 'high' | 'standard'
  verdict_state: string
  confidence: string
  coverage_score: number
  gate_outcome: string
  gate_locked: boolean
  seconds_remaining: number
  is_breached: boolean
  status: string
  is_approved?: boolean
}

export interface ProofPackManifest {
  pack_id: string
  tenant_id: string
  asset_id: string
  advisory_id: string
  generated_at: string
  verdict_state: string
  coverage_score: number
  decision_outcome: string
  post_patch_status: string
  spec_hashes: string[]
  evidence_hashes: string[]
  limitations_statement: string
  issuer: string
}

export interface AuditRecord {
  index: number
  timestamp: string
  actor: string
  role: string
  action: string
  object_id: string
  details: Record<string, any>
  prev_hash: string
  hash: string
}

export interface ApprovalRequest {
  request_id: string
  asset_id: string
  action_type: 'contain_host' | 'approve_patch' | 'override_gate' | string
  requested_by: string
  required_role: string
  evidence_snapshot_hash: string
  status: 'pending' | 'approved' | 'rejected' | 'pending_second_approval' | string
  approved_by?: string
  second_approver?: string
  approval_notes?: string
  created_at: string
}

export interface CollaborationMessage {
  msg_id: string
  asset_id: string
  sender: string
  role: string
  content: string
  timestamp: string
}

export interface ProofPack {
  manifest: ProofPackManifest
  signature_b64: string
  public_key_b64: string
  evidence_items: EvidenceEvent[]
  verdict: Verdict
  decision: DecisionGate
  clock: DeadlineClock
  playbook?: Playbook
  audit_events: AuditRecord[]
}

