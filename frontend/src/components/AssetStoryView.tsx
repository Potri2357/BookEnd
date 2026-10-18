import React, { useState, useEffect } from 'react'
import {
  ShieldAlert, ShieldCheck, AlertTriangle, ShieldX,
  Clock, Lock, Unlock, ArrowLeft, Terminal, FileCode,
  Network, Cpu, CheckCircle2, MessageSquare, Send,
  FileCheck, Shield, ExternalLink, HelpCircle, Activity,
  ChevronDown, ChevronUp, Layers, Check
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
      text: `Patch Assurance Evidence Assistant active for ${story.asset.host_name}. All responses are derived strictly from case telemetry with citations.`,
      citations: []
    }
  ])
  const [isAsking, setIsAsking] = useState(false)

  const isComp = story.verdict.state === 'Likely compromised'
  const isCannotVerify = story.verdict.state === 'Cannot verify'
  const isNoEvidence = story.verdict.state === 'No evidence found'

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return '00h 00m 00s (BREACHED)'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
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

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decision Queue
        </button>

        <div className="flex items-center gap-2">
          {isComp && (
            <button
              onClick={handleOpenIncident}
              disabled={isOpeningIncident}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold shadow-md transition"
            >
              <FileCheck className="w-4 h-4" />
              {isOpeningIncident ? 'Drafting...' : 'CERT-In Incident Hand-Off (F17)'}
            </button>
          )}

          <button
            onClick={handleOpenProofPack}
            disabled={isOpeningPack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-semibold transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {isOpeningPack ? 'Loading...' : 'Cryptographic Proof Pack (F16)'}
          </button>
        </div>
      </div>

      {/* Top HUD Asset Story Banner (PRD Section 8.3) */}
      <div className={`p-5 rounded-2xl border glass-panel transition ${
        isComp
          ? 'border-rose-500/50 bg-rose-950/15 glow-rose'
          : isCannotVerify
          ? 'border-purple-500/50 bg-purple-950/15'
          : 'border-slate-800'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-white font-mono">
                {story.asset.host_name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider ${
                story.asset.exposure_tier === 'emergency'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {story.asset.exposure_tier} Exposure Tier
              </span>
              <span className="text-xs font-mono text-slate-400">
                IP: <strong className="text-slate-200">{story.asset.ip_address}</strong>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Product: <strong className="text-cyan-300">{story.asset.product} {story.asset.version}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Tenant: <strong className="text-slate-300 capitalize">{story.asset.tenant_id.replace('-', ' ')}</strong> · Owner: {story.asset.owner} · Timezone: {story.asset.timezone}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            {/* Verdict Badge */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Forensic Verdict</div>
              <div className="flex items-center gap-2 mt-0.5">
                {isComp ? (
                  <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                ) : isCannotVerify ? (
                  <ShieldX className="w-5 h-5 text-purple-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <span className={`text-base font-bold ${
                  isComp ? 'text-rose-300' : isCannotVerify ? 'text-purple-300' : 'text-emerald-300'
                }`}>
                  {story.verdict.state}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                  {story.verdict.confidence} Conf.
                </span>
              </div>
            </div>

            {/* Deadline Clock */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> {story.clock.profile}
              </div>
              <div className={`text-base font-bold mt-0.5 ${
                story.clock.is_breached ? 'text-red-400' : 'text-amber-300'
              }`}>
                {formatSeconds(story.clock.seconds_remaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline/Tabs (8 cols) & Right Reasoning/Assistant (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Tabs bar */}
          <div className="glass-panel p-1 rounded-xl flex items-center gap-1 border border-slate-800 text-xs font-mono">
            {[
              { id: 'timeline', label: 'Timeline View', icon: Activity },
              { id: 'process_tree', label: 'Process Tree', icon: Cpu },
              { id: 'evidence', label: `Raw Evidence (${story.evidence.length})`, icon: Terminal },
              { id: 'playbook', label: 'Residue Playbook (F9)', icon: Shield },
              { id: 'blast_radius', label: 'Blast Radius (V2)', icon: Network }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700/80'
                      : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* TAB 1: BESPOKE VISUAL TIMELINE LANES (PRD Section 8.3) */}
          {activeTab === 'timeline' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  45-Day Forensic Exposure & Telemetry Lanes
                </span>
                <span className="text-[11px] text-slate-400">
                  Advisory Disclosed: <strong>2026-10-09</strong> (Dashed Line)
                </span>
              </div>

              {/* Visual Timeline Lanes Container */}
              <div className="space-y-4 pt-2">
                {/* Lane 1: Flaw Exposure Window */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>LANE 1: FLAW EXPOSURE WINDOW</span>
                    <span>Lookback: 45 Days Prior</span>
                  </div>
                  <div className="relative h-6 bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex items-center">
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-red-500/20 via-amber-500/20 to-slate-800 flex items-center px-3 text-[10px] text-slate-300">
                      Vulnerable Firmware Active in Production Network (45 Days)
                    </div>
                    {/* Advisory Marker Line */}
                    <div className="absolute left-[70%] inset-y-0 w-0.5 bg-cyan-400 border-l border-dashed border-cyan-400 z-10" />
                  </div>
                </div>

                {/* Lane 2: Evidence Markers (Numbered in time order) */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>LANE 2: MATCHED EVIDENCE MARKERS</span>
                    <span className="text-rose-400">{story.evidence.length} Forensic Markers Plotted</span>
                  </div>
                  <div className="relative h-12 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center px-4">
                    {/* Advisory line */}
                    <div className="absolute left-[70%] inset-y-0 w-0.5 border-l-2 border-dashed border-cyan-400 z-10" />
                    
                    {story.evidence.length === 0 ? (
                      <span className="text-slate-500 text-[11px] italic">0 indicators or exploit patterns found in telemetry</span>
                    ) : (
                      <div className="w-full flex items-center justify-between relative">
                        {story.evidence.map((ev, idx) => {
                          const isSelected = selectedEvidence?.event_id === ev.event_id
                          return (
                            <button
                              key={ev.event_id}
                              onClick={() => setSelectedEvidence(ev)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                                isSelected
                                  ? 'bg-rose-500 text-white scale-110 shadow-lg glow-rose'
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/50 hover:bg-rose-900/60'
                              }`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full bg-rose-400 text-slate-950 flex items-center justify-center text-[9px] font-black">
                                {idx + 1}
                              </span>
                              {ev.signal_class.replace('_', ' ').toUpperCase()}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lane 3: Per-Source Log Coverage Lanes */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>LANE 3: TELEMETRY RETENTION PER LOG SOURCE</span>
                    <span>Adequacy Policy: &gt;= 85%</span>
                  </div>

                  <div className="space-y-2">
                    {story.coverage.sources.map((src) => {
                      const pct = Math.round(src.coverage_ratio * 100)
                      const isAdequate = src.coverage_ratio >= 0.85
                      return (
                        <div key={src.source_type} className="flex items-center gap-3">
                          <span className="w-20 font-bold uppercase text-[11px] text-slate-300 text-right">
                            {src.source_type}:
                          </span>
                          <div className="flex-1 h-4 bg-slate-900 rounded-md border border-slate-800 overflow-hidden relative">
                            <div
                              className={`h-full rounded-md transition-all ${
                                isAdequate ? 'bg-emerald-500/80' : 'bg-purple-500/80'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            {/* Retention gap indicator */}
                            {!isAdequate && (
                              <div
                                className="absolute inset-y-0 right-0 bg-red-500/30 border-l border-red-500 flex items-center justify-center text-[9px] text-red-200 px-2"
                                style={{ width: `${100 - pct}%` }}
                              >
                                RETENTION BLIND SPOT
                              </div>
                            )}
                          </div>
                          <span className={`w-14 text-right text-[11px] ${
                            isAdequate ? 'text-emerald-400' : 'text-purple-400 font-bold'
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
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-cyan-300 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      EVIDENCE INSPECTOR: [{selectedEvidence.event_id}]
                    </span>
                    <span className="text-slate-400 font-mono">Timestamp: {selectedEvidence.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    <div>Source: <strong className="text-slate-200">{selectedEvidence.source_type}</strong></div>
                    <div>Action: <strong className="text-slate-200">{selectedEvidence.event_action}</strong></div>
                    <div>Class: <strong className="text-rose-300">{selectedEvidence.signal_class}</strong></div>
                    <div>Confidence: <strong className="text-amber-300">{selectedEvidence.confidence}</strong></div>
                  </div>
                  {selectedEvidence.details.process_cmdline && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-200 select-all">
                      <code>{selectedEvidence.details.process_cmdline}</code>
                    </div>
                  )}
                  {selectedEvidence.details.url_path && (
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-rose-200 select-all">
                      <code>{selectedEvidence.details.http_method} {selectedEvidence.details.url_path}</code>
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
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <h3 className="font-bold text-slate-200">Forensic Telemetry Records ({story.evidence.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2">EVENT ID</th>
                      <th className="p-2">TIMESTAMP</th>
                      <th className="p-2">SOURCE</th>
                      <th className="p-2">SIGNAL CLASS</th>
                      <th className="p-2">ACTION / COMMAND</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-[11px]">
                    {story.evidence.map((ev) => (
                      <tr key={ev.event_id} className="hover:bg-slate-800/40">
                        <td className="p-2 font-bold text-cyan-300">{ev.event_id}</td>
                        <td className="p-2 text-slate-300">{ev.timestamp}</td>
                        <td className="p-2 uppercase text-slate-400">{ev.source_type}</td>
                        <td className="p-2 font-semibold text-rose-400">{ev.signal_class}</td>
                        <td className="p-2 text-slate-300 select-all max-w-xs truncate">
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
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> Containment & Residue Playbook (F9)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Covers necessary isolation and hygiene actions that software patching alone does not resolve.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {story.playbook.steps.map((step) => {
                  const isDone = step.status === 'verified'
                  return (
                    <div
                      key={step.step_id}
                      className={`p-3.5 rounded-xl border transition ${
                        isDone ? 'bg-emerald-950/15 border-emerald-500/40' : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 font-bold text-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            step.phase === 'containment' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {step.phase}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {step.status}
                          </span>
                          {!isDone && (
                            <button
                              onClick={() => handleStepVerify(step.step_id)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500 text-emerald-300 border border-slate-700 text-[10px] font-bold"
                            >
                              Verify Step
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{step.description}</p>
                      <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                        <span>Owner: <strong className="text-slate-400">{step.owner}</strong></span>
                        <span>Verification Method: <strong className="text-slate-300">{step.verification_method}</strong></span>
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

        {/* Right Column: Reasoning & Ask-The-Evidence Assistant (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Why This Verdict (Citations Required) */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              Why This Verdict (Cited Narrative)
            </h3>

            <div className="space-y-2.5">
              {story.verdict.reasons.map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-slate-300 leading-relaxed text-[11px]">
                  <p>{r.text}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-500">Citations:</span>
                    {r.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold cursor-pointer hover:bg-cyan-900"
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
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              What I Cannot See (Blind Spots)
            </h3>

            {story.coverage.blind_spots.length === 0 ? (
              <p className="text-slate-400 text-[11px]">
                0 blind spots detected. Full 45-day telemetry available across web, endpoint, auth, network, and file systems.
              </p>
            ) : (
              <div className="space-y-1.5">
                {story.coverage.blind_spots.map((bs, i) => (
                  <div key={i} className="p-2 rounded bg-purple-950/20 border border-purple-500/30 text-purple-200 text-[11px]">
                    {bs}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ask-The-Evidence Assistant (F14) */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-cyan-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Ask-The-Evidence Assistant
              </h3>
              <span className="text-[10px] text-slate-500">Evidence Scoped</span>
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Why is this likely compromised?',
                'What would change the verdict?',
                "What can't you see?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="h-44 overflow-y-auto space-y-2 p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-cyan-950/40 text-cyan-200 border border-cyan-800 ml-4'
                      : 'bg-slate-900 text-slate-300 mr-4'
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-slate-400 mb-0.5">
                    {msg.sender === 'user' ? 'Analyst' : 'PatchGate Assistant'}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      <span className="text-[9px] text-slate-500">Citations:</span>
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[9px] px-1 rounded bg-slate-800 text-cyan-400 font-mono">
                          [{c}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAsking && <div className="text-slate-500 italic">Querying evidence ledger...</div>}
            </div>

            {/* Query Input */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Ask evidence question..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAsk()}
                className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Recommended Order with Locked Steps (PRD Section 8.3 & F8/F10) */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
        <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Recommended Action Pipeline & Patch Gate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Containment */}
          <div className="p-3.5 rounded-xl border bg-slate-950 border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>1. Host Isolation</span>
              <span className={isComp ? 'text-rose-400' : 'text-slate-500'}>
                {isComp ? 'MANDATORY' : 'OPTIONAL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Quarantine host to isolation VLAN prior to patching to prevent active lateral pivot.
            </p>
          </div>

          {/* Step 2: Forensic Memory Snapshot */}
          <div className="p-3.5 rounded-xl border bg-slate-950 border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>2. Preserve Evidence</span>
              <span className="text-slate-400">VOLATILE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Snapshot volatile RAM and process descriptors before host reboot or firmware overwrite.
            </p>
          </div>

          {/* Step 3: Patch Gate */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            story.gate.gate_locked ? 'bg-rose-950/20 border-rose-500/50' : 'bg-emerald-950/20 border-emerald-500/50'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {story.gate.gate_locked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
                3. Patch Gate
              </span>
              <span className={story.gate.gate_locked ? 'text-rose-300' : 'text-emerald-300'}>
                {story.gate.gate_locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Outcome: <strong className="text-slate-200">{story.gate.outcome}</strong>
            </p>
            {story.gate.gate_locked && (
              <button
                onClick={() => setShowOverrideModal(true)}
                className="w-full py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 text-[11px] font-bold"
              >
                Apply Gate Override
              </button>
            )}
          </div>

          {/* Step 4: Post-Patch Re-Check (F10) */}
          <div className="p-3.5 rounded-xl border bg-slate-950 border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-200">
              <span>4. Closure Verification</span>
              <span className="text-cyan-400 font-bold">F10 ENGINE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Re-runs residue checks (sessions, web shells, C2 beaconing) to verify closure.
            </p>
            <button
              onClick={handleRunRecheck}
              disabled={recheckRunning}
              className="w-full py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition"
            >
              {recheckRunning ? 'Re-Checking...' : 'Run Post-Patch Re-Check'}
            </button>
          </div>
        </div>

        {recheckMessage && (
          <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-200 font-mono text-xs">
            {recheckMessage}
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Administrative Patch Gate Override
            </h3>
            <p className="text-slate-300 leading-relaxed font-sans">
              Override unlocks the patch gate for an active compromised host. Requires justification recorded in the immutable audit ledger.
            </p>
            <div>
              <label className="text-slate-400">Approver ID / Email:</label>
              <input
                type="text"
                value={overrideApprover}
                onChange={(e) => setOverrideApprover(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400">Operational Justification:</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded p-2 text-white font-sans text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleOverride}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Confirm & Log Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Pack Modal */}
      {proofPack && (
        <ProofPackModal pack={proofPack} onClose={() => setProofPack(null)} />
      )}

      {/* Incident Hand-Off Modal */}
      {incidentDraft && (
        <IncidentHandOffModal
          incidentDraft={incidentDraft}
          onClose={() => setIncidentDraft(null)}
        />
      )}
    </div>
  )
}
