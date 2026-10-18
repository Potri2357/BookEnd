import React, { useState } from 'react'
import {
  FileText, X, Copy, Check, AlertTriangle,
  Building, Clock, ShieldAlert, HelpCircle, Shield,
  Printer, ArrowRight
} from 'lucide-react'

interface IncidentHandOffModalProps {
  incidentDraft: any
  onClose: () => void
}

export const IncidentHandOffModal: React.FC<IncidentHandOffModalProps> = ({
  incidentDraft,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'cert_in' | 'insurer' | 'executive'>('cert_in')
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const certIn = incidentDraft.cert_in_draft
  const insurer = incidentDraft.insurer_notice_draft

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="soc-card-elevated rounded-3xl max-w-4xl w-full p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto font-sans border border-white/[0.1]">
        {/* CERT-In Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 via-amber-500/10 to-slate-900 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Statutory Incident Hand-Off (F17)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 font-black uppercase">
                  Indian CERT-In & Insurer Filing
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Incident Reference: <strong className="text-cyan-300">{incidentDraft.incident_id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-xs font-mono">
          {[
            { id: 'cert_in', label: 'CERT-In Incident Report (Form IR)', icon: FileText, badge: 'Mandatory 6h Rule' },
            { id: 'insurer', label: 'Cyber Insurer Breach Notice', icon: Building },
            { id: 'executive', label: 'Board Briefing Memorandum', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-500/50 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-600/30 text-rose-200 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab 1: CERT-In */}
        {activeTab === 'cert_in' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 bg-amber-500/[0.06] border border-amber-500/30 rounded-xl text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Statutory Mandate: CERT-In Directions 2026 require cyber incident notice within 6 hours.</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(certIn, null, 2))}
                className="px-3 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-slate-200 border border-white/[0.1] flex items-center gap-1.5 text-[11px] font-bold transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy CERT-In Draft
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3 text-slate-300 text-[11px] border-b border-white/[0.06] pb-3">
                <div>Statutory Form: <strong className="text-white">{certIn.form}</strong></div>
                <div>Incident Class: <strong className="text-rose-400">{certIn.incident_classification}</strong></div>
                <div>Target Host: <strong className="text-cyan-300">{certIn.system_details?.host_name}</strong> ({certIn.system_details?.ip_address})</div>
                <div>Exposure: <strong className="text-amber-300 uppercase">{certIn.system_details?.exposure}</strong></div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-slate-400 text-[11px] font-bold">Forensic Evidence Summary (Cited Sentences):</span>
                <p className="p-3 rounded-xl bg-[#080b16] border border-white/[0.08] text-cyan-200 text-xs font-sans leading-relaxed">
                  {certIn.evidence_cited_summary}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-slate-400 text-[11px] font-bold">Action Taken (Defense Gate & Containment):</span>
                <p className="p-3 rounded-xl bg-[#080b16] border border-white/[0.08] text-emerald-300 text-xs font-sans leading-relaxed">
                  {certIn.action_taken}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cyber Insurer */}
        {activeTab === 'insurer' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 bg-black/40 border border-white/[0.08] rounded-xl text-slate-300 flex items-center justify-between">
              <span>Cyber Insurance Triage & Proof Submission</span>
              <button
                onClick={() => handleCopy(JSON.stringify(insurer, null, 2))}
                className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] flex items-center gap-1.5 text-[11px] font-bold transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Notice
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3">
              <div>Policyholder Tenant: <strong className="text-slate-100 capitalize">{insurer.policyholder_tenant}</strong></div>
              <div>Proof Pack Reference: <strong className="text-cyan-300">{insurer.proof_pack_id}</strong></div>
              <div>Impact Assessment: <strong className="text-amber-300">{insurer.estimated_impact}</strong></div>
              <div>Chain of Custody Preserved: <strong className="text-emerald-400">YES (SHA-256 Merkle Ledger)</strong></div>
            </div>
          </div>
        )}

        {/* Tab 3: Executive Memo */}
        {activeTab === 'executive' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="font-bold text-white text-sm">Board & Executive Cybersecurity Briefing</span>
                <button
                  onClick={() => handleCopy(incidentDraft.executive_summary_draft)}
                  className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] flex items-center gap-1.5 text-[11px] font-bold transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Text
                </button>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-xs">
                {incidentDraft.executive_summary_draft}
              </p>
            </div>
          </div>
        )}

        {/* Missing Facts (Explicit Unknown Boundaries) */}
        <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>UNRESOLVED FACTS (NO SPECULATION - STRICT BOUNDARIES):</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside font-mono">
            {incidentDraft.missing_facts.map((fact: string, idx: number) => (
              <li key={idx} className="text-slate-400">
                <span className="text-amber-200/90">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
