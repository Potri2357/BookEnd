import React, { useState } from 'react'
import {
  FileText, X, Copy, Check, AlertTriangle,
  Building, Clock, ShieldAlert, HelpCircle
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Regulatory Incident Hand-Off (F17)</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  Pre-Filing Stage
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{incidentDraft.incident_id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
          {[
            { id: 'cert_in', label: 'CERT-In Form IR (India 6-Hour Rule)', icon: FileText },
            { id: 'insurer', label: 'Cyber Insurer Breach Notice', icon: Building },
            { id: 'executive', label: 'Executive Board Briefing', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'cert_in' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Statutory Deadline: Mandatory disclosure within 6 hours of incident confirmation.</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(certIn, null, 2))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Draft
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3 text-slate-300 text-[11px]">
                <div><strong>Form Title:</strong> {certIn.form}</div>
                <div><strong>Classification:</strong> {certIn.incident_classification}</div>
                <div><strong>Target Host:</strong> {certIn.system_details?.host_name} ({certIn.system_details?.ip_address})</div>
                <div><strong>Software:</strong> {certIn.system_details?.os_product}</div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="text-slate-400 text-[11px]">Forensic Evidence Summary (Cited Sentences):</span>
                <p className="mt-1 p-2.5 rounded bg-slate-900 border border-slate-800/80 text-cyan-200 text-xs leading-relaxed">
                  {certIn.evidence_cited_summary}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Mitigation & Containment Taken:</span>
                <p className="mt-1 p-2.5 rounded bg-slate-900 border border-slate-800/80 text-emerald-300 text-xs">
                  {certIn.action_taken}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insurer' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300 flex items-center justify-between">
              <span>Cyber Insurance Preliminary Claim & Triage Submission</span>
              <button
                onClick={() => handleCopy(JSON.stringify(insurer, null, 2))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Draft
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div><strong>Policyholder Tenant:</strong> {insurer.policyholder_tenant}</div>
              <div><strong>Proof Pack Reference:</strong> {insurer.proof_pack_id}</div>
              <div><strong>Impact Assessment:</strong> {insurer.estimated_impact}</div>
              <div><strong>Chain of Custody Preserved:</strong> {insurer.forensic_chain_of_custody_preserved ? 'YES (SHA-256 Ledger)' : 'NO'}</div>
            </div>
          </div>
        )}

        {activeTab === 'executive' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white">Board & Executive Briefing Memorandum:</span>
                <button
                  onClick={() => handleCopy(incidentDraft.executive_summary_draft)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 text-[11px]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Text
                </button>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-sm">
                {incidentDraft.executive_summary_draft}
              </p>
            </div>
          </div>
        )}

        {/* Missing Facts (PRD Requirement: Unknown stays unknown) */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            UNRESOLVED / UNKNOWN FACTS (EXPLICIT BOUNDARIES):
          </div>
          <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-mono">
            {incidentDraft.missing_facts.map((fact: string, idx: number) => (
              <li key={idx} className="text-slate-400">
                <span className="text-amber-200">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
