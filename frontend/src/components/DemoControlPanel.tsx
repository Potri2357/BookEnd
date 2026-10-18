import React, { useState } from 'react'
import { Eye, ShieldAlert, Sparkles, KeyRound, Radio, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface DemoControlPanelProps {
  onSelectScenarioAsset: (assetId: string) => void
  onTogglePersistence: () => void
  persistenceActive: boolean
  onReset: () => void
  isResetting: boolean
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  onSelectScenarioAsset,
  onTogglePersistence,
  persistenceActive,
  onReset,
  isResetting
}) => {
  const [showGroundTruth, setShowGroundTruth] = useState(false)
  const [activeScenario, setActiveScenario] = useState<string>('S1')

  const scenarios = [
    {
      id: 'S1',
      code: 'S1',
      title: 'Compromised Pre-Advisory',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Likely Compromised',
      dot: 'bg-[#DC2626]'
    },
    {
      id: 'S2',
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      verdict: 'No Evidence Found',
      dot: 'bg-[#047857]'
    },
    {
      id: 'S3',
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      verdict: 'Benign Noise',
      dot: 'bg-[#D97706]'
    },
    {
      id: 'S4',
      code: 'S4',
      title: 'Retention Gap Blind Spot',
      assetId: 'meridian-web-portal-01',
      verdict: 'Cannot Verify',
      dot: 'bg-[#7194B7]'
    },
    {
      id: 'S5',
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Reopen Trigger',
      dot: 'bg-[#84A3C4]'
    }
  ]

  return (
    <div className="bg-white border-b border-[#E1E9F2] px-6 py-2 flex flex-col gap-2 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Scenario Selectors */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#64748B] font-sans text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-[#7194B7]" />
            <span>Range Scenario:</span>
          </div>

          <div className="inline-flex items-center p-0.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] gap-1 flex-wrap">
            {scenarios.map((sc) => {
              const isActive = activeScenario === sc.id
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    setActiveScenario(sc.id)
                    onSelectScenarioAsset(sc.assetId)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#111B36] font-bold border border-[#7194B7] shadow-2xs'
                      : 'text-[#64748B] hover:text-[#111B36] hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  <span className="font-mono font-bold text-[11px]">{sc.code}</span>
                  <span className="hidden md:inline">{sc.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Persistence Toggle (S5) */}
          <button
            onClick={onTogglePersistence}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-sans transition cursor-pointer shadow-2xs ${
              persistenceActive
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
            title="Toggle whether malicious web shell survives firmware patching to test S5 closure reopen"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${persistenceActive ? 'text-rose-600' : 'text-emerald-600'}`} />
            <span className="font-medium">S5 Implant:</span>
            <span className="font-bold font-mono text-[11px]">
              {persistenceActive ? 'ACTIVE (REOPENS)' : 'CLEARED (PASSES)'}
            </span>
          </button>

          {/* Reveal Ground Truth */}
          <button
            onClick={() => setShowGroundTruth(!showGroundTruth)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-sans transition cursor-pointer shadow-2xs ${
              showGroundTruth
                ? 'bg-[#E6EEF7] text-[#111B36] border-[#7194B7] font-semibold'
                : 'bg-[#F7FAFD] text-[#64748B] border-[#E1E9F2] hover:bg-[#E6EEF7] hover:text-[#111B36]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#7194B7]" />
            <span>Ground Truth</span>
            {showGroundTruth ? <ChevronUp className="w-3 h-3 text-[#64748B]" /> : <ChevronDown className="w-3 h-3 text-[#64748B]" />}
          </button>
        </div>
      </div>

      {/* Expandable Ground Truth Inspector */}
      {showGroundTruth && (
        <div className="mt-1 p-4 rounded-xl bg-[#F7FAFD] border border-[#C1D0E2] text-[#111B36] text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E1E9F2]">
            <div className="font-bold text-[#111B36] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#7194B7]" />
              <span>RANGE LITE EVALUATION GROUND TRUTH (BENCHMARK BASELINE)</span>
            </div>
            <span className="text-[10px] text-[#047857] font-semibold bg-[#D1FAE5] px-2 py-0.5 rounded border border-[#A7F3D0]">
              100% Recall · 0% FP Validated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-white border border-[#FECACA] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#DC2626]">meridian-vpn-gw-01</span>
                <span className="text-[9px] px-1 rounded bg-[#FEE2E2] text-[#DC2626] font-bold uppercase">S1 / S5</span>
              </div>
              <div className="text-[#111B36] font-bold">STATE: TRUE COMPROMISE</div>
              <p className="text-[#64748B] text-[10px] leading-relaxed font-sans">
                Pre-disclosure traversal on 2026-10-04 (-14d) followed by web shell drop in /assets/.sys_cache.php and periodic port 8443 beaconing.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#A7F3D0] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#047857]">harbor-vpn-gw-01</span>
                <span className="text-[9px] px-1 rounded bg-[#D1FAE5] text-[#047857] font-bold uppercase">S2</span>
              </div>
              <div className="text-[#111B36] font-bold">STATE: UNCOMPROMISED</div>
              <p className="text-[#64748B] text-[10px] leading-relaxed font-sans">
                Full 45-day log coverage across all 5 telemetry sources. 0 indicators or exploit patterns found. Patch safely.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#FDE68A] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#B45309]">lotus-app-server-01</span>
                <span className="text-[9px] px-1 rounded bg-[#FEF3C7] text-[#B45309] font-bold uppercase">S3</span>
              </div>
              <div className="text-[#111B36] font-bold">STATE: BENIGN LOOK-ALIKE</div>
              <p className="text-[#64748B] text-[10px] leading-relaxed font-sans">
                Ansible maintenance scripts creating temporary files and health checks. Tests false-positive rejection engine.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#C1D0E2] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5E82A7]">meridian-web-portal-01</span>
                <span className="text-[9px] px-1 rounded bg-[#E6EEF7] text-[#5E82A7] font-bold uppercase">S4</span>
              </div>
              <div className="text-[#111B36] font-bold">STATE: BLIND SPOT GAP</div>
              <p className="text-[#64748B] text-[10px] leading-relaxed font-sans">
                Retention gap: Only 7 days of endpoint logs retained out of required 45. Verdict strictly forced to 'Cannot verify'.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
