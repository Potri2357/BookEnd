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
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#527977] hover:text-[#0d9488] transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#0d9488]" /> Back to Queue
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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f2f7f7] text-[#113644] border border-[#cde5e3] hover:border-[#0d9488] font-mono text-xs font-bold transition active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-[#0d9488]" />
            <span>{isOpeningPack ? 'Loading Certificate...' : 'Ed25519 Cryptographic Proof Pack'}</span>
          </button>
        </div>
      </div>

      {/* Hero Asset Investigation Banner */}
      <div className={`p-5 rounded-2xl bg-white border transition shadow-sm ${
        isComp
          ? 'border-rose-300 bg-rose-50/25'
          : isCannotVerify
          ? 'border-purple-300 bg-purple-50/25'
          : 'border-[#cde5e3]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-[#113644] font-mono flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-[#0d9488]" />
                {story.asset.host_name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                story.asset.exposure_tier === 'emergency'
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {story.asset.exposure_tier} Exposure Tier
              </span>
              <span className="text-xs font-mono text-[#527977]">
                IP: <strong className="text-[#113644] font-bold">{story.asset.ip_address}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#527977] flex-wrap">
              <span>Product: <strong className="text-[#0d9488] font-bold">{story.asset.product} {story.asset.version}</strong></span>
              <span>•</span>
              <span>Tenant: <strong className="text-[#113644] capitalize font-bold">{story.asset.tenant_id.replace('-', ' ')}</strong></span>
              <span>•</span>
              <span>Criticality: <strong className="text-amber-800 font-bold uppercase">{story.asset.criticality}</strong></span>
              <span>•</span>
              <span>Owner: {story.asset.owner}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Verdict Badge */}
            <div className="p-3 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] text-right font-mono min-w-[200px]">
              <div className="text-[10px] text-[#527977] uppercase tracking-wider font-bold">Compromise Verdict</div>
              <div className="flex items-center justify-end gap-2 mt-1">
                {isComp ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                ) : isCannotVerify ? (
                  <ShieldX className="w-5 h-5 text-purple-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className={`text-base font-black ${
                  isComp ? 'text-rose-700' : isCannotVerify ? 'text-purple-700' : 'text-emerald-700'
                }`}>
                  {story.verdict.state}
                </span>
              </div>
              <div className="text-[10px] text-[#527977] mt-0.5">
                Confidence: <strong className="text-[#113644] uppercase font-bold">{story.verdict.confidence}</strong>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="p-3 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] text-right font-mono min-w-[170px]">
              <div className="text-[10px] text-[#527977] uppercase tracking-wider font-bold flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0d9488]" /> {story.clock.profile}
              </div>
              <div className={`text-lg font-black mt-1 ${
                story.clock.is_breached ? 'text-rose-600' : 'text-amber-700'
              }`}>
                {formatSeconds(story.clock.seconds_remaining)}
              </div>
              <div className="text-[10px] text-[#527977] mt-0.5">
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
          <div className="bg-white p-1 rounded-xl flex items-center gap-1 border border-[#cde5e3] text-xs font-mono shadow-sm">
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
                      ? 'bg-[#0d9488] text-white font-bold shadow-sm'
                      : 'text-[#527977] hover:text-[#113644] hover:bg-[#f2f7f7]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#527977]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#eaf4f3] text-[#0d9488]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: BESPOKE VISUAL TIMELINE LANES */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-5 rounded-2xl border border-[#cde5e3] space-y-5 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-3">
                <div className="flex items-center gap-2 font-bold text-[#113644]">
                  <Activity className="w-4 h-4 text-[#0d9488]" />
                  <span>Multi-Lane Telemetry & Attack Timeline (45-Day Scope)</span>
                </div>
                <div className="text-[11px] text-[#527977] flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#0d9488]" />
                    <span>Advisory Disclosed: <strong className="text-[#113644]">2026-10-09</strong></span>
                  </span>
                  <span className="text-[#cde5e3]">|</span>
                  <span className="text-amber-700">First In-The-Wild Hit: <strong className="text-amber-800">2026-10-04</strong></span>
                </div>
              </div>

              {/* Time Ruler Bar */}
              <div className="relative pt-2">
                <div className="flex justify-between text-[10px] text-[#527977] font-mono uppercase pb-1 px-1">
                  <span>-45d (Aug 25)</span>
                  <span>-30d</span>
                  <span className="text-rose-700 font-bold">-14d [FIRST HIT]</span>
                  <span className="text-[#0d9488] font-bold">-9d [DISCLOSED]</span>
                  <span>-7d</span>
                  <span className="text-[#113644] font-bold">NOW (Triage)</span>
                </div>
                <div className="h-1.5 bg-[#eaf4f3] rounded-full border border-[#cde5e3] relative">
                  <div className="absolute left-[68.8%] top-[-2px] bottom-[-2px] w-1 bg-rose-500 rounded-full" title="First Exploit Hit (-14d)" />
                  <div className="absolute left-[80%] top-[-4px] bottom-[-4px] w-1 bg-[#0d9488] rounded-full" title="Public Advisory Disclosed (-9d)" />
                </div>
              </div>

              {/* Timeline Lanes Container */}
              <div className="space-y-4 pt-1">
                {/* Lane 1: Flaw Exposure Window */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#527977] uppercase font-bold tracking-wider">
                    <span>LANE 1: VULNERABILITY EXPOSURE SPAN</span>
                    <span className="text-[#8da8a6]">Firmware: EdgeGate VPN 9.1.4</span>
                  </div>
                  <div className="relative h-7 bg-[#f8fbfb] rounded-xl border border-[#cde5e3] overflow-hidden flex items-center px-3">
                    <div className="absolute inset-y-0 left-0 w-[80%] bg-gradient-to-r from-rose-100/70 via-amber-100/70 to-transparent flex items-center px-3 text-[10px] text-[#113644] font-semibold">
                      Unpatched Vulnerable Window (45 Days Telemetry History)
                    </div>
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#0d9488] z-10" />
                  </div>
                </div>

                {/* Lane 2: Matched Forensic Markers */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-[#527977] uppercase font-bold tracking-wider">
                    <span>LANE 2: NUMBERED ATTACK PROGRESSION MARKERS</span>
                    <span className="text-rose-700 font-bold">{story.evidence.length} Correlated Artifacts</span>
                  </div>
                  <div className="relative h-14 bg-[#f8fbfb] rounded-xl border border-[#cde5e3] flex items-center px-4">
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#0d9488] z-10" />

                    {story.evidence.length === 0 ? (
                      <div className="text-[#527977] text-[11px] italic flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
                                  ? 'bg-[#0d9488] text-white shadow-md scale-105'
                                  : 'bg-rose-50 text-rose-800 border border-rose-300 hover:border-rose-400 hover:bg-rose-100'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-[#143e4c] text-white flex items-center justify-center text-[10px] font-black">
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
                  <div className="flex justify-between text-[10px] text-[#527977] uppercase font-bold tracking-wider">
                    <span>LANE 3: TELEMETRY RETENTION PER LOG SOURCE</span>
                    <span className="text-emerald-700 font-bold">Policy: &gt;= 85% Provability</span>
                  </div>

                  <div className="space-y-1.5">
                    {story.coverage.sources.map((src) => {
                      const pct = Math.round(src.coverage_ratio * 100)
                      const isAdequate = src.coverage_ratio >= 0.85
                      return (
                        <div key={src.source_type} className="flex items-center gap-3">
                          <span className="w-20 font-bold uppercase text-[10px] text-[#527977] text-right font-mono">
                            {src.source_type}:
                          </span>
                          <div className="flex-1 h-3.5 bg-[#eaf4f3] rounded-lg border border-[#cde5e3] overflow-hidden relative">
                            <div
                              className={`h-full rounded-lg transition-all ${
                                isAdequate ? 'bg-[#0d9488]' : 'bg-purple-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            {!isAdequate && (
                              <div
                                className="absolute inset-y-0 right-0 bg-red-100 border-l border-red-400 flex items-center justify-center text-[8px] text-red-800 px-1 font-mono font-bold"
                                style={{ width: `${100 - pct}%` }}
                              >
                                RETENTION GAP
                              </div>
                            )}
                          </div>
                          <span className={`w-16 text-right text-[10px] font-mono font-bold ${
                            isAdequate ? 'text-[#113644]' : 'text-purple-700'
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
                <div className="mt-4 p-4 rounded-xl bg-[#f8fbfb] border border-[#bfe0dc] space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-[#e5f0ef] pb-2">
                    <span className="font-bold text-[#0d9488] flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#0d9488]" />
                      EVENT INSPECTOR: [{selectedEvidence.event_id}]
                    </span>
                    <span className="text-[#527977] font-mono text-[11px]">{selectedEvidence.timestamp} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div>Source: <strong className="text-[#113644] uppercase font-bold">{selectedEvidence.source_type}</strong></div>
                    <div>Action: <strong className="text-[#113644] font-bold">{selectedEvidence.event_action}</strong></div>
                    <div>Signal Class: <strong className="text-rose-700 uppercase font-bold">{selectedEvidence.signal_class}</strong></div>
                    <div>Confidence: <strong className="text-amber-800 uppercase font-bold">{selectedEvidence.confidence}</strong></div>
                  </div>

                  {selectedEvidence.details.process_cmdline && (
                    <div className="p-2.5 rounded-lg bg-white border border-[#cde5e3] text-[11px] text-[#0d9488] flex items-center justify-between gap-2 shadow-sm">
                      <code className="select-all truncate font-semibold">{selectedEvidence.details.process_cmdline}</code>
                      <button
                        onClick={() => copyCode(selectedEvidence.details.process_cmdline)}
                        className="px-2 py-0.5 rounded bg-[#f2f7f7] hover:bg-[#eaf4f3] text-[#113644] text-[10px] font-bold border border-[#cde5e3]"
                      >
                        {copiedCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {selectedEvidence.details.url_path && (
                    <div className="p-2.5 rounded-lg bg-white border border-[#cde5e3] text-[11px] text-rose-700 flex items-center justify-between gap-2 shadow-sm">
                      <code className="select-all truncate font-semibold">{selectedEvidence.details.http_method} {selectedEvidence.details.url_path}</code>
                      <button
                        onClick={() => copyCode(`${selectedEvidence.details.http_method} ${selectedEvidence.details.url_path}`)}
                        className="px-2 py-0.5 rounded bg-[#f2f7f7] hover:bg-[#eaf4f3] text-[#113644] text-[10px] font-bold border border-[#cde5e3]"
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
            <div className="bg-white p-5 rounded-2xl border border-[#cde5e3] space-y-3 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-3">
                <span className="font-bold text-[#113644] flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0d9488]" />
                  Forensic Telemetry Ledger ({story.evidence.length} Records)
                </span>
                <span className="text-[11px] text-[#527977]">Read-Only DuckDB Stream</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fbfb] text-[#527977] text-[10px] uppercase border-b border-[#e5f0ef]">
                    <tr>
                      <th className="p-2.5">EVENT ID</th>
                      <th className="p-2.5">TIMESTAMP</th>
                      <th className="p-2.5">SOURCE</th>
                      <th className="p-2.5">SIGNAL CLASS</th>
                      <th className="p-2.5">TELEMETRY DETAIL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5f0ef] text-[11px]">
                    {story.evidence.map((ev) => (
                      <tr key={ev.event_id} className="hover:bg-[#f2f7f7] transition">
                        <td className="p-2.5 font-bold text-[#0d9488]">{ev.event_id}</td>
                        <td className="p-2.5 text-[#113644]">{ev.timestamp}</td>
                        <td className="p-2.5 uppercase text-[#527977] font-semibold">{ev.source_type}</td>
                        <td className="p-2.5 font-bold text-rose-700">{ev.signal_class}</td>
                        <td className="p-2.5 text-[#113644] select-all max-w-sm truncate">
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
            <div className="bg-white p-5 rounded-2xl border border-[#cde5e3] space-y-4 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-3">
                <div>
                  <h3 className="font-bold text-[#113644] flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[#0d9488]" /> Containment & Remediation Playbook
                  </h3>
                  <p className="text-[11px] text-[#527977] mt-0.5 font-sans">
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
                        isDone ? 'bg-emerald-50/70 border-emerald-300' : 'bg-[#f8fbfb] border border-[#cde5e3]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-[#113644]">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            step.phase === 'containment' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-[#eaf4f3] text-[#0d9488] border border-[#bfe0dc]'
                          }`}>
                            {step.phase}
                          </span>
                          <span className="text-xs">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            isDone ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {step.status}
                          </span>
                          {!isDone && (
                            <button
                              onClick={() => handleStepVerify(step.step_id)}
                              className="px-2.5 py-1 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white text-[10px] font-bold font-mono transition shadow-sm"
                            >
                              Verify Step
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[#406866] text-xs font-sans leading-relaxed">{step.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-[#e5f0ef] text-[10px] text-[#527977] flex items-center justify-between">
                        <span>Owner: <strong className="text-[#113644] font-semibold">{step.owner}</strong></span>
                        <span>Verification: <strong className="text-[#113644] font-semibold">{step.verification_method}</strong></span>
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
          <div className="bg-white p-4 rounded-2xl border border-[#cde5e3] space-y-3 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-2">
              <h3 className="font-bold text-[#113644] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
                <span>Forensic Reasoning (Citations)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold">100% CITED</span>
            </div>

            <div className="space-y-2.5 font-sans">
              {story.verdict.reasons.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] text-[#113644] leading-relaxed text-xs">
                  <p>{r.text}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-[10px] text-[#527977]">Evidence Citations:</span>
                    {r.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="px-1.5 py-0.5 rounded bg-[#eaf4f3] text-[#0d9488] border border-[#bfe0dc] text-[10px] font-bold cursor-pointer hover:bg-[#d5f0ed] transition"
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
          <div className="bg-white p-4 rounded-2xl border border-[#cde5e3] space-y-2.5 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-2">
              <h3 className="font-bold text-[#113644] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Coverage Honesty (Blind Spots)</span>
              </h3>
              <span className="text-[10px] font-bold text-purple-700">
                {Math.round(story.coverage.overall_coverage * 100)}% Retained
              </span>
            </div>

            {story.coverage.blind_spots.length === 0 ? (
              <p className="text-[#527977] text-xs font-sans leading-relaxed">
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
          <div className="bg-white p-4 rounded-2xl border border-[#cde5e3] space-y-3 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-2">
              <h3 className="font-bold text-[#0d9488] flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Forensic Evidence Assistant
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#eaf4f3] text-[#0d9488] border border-[#bfe0dc] font-bold">
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
                  className="px-2 py-1 rounded-md bg-[#f8fbfb] hover:bg-[#eaf4f3] text-[#113644] text-[10px] font-semibold border border-[#cde5e3] transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat History Drawer */}
            <div className="h-48 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] text-xs font-sans">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-[#eaf4f3] text-[#113644] border border-[#bfe0dc] ml-4'
                      : 'bg-white text-[#113644] mr-4 border border-[#cde5e3] shadow-sm'
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-[#527977] mb-0.5 font-mono">
                    {msg.sender === 'user' ? 'Analyst' : 'PatchGate Trust Service'}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap font-mono">
                      <span className="text-[9px] text-[#527977]">Citations:</span>
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[9px] px-1 rounded bg-[#eaf4f3] text-[#0d9488] border border-[#bfe0dc] font-bold">
                          [{c}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAsking && <div className="text-[#527977] italic text-[11px] font-mono">Querying evidence ledger...</div>}
            </div>

            {/* Query Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask grounded question..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-white border border-[#cde5e3] rounded-xl px-3 py-1.5 text-xs text-[#113644] placeholder-[#8da8a6] focus:outline-none focus:border-[#0d9488] font-mono"
              />
              <button
                onClick={() => handleAsk()}
                className="p-2 rounded-xl bg-[#0d9488] hover:bg-[#0f766e] text-white transition active:scale-95 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gated Execution Pipeline */}
      <div className="bg-white p-5 rounded-2xl border border-[#cde5e3] space-y-4 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-2">
          <h3 className="font-bold text-[#113644] uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0d9488]" />
            <span>Recommended Decision Sequence & Patch Gate Pipeline</span>
          </h3>
          <span className="text-[10px] text-[#527977]">Step 3 strictly enforced by Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Containment */}
          <div className="p-4 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#113644]">
              <span>1. Host Isolation</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isComp ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-[#eaf4f3] text-[#527977]'
              }`}>
                {isComp ? 'Mandatory' : 'Bypassed'}
              </span>
            </div>
            <p className="text-[11px] text-[#527977] font-sans leading-relaxed">
              Quarantine host to isolated VLAN prior to patching to prevent active lateral movement.
            </p>
          </div>

          {/* Step 2: Evidence Snapshot */}
          <div className="p-4 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[#113644]">
              <span>2. Memory Snapshot</span>
              <span className="text-[10px] text-[#527977] uppercase font-bold">Volatile</span>
            </div>
            <p className="text-[11px] text-[#527977] font-sans leading-relaxed">
              Preserve live RAM dump and socket states before host reboot or firmware overwrite.
            </p>
          </div>

          {/* Step 3: Patch Gate */}
          <div className={`p-4 rounded-xl border space-y-2 transition ${
            story.gate.gate_locked ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {story.gate.gate_locked ? <Lock className="w-4 h-4 text-rose-600" /> : <Unlock className="w-4 h-4 text-emerald-600" />}
                3. Patch Gate
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                story.gate.gate_locked ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {story.gate.gate_locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="text-[11px] text-[#204443] font-sans">
              Outcome: <strong className="text-[#113644] font-bold">{story.gate.outcome}</strong>
            </p>
            {story.gate.gate_locked && (
              <button
                onClick={() => setShowOverrideModal(true)}
                className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-sm transition"
              >
                Apply Gate Override
              </button>
            )}
          </div>

          {/* Step 4: Post-Patch Re-Check */}
          <div className="p-4 rounded-xl bg-[#f8fbfb] border border-[#cde5e3] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#113644]">
              <span>4. Closure Verification</span>
              <span className="text-[#0d9488] text-[10px] font-bold uppercase">Re-Check Engine</span>
            </div>
            <p className="text-[11px] text-[#527977] font-sans leading-relaxed">
              Forensic recheck verifying web shell removal, session flush, and 0 outbound C2 traffic.
            </p>
            <button
              onClick={handleRunRecheck}
              disabled={recheckRunning}
              className="w-full py-1.5 rounded-lg bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-[11px] transition active:scale-95 shadow-sm"
            >
              {recheckRunning ? 'Re-Checking Host...' : 'Run Post-Patch Re-Check'}
            </button>
          </div>
        </div>

        {recheckMessage && (
          <div className="p-3.5 rounded-xl bg-[#f8fbfb] border border-[#bfe0dc] text-[#0d9488] font-mono text-xs flex items-center justify-between">
            <span className="font-semibold">{recheckMessage}</span>
            <span className="text-[10px] text-[#527977] font-bold uppercase">Closure Audit Complete</span>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2833]/60 backdrop-blur-md p-4">
          <div className="bg-white p-6 max-w-md w-full space-y-4 font-mono text-xs rounded-2xl border border-rose-300 shadow-2xl">
            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600" /> Administrative Patch Gate Override
            </h3>
            <p className="text-[#406866] font-sans text-xs leading-relaxed">
              Unlocks the patch gate over a suspected or confirmed compromise. Requires business continuity justification and records an immutable audit entry in the chain of custody.
            </p>
            <div>
              <label className="text-[#527977] font-semibold">Approver ID / Role:</label>
              <input
                type="text"
                value={overrideApprover}
                onChange={(e) => setOverrideApprover(e.target.value)}
                className="w-full mt-1 bg-[#f8fbfb] border border-[#cde5e3] rounded-lg p-2 text-[#113644] font-mono text-xs focus:outline-none focus:border-[#0d9488]"
              />
            </div>
            <div>
              <label className="text-[#527977] font-semibold">Recorded Operational Justification:</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-[#f8fbfb] border border-[#cde5e3] rounded-lg p-2 text-[#113644] font-sans text-xs focus:outline-none focus:border-[#0d9488]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5f0ef]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#f2f7f7] text-[#527977] hover:bg-[#eaf4f3] border border-[#cde5e3]"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
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
