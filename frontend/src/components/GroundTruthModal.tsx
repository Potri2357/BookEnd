import React, { useEffect } from 'react'
import { X, KeyRound, ShieldAlert, CheckCircle2, AlertTriangle, Database, Activity } from 'lucide-react'

interface GroundTruthModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectScenario: (scenarioId: string, assetId: string) => void
}

export const GroundTruthModal: React.FC<GroundTruthModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const items = [
    {
      code: 'S1',
      title: 'Compromised Pre-Advisory',
      assetId: 'meridian-vpn-gw-01',
      expectedState: 'TRUE COMPROMISE',
      verdictClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotClass: 'bg-rose-500',
      description: 'Pre-disclosure path traversal on 2026-10-04 (-14d) followed by web shell drop in /assets/.sys_cache.php and periodic port 8443 beaconing.',
      recommendation: 'CONTAIN FIRST. Do not patch firmware before isolating host and revoking Active Directory session tokens.'
    },
    {
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      expectedState: 'UNCOMPROMISED',
      verdictClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
      description: 'Full 45-day log coverage across all 5 telemetry sources (Web, Auth, Syslog, EDR, Network). 0 indicators or exploit patterns found.',
      recommendation: 'SAFE TO PATCH NOW. Automatic bulk-approval cleared under 12-hour SLA window.'
    },
    {
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      expectedState: 'BENIGN NOISE',
      verdictClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      description: 'Ansible maintenance scripts creating temporary files and health check probes. Tests false-positive rejection engine against legitimate admin noise.',
      recommendation: 'SAFE TO PATCH NOW. Verified administrative origin with valid cryptographic signing key.'
    },
    {
      code: 'S4',
      title: 'Retention Gap Blind Spot',
      assetId: 'meridian-web-portal-01',
      expectedState: 'BLIND SPOT GAP',
      verdictClass: 'bg-sky-50 text-sky-700 border-sky-200',
      dotClass: 'bg-sky-500',
      description: 'Retention gap: Only 7 days of endpoint logs retained out of required 45-day exposure window. System cannot prove asset was not breached.',
      recommendation: 'PATCH WITH CAVEAT / GAPPED AUDIT. Requires incident responder waiver and manual baseline forensics.'
    },
    {
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      expectedState: 'REOPEN TRIGGER',
      verdictClass: 'bg-purple-50 text-purple-700 border-purple-200',
      dotClass: 'bg-purple-500',
      description: 'Asset patched to latest firmware, but persistent backdoor (/assets/.sys_cache.php) left intact. Post-patch telemetry verification detects ongoing beacons.',
      recommendation: 'AUTOMATIC REOPEN. Incident re-escalated to IR triage team with Proof Pack integrity invalidation.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/80 shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200 font-sans max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2FE] text-[#1D63ED] flex items-center justify-center shadow-2xs">
              <KeyRound className="w-5 h-5 text-[#1D63ED]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111B36]">
                  Range Lite Ground Truth Baseline
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#047857] bg-[#D1FAE5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                  100% Recall · 0% FP
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Empirical benchmark dataset for automated containment &amp; patch gate validation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#111B36] hover:bg-[#F7FAFD] border border-transparent hover:border-[#E1E9F2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.code}
                onClick={() => {
                  onSelectScenario(item.code, item.assetId)
                  onClose()
                }}
                className="p-4 rounded-xl border border-[#E1E9F2] bg-[#F7FAFD] hover:bg-white hover:border-[#7194B7] transition cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                      <span className="text-xs font-mono font-bold text-[#111B36]">
                        {item.code}: {item.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.verdictClass}`}>
                      {item.expectedState}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#5E82A7] mb-2 font-semibold">
                    Target: {item.assetId}
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed mb-3 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E1E9F2]/80 flex items-center justify-between text-[11px]">
                  <span className="text-[#047857] font-medium truncate pr-2">
                    {item.recommendation}
                  </span>
                  <span className="text-[#7194B7] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E1E9F2] flex items-center justify-between text-xs text-[#64748B]">
          <span className="font-mono text-[11px]">
            Synthetic telemetry generated with DuckDB columnar store across 90 simulated nodes
          </span>
          <button
            onClick={onClose}
            className="chip-btn chip-btn-primary px-5 py-2 text-xs"
          >
            Close Baseline
          </button>
        </div>
      </div>
    </div>
  )
}
