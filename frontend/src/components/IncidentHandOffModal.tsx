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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121214] rounded-3xl max-w-4xl w-full p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto font-sans border border-[#E1E9F2] dark:border-[#222225] text-[#111B36] dark:text-[#FFFFFF]">
        {/* CERT-In Header */}
        <div className="flex items-start justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE2E2] dark:bg-[#1A1314] border border-[#FECACA] dark:border-[#3D1F23] flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-8 h-8 text-[#DC2626] dark:text-[#F87171]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#111B36] dark:text-white tracking-tight">
                  Statutory Incident Hand-Off Notification
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-[#1A1314] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#3D1F23] font-bold uppercase">
                  Indian CERT-In &amp; Insurer Filing
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8E8E93] font-mono mt-1">
                Incident Reference: <strong className="text-[#5E82A7] dark:text-white">{incidentDraft.incident_id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#E6EEF7] dark:bg-[#18181B] text-[#111B36] dark:text-white hover:bg-[#C1D0E2] dark:hover:bg-[#222225] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#E1E9F2] dark:border-[#222225] pb-2 text-xs font-mono">
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#7194B7] dark:border-[#52525B] font-bold shadow-2xs'
                    : 'text-[#64748B] dark:text-[#8E8E93] hover:bg-[#F7FAFD] dark:hover:bg-[#18181B] hover:text-[#111B36] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FEE2E2] dark:bg-[#1A1314] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#3D1F23] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: CERT-In Official Filing Format */}
        {activeTab === 'cert_in' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#FEE2E2]/60 dark:bg-[#1A1314] border border-[#FECACA] dark:border-[#3D1F23] flex items-center justify-between text-[#DC2626] dark:text-[#F87171]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>CERT-In Rule 12 Mandate: Incidents must be formally notified within <strong>6 hours</strong> of noticing.</span>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#FECACA] dark:border-[#3D1F23]">
                COMPLIANT DISPATCH
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
                <span className="text-[#111B36] dark:text-white font-bold">CERT-In Incident Reporting Format (Form IR)</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(certIn, null, 2))}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121214] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] text-[#111B36] dark:text-white border border-[#E1E9F2] dark:border-[#27272A] text-[11px] transition shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-[#047857] dark:text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Form IR</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">1. NAME OF AFFECTED ENTITY:</span>
                  <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-white mt-1 font-semibold">{certIn.affected_entity}</div>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">2. INCIDENT TYPE &amp; CLASSIFICATION:</span>
                  <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#DC2626] dark:text-[#F87171] mt-1 font-bold">{certIn.incident_type}</div>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">3. TIME OF OBSERVATION / FIRST HIT:</span>
                  <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-white mt-1">{certIn.time_of_observation}</div>
                </div>
                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">4. ADVERSE IMPACTED SYSTEMS:</span>
                  <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#5E82A7] dark:text-[#E4E4E7] mt-1 font-semibold">{certIn.impacted_systems.join(', ')}</div>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">5. CHRONOLOGY OF SUSPECTED ATTACK EVENTS:</span>
                <ul className="p-3 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-slate-200 text-[11px] space-y-1 list-disc list-inside mt-1 font-sans">
                  {certIn.chronology.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">6. ATTACKER ARTIFACTS, IPS &amp; IOCS:</span>
                <div className="p-2.5 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#B45309] dark:text-[#FBBF24] font-mono text-[11px] select-all mt-1">
                  {certIn.observed_iocs.join(' · ')}
                </div>
              </div>

              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">7. IMMEDIATE REMEDIAL MEASURES UNDERTAKEN:</span>
                <div className="p-2.5 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-slate-200 text-[11px] font-sans mt-1">
                  {certIn.remedial_measures}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Cyber Insurer Notification */}
        {activeTab === 'insurer' && (
          <div className="p-5 rounded-2xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <span className="text-[#111B36] dark:text-white font-bold">Cyber Insurance Breach Claim Notice (First-Party &amp; Third-Party Loss)</span>
              <button
                onClick={() => handleCopy(JSON.stringify(insurer, null, 2))}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#121214] hover:bg-[#E6EEF7] dark:hover:bg-[#222225] text-[#111B36] dark:text-white border border-[#E1E9F2] dark:border-[#27272A] text-[11px] transition shadow-2xs cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#047857] dark:text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                <span>Copy Insurer Notice</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">INSURED ORGANISATION:</span>
                <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-white mt-1 font-bold">{insurer.insured_entity}</div>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">POLICY APPLICABILITY:</span>
                <div className="p-2 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#047857] dark:text-[#34D399] mt-1 font-semibold">{insurer.policy_applicability}</div>
              </div>
            </div>

            <div>
              <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">FORENSIC LOSS MITIGATION CONFIRMATION:</span>
              <div className="p-3 rounded bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-slate-200 text-xs font-sans leading-relaxed mt-1">
                {insurer.mitigation_proof}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Executive Board Briefing */}
        {activeTab === 'executive' && (
          <div className="p-5 rounded-2xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-4 text-xs font-sans">
            <h3 className="font-bold text-sm text-[#111B36] dark:text-white font-mono">Executive Cybersecurity Briefing for Board of Directors</h3>
            <p className="text-[#64748B] dark:text-[#8E8E93] leading-relaxed">
              At approximately <strong>{certIn.time_of_observation}</strong>, Postern detected confirmed adversarial exploitation on <strong>{certIn.impacted_systems.join(', ')}</strong> prior to public vendor patching.
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-[#121214] border border-[#E1E9F2] dark:border-[#27272A] space-y-2">
              <h4 className="font-bold text-[#111B36] dark:text-white font-mono text-[11px]">Key Executive Takeaways:</h4>
              <ul className="list-disc list-inside space-y-1 text-[#64748B] dark:text-[#8E8E93]">
                <li><strong>Containment Initiated:</strong> Automated patch gate locked to prevent adversary binary overwrites.</li>
                <li><strong>No Exfiltration Beyond Host:</strong> Blast radius analysis confirms zero lateral hops across internal subnets.</li>
                <li><strong>Regulator Filing:</strong> Formal Form IR drafted for statutory submission to Indian CERT-In under IT Act Section 70B.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E1E9F2] dark:border-[#222225] text-xs font-mono">
          <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">
            Automated legal &amp; regulatory hand-off generated by Postern.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111B36] hover:bg-[#1D63ED] text-white dark:bg-white dark:text-black dark:hover:bg-[#E4E4E7] font-bold transition shadow-xs cursor-pointer"
          >
            Done &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncidentHandOffModal
