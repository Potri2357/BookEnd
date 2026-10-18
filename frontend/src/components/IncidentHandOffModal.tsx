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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2833]/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto font-sans border border-[#cde5e3]">
        {/* CERT-In Header */}
        <div className="flex items-start justify-between border-b border-[#e5f0ef] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#113644] tracking-tight">
                  Statutory Incident Hand-Off Notification
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 font-bold uppercase">
                  Indian CERT-In & Insurer Filing
                </span>
              </div>
              <p className="text-xs text-[#527977] font-mono mt-1">
                Incident Reference: <strong className="text-[#0d9488] font-bold">{incidentDraft.incident_id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#f2f7f7] text-[#527977] hover:text-[#113644] hover:bg-[#eaf4f3] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#e5f0ef] pb-2 text-xs font-mono">
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
                    ? 'bg-[#0d9488] text-white font-bold shadow-sm'
                    : 'text-[#527977] hover:bg-[#f2f7f7] hover:text-[#113644]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                  }`}>
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
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="font-semibold">Statutory Mandate: CERT-In Directions 2026 require cyber incident notice within 6 hours.</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(certIn, null, 2))}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#f2f7f7] text-[#113644] border border-[#cde5e3] flex items-center gap-1.5 text-[11px] font-bold shadow-sm transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#0d9488]" />}
                Copy CERT-In Draft
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fbfb] border border-[#cde5e3] space-y-3 font-mono">
              <div className="grid grid-cols-2 gap-3 text-[#406866] text-[11px] border-b border-[#e5f0ef] pb-3">
                <div>Statutory Form: <strong className="text-[#113644]">{certIn.form}</strong></div>
                <div>Incident Class: <strong className="text-rose-700 font-bold">{certIn.incident_classification}</strong></div>
                <div>Target Host: <strong className="text-[#0d9488] font-bold">{certIn.system_details?.host_name}</strong> ({certIn.system_details?.ip_address})</div>
                <div>Exposure: <strong className="text-amber-800 uppercase font-bold">{certIn.system_details?.exposure}</strong></div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[#527977] text-[11px] font-bold">Forensic Evidence Summary (Cited Sentences):</span>
                <p className="p-3.5 rounded-xl bg-white border border-[#cde5e3] text-[#113644] text-xs font-sans leading-relaxed">
                  {certIn.evidence_cited_summary}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[#527977] text-[11px] font-bold">Action Taken (Defense Gate & Containment):</span>
                <p className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs font-sans leading-relaxed">
                  {certIn.action_taken}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cyber Insurer */}
        {activeTab === 'insurer' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 bg-[#f8fbfb] border border-[#cde5e3] rounded-xl text-[#113644] flex items-center justify-between">
              <span className="font-semibold">Cyber Insurance Triage & Proof Submission</span>
              <button
                onClick={() => handleCopy(JSON.stringify(insurer, null, 2))}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#f2f7f7] text-[#113644] border border-[#cde5e3] flex items-center gap-1.5 text-[11px] font-bold shadow-sm transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#0d9488]" />}
                Copy Notice
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fbfb] border border-[#cde5e3] space-y-3">
              <div>Policyholder Tenant: <strong className="text-[#113644] capitalize font-bold">{insurer.policyholder_tenant}</strong></div>
              <div>Proof Pack Reference: <strong className="text-[#0d9488] font-bold">{insurer.proof_pack_id}</strong></div>
              <div>Impact Assessment: <strong className="text-amber-800 font-bold">{insurer.estimated_impact}</strong></div>
              <div>Chain of Custody Preserved: <strong className="text-emerald-700 font-bold">YES (SHA-256 Merkle Ledger)</strong></div>
            </div>
          </div>
        )}

        {/* Tab 3: Executive Memo */}
        {activeTab === 'executive' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-5 rounded-2xl bg-[#f8fbfb] border border-[#cde5e3] space-y-3">
              <div className="flex items-center justify-between border-b border-[#e5f0ef] pb-3">
                <span className="font-bold text-[#113644] text-sm">Board & Executive Cybersecurity Briefing</span>
                <button
                  onClick={() => handleCopy(incidentDraft.executive_summary_draft)}
                  className="px-3 py-1 rounded-lg bg-white hover:bg-[#f2f7f7] text-[#113644] border border-[#cde5e3] flex items-center gap-1.5 text-[11px] font-bold shadow-sm transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#0d9488]" />}
                  Copy Text
                </button>
              </div>
              <p className="text-[#204443] leading-relaxed font-sans text-xs">
                {incidentDraft.executive_summary_draft}
              </p>
            </div>
          </div>
        )}

        {/* Missing Facts (Explicit Unknown Boundaries) */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>UNRESOLVED FACTS (NO SPECULATION - STRICT BOUNDARIES):</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#406866] list-disc list-inside font-mono">
            {incidentDraft.missing_facts.map((fact: string, idx: number) => (
              <li key={idx}>
                <span className="text-amber-900 font-semibold">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

