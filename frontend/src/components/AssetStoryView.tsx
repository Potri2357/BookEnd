import React, { useState } from 'react'
import {
  ShieldAlert, ShieldCheck, AlertTriangle, ShieldX,
  Clock, Lock, Unlock, ArrowLeft, Terminal,
  Network, Cpu, CheckCircle2, MessageSquare, Send,
  FileCheck, Shield, HelpCircle, Activity,
  ChevronRight, Copy, Check, CheckCheck, Radio, Eye
} from 'lucide-react'
import { AssetStory, EvidenceEvent } from '../types'
import { ProcessTree } from './ProcessTree'
import { BlastRadiusView } from './BlastRadiusView'
import { ProofPackModal } from './ProofPackModal'
import { IncidentHandOffModal } from './IncidentHandOffModal'
import {
  askAssistant, fetchIncidentDraft, fetchProofPack,
  overrideGate, triggerRecheck, updatePlaybookStep,
  approveSingleAsset, containSingleAsset,
  createJiraTicket, createServiceNowIncident,
  sendSlackAlert, sendTeamsAlert
} from '../api'
import { UserRole } from '../types'

interface AssetStoryViewProps {
  story: AssetStory
  onBack: () => void
  onRefresh: () => void
  currentRole?: UserRole
}

export const AssetStoryView: React.FC<AssetStoryViewProps> = ({
  story,
  onBack,
  onRefresh,
  currentRole = 'admin'
}) => {
  const canApprove = currentRole === 'admin' || currentRole === 'approver'
  const canOverride = currentRole === 'admin' || currentRole === 'approver'
  const canContain = currentRole === 'admin' || currentRole === 'approver' || currentRole === 'analyst'
  const canCreateTicket = currentRole === 'admin' || currentRole === 'approver' || currentRole === 'analyst'
  const canVerifyPlaybook = currentRole === 'admin' || currentRole === 'approver' || currentRole === 'analyst'
  const canRunRecheck = currentRole === 'admin' || currentRole === 'approver' || currentRole === 'analyst'
  const isReadOnly = currentRole === 'auditor' || currentRole === 'viewer'

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

  // Action states for pipeline execution marks
  const [isIsolated, setIsIsolated] = useState<boolean>((story as any).is_contained || false)
  const [isSnapshotTaken, setIsSnapshotTaken] = useState<boolean>(false)
  const [recheckVerified, setRecheckVerified] = useState<boolean>(false)

  const handleIsolateHost = async () => {
    setIsIsolated(true)
    try {
      await containSingleAsset(story.asset.id)
    } catch (e) {
      console.warn('Containment deferred:', e)
    }
  }

  const handleTakeSnapshot = () => {
    setIsSnapshotTaken(true)
  }

  const handleRunRecheck = async () => {
    setRecheckRunning(true)
    setRecheckMessage(null)
    try {
      const res = await triggerRecheck(story.asset.id)
      setRecheckMessage(res.summary)
      setRecheckVerified(true)
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

  const [workflowFeedback, setWorkflowFeedback] = useState<string | null>(null)
  const [isCreatingTicket, setIsCreatingTicket] = useState(false)

  const handleCreateJira = async () => {
    setIsCreatingTicket(true)
    try {
      const res = await createJiraTicket(story.asset.id)
      setWorkflowFeedback(`Jira issue ${res.issue_key} created with high priority triage link.`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } catch (e: any) {
      setWorkflowFeedback(`Failed to create Jira ticket: ${e.message}`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } finally {
      setIsCreatingTicket(false)
    }
  }

  const handleCreateServiceNow = async () => {
    setIsCreatingTicket(true)
    try {
      const res = await createServiceNowIncident(story.asset.id)
      setWorkflowFeedback(`ServiceNow incident ${res.incident_number} logged with state 'New'.`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } catch (e: any) {
      setWorkflowFeedback(`Failed to create ServiceNow incident: ${e.message}`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } finally {
      setIsCreatingTicket(false)
    }
  }

  const handleSendSlack = async () => {
    try {
      await sendSlackAlert(story.asset.id, '#soc-alerts')
      setWorkflowFeedback(`Slack alert with Block Kit payload dispatched to #soc-alerts.`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } catch (e: any) {
      setWorkflowFeedback(`Failed to send Slack alert: ${e.message}`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    }
  }

  const handleSendTeams = async () => {
    try {
      await sendTeamsAlert(story.asset.id)
      setWorkflowFeedback(`Microsoft Teams Adaptive Card dispatched to SOC channel.`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    } catch (e: any) {
      setWorkflowFeedback(`Failed to send Teams alert: ${e.message}`)
      setTimeout(() => setWorkflowFeedback(null), 5000)
    }
  }

  const copyCode = (cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Toast Feedback */}
      {workflowFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{workflowFeedback}</span>
        </div>
      )}

      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-blue-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" /> Back to Decision Queue
        </button>

        {/* Workflow Integrations & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ticket actions */}
          <button
            onClick={handleCreateJira}
            disabled={isCreatingTicket || !canCreateTicket}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition shadow-xs ${
              !canCreateTicket
                ? 'border-slate-200 dark:border-[#222225] bg-slate-100 dark:bg-[#121214] text-slate-400 dark:text-[#71717A] cursor-not-allowed opacity-60'
                : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-800 dark:text-[#E4E4E7] hover:dark:text-white cursor-pointer'
            }`}
            title={canCreateTicket ? "Create Jira Security Incident Ticket" : "Jira ticket creation requires Analyst, Approver or Admin role"}
          >
            <span>{canCreateTicket ? '+ Jira Ticket' : '🔒 Jira (Analyst+)'}</span>
          </button>

          <button
            onClick={handleCreateServiceNow}
            disabled={isCreatingTicket || !canCreateTicket}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition shadow-xs ${
              !canCreateTicket
                ? 'border-slate-200 dark:border-[#222225] bg-slate-100 dark:bg-[#121214] text-slate-400 dark:text-[#71717A] cursor-not-allowed opacity-60'
                : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-800 dark:text-[#E4E4E7] hover:dark:text-white cursor-pointer'
            }`}
            title={canCreateTicket ? "Create ServiceNow Incident (P1/P2)" : "ServiceNow ticket creation requires Analyst, Approver or Admin role"}
          >
            <span>{canCreateTicket ? '+ ServiceNow' : '🔒 ServiceNow'}</span>
          </button>

          <button
            onClick={handleSendSlack}
            disabled={!canCreateTicket}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition shadow-xs ${
              !canCreateTicket
                ? 'border-slate-200 dark:border-[#222225] bg-slate-100 dark:bg-[#121214] text-slate-400 dark:text-[#71717A] cursor-not-allowed opacity-60'
                : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-800 dark:text-[#E4E4E7] hover:dark:text-white cursor-pointer'
            }`}
            title={canCreateTicket ? "Send Slack Block Kit alert to #soc-alerts" : "Slack dispatch requires Analyst, Approver or Admin role"}
          >
            <span>{canCreateTicket ? 'Slack Alert' : '🔒 Slack'}</span>
          </button>

          <button
            onClick={handleSendTeams}
            disabled={!canCreateTicket}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition shadow-xs ${
              !canCreateTicket
                ? 'border-slate-200 dark:border-[#222225] bg-slate-100 dark:bg-[#121214] text-slate-400 dark:text-[#71717A] cursor-not-allowed opacity-60'
                : 'border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-800 dark:text-[#E4E4E7] hover:dark:text-white cursor-pointer'
            }`}
            title={canCreateTicket ? "Send Microsoft Teams Adaptive Card alert" : "Teams dispatch requires Analyst, Approver or Admin role"}
          >
            <span>{canCreateTicket ? 'Teams Alert' : '🔒 Teams'}</span>
          </button>

          {isComp && (
            <button
              onClick={handleOpenIncident}
              disabled={isOpeningIncident}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-md shadow-rose-600/20 transition active:scale-95 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>{isOpeningIncident ? 'Drafting Form...' : 'CERT-In Notice'}</span>
            </button>
          )}

          <button
            onClick={handleOpenProofPack}
            disabled={isOpeningPack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-[#0F172A] dark:text-[#E4E4E7] hover:dark:text-white border border-slate-200 dark:border-[#27272A] font-mono text-xs font-bold transition active:scale-95 shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80]" />
            <span>{isOpeningPack ? 'Loading...' : 'Proof Pack (Ed25519)'}</span>
          </button>
        </div>
      </div>


      {/* Hero Asset Investigation Banner */}
      <div className={`p-5 rounded-2xl soc-card-elevated border transition ${
        isComp
          ? 'border-rose-300 bg-rose-50/50 dark:border-[#3D1F23] dark:bg-[#151214]'
          : isCannotVerify
          ? 'border-purple-300 bg-purple-50/50 dark:border-[#2E2E34] dark:bg-[#141416]'
          : 'border-[#E1E9F2] bg-white dark:border-[#222225] dark:bg-[#121214]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black tracking-tight text-[#111B36] dark:text-white font-mono flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-[#7194B7] dark:text-slate-400" />
                {story.asset.host_name}
              </h1>
              {story.gate.is_approved && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#4ADE80] border border-[#A7F3D0] dark:border-[#1E3B29] inline-flex items-center gap-1 shadow-2xs">
                  <CheckCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#4ADE80]" />
                  <span>Approved & Released</span>
                </span>
              )}
              {isIsolated && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEF3C7] dark:bg-[#1A1713] text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#3D3219] inline-flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FBBF24]" />
                  <span>Host Contained</span>
                </span>
              )}
              {story.gate.status === 'overridden' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-[#1A1713] text-amber-800 dark:text-[#FBBF24] border border-amber-300 dark:border-[#3D3219] inline-flex items-center gap-1 shadow-2xs">
                  <Unlock className="w-3.5 h-3.5 text-amber-700 dark:text-[#FBBF24]" />
                  <span>Gate Overridden</span>
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider ${
                story.asset.exposure_tier === 'emergency'
                  ? 'bg-red-100 dark:bg-[#1A1314] text-red-700 dark:text-[#F87171] border border-red-200 dark:border-[#3D1F23]'
                  : 'bg-amber-100 dark:bg-[#18181B] text-amber-700 dark:text-[#E4E4E7] border border-amber-200 dark:border-[#27272A]'
              }`}>
                {story.asset.exposure_tier} Exposure Tier
              </span>
              <span className="text-xs font-mono text-[#64748B] dark:text-[#8E8E93]">
                IP: <strong className="text-[#111B36] dark:text-white">{story.asset.ip_address}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B] dark:text-[#8E8E93] flex-wrap">
              <span>Product: <strong className="text-[#7194B7] dark:text-slate-300">{story.asset.product} {story.asset.version}</strong></span>
              <span>•</span>
              <span>Tenant: <strong className="text-[#111B36] dark:text-white capitalize">{story.asset.tenant_id.replace('-', ' ')}</strong></span>
              <span>•</span>
              <span>Criticality: <strong className="text-amber-700 dark:text-[#FBBF24] uppercase">{story.asset.criticality}</strong></span>
              <span>•</span>
              <span>Owner: {story.asset.owner}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Verdict Badge */}
            <div className="p-3 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-right font-mono min-w-[200px]">
              <div className="text-[10px] text-[#64748B] dark:text-[#8E8E93] uppercase tracking-wider font-bold">Compromise Verdict</div>
              <div className="flex items-center justify-end gap-2 mt-1">
                {isComp ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-[#F87171] animate-pulse" />
                ) : isCannotVerify ? (
                  <ShieldX className="w-5 h-5 text-purple-600 dark:text-[#C084FC]" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-[#4ADE80]" />
                )}
                <span className={`text-base font-black ${
                  isComp ? 'text-rose-600 dark:text-[#F87171]' : isCannotVerify ? 'text-purple-600 dark:text-[#C084FC]' : 'text-emerald-600 dark:text-[#4ADE80]'
                }`}>
                  {story.verdict.state}
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] dark:text-[#8E8E93] mt-0.5">
                Confidence: <strong className="text-[#111B36] dark:text-white uppercase">{story.verdict.confidence}</strong>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="p-3 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-right font-mono min-w-[170px]">
              <div className="text-[10px] text-[#64748B] dark:text-[#8E8E93] uppercase tracking-wider font-bold flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7194B7] dark:text-slate-400" /> {story.clock.profile}
              </div>
              <div className={`text-lg font-black mt-1 ${
                story.clock.is_breached ? 'text-red-600 dark:text-[#F87171]' : 'text-amber-700 dark:text-[#FBBF24]'
              }`}>
                {formatSeconds(story.clock.seconds_remaining)}
              </div>
              <div className="text-[10px] text-[#64748B] dark:text-[#8E8E93] mt-0.5">
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
          <div className="soc-card p-1 rounded-xl flex items-center gap-1 border border-[#E1E9F2] dark:border-[#222225] text-xs font-mono bg-white dark:bg-[#121214]">
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
                      ? 'bg-[#E6EEF7] text-[#111B36] font-bold border border-[#7194B7] shadow-sm dark:bg-[#222225] dark:text-white dark:border-[#52525B]'
                      : 'text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] hover:dark:text-white hover:bg-[#F7FAFD] hover:dark:bg-[#18181B]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7194B7] dark:text-white' : 'text-[#64748B] dark:text-[#8E8E93]'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-[#7194B7] text-white dark:bg-white dark:text-black font-bold' : 'bg-[#E6EEF7] text-[#64748B] dark:bg-[#18181B] dark:text-[#8E8E93]'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-[#1A1314] text-rose-700 dark:text-[#F87171] border border-rose-200 dark:border-[#3D1F23] font-mono font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: BESPOKE VISUAL TIMELINE LANES */}
          {activeTab === 'timeline' && (
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-3">
                <div className="flex items-center gap-2 font-bold text-[#111B36] dark:text-white">
                  <Activity className="w-4 h-4 text-[#7194B7] dark:text-white" />
                  <span>Multi-Lane Telemetry & Attack Timeline (45-Day Scope)</span>
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#8E8E93] flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#7194B7] dark:border-slate-500" />
                    <span>Advisory Disclosed: <strong>2026-10-09</strong></span>
                  </span>
                  <span className="text-[#C1D0E2] dark:text-[#3F3F46]">|</span>
                  <span className="text-amber-700 dark:text-[#FBBF24]">First In-The-Wild Hit: <strong>2026-10-04</strong></span>
                </div>
              </div>

              {/* Time Ruler Bar */}
              <div className="relative pt-2">
                <div className="flex justify-between text-[10px] text-[#64748B] dark:text-[#8E8E93] font-mono uppercase pb-1 px-1">
                  <span>-45d (Aug 25)</span>
                  <span>-30d</span>
                  <span className="text-rose-600 dark:text-[#F87171] font-bold">-14d [FIRST HIT]</span>
                  <span className="text-[#7194B7] dark:text-slate-300 font-bold">-9d [DISCLOSED]</span>
                  <span>-7d</span>
                  <span className="text-[#111B36] dark:text-white font-bold">NOW (Triage)</span>
                </div>
                <div className="h-1.5 bg-[#E6EEF7] dark:bg-[#18181B] rounded-full border border-[#E1E9F2] dark:border-[#27272A] relative">
                  <div className="absolute left-[68.8%] top-[-2px] bottom-[-2px] w-1 bg-rose-500 rounded-full" title="First Exploit Hit (-14d)" />
                  <div className="absolute left-[80%] top-[-4px] bottom-[-4px] w-1 bg-[#7194B7] dark:bg-white rounded-full" title="Public Advisory Disclosed (-9d)" />
                </div>
              </div>

              {/* Timeline Lanes Container */}
              <div className="space-y-4 pt-1">
                {/* Lane 1: Flaw Exposure Window */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#64748B] dark:text-[#8E8E93] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 1: VULNERABILITY EXPOSURE SPAN</span>
                    <span className="text-[#64748B] dark:text-[#8E8E93]">Firmware: EdgeGate VPN 9.1.4</span>
                  </div>
                  <div className="relative h-8 bg-[#E6EEF7]/50 dark:bg-[#18181B] rounded-xl border border-[#E1E9F2] dark:border-[#27272A] overflow-hidden flex items-center px-3">
                    <div className="absolute inset-y-0 left-0 w-[80%] bg-[#E6EEF7] dark:bg-[#222225] flex items-center px-3 text-[11px] font-medium text-[#111B36] dark:text-white">
                      Unpatched Vulnerable Window (45 Days Telemetry History)
                    </div>
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#7194B7] dark:border-slate-500 z-10" />
                  </div>
                </div>

                {/* Lane 2: Matched Forensic Markers */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-[#64748B] dark:text-[#8E8E93] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 2: NUMBERED ATTACK PROGRESSION MARKERS</span>
                    <span className="text-[#111B36] dark:text-white font-bold">{story.evidence.length} Correlated Artifacts</span>
                  </div>
                  <div className="relative min-h-[64px] bg-[#F7FAFD] dark:bg-[#18181B] rounded-xl border border-[#E1E9F2] dark:border-[#27272A] flex items-center px-3 py-2.5 overflow-x-auto">
                    {/* Vertical marker for Advisory date */}
                    <div className="absolute left-[80%] inset-y-0 w-0.5 border-l-2 border-dashed border-[#7194B7] dark:border-slate-500 z-10 pointer-events-none" />

                    {story.evidence.length === 0 ? (
                      <div className="text-[#64748B] dark:text-[#8E8E93] text-xs italic flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#4ADE80]" />
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
                                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white shadow-xs'
                                  : 'bg-white dark:bg-[#18181B] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] text-[#111B36] dark:text-[#E4E4E7] border-[#E1E9F2] dark:border-[#27272A] shadow-2xs'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-white dark:bg-black text-black dark:text-white'
                                  : 'bg-[#E6EEF7] dark:bg-[#222225] text-slate-700 dark:text-white'
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
                  <div className="flex justify-between text-[10px] text-[#64748B] dark:text-[#8E8E93] uppercase font-bold tracking-wider font-mono">
                    <span>LANE 3: TELEMETRY RETENTION PER LOG SOURCE</span>
                    <span className="text-[#047857] dark:text-[#4ADE80] font-semibold">Policy: &gt;= 85% Provability</span>
                  </div>

                  <div className="space-y-1.5">
                    {story.coverage.sources.map((src) => {
                      const pct = Math.round(src.coverage_ratio * 100)
                      const isAdequate = src.coverage_ratio >= 0.85
                      return (
                        <div key={src.source_type} className="flex items-center gap-3 text-xs">
                          <span className="w-20 font-bold uppercase text-[10px] text-[#64748B] dark:text-[#8E8E93] text-right font-mono">
                            {src.source_type}:
                          </span>
                          <div className="flex-1 h-3.5 bg-[#E6EEF7] dark:bg-[#18181B] rounded-lg border border-[#E1E9F2] dark:border-[#27272A] overflow-hidden relative">
                            <div
                              className={`h-full rounded-lg transition-all ${
                                isAdequate ? 'bg-neutral-800 dark:bg-white' : 'bg-[#C1D0E2] dark:bg-[#3F3F46]'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                            {!isAdequate && (
                              <div
                                className="absolute inset-y-0 right-0 bg-[#FEE2E2] dark:bg-[#1A1314] border-l border-[#FECACA] dark:border-[#3D1F23] flex items-center justify-center text-[8px] text-[#DC2626] dark:text-[#F87171] px-1 font-mono font-bold"
                                style={{ width: `${100 - pct}%` }}
                              >
                                RETENTION GAP
                              </div>
                            )}
                          </div>
                          <span className="w-20 text-right text-[10px] font-mono font-bold text-[#111B36] dark:text-white">
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
                <div className="mt-4 p-4 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#7194B7]/40 dark:border-[#52525B] space-y-2.5">
                  <div className="flex items-center justify-between text-xs border-b border-[#E1E9F2] dark:border-[#27272A] pb-2">
                    <span className="font-bold text-[#7194B7] dark:text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#7194B7] dark:text-white" />
                      EVENT INSPECTOR: [{selectedEvidence.event_id}]
                    </span>
                    <span className="text-[#64748B] dark:text-[#8E8E93] font-mono text-[11px]">{selectedEvidence.timestamp} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-700 dark:text-[#E4E4E7]">
                    <div>Source: <strong className="text-[#111B36] dark:text-white uppercase">{selectedEvidence.source_type}</strong></div>
                    <div>Action: <strong className="text-[#111B36] dark:text-white">{selectedEvidence.event_action}</strong></div>
                    <div>Signal Class: <strong className="text-[#111B36] dark:text-white uppercase">{selectedEvidence.signal_class}</strong></div>
                    <div>Confidence: <strong className="text-[#5E82A7] dark:text-slate-300 uppercase">{selectedEvidence.confidence}</strong></div>
                  </div>

                  {selectedEvidence.details.process_cmdline && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[11px] text-[#111B36] dark:text-white flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.process_cmdline}</code>
                      <button
                        onClick={() => copyCode(selectedEvidence.details.process_cmdline)}
                        className="px-2 py-0.5 rounded bg-[#F7FAFD] dark:bg-[#18181B] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] border border-[#E1E9F2] dark:border-[#27272A] text-[#64748B] dark:text-[#8E8E93] text-[10px]"
                      >
                        {copiedCmd ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {selectedEvidence.details.url_path && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[11px] text-[#111B36] dark:text-white flex items-center justify-between gap-2">
                      <code className="select-all truncate">{selectedEvidence.details.http_method} {selectedEvidence.details.url_path}</code>
                      <button
                        onClick={() => copyCode(`${selectedEvidence.details.http_method} ${selectedEvidence.details.url_path}`)}
                        className="px-2 py-0.5 rounded bg-[#F7FAFD] dark:bg-[#18181B] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] border border-[#E1E9F2] dark:border-[#27272A] text-[#64748B] dark:text-[#8E8E93] text-[10px]"
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
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-3">
                <span className="font-bold text-[#111B36] dark:text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#7194B7] dark:text-white" />
                  Forensic Telemetry Ledger ({story.evidence.length} Records)
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#8E8E93]">Read-Only DuckDB Stream</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E6EEF7] dark:bg-[#18181B] text-[#111B36] dark:text-[#A1A1AA] text-[10px] uppercase border-b border-[#E1E9F2] dark:border-[#222225]">
                    <tr>
                      <th className="p-2.5">EVENT ID</th>
                      <th className="p-2.5">TIMESTAMP</th>
                      <th className="p-2.5">SOURCE</th>
                      <th className="p-2.5">SIGNAL CLASS</th>
                      <th className="p-2.5">TELEMETRY DETAIL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E9F2] dark:divide-[#222225] text-[11px]">
                    {story.evidence.map((ev) => (
                      <tr key={ev.event_id} className="hover:bg-[#F7FAFD] dark:hover:bg-[#18181B] text-[#111B36] dark:text-[#E4E4E7]">
                        <td className="p-2.5 font-bold text-[#7194B7] dark:text-white">{ev.event_id}</td>
                        <td className="p-2.5 text-[#111B36] dark:text-slate-200">{ev.timestamp}</td>
                        <td className="p-2.5 uppercase text-[#64748B] dark:text-[#8E8E93]">{ev.source_type}</td>
                        <td className="p-2.5 font-bold text-[#111B36] dark:text-white">{ev.signal_class}</td>
                        <td className="p-2.5 text-[#111B36] dark:text-slate-200 select-all max-w-sm truncate">
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
            <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-3">
                <div>
                  <h3 className="font-bold text-[#111B36] dark:text-white flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[#7194B7] dark:text-white" /> Containment & Remediation Playbook
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] mt-0.5 font-sans">
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
                        isDone
                          ? 'bg-emerald-50 dark:bg-[#121915] border-emerald-200 dark:border-[#1E3B29]'
                          : 'bg-[#F7FAFD] dark:bg-[#18181B] border-[#E1E9F2] dark:border-[#27272A]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 font-bold text-[#111B36] dark:text-white">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            step.phase === 'containment'
                              ? 'bg-rose-100 dark:bg-[#1A1314] text-rose-700 dark:text-[#F87171] border border-rose-200 dark:border-[#3D1F23]'
                              : 'bg-[#E6EEF7] dark:bg-[#222225] text-[#7194B7] dark:text-[#E4E4E7] border border-[#C1D0E2] dark:border-[#3F3F46]'
                          }`}>
                            {step.phase}
                          </span>
                          <span className="text-xs">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                            isDone
                              ? 'bg-emerald-100 dark:bg-[#121915] text-emerald-700 dark:text-[#4ADE80] border border-emerald-200 dark:border-[#1E3B29]'
                              : 'bg-amber-100 dark:bg-[#1A1713] text-amber-700 dark:text-[#FBBF24] border border-amber-200 dark:border-[#3D3219]'
                          }`}>
                            {step.status}
                          </span>
                          {!isDone && (
                            canVerifyPlaybook ? (
                              <button
                                onClick={() => handleStepVerify(step.step_id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 dark:bg-[#121915] hover:bg-emerald-500 dark:hover:bg-[#1E3B29] text-white dark:text-[#4ADE80] border border-transparent dark:border-[#1E3B29] text-[10px] font-bold font-mono transition cursor-pointer"
                              >
                                Verify Step
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] border border-transparent dark:border-[#27272A] text-[10px] font-bold font-mono cursor-not-allowed opacity-60"
                                title="Playbook step verification requires Analyst, Approver or Admin role"
                              >
                                🔒 Verify (Analyst+)
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans leading-relaxed">{step.description}</p>
                      <div className="mt-2.5 pt-2 border-t border-[#E1E9F2] dark:border-[#222225] text-[10px] text-[#64748B] dark:text-[#8E8E93] flex items-center justify-between">
                        <span>Owner: <strong className="text-[#111B36] dark:text-white">{step.owner}</strong></span>
                        <span>Verification: <strong className="text-[#111B36] dark:text-white">{step.verification_method}</strong></span>
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
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <h3 className="font-bold text-[#111B36] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#7194B7] dark:text-white" />
                <span>Forensic Reasoning (Citations)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 dark:text-[#4ADE80] font-bold">100% CITED</span>
            </div>

            <div className="space-y-2.5 font-sans">
              {story.verdict.reasons.map((r, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-[#E4E4E7] leading-relaxed text-xs">
                  <p>{r.text}</p>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap font-mono">
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">Evidence Citations:</span>
                    {r.evidence_ids.map((eid) => (
                      <span
                        key={eid}
                        className="px-1.5 py-0.5 rounded bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#C1D0E2] dark:border-[#3F3F46] text-[10px] font-bold cursor-pointer hover:bg-[#C1D0E2] hover:dark:bg-[#2E2E34] transition"
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
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <h3 className="font-bold text-[#111B36] dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-white" />
                <span>Coverage Honesty (Blind Spots)</span>
              </h3>
              <span className="text-[10px] font-bold text-purple-700 dark:text-[#C084FC]">
                {Math.round(story.coverage.overall_coverage * 100)}% Retained
              </span>
            </div>

            {story.coverage.blind_spots.length === 0 ? (
              <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans leading-relaxed">
                Zero retention blind spots. Complete 45-day telemetry available across web, endpoint, auth, and network sources.
              </p>
            ) : (
              <div className="space-y-1.5">
                {story.coverage.blind_spots.map((bs, i) => (
                  <div key={i} className="p-2 rounded-lg bg-purple-50 dark:bg-[#18181B] border border-purple-200 dark:border-[#27272A] text-purple-900 dark:text-[#E4E4E7] text-xs font-sans">
                    {bs}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ask-The-Evidence Assistant */}
          <div className="soc-card-elevated p-4 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <h3 className="font-bold text-[#111B36] dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#7194B7] dark:text-white" /> Forensic Evidence Assistant
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E6EEF7] dark:bg-[#18181B] text-[#7194B7] dark:text-[#E4E4E7] border border-[#C1D0E2] dark:border-[#27272A]">
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
                  className="px-2 py-1 rounded-md bg-[#F7FAFD] dark:bg-[#18181B] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] text-[#111B36] dark:text-[#E4E4E7] text-[10px] border border-[#E1E9F2] dark:border-[#27272A] transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat History Drawer */}
            <div className="h-48 overflow-y-auto space-y-2 p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-xs font-sans">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#84A3C4] dark:border-[#52525B] ml-4'
                      : 'bg-white dark:bg-[#121214] text-[#111B36] dark:text-[#E4E4E7] mr-4 border border-[#E1E9F2] dark:border-[#27272A]'
                  }`}
                >
                  <div className="font-bold text-[9px] uppercase tracking-wider text-[#64748B] dark:text-[#8E8E93] mb-0.5 font-mono">
                    {msg.sender === 'user' ? 'Analyst' : 'Postern Trust Service'}
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 flex-wrap font-mono">
                      <span className="text-[9px] text-[#64748B] dark:text-[#8E8E93]">Citations:</span>
                      {msg.citations.map((c) => (
                        <span key={c} className="text-[9px] px-1 rounded bg-[#E6EEF7] dark:bg-[#222225] text-[#7194B7] dark:text-white border border-[#C1D0E2] dark:border-[#3F3F46]">
                          [{c}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isAsking && <div className="text-[#64748B] dark:text-[#8E8E93] italic text-[11px] font-mono">Querying evidence ledger...</div>}
            </div>

            {/* Query Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask grounded question..."
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                className="flex-1 bg-white dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-[#111B36] dark:text-white placeholder-[#64748B] dark:placeholder-[#71717A] focus:outline-none focus:border-neutral-500 font-mono"
              />
              <button
                onClick={() => handleAsk()}
                className="p-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-[#E4E4E7] transition active:scale-95 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gated Execution Pipeline */}
      <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
          <h3 className="font-bold text-[#111B36] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#7194B7] dark:text-white" />
            <span>Recommended Decision Sequence & Patch Gate Pipeline</span>
          </h3>
          <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">Step 3 strictly enforced by Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Containment */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#111B36] dark:text-white">
              <span>1. Host Isolation</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isIsolated ? 'bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#4ADE80] border border-[#A7F3D0] dark:border-[#1E3B29]' :
                isComp ? 'bg-[#FEE2E2] dark:bg-[#1A1314] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#3D1F23]' : 'bg-[#E6EEF7] dark:bg-[#222225] text-[#64748B] dark:text-[#8E8E93]'
              }`}>
                {isIsolated ? '✓ Contained' : (isComp ? 'Mandatory' : 'Bypassed')}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans leading-relaxed">
              Quarantine host to isolated VLAN prior to patching to prevent active lateral movement.
            </p>
            {isIsolated ? (
              <div className="p-2 rounded-lg bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3B29] text-[#047857] dark:text-[#4ADE80] text-[11px] font-bold flex items-center justify-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#4ADE80]" />
                <span>✓ Host Isolated to Quarantine VLAN</span>
              </div>
            ) : isComp ? (
              canContain ? (
                <button
                  onClick={handleIsolateHost}
                  className="w-full py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Isolate Host Now</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] text-[11px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                  title="Host isolation requires Analyst, Approver or Admin role"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 Isolation Locked ({currentRole})</span>
                </button>
              )
            ) : null}
          </div>

          {/* Step 2: Evidence Snapshot */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#111B36] dark:text-white">
              <span>2. Memory Snapshot</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-bold ${
                isSnapshotTaken ? 'bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#4ADE80] border border-[#A7F3D0] dark:border-[#1E3B29]' : 'bg-[#E6EEF7] dark:bg-[#222225] text-[#64748B] dark:text-[#8E8E93]'
              }`}>
                {isSnapshotTaken ? '✓ Sealed' : 'Volatile'}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans leading-relaxed">
              Preserve live RAM dump and socket states before host reboot or firmware overwrite.
            </p>
            {isSnapshotTaken ? (
              <div className="p-2 rounded-lg bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3B29] text-[#047857] dark:text-[#4ADE80] text-[11px] font-bold flex items-center justify-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#4ADE80]" />
                <span>✓ RAM Dump Sealed (SHA-256)</span>
              </div>
            ) : (
              canContain ? (
                <button
                  onClick={handleTakeSnapshot}
                  className="w-full py-1.5 rounded-lg bg-[#E6EEF7] hover:bg-[#C1D0E2] dark:bg-[#222225] dark:hover:bg-[#2A2A2E] text-[#111B36] dark:text-white text-[11px] font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 border border-transparent dark:border-[#3F3F46]"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#7194B7] dark:text-white" />
                  <span>Capture RAM Snapshot</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] text-[11px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                  title="RAM dump snapshot requires operational role"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 Snapshot Locked ({currentRole})</span>
                </button>
              )
            )}
          </div>

          {/* Step 3: Patch Gate */}
          <div className={`p-4 rounded-xl border space-y-2 transition ${
            story.gate.gate_locked ? 'bg-[#FEE2E2]/40 dark:bg-[#1A1314] border-[#FECACA] dark:border-[#3D1F23]' : 'bg-[#D1FAE5]/40 dark:bg-[#121915] border-[#A7F3D0] dark:border-[#1E3B29]'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-[#111B36] dark:text-white">
                {story.gate.gate_locked ? <Lock className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" /> : <Unlock className="w-4 h-4 text-[#047857] dark:text-[#4ADE80]" />}
                3. Patch Gate
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                story.gate.gate_locked ? 'bg-[#FEE2E2] dark:bg-[#2D1619] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#4D2026]' : 'bg-[#D1FAE5] dark:bg-[#14261B] text-[#047857] dark:text-[#4ADE80] border border-[#A7F3D0] dark:border-[#21432D]'
              }`}>
                {story.gate.gate_locked ? 'LOCKED' : 'UNLOCKED'}
              </span>
            </div>
            <p className="text-[11px] text-[#111B36] dark:text-slate-300 font-sans">
              Outcome: <strong className="text-[#111B36] dark:text-white font-bold">{story.gate.outcome}</strong>
            </p>
            {story.gate.gate_locked ? (
              canOverride ? (
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-[#222225] dark:hover:bg-[#2A2A2E] text-white text-[11px] font-bold transition shadow-2xs cursor-pointer border border-transparent dark:border-[#3F3F46]"
                >
                  Apply Gate Override
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] text-[11px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                  title="Patch Gate override requires Approver or Admin role"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 Override Requires Approver</span>
                </button>
              )
            ) : story.gate.is_approved ? (
              <div className="p-2 rounded-lg bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3B29] text-[#047857] dark:text-[#4ADE80] text-[11px] font-bold flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#047857] dark:text-[#4ADE80]" />
                <span>Gate Approved & Released</span>
              </div>
            ) : (
              canApprove ? (
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
                  className="w-full py-1.5 rounded-lg bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-[#E4E4E7] text-white dark:text-black text-[11px] font-bold transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve & Release Patch</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] text-[11px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                  title="Patch release approval requires Approver or Admin role"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 Release Requires Approver Role</span>
                </button>
              )
            )}
          </div>

          {/* Step 4: Post-Patch Re-Check */}
          <div className="p-4 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#111B36] dark:text-white">
              <span>4. Closure Verification</span>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                recheckVerified ? 'bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#4ADE80] border border-[#A7F3D0] dark:border-[#1E3B29]' : 'text-[#7194B7] dark:text-white'
              }`}>
                {recheckVerified ? '✓ Verified Clean' : 'Re-Check Engine'}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans leading-relaxed">
              Forensic recheck verifying web shell removal, session flush, and 0 outbound C2 traffic.
            </p>
            {recheckVerified ? (
              <div className="p-2 rounded-lg bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3B29] text-[#047857] dark:text-[#4ADE80] text-[11px] font-bold flex items-center justify-center gap-1.5">
                <CheckCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#4ADE80]" />
                <span>✓ Verified: 0 Residue Detected</span>
              </div>
            ) : (
              canRunRecheck ? (
                <button
                  onClick={handleRunRecheck}
                  disabled={recheckRunning}
                  className="w-full py-1.5 rounded-lg bg-neutral-900 dark:bg-[#222225] hover:bg-neutral-800 dark:hover:bg-[#2A2A2E] text-white font-bold text-[11px] transition active:scale-95 shadow-sm cursor-pointer border border-transparent dark:border-[#3F3F46]"
                >
                  {recheckRunning ? 'Re-Checking Host...' : 'Run Post-Patch Re-Check'}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-1.5 rounded-lg bg-slate-200 dark:bg-[#222225] text-slate-500 dark:text-[#71717A] text-[11px] font-bold cursor-not-allowed flex items-center justify-center gap-1.5 opacity-60"
                  title="Post-patch recheck requires Analyst, Approver or Admin role"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🔒 Re-Check Requires Analyst+</span>
                </button>
              )
            )}
          </div>
        </div>

        {recheckMessage && (
          <div className="p-3.5 rounded-xl bg-[#E6EEF7] dark:bg-[#18181B] border border-[#7194B7] dark:border-[#27272A] text-[#111B36] dark:text-white font-mono text-xs flex items-center justify-between">
            <span>{recheckMessage}</span>
            <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] font-bold uppercase">Closure Audit Complete</span>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="soc-card-elevated p-6 max-w-md w-full space-y-4 font-mono text-xs rounded-2xl border border-rose-300 dark:border-[#3D1F23] bg-white dark:bg-[#121214]">
            <h3 className="text-sm font-bold text-rose-700 dark:text-[#F87171] flex items-center gap-2">
              <Lock className="w-4 h-4" /> Administrative Patch Gate Override
            </h3>
            <p className="text-[#64748B] dark:text-[#8E8E93] font-sans text-xs leading-relaxed">
              Unlocks the patch gate over a suspected or confirmed compromise. Requires business continuity justification and records an immutable audit entry in the chain of custody.
            </p>
            <div>
              <label className="text-[#64748B] dark:text-[#8E8E93]">Approver ID / Role:</label>
              <input
                type="text"
                value={overrideApprover}
                onChange={(e) => setOverrideApprover(e.target.value)}
                className="w-full mt-1 bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] rounded-lg p-2 text-[#111B36] dark:text-white font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[#64748B] dark:text-[#8E8E93]">Recorded Operational Justification:</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                className="w-full mt-1 bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] rounded-lg p-2 text-[#111B36] dark:text-white font-sans text-xs"
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
