import React, { useState } from 'react'
import {
  X, ChevronRight, ChevronLeft, ShieldAlert, CheckCircle2,
  AlertTriangle, EyeOff, RefreshCw, KeyRound, ArrowRight
} from 'lucide-react'

interface GuidedTourModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectScenario: (assetId: string) => void
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const tourSteps = [
    {
      title: 'Welcome to Postern: Patch With Proof',
      subtitle: 'Closing the gap between "we patched" and "we are safe"',
      badge: 'Assurance Engine',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:bg-[#18181B] dark:text-white dark:border-[#27272A]',
      icon: KeyRound,
      description:
        'When an emergency CVE drops, teams rush to patch. But if an attacker already breached the asset days before the advisory, patching blinds your team, reboots processes, and seals attackers inside. Postern halts this by running automated pre-disclosure hunts before any patch can be released.',
      targetAsset: null,
      takeaway: 'Deterministic DuckDB telemetry + RFC 8785 Ed25519 digital proof packs.'
    },
    {
      title: 'Scenario S1: Active Exploitation Pre-Advisory',
      subtitle: 'Attacker breached VPN 5 days prior to advisory disclosure',
      badge: 'S1 • Compromised',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]',
      icon: ShieldAlert,
      description:
        'meridian-vpn-gw-01 suffered pre-authentication RCE on October 4, followed by a planted web shell (.sys_cache.php) and C2 beaconing. Postern locks the patch gate with "Contain first then patch", blocking standard deployment until remediation completes.',
      targetAsset: 'meridian-vpn-gw-01',
      takeaway: 'Prevents incident response team from accidentally overwriting live evidence.'
    },
    {
      title: 'Scenario S2: Clean Asset with Full Telemetry',
      subtitle: 'Verified clean across the complete 45-day lookback window',
      badge: 'S2 • Clean',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F]',
      icon: CheckCircle2,
      description:
        'harbor-vpn-gw-01 is running the vulnerable firmware, but zero forensic indicators were observed across its complete 45-day lookback. Postern gives a green "No evidence found" verdict, unlocking the patch gate for immediate release.',
      targetAsset: 'harbor-vpn-gw-01',
      takeaway: 'Confirms safe rapid patching when evidence proves absence of compromise.'
    },
    {
      title: 'Scenario S3: Benign Look-Alike (Noise Control)',
      subtitle: 'Maintenance scripts creating files must not trigger false alarms',
      badge: 'S3 • Noise Control',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:bg-[#1A1713] dark:text-[#FBBF24] dark:border-[#3B2D18]',
      icon: AlertTriangle,
      description:
        'lotus-app-server-01 executes automated maintenance cron jobs with similar file creation patterns. Postern’s behavioral hypotheses differentiate legitimate admin tools from attack techniques, keeping the false-positive rate at 0%.',
      targetAsset: 'lotus-app-server-01',
      takeaway: 'Avoids operational fatigue and false alarm gridlock during emergency triage.'
    },
    {
      title: 'Scenario S4: Retention Blind Spot (Coverage Honesty)',
      subtitle: 'Incomplete logs MUST force caution, never fake clean verdicts',
      badge: 'S4 • Blind Spot',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border-[#27272A]',
      icon: EyeOff,
      description:
        'meridian-web-portal-01 only possesses 7 days of logs out of the required 45-day lookback. Most security tools report "Clean" simply because they cannot see older logs. Postern explicitly reports "Cannot verify" and enforces assume-breach caution.',
      targetAsset: 'meridian-web-portal-01',
      takeaway: 'Coverage honesty: You cannot prove absence of compromise if you cannot see the attack window.'
    },
    {
      title: 'Scenario S5: Post-Patch Persistence Reopen',
      subtitle: 'Firmware upgraded, but planted web shell remains active',
      badge: 'S5 • Closure Check',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:bg-[#1A1520] dark:text-[#C084FC] dark:border-[#3B2D54]',
      icon: RefreshCw,
      description:
        'An admin patches meridian-vpn-gw-01 to version 9.2.4 and attempts to mark the ticket closed. Postern’s automated Post-Patch Recheck verifies whether sessions were killed and web shells removed. When residue is detected, the asset is automatically reopened.',
      targetAsset: 'meridian-vpn-gw-01',
      takeaway: 'Closes the enterprise loophole where patches are applied without root cause remediation.'
    }
  ]

  const step = tourSteps[currentStep]
  const Icon = step.icon

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInspectAsset = () => {
    if (step.targetAsset) {
      onSelectScenario(step.targetAsset)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-[#18181B]">
          <div
            className="h-full bg-blue-600 dark:bg-white transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#222225]">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${step.badgeColor}`}>
              {step.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-[#8E8E93]">
              {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-[#18181B] text-slate-800 dark:text-white border border-slate-200 dark:border-[#27272A]">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-[#8E8E93]">
                {step.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {step.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#18181B] border border-slate-200/80 dark:border-[#27272A]">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider block mb-1">
              Key Principle
            </span>
            <p className="text-xs font-medium text-slate-900 dark:text-white">
              {step.takeaway}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#222225] bg-slate-50/50 dark:bg-[#18181B]/50 flex items-center justify-between font-mono text-xs">
          <div>
            {step.targetAsset ? (
              <button
                onClick={handleInspectAsset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-white hover:underline cursor-pointer"
              >
                Inspect Asset Story ({step.targetAsset})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-slate-400 dark:text-[#8E8E93]">Interactive walkthrough</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-[#27272A] text-xs font-medium text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#222225] cursor-pointer"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-[#E4E4E7] text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              ) : (
                'Finish Tour'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidedTourModal
