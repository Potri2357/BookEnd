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
      verdictClass: 'bg-rose-50 dark:bg-[#1A1314] text-rose-700 dark:text-[#F87171] border-rose-200 dark:border-[#3D1F23]',
      dotClass: 'bg-rose-500',
      description: 'Pre-disclosure path traversal on 2026-10-04 (-14d) followed by web shell drop in /assets/.sys_cache.php and periodic port 8443 beaconing.',
      recommendation: 'CONTAIN FIRST. Do not patch firmware before isolating host and revoking Active Directory session tokens.'
    },
    {
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      expectedState: 'UNCOMPROMISED',
      verdictClass: 'bg-emerald-50 dark:bg-[#121915] text-emerald-700 dark:text-[#34D399] border-emerald-200 dark:border-[#1E3A2F]',
      dotClass: 'bg-emerald-500',
      description: 'Full 45-day log coverage across all 5 telemetry sources (Web, Auth, Syslog, EDR, Network). 0 indicators or exploit patterns found.',
      recommendation: 'SAFE TO PATCH NOW. Automatic bulk-approval cleared under 12-hour SLA window.'
    },
    {
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      expectedState: 'BENIGN NOISE',
      verdictClass: 'bg-amber-50 dark:bg-[#1A1713] text-amber-700 dark:text-[#FBBF24] border-amber-200 dark:border-[#3B2D18]',
      dotClass: 'bg-amber-500',
      description: 'Ansible maintenance scripts creating temporary files and health check probes. Tests false-positive rejection engine against legitimate admin noise.',
      recommendation: 'SAFE TO PATCH NOW. Verified administrative origin with valid cryptographic signing key.'
    },
    {
      code: 'S4',
      title: 'Retention Gap Blind Spot',
      assetId: 'meridian-web-portal-01',
      expectedState: 'BLIND SPOT GAP',
      verdictClass: 'bg-sky-50 dark:bg-[#18181B] text-sky-700 dark:text-[#A1A1AA] border-sky-200 dark:border-[#27272A]',
      dotClass: 'bg-sky-500',
      description: 'Retention gap: Only 7 days of endpoint logs retained out of required 45-day exposure window. System cannot prove asset was not breached.',
      recommendation: 'PATCH WITH CAVEAT / GAPPED AUDIT. Requires incident responder waiver and manual baseline forensics.'
    },
    {
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      expectedState: 'REOPEN TRIGGER',
      verdictClass: 'bg-purple-50 dark:bg-[#1A1520] text-purple-700 dark:text-[#C084FC] border-purple-200 dark:border-[#3B2D54]',
      dotClass: 'bg-purple-500',
      description: 'Asset patched to latest firmware, but persistent backdoor (/assets/.sys_cache.php) left intact. Post-patch telemetry verification detects ongoing beacons.',
      recommendation: 'AUTOMATIC REOPEN. Incident re-escalated to IR triage team with Proof Pack integrity invalidation.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Frosted Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-[#222225] shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200 font-sans max-h-[90vh] flex flex-col text-[#111B36] dark:text-[#FFFFFF]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#222225]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF2FE] dark:bg-[#18181B] text-[#1D63ED] dark:text-white border border-[#BFDBFE] dark:border-[#27272A] flex items-center justify-center shadow-2xs">
              <KeyRound className="w-5 h-5 text-[#1D63ED] dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111B36] dark:text-white">
                  Range Lite Ground Truth Baseline
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#047857] dark:text-[#34D399] bg-[#D1FAE5] dark:bg-[#121915] px-2 py-0.5 rounded-full border border-[#A7F3D0] dark:border-[#1E3A2F]">
                  100% Recall · 0% FP
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8E8E93]">
                Empirical benchmark dataset for automated containment &amp; patch gate validation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] dark:hover:text-white hover:bg-[#F7FAFD] dark:hover:bg-[#18181B] border border-transparent hover:border-[#E1E9F2] dark:hover:border-[#27272A] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="overflow-y-auto py-4 space-y-3 flex-1 pr-1 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.code}
                onClick={() => {
                  onSelectScenario(item.code, item.assetId)
                  onClose()
                }}
                className="p-4 rounded-xl border border-[#E1E9F2] dark:border-[#27272A] bg-[#F7FAFD] dark:bg-[#18181B] hover:bg-white hover:dark:bg-[#222225] hover:border-[#7194B7] dark:hover:border-[#52525B] transition cursor-pointer shadow-2xs group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                      <span className="text-xs font-mono font-bold text-[#111B36] dark:text-white">
                        {item.code}: {item.title}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.verdictClass}`}>
                      {item.expectedState}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-[#5E82A7] dark:text-[#A1A1AA] mb-2 font-semibold">
                    Target: {item.assetId}
                  </div>

                  <p className="text-xs text-[#64748B] dark:text-[#8E8E93] leading-relaxed mb-3 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E1E9F2]/80 dark:border-[#222225] flex items-center justify-between text-[11px]">
                  <span className="text-[#047857] dark:text-[#34D399] font-medium truncate pr-2 font-sans">
                    {item.recommendation}
                  </span>
                  <span className="text-[#7194B7] dark:text-white font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E1E9F2] dark:border-[#222225] flex items-center justify-between text-xs text-[#64748B] dark:text-[#8E8E93]">
          <span className="font-mono text-[11px]">
            Synthetic telemetry generated with DuckDB columnar store across 90 simulated nodes
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1D63ED] hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-[#E4E4E7] font-bold text-xs transition cursor-pointer shadow-sm"
          >
            Close Baseline
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroundTruthModal
