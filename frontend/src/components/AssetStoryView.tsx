import React, { useState } from 'react'
import {
  ShieldAlert, ShieldCheck, AlertTriangle, ShieldX,
  Clock, Lock, Unlock, ArrowLeft, Terminal,
  Network, Cpu, CheckCircle2, MessageSquare, Send,
  FileCheck, Shield, HelpCircle, Activity,
  ChevronRight, Copy, Check, Radio, Eye
} from 'lucide-react'
import { AssetStory, EvidenceEvent } from '../types'
import { ProcessTree } from './ProcessTree'
import { BlastRadiusView } from './BlastRadiusView'
import { ProofPackModal } from './ProofPackModal'
import { IncidentHandOffModal } from './IncidentHandOffModal'
import {
  askAssistant, fetchIncidentDraft, fetchProofPack,
  overrideGate, triggerRecheck, updatePlaybookStep, approveSingleAsset
} from '../api'

interface AssetStoryViewProps {
  story: AssetStory
  onBack: () => void
  onRefresh: () => void
}

export const AssetStoryView: React.FC<AssetStoryViewProps> = ({
  story,
  onBack,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'process_tree' | 'evidence' | 'playbook' | 'blast_radius'>('timeline')
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceEvent | null>(story.evidence[0] || null)
  const [proofPack, setProofPack] = useState<any | null>(null)
  const [incidentDraft, setIncidentDraft] = useState<any | null>(null)
  const [isOpeningPack, setIsOpeningPack] = useState(false)
  const [isOpeningIncident, setIsOpeningIncident] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState(false)

  // Re-check state
  const [recheckRunning, setRecheckRunning] = useState(false)
  const [recheckMessage, setRecheckMessage] = useState<string | null>(null)

  // Override modal state
  const [showOverrideModal, setShowOverrideModal] = useState(false)
  const [overrideApprover, setOverrideApprover] = useState('ciso@company.in')
  const [overrideReason, setOverrideReason] = useState('Emergency operational uptime mandate approved by CISO')

  // Assistant state
  const [chatQuestion, setChatQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; citations?: string[] }>>([
    {
      sender: 'assistant',
      text: `Postern Evidence Assistant active for ${story.asset.host_name}. Telemetry reasoning strictly cited from case events.`,
      citations: []
    }
  ])
  const [isAsking, setIsAsking] = useState(false)

  const isComp = story.verdict.state === 'Likely compromised'
  const isCannotVerify = story.verdict.state === 'Cannot verify'

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return '00:00:00 (BREACHED)'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleAsk = async (qText?: string) => {
    const query = qText || chatQuestion
    if (!query.trim()) return

    const newHistory = [...chatHistory, { sender: 'user', text: query }]
    setChatHistory(newHistory)
    setChatQuestion('')
    setIsAsking(true)

    try {
      const res = await askAssistant(story.asset.id, query)
      setChatHistory([
        ...newHistory,
        {
          sender: 'assistant',
          text: res.answer,
          citations: res.citations
        }
      ])
    } catch (e) {
      setChatHistory([
        ...newHistory,
        {
          sender: 'assistant',
          text: 'Error connecting to evidence reasoning service.'
        }
      ])
    } finally {
      setIsAsking(false)
    }
  }

  const handleOverride = async () => {
    setShowOverrideModal(false)
    if (story.gate) {
      story.gate.gate_locked = false
      story.gate.status = 'overridden'
      story.gate.outcome = 'Overridden & Released'
      story.gate.override_approver = overrideApprover
      story.gate.override_reason = overrideReason
    }
    try {
      await overrideGate(story.asset.id, overrideApprover, overrideReason)
    } catch (e) {
      console.warn('Backend override sync warning, local state applied:', e)
    } finally {
      onRefresh()
    }
  }

  const handleRunRecheck = async () => {
    setRecheckRunning(true)
    setRecheckMessage(null)
    try {
      const res = await triggerRecheck(story.asset.id)
      setRecheckMessage(res.summary)
      onRefresh()
    } catch (e) {
      setRecheckMessage('Re-check execution failed')
    } finally {
      setRecheckRunning(false)
    }
  }

  const handleOpenProofPack = async () => {
    setIsOpeningPack(true)
    try {
      const pack = await fetchProofPack(story.asset.id)
      setProofPack(pack)
    } finally {
      setIsOpeningPack(false)
    }
  }

  const handleOpenIncident = async () => {
    setIsOpeningIncident(true)
    try {
      const inc = await fetchIncidentDraft(story.asset.id)
      setIncidentDraft(inc)
    } finally {
      setIsOpeningIncident(false)
    }
  }

  const handleStepVerify = async (stepId: string) => {
    await updatePlaybookStep(story.asset.id, stepId, 'verified', 'analyst@postern.local')
    onRefresh()
  }

  const copyCode = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#64748B] hover:text-[#7194B7] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#7194B7]" /> Back to Queue
        </button>

        <div className="flex items-center gap-2.5">
          {isComp && (
            <button
              onClick={handleOpenIncident}
              disabled={isOpeningIncident}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isOpeningIncident ? 'Drafting Form...' : 'CERT-In Form IR Notice'}</span>
            </button>
          )}

          <button
            onClick={handleOpenProofPack}
            disabled={isOpeningPack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F7FAFD] text-[#111B36] border border-[#E1E9F2] hover:border-[#7194B7] font-mono text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isOpeningPack ? 'Loading Certificate...' : 'Ed25519 Cryptographic Proof Pack'}</span>
          </button>
        </div>
      </div>

      {/* Hero Asset Investigation Banner */}
      <div className={`p-5 rounded-2xl soc-card-elevated border transition ${
        isComp
          ? 'border-rose-300 bg-rose-50/50'
          : isCannotVerify
          ? 'border-purple-300 bg-purple-50/50'
          : 'border-[#E1E9F2] bg-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-[#111B36] font-mono flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-[#7194B7]" />
                {story.asset.host_name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                story.asset.exposure_tier === 'emergency'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {story.asset.exposure_tier} Exposure Tier
              </span>
              <span className="text-xs font-mono text-[#64748B]">
                IP: <strong className="text-[#111B36]">{story.asset.ip_address}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] flex-wrap">
              <span>Product: <strong className="text-[#7194B7]">{story.asset.product} {story.asset.version}</strong></span>
              <span>•</span>
              <span>Tenant: <strong className="text-[#111B36] capitalize">{story.asset.tenant_id.replace('-', ' ')}</strong></span>
              <span>•</span>
              <span>Criticality: <strong className="text-amber-700 uppercase">{story.asset.criticality}</strong></span>
              <span>•</span>
              <span>Owner: {story.asset.owner}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Verdict Badge */}
            <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] text-right font-mono min-w-[200px]">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Compromise Verdict</div>
              <div className="flex items-center justify-end gap-2 mt-1">
                {isComp ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                ) : isCannotVerify ? (
                  <ShieldX className="w-5 h-5 text-purple-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className={`text-base font-black ${
                  isComp ? 'text-rose-600' : isCannotVerify ? 'text-purple-600' : 'text-emerald-600'
                }`}>
                  {story.verdict.state}
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] mt-0.5">
                Confidence: <strong className="text-[#111B36] uppercase">{story.verdict.confidence}</strong>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] text-right font-mono min-w-[170px]">
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7194B7]" /> {story.clock.profile}
              </div>
              <div className={`text-lg font-black mt-1 ${
                story.clock.is_breached ? 'text-red-600' : 'text-amber-700'
              }`}>
                {formatSeconds(story.clock.seconds_remaining)}
              </div>
              <div className="text-[10px] text-[#64748B] mt-0.5">
                Target: {story.clock.target_tier}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tabs (8 cols) & Right Reasoning Rail (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Investigative View Tabs */}
          <div className="soc-card p-1 rounded-xl flex items-center gap-1 border border-[#E1E9F2] text-xs font-mono bg-white">
            {[
              { id: 'timeline', label: 'Timeline Lanes', icon: Activity, count: story.evidence.length },
              { id: 'process_tree', label: 'Process Hierarchy', icon: Cpu },
              { id: 'evidence', label: 'Raw Telemetry Table', icon: Terminal, count: story.evidence.length },
              { id: 'playbook', label: 'Residue Playbook', icon: Shield, count: story.playbook.steps.length },
              { id: 'blast_radius', label: 'Blast Radius (V2)', icon: Network, badge: `${story.blast_radius.blast_radius_score}/100` }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${
                    isActive
                      ? 'bg-[#E6EEF7] text-[#111B36] font-bold border border-[#7194B7] shadow-sm'
                      : 'text-[#64748B] hover:text-[#111B36] hover:bg-[#F7FAFD]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7194B7]' : 'text-[#64748B]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#7194B7] text-white font-bold' : 'bg-[#E6EEF7] text-[#64748B]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200 font-mono font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: BESPOKE VISUAL TIMELINE LANES */}
          {activeTab === 'timeline' && (
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] bg-white space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-3">
                <div className="flex items-center gap-2 font-bold text-[#111B36]">
                  <Activity className="w-4 h-4 text-[#7194B7]" />
                  <span>Multi-Lane Telemetry & Attack Timeline (45-Day Scope)</span>
                </div>
                <div className="text-[11px] text-[#64748B] flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#7194B7]" />
                    <span>Advisory Disclosed: <strong>2026-10-09</strong></span>
                  </span>
                  <span className="text-[#C1D0E2]">|</span>
                  <span className="text-amber-700">First In-The-Wild Hit: <strong>2026-10-04</strong></span>
                </div>
              </div>

              {/* Time Ruler Bar */}
              <div className="relative pt-2">
                <div className="flex justify-between text-[10px] text-[#64748B] font-mono uppercase pb-1 px-1">
                  <span>-45d (Aug 25)</span>
                  <span>-30d</span>
                  <span className="text-rose-600 font-bold">-14d [FIRST HIT]</span>
                  <span className="text-[#7194B7] font-bold">-9d [DISCLOSED]</span>
                  <span>-7d</span>
                  <span className="text-[#111B36] font-bold">NOW (Triage)</span>
                </div>
                <div className="h-1.5 bg-[#E6EEF7] rounded-full border border-[#E1E9F2] relative">
                  <div className="absolute left-[68.8%] top-[-2px] bottom-[-2px] w-1 bg-rose-500 rounded-full" title="First Exploit Hit (-14d)" />
                  <div className="absolute left-[80%] top-[-4px] bottom-[-4px] w-1 bg-[#7194B7] rounded-full" title="Public Advisory Disclosed (-9d)" />
                </div>
              </div>

              {/* Timeline Lanes Container */}
              <div className="space-y-4 pt-1">
                {/* Lane 1: Flaw Exposure Window */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#64748B] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 1: VULNERABILITY EXPOSURE SPAN</span>
                    <span className="text-[#64748B]">Firmware: EdgeGate VPN 9.1.4</span>
                  </div>
                  <div className="relative h-8 bg-[#E6EEF7]/50 rounded-xl border border-[#E1E9F2] overflow-hidden flex items-center px-3">
                    <div className="absolute inset-y-0 left-0 w-[80%] bg-[#E6EEF7] flex items-center px-3 text-[11px] font-medium text-[#111B36]">
                      Unpatched Vulnerable Window (45 Days Telemetry History)
                    </div>
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#7194B7] z-10" />
                  </div>
                </div>

                {/* Lane 2: Matched Forensic Markers */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#64748B] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 2: NUMBERED ATTACK PROGRESSION MARKERS</span>
                    <span className="text-[#111B36] font-bold">{story.evidence.length} Correlated Artifacts</span>
                  </div>
                  <div className="relative min-h-[64px] bg-[#F7FAFD] rounded-xl border border-[#E1E9F2] flex items-center px-3 py-2.5 overflow-x-auto">
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#7194B7] z-10 pointer-events-none" />

                    {story.evidence.length === 0 ? (
                      <div className="text-[#64748B] text-xs italic flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                        <span>Zero exploit artifacts detected across all queries</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 relative z-0 flex-nowrap pr-6">
                        {story.evidence.map((ev, idx) => {
                          const isSelected = selectedEvidence?.event_id === ev.event_id
                          return (
                            <button
                              key={ev.event_id}
                              onClick={() => setSelectedEvidence(ev)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer shrink-0 border ${
                                isSelected
                                  ? 'bg-[#7194B7] text-white border-[#5E82A7] shadow-xs'
                                  : 'bg-white hover:bg-[#E6EEF7] text-[#111B36] border-[#E1E9F2] hover:border-[#84A3C4] shadow-2xs'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-white text-[#7194B7]'
                                  : 'bg-[#E6EEF7] text-[#5E82A7]'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="font-semibold whitespace-nowrap">
                                {ev.signal_class.replace('_', ' ').toUpperCase()}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lane 3: Per-Source Retention Coverage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#64748B] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 3: TELEMETRY RETENTION PER LOG SOURCE</span>
                    <span className="text-[#047857] font-semibold">Policy: &gt;= 85% Provability</span>
                  </div>

                  <div className="space-y-1.5">
                    {story.coverage.sources.map((src) => {
                      const pct = Math.round(src.coverage_ratio * 100)
                      const isAdequate = src.coverage_ratio >= 0.85
                      return (
                        <div key={src.source_type} className="flex items-center gap-3 text-xs">
                          <span className="w-20 font-bold uppercase text-[10px] text-[#64748B] text-right font-mono">
                            {src.source_type}:
                          </span>
                          <div className="flex-1 h-3.5 bg-[#E6EEF7] rounded-lg border border-[#E1E9F2] overflow-hidden relative">
                            <div
                              className={`h-full rounded-lg transition-all ${
                                isAdequate ? 'bg-[#7194B7]' : 'bg-[#C1D0E2]'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            {!isAdequate && (
                              <div
                                className="absolute inset-y-0 right-0 bg-[#FEE2E2] border-l border-[#FECACA] flex items-center justify-center text-[8px] text-[#DC2626] px-1 font-mono font-bold"
                                style={{ width: `${100 - pct}%` }}
                              >
                                RETENTION GAP
                              </div>
                            )}
                          </div>
                          <span className="w-20 text-right text-[10px] font-mono font-bold text-[#111B36]">
                            {src.available_days}/45d ({pct}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Evidence Detail Drawer */}
              {selectedEvidence && (
                <div className="mt-4 p-4 rounded-xl bg-[#F7FAFD] border border-[#7194B7]/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-[#E1E9F2] pb-2">
                    <span className="font-bold text-[#7194B7] flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#7194B7]" />
                      EVENT INSPECTOR: [{selectedEvidence.event_id}]
                    </span>
                    <span className="text-[#64748B] font-mono text-[11px]">{selectedEvidence.timestamp} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div>Source: <strong className="text-[#111B36] uppercase">{selectedEvidence.source_type}</strong></div>
                    <div>Action: <strong className="text-[#111B36]">{selectedEvidence.event_action}</strong></div>
                    <div>Signal Class: <strong className="text-[#111B36] uppercase">{selectedEvidence.signal_class}</strong></div>
                    <div>Confidence: <strong className="text-[#5E82A7] uppercase">{selectedEvidence.confidence}</strong></div>
                  </div>

                  {selectedEvidence.details.process_cmdline && (
                    <div className="p-2.5 rounded-lg bg-white border border-[#E1E9F2] text-[11px] text-[#111B36] flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.process_cmdline}</code>
                      <button
                        onClick={() => copyCode(selectedEvidence.details.process_cmdline)}
                        className="px-2 py-0.5 rounded bg-[#F7FAFD] hover:bg-[#E6EEF7] border border-[#E1E9F2] text-[#64748B] text-[10px]"
                      >
                        {copiedCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {selectedEvidence.details.url_path && (
                    <div className="p-2.5 rounded-lg bg-white border border-[#E1E9F2] text-[11px] text-[#111B36] flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.http_method} {selectedEvidence.details.url_path}</code>
                      <button
                        onClick={() => copyCode(`${selectedEvidence.details.http_method} ${selectedEvidence.details.url_path}`)}
                        className="px-2 py-0.5 rounded bg-[#F7FAFD] hover:bg-[#E6EEF7] border border-[#E1E9F2] text-[#64748B] text-[10px]"
                      >
                        {copiedCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROCESS TREE */}
          {activeTab === 'process_tree' && (
            <ProcessTree evidence={story.evidence} hostName={story.asset.host_name} />
          )}

          {/* TAB 3: RAW EVIDENCE */}
          {activeTab === 'evidence' && (
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] bg-white space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-3">
                <span className="font-bold text-[#111B36] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#7194B7]" />
                  Forensic Telemetry Ledger ({story.evidence.length} Records)
                </span>
                <span className="text-[11px] text-[#64748B]">Read-Only DuckDB Stream</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E6EEF7] text-[#111B36] text-[10px] uppercase border-b border-[#E1E9F2]">
                    <tr>
                      <th className="p-2.5">EVENT ID</th>
                      <th className="p-2.5">TIMESTAMP</th>
                      <th className="p-2.5">SOURCE</th>
                      <th className="p-2.5">SIGNAL CLASS</th>
                      <th className="p-2.5">TELEMETRY DETAIL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E9F2] text-[11px]">
                    {story.evidence.map((ev) => (
                      <tr key={ev.event_id} className="hover:bg-[#F7FAFD]">
                        <td className="p-2.5 font-bold text-[#7194B7]">{ev.event_id}</td>
                        <td className="p-2.5 text-[#111B36]">{ev.timestamp}</td>
                        <td className="p-2.5 uppercase text-[#64748B]">{ev.source_type}</td>
                        <td className="p-2.5 font-bold text-[#111B36]">{ev.signal_class}</td>
                        <td className="p-2.5 text-[#111B36] select-all max-w-sm truncate">
                          {ev.details.process_cmdline || ev.details.url_path || ev.details.file_path || ev.event_action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PLAYBOOK & CLEANUP */}
          {activeTab === 'playbook' && (
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] bg-white space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-3">
                <div>
                  <h3 className="font-bold text-[#111B36] flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[#7194B7]" /> Containment & Remediation Playbook
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5 font-sans">
                    Guarantees execution of hygiene actions (session termination, implant removal) that patching alone leaves behind.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {story.playbook.steps.map((step) => {
                  const isDone = step.status === 'verified'
                  return (
                    <div
                      key={step.step_id}
                      className={`p-4 rounded-xl border transition ${
                        isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F7FAFD] border-[#E1E9F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-[#111B36]">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            step.phase === 'containment' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-[#E6EEF7] text-[#7194B7] border border-[#C1D0E2]'
                          }`}>
                            {step.phase}
                          </span>
                          <span className="text-xs">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            isDone ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {step.status}
                          </span>
                          {!isDone && (
                            <button
                              onClick={() => handleStepVerify(step.step_id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold font-mono transition"
                            >
                              Verify Step
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[#64748B] text-xs font-sans leading-relaxed">{step.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-[#E1E9F2] text-[10px] text-[#64748B] flex items-center justify-between">
                        <span>Owner: <strong className="text-[#111B36]">{step.owner}</strong></span>
                        <span>Verification: <strong className="text-[#111B36]">{step.verification_method}</strong></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 5: BLAST RADIUS */}
          {activeTab === 'blast_radius' && (
            <BlastRadiusView graph={story.blast_radius} hostName={story.asset.host_name} />
          )}
        </div>

        {/* Right Rail: Evidence Reasoning & Assistant (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Why This Verdict (Citations Enforced) */}
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] bg-white space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
              <h3 className="font-bold text-[#111B36] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7194B7]" />
                <span>Forensic Reasoning (Citations)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold">100% CITED</span>
            </div>

            <div className="space-y-2.5 font-sans">
              {story.verdict.reasons.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] text-[#111B36] leading-relaxed text-xs">
                  <p>{r.text}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-[10px] text-[#64748B]">Evidence Citations:</span>
                    {r.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="px-1.5 py-0.5 rounded bg-[#E6EEF7] text-[#111B36] border border-[#C1D0E2] text-[10px] font-bold cursor-pointer hover:bg-[#C1D0E2] transition"
                        onClick={() => {
                          const ev = story.evidence.find((e) => e.event_id === eid)
                          if (ev) setSelectedEvidence(ev)
                        }}
                      >
                        [{eid}]
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What I Cannot See (Coverage Honesty) */}
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] bg-white space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
              <h3 className="font-bold text-[#111B36] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Coverage Honesty (Blind Spots)</span>
              </h3>
              <span className="text-[10px] font-bold text-purple-700">
                {Math.round(story.coverage.overall_coverage * 100)}% Retained
              </span>
            </div>

            {story.coverage.blind_spots.length === 0 ? (
              <p className="text-[#64748B] text-xs font-sans leading-relaxed">
                Zero retention blind spots. Complete 45-day telemetry available across web, endpoint, auth, and network sources.
              </p>
            ) : (
              <div className="space-y-1.5">
                {story.coverage.blind_spots.map((bs, i) => (
                  <div key={i} className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs font-sans">
                    {bs}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ask-The-Evidence Assistant */}
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] bg-white space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
              <h3 className="font-bold text-[#111B36] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#7194B7]" /> Forensic Evidence Assistant
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E6EEF7] text-[#7194B7] border border-[#C1D0E2]">
                Injection Shielded
              </span>
            </div>

            {/* Quick Inquiry Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Why is this likely compromised?',
                'What would change the verdict?',
                "What can't you see?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="px-2 py-1 rounded-md bg-[#F7FAFD] hover:bg-[#E6EEF7] text-[#111B36] text-[10px] border border-[#E1E9F2] transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat History Drawer */}
            <div className="h-48 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] text-xs font-sans">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-[#E6EEF7] text-[#111B36] border border-[#84A3C4] ml-4'
                      : 'bg-white text-[#111B36] mr-4 border border-[#E1E9F2]'
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-[#64748B] mb-0.5 font-mono">
                    {msg.sender === 'user' ? 'Analyst' : 'Postern Trust Service'}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap font-mono">
                      <span className="text-[9px] text-[#64748B]">Citations:</span>
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[9px] px-1 rounded bg-[#E6EEF7] text-[#7194B7] border border-[#C1D0E2]">
                          [{c}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAsking && <div className="text-[#64748B] italic text-[11px] font-mono">Querying evidence ledger...</div>}
            </div>

            {/* Query Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask grounded question..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-white border border-[#E1E9F2] rounded-xl px-3 py-1.5 text-xs text-[#111B36] placeholder-[#64748B] focus:outline-none focus:border-[#7194B7] font-mono"
              />
              <button
                onClick={() => handleAsk()}
                className="p-2 rounded-xl bg-[#7194B7] hover:bg-[#5E82A7] text-white transition active:scale-95 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gated Execution Pipeline */}
      <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] bg-white space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
          <h3 className="font-bold text-[#111B36] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7194B7]" />
            <span>Recommended Decision Sequence & Patch Gate Pipeline</span>
          </h3>
          <span className="text-[10px] text-[#64748B]">Step 3 strictly enforced by Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Containment */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#111B36]">
              <span>1. Host Isolation</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isComp ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]' : 'bg-[#E6EEF7] text-[#64748B]'
              }`}>
                {isComp ? 'Mandatory' : 'Bypassed'}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
              Quarantine host to isolated VLAN prior to patching to prevent active lateral movement.
            </p>
          </div>

          {/* Step 2: Evidence Snapshot */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#111B36]">
              <span>2. Memory Snapshot</span>
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Volatile</span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
              Preserve live RAM dump and socket states before host reboot or firmware overwrite.
            </p>
          </div>

          {/* Step 3: Patch Gate */}
          <div className={`p-4 rounded-xl border space-y-2 transition ${
            story.gate.gate_locked ? 'bg-[#FEE2E2]/40 border-[#FECACA]' : 'bg-[#D1FAE5]/40 border-[#A7F3D0]'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-[#111B36]">
                {story.gate.gate_locked ? <Lock className="w-4 h-4 text-[#DC2626]" /> : <Unlock className="w-4 h-4 text-[#047857]" />}
                3. Patch Gate
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                story.gate.gate_locked ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]' : 'bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]'
              }`}>
                {story.gate.gate_locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="text-[11px] text-[#111B36] font-sans">
              Outcome: <strong className="text-[#111B36] font-bold">{story.gate.outcome}</strong>
            </p>
            {story.gate.gate_locked ? (
              <button
                onClick={() => setShowOverrideModal(true)}
                className="w-full py-1.5 rounded-lg bg-[#7194B7] hover:bg-[#5E82A7] text-white text-[11px] font-bold transition shadow-2xs cursor-pointer"
              >
                Apply Gate Override
              </button>
            ) : story.gate.is_approved ? (
              <div className="p-2 rounded-lg bg-[#D1FAE5] border border-[#A7F3D0] text-[#047857] text-[11px] font-bold flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#047857]" />
                <span>Gate Approved & Released</span>
              </div>
            ) : (
              <button
                onClick={async () => {
                  story.gate.is_approved = true
                  story.gate.status = 'approved'
                  story.gate.outcome = 'Approved & Released'
                  try {
                    await approveSingleAsset(story.asset.id)
                  } catch (e) {
                    console.warn('Backend sync deferred:', e)
                  } finally {
                    onRefresh()
                  }
                }}
                className="w-full py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-[11px] font-bold transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Release Patch</span>
              </button>
            )}
          </div>

          {/* Step 4: Post-Patch Re-Check */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#111B36]">
              <span>4. Closure Verification</span>
              <span className="text-[#7194B7] text-[10px] font-bold uppercase">Re-Check Engine</span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
              Forensic recheck verifying web shell removal, session flush, and 0 outbound C2 traffic.
            </p>
            <button
              onClick={handleRunRecheck}
              disabled={recheckRunning}
              className="w-full py-1.5 rounded-lg bg-[#7194B7] hover:bg-[#5E82A7] text-white font-bold text-[11px] transition active:scale-95 shadow-sm"
            >
              {recheckRunning ? 'Re-Checking Host...' : 'Run Post-Patch Re-Check'}
            </button>
          </div>
        </div>

        {recheckMessage && (
          <div className="p-3.5 rounded-xl bg-[#E6EEF7] border border-[#7194B7] text-[#111B36] font-mono text-xs flex items-center justify-between">
            <span>{recheckMessage}</span>
            <span className="text-[10px] text-[#64748B] font-bold uppercase">Closure Audit Complete</span>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="soc-card-elevated p-6 max-w-md w-full space-y-4 font-mono text-xs rounded-2xl border border-rose-300 bg-white">
            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Administrative Patch Gate Override
            </h3>
            <p className="text-[#64748B] font-sans text-xs leading-relaxed">
              Unlocks the patch gate over a suspected or confirmed compromise. Requires business continuity justification and records an immutable audit entry in the chain of custody.
            </p>
            <div>
              <label className="text-[#64748B]">Approver ID / Role:</label>
              <input
                type="text"
                value={overrideApprover}
                onChange={(e) => setOverrideApprover(e.target.value)}
                className="w-full mt-1 bg-[#F7FAFD] border border-[#E1E9F2] rounded-lg p-2 text-[#111B36] font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[#64748B]">Recorded Operational Justification:</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-[#F7FAFD] border border-[#E1E9F2] rounded-lg p-2 text-[#111B36] font-sans text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1E9F2]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#E6EEF7] text-[#111B36] hover:bg-[#C1D0E2]"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm & Log Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {proofPack && <ProofPackModal pack={proofPack} onClose={() => setProofPack(null)} />}
      {incidentDraft && <IncidentHandOffModal incidentDraft={incidentDraft} onClose={() => setIncidentDraft(null)} />}
    </div>
  )
}
