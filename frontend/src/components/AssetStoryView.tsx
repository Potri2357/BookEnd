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
  overrideGate, triggerRecheck, updatePlaybookStep
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
      text: `Patch Assurance Evidence Assistant active for ${story.asset.host_name}. Telemetry reasoning strictly cited from case events.`,
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
    await overrideGate(story.asset.id, overrideApprover, overrideReason)
    setShowOverrideModal(false)
    onRefresh()
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
    await updatePlaybookStep(story.asset.id, stepId, 'verified', 'analyst@patchguard.local')
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
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-cyan-300 transition"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to Queue
        </button>

        <div className="flex items-center gap-2.5">
          {isComp && (
            <button
              onClick={handleOpenIncident}
              disabled={isOpeningIncident}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-lg shadow-rose-600/20 transition active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isOpeningIncident ? 'Drafting Form...' : 'CERT-In Form IR Draft (F17)'}</span>
            </button>
          )}

          <button
            onClick={handleOpenProofPack}
            disabled={isOpeningPack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0c1020] hover:bg-[#12172e] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs font-bold transition active:scale-95 shadow-md shadow-cyan-500/10"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isOpeningPack ? 'Loading Certificate...' : 'Cryptographic Proof Pack (F16)'}</span>
          </button>
        </div>
      </div>

      {/* Hero Asset Investigation Banner (PRD Section 8.3) */}
      <div className={`p-5 rounded-2xl soc-card-elevated border transition ${
        isComp
          ? 'border-rose-500/50 glow-crimson'
          : isCannotVerify
          ? 'border-purple-500/40'
          : 'border-white/[0.08]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-cyan-400" />
                {story.asset.host_name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                story.asset.exposure_tier === 'emergency'
                  ? 'bg-red-500/15 text-red-300 border border-red-500/40'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
              }`}>
                {story.asset.exposure_tier} Exposure Tier
              </span>
              <span className="text-xs font-mono text-slate-400">
                IP: <strong className="text-slate-200">{story.asset.ip_address}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
              <span>Product: <strong className="text-cyan-300">{story.asset.product} {story.asset.version}</strong></span>
              <span>•</span>
              <span>Tenant: <strong className="text-slate-200 capitalize">{story.asset.tenant_id.replace('-', ' ')}</strong></span>
              <span>•</span>
              <span>Criticality: <strong className="text-amber-300 uppercase">{story.asset.criticality}</strong></span>
              <span>•</span>
              <span>Owner: {story.asset.owner}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Verdict Badge */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-right font-mono min-w-[200px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Compromise Verdict</div>
              <div className="flex items-center justify-end gap-2 mt-1">
                {isComp ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                ) : isCannotVerify ? (
                  <ShieldX className="w-5 h-5 text-purple-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <span className={`text-base font-black ${
                  isComp ? 'text-rose-300' : isCannotVerify ? 'text-purple-300' : 'text-emerald-300'
                }`}>
                  {story.verdict.state}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Confidence: <strong className="text-slate-300 uppercase">{story.verdict.confidence}</strong>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-right font-mono min-w-[170px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {story.clock.profile}
              </div>
              <div className={`text-lg font-black mt-1 ${
                story.clock.is_breached ? 'text-red-400' : 'text-amber-300'
              }`}>
                {formatSeconds(story.clock.seconds_remaining)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
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
          <div className="soc-card p-1 rounded-xl flex items-center gap-1 border border-white/[0.08] text-xs font-mono">
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
                      ? 'bg-cyan-500/15 text-cyan-200 font-bold border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-cyan-500/25 text-cyan-200 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: BESPOKE VISUAL TIMELINE LANES */}
          {activeTab === 'timeline' && (
            <div className="soc-card-elevated p-5 rounded-2xl border border-white/[0.08] space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-100">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Multi-Lane Telemetry & Attack Timeline (45-Day Scope)</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t-2 border-dashed border-cyan-400" />
                    <span>Advisory Disclosed: <strong>2026-10-09</strong></span>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-amber-300">First In-The-Wild Hit: <strong>2026-10-04</strong></span>
                </div>
              </div>

              {/* Time Ruler Bar */}
              <div className="relative pt-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase pb-1 px-1">
                  <span>-45d (Aug 25)</span>
                  <span>-30d</span>
                  <span className="text-rose-400 font-bold">-14d [FIRST HIT]</span>
                  <span className="text-cyan-400 font-bold">-9d [DISCLOSED]</span>
                  <span>-7d</span>
                  <span className="text-slate-300 font-bold">NOW (Triage)</span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full border border-white/[0.06] relative">
                  <div className="absolute left-[68.8%] top-[-2px] bottom-[-2px] w-1 bg-rose-500 rounded-full" title="First Exploit Hit (-14d)" />
                  <div className="absolute left-[80%] top-[-4px] bottom-[-4px] w-1 bg-cyan-400 rounded-full" title="Public Advisory Disclosed (-9d)" />
                </div>
              </div>

              {/* Timeline Lanes Container */}
              <div className="space-y-4 pt-1">
                {/* Lane 1: Flaw Exposure Window */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>LANE 1: VULNERABILITY EXPOSURE SPAN</span>
                    <span className="text-slate-500">Firmware: EdgeGate VPN 9.1.4</span>
                  </div>
                  <div className="relative h-7 bg-black/50 rounded-xl border border-white/[0.08] overflow-hidden flex items-center px-3">
                    <div className="absolute inset-y-0 left-0 w-[80%] bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-transparent flex items-center px-3 text-[10px] text-slate-300">
                      Unpatched Vulnerable Window (45 Days Telemetry History)
                    </div>
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-cyan-400/80 z-10" />
                  </div>
                </div>

                {/* Lane 2: Matched Forensic Markers */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>LANE 2: NUMBERED ATTACK PROGRESSION MARKERS</span>
                    <span className="text-rose-400 font-bold">{story.evidence.length} Correlated Artifacts</span>
                  </div>
                  <div className="relative h-14 bg-black/60 rounded-xl border border-white/[0.08] flex items-center px-4">
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-cyan-400/80 z-10" />

                    {story.evidence.length === 0 ? (
                      <div className="text-slate-500 text-[11px] italic flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Zero exploit artifacts detected across all queries</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between relative">
                        {story.evidence.map((ev, idx) => {
                          const isSelected = selectedEvidence?.event_id === ev.event_id
                          return (
                            <button
                              key={ev.event_id}
                              onClick={() => setSelectedEvidence(ev)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition ${
                                isSelected
                                  ? 'bg-rose-500 text-white shadow-lg glow-crimson scale-105'
                                  : 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/40'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-black/40 text-rose-200 flex items-center justify-center text-[10px] font-black border border-rose-500/30">
                                {idx + 1}
                              </span>
                              <span>{ev.signal_class.replace('_', ' ').toUpperCase()}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lane 3: Per-Source Retention Coverage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>LANE 3: TELEMETRY RETENTION PER LOG SOURCE</span>
                    <span className="text-emerald-400">Policy: &gt;= 85% Provability</span>
                  </div>

                  <div className="space-y-1.5">
                    {story.coverage.sources.map((src) => {
                      const pct = Math.round(src.coverage_ratio * 100)
                      const isAdequate = src.coverage_ratio >= 0.85
                      return (
                        <div key={src.source_type} className="flex items-center gap-3">
                          <span className="w-20 font-bold uppercase text-[10px] text-slate-400 text-right font-mono">
                            {src.source_type}:
                          </span>
                          <div className="flex-1 h-3.5 bg-black/50 rounded-lg border border-white/[0.06] overflow-hidden relative">
                            <div
                              className={`h-full rounded-lg transition-all ${
                                isAdequate ? 'bg-emerald-500/70' : 'bg-purple-500/80'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            {!isAdequate && (
                              <div
                                className="absolute inset-y-0 right-0 bg-red-500/25 border-l border-red-500 flex items-center justify-center text-[8px] text-red-200 px-1 font-mono font-bold"
                                style={{ width: `${100 - pct}%` }}
                              >
                                RETENTION GAP
                              </div>
                            )}
                          </div>
                          <span className={`w-16 text-right text-[10px] font-mono font-bold ${
                            isAdequate ? 'text-slate-300' : 'text-purple-300'
                          }`}>
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
                <div className="mt-4 p-4 rounded-xl soc-card border border-cyan-500/30 space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-white/[0.06] pb-2">
                    <span className="font-bold text-cyan-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      EVENT INSPECTOR: [{selectedEvidence.event_id}]
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{selectedEvidence.timestamp} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div>Source: <strong className="text-slate-200 uppercase">{selectedEvidence.source_type}</strong></div>
                    <div>Action: <strong className="text-slate-200">{selectedEvidence.event_action}</strong></div>
                    <div>Signal Class: <strong className="text-rose-300 uppercase">{selectedEvidence.signal_class}</strong></div>
                    <div>Confidence: <strong className="text-amber-300 uppercase">{selectedEvidence.confidence}</strong></div>
                  </div>

                  {selectedEvidence.details.process_cmdline && (
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.08] text-[11px] text-cyan-200 flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.process_cmdline}</code>
                      <button
                        onClick={() => copyCode(selectedEvidence.details.process_cmdline)}
                        className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[10px]"
                      >
                        {copiedCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {selectedEvidence.details.url_path && (
                    <div className="p-2.5 rounded-lg bg-black/50 border border-white/[0.08] text-[11px] text-rose-200 flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.http_method} {selectedEvidence.details.url_path}</code>
                      <button
                        onClick={() => copyCode(`${selectedEvidence.details.http_method} ${selectedEvidence.details.url_path}`)}
                        className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[10px]"
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
            <div className="soc-card-elevated p-5 rounded-2xl border border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Forensic Telemetry Ledger ({story.evidence.length} Records)
                </span>
                <span className="text-[11px] text-slate-400">Read-Only DuckDB Stream</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080b16] text-slate-400 text-[10px] uppercase border-b border-white/[0.06]">
                    <tr>
                      <th className="p-2.5">EVENT ID</th>
                      <th className="p-2.5">TIMESTAMP</th>
                      <th className="p-2.5">SOURCE</th>
                      <th className="p-2.5">SIGNAL CLASS</th>
                      <th className="p-2.5">TELEMETRY DETAIL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-[11px]">
                    {story.evidence.map((ev) => (
                      <tr key={ev.event_id} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 font-bold text-cyan-300">{ev.event_id}</td>
                        <td className="p-2.5 text-slate-300">{ev.timestamp}</td>
                        <td className="p-2.5 uppercase text-slate-400">{ev.source_type}</td>
                        <td className="p-2.5 font-bold text-rose-400">{ev.signal_class}</td>
                        <td className="p-2.5 text-slate-300 select-all max-w-sm truncate">
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
            <div className="soc-card-elevated p-5 rounded-2xl border border-white/[0.08] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-cyan-400" /> Containment & Residue Playbook (F9)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
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
                        isDone ? 'bg-emerald-950/15 border-emerald-500/40' : 'soc-card border-white/[0.07]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            step.phase === 'containment' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {step.phase}
                          </span>
                          <span className="text-xs">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
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
                      <p className="text-slate-400 text-xs font-sans leading-relaxed">{step.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-white/[0.04] text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Owner: <strong className="text-slate-300">{step.owner}</strong></span>
                        <span>Verification: <strong className="text-slate-300">{step.verification_method}</strong></span>
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
          <div className="soc-card-elevated p-4 rounded-2xl border border-white/[0.08] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Forensic Reasoning (Citations)</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold">100% CITED</span>
            </div>

            <div className="space-y-2.5 font-sans">
              {story.verdict.reasons.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/[0.06] text-slate-300 leading-relaxed text-xs">
                  <p>{r.text}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-[10px] text-slate-500">Evidence Citations:</span>
                    {r.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-[10px] font-bold cursor-pointer hover:bg-cyan-900 transition"
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
          <div className="soc-card-elevated p-4 rounded-2xl border border-white/[0.08] space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Coverage Honesty (Blind Spots)</span>
              </h3>
              <span className="text-[10px] font-bold text-purple-300">
                {Math.round(story.coverage.overall_coverage * 100)}% Retained
              </span>
            </div>

            {story.coverage.blind_spots.length === 0 ? (
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                Zero retention blind spots. Complete 45-day telemetry available across web, endpoint, auth, and network sources.
              </p>
            ) : (
              <div className="space-y-1.5">
                {story.coverage.blind_spots.map((bs, i) => (
                  <div key={i} className="p-2 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-200 text-xs font-sans">
                    {bs}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ask-The-Evidence Assistant (F14) */}
          <div className="soc-card-elevated p-4 rounded-2xl border border-white/[0.08] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Evidence Assistant (F14)
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
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
                  className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-[10px] border border-white/[0.06] transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat History Drawer */}
            <div className="h-48 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-sans">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-cyan-950/30 text-cyan-200 border border-cyan-800/50 ml-4'
                      : 'bg-[#111524] text-slate-200 mr-4 border border-white/[0.04]'
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-slate-500 mb-0.5 font-mono">
                    {msg.sender === 'user' ? 'Analyst' : 'PatchGate Trust Service'}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap font-mono">
                      <span className="text-[9px] text-slate-500">Citations:</span>
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[9px] px-1 rounded bg-slate-900 text-cyan-400 border border-cyan-900">
                          [{c}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAsking && <div className="text-slate-500 italic text-[11px] font-mono">Querying evidence ledger...</div>}
            </div>

            {/* Query Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask grounded question..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                onClick={() => handleAsk()}
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition active:scale-95 shadow-md shadow-cyan-600/20"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gated Execution Pipeline (PRD Section 8.3 & F8/F10) */}
      <div className="soc-card-elevated p-5 rounded-2xl border border-white/[0.08] space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Recommended Decision Sequence & Patch Gate Pipeline</span>
          </h3>
          <span className="text-[10px] text-slate-400">Step 3 strictly enforced by Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Containment */}
          <div className="p-4 rounded-xl soc-card border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>1. Host Isolation</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isComp ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-500'
              }`}>
                {isComp ? 'Mandatory' : 'Bypassed'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Quarantine host to isolated VLAN prior to patching to prevent active lateral movement.
            </p>
          </div>

          {/* Step 2: Evidence Snapshot */}
          <div className="p-4 rounded-xl soc-card border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>2. Memory Snapshot</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Volatile</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Preserve live RAM dump and socket states before host reboot or firmware overwrite.
            </p>
          </div>

          {/* Step 3: Patch Gate */}
          <div className={`p-4 rounded-xl border space-y-2 transition ${
            story.gate.gate_locked ? 'bg-rose-950/20 border-rose-500/50 glow-crimson' : 'bg-emerald-950/20 border-emerald-500/50 glow-emerald'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {story.gate.gate_locked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                3. Patch Gate
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                story.gate.gate_locked ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {story.gate.gate_locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Outcome: <strong className="text-white">{story.gate.outcome}</strong>
            </p>
            {story.gate.gate_locked && (
              <button
                onClick={() => setShowOverrideModal(true)}
                className="w-full py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/40 text-rose-200 border border-rose-500/50 text-[11px] font-bold transition"
              >
                Apply Gate Override
              </button>
            )}
          </div>

          {/* Step 4: Post-Patch Re-Check (F10) */}
          <div className="p-4 rounded-xl soc-card border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>4. Closure Verification</span>
              <span className="text-cyan-400 text-[10px] font-bold uppercase">F10 Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Forensic recheck verifying web shell removal, session flush, and 0 outbound C2 traffic.
            </p>
            <button
              onClick={handleRunRecheck}
              disabled={recheckRunning}
              className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition active:scale-95 shadow-md shadow-cyan-600/20"
            >
              {recheckRunning ? 'Re-Checking Host...' : 'Run Post-Patch Re-Check'}
            </button>
          </div>
        </div>

        {recheckMessage && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-cyan-500/40 text-cyan-200 font-mono text-xs flex items-center justify-between">
            <span>{recheckMessage}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Closure Audit Complete</span>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="soc-card-elevated p-6 max-w-md w-full space-y-4 font-mono text-xs rounded-2xl border border-rose-500/50">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Administrative Patch Gate Override
            </h3>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Unlocks the patch gate over a suspected or confirmed compromise. Requires business continuity justification and records an immutable audit entry in the chain of custody.
            </p>
            <div>
              <label className="text-slate-400">Approver ID / Role:</label>
              <input
                type="text"
                value={overrideApprover}
                onChange={(e) => setOverrideApprover(e.target.value)}
                className="w-full mt-1 bg-black/50 border border-white/[0.08] rounded-lg p-2 text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400">Recorded Operational Justification:</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-black/50 border border-white/[0.08] rounded-lg p-2 text-white font-sans text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"
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
