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

  const scenarios = [
    {
      id: 'S1',
      code: 'S1',
      title: 'Compromised Pre-Advisory',
      assetId: 'meridian-vpn-gw-01',
      target: 'meridian-vpn-gw-01',
      verdict: 'Likely Compromised',
      accent: 'border-rose-500/30 text-rose-300 hover:border-rose-500 bg-rose-500/[0.04]',
      dot: 'bg-rose-500 shadow-rose-500/50'
    },
    {
      id: 'S2',
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      target: 'harbor-vpn-gw-01',
      verdict: 'No Evidence Found',
      accent: 'border-emerald-500/30 text-emerald-300 hover:border-emerald-500 bg-emerald-500/[0.04]',
      dot: 'bg-emerald-500 shadow-emerald-500/50'
    },
    {
      id: 'S3',
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      target: 'lotus-app-server-01',
      verdict: 'Benign Noise',
      accent: 'border-amber-500/30 text-amber-300 hover:border-amber-500 bg-amber-500/[0.04]',
      dot: 'bg-amber-500 shadow-amber-500/50'
    },
    {
      id: 'S4',
      code: 'S4',
      title: 'Blind Spot (Retention Gap)',
      assetId: 'meridian-web-portal-01',
      target: 'meridian-web-portal-01',
      verdict: 'Cannot Verify',
      accent: 'border-purple-500/30 text-purple-300 hover:border-purple-500 bg-purple-500/[0.04]',
      dot: 'bg-purple-500 shadow-purple-500/50'
    },
    {
      id: 'S5',
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      target: 'meridian-vpn-gw-01',
      verdict: 'Reopen Trigger',
      accent: 'border-cyan-500/30 text-cyan-300 hover:border-cyan-500 bg-cyan-500/[0.04]',
      dot: 'bg-cyan-500 shadow-cyan-500/50'
    }
  ]

  return (
    <div className="bg-[#090b14] border-b border-white/[0.06] px-6 py-2 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Scenario Selectors */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Range Scenarios:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectScenarioAsset(sc.assetId)}
                className={`group flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition soc-card-interactive ${sc.accent}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                <span className="font-bold text-slate-200">{sc.code}:</span>
                <span className="text-slate-300">{sc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Persistence Toggle (S5) */}
          <button
            onClick={onTogglePersistence}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[11px] font-mono font-semibold transition ${
              persistenceActive
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/40 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
            }`}
            title="Toggle whether malicious web shell survives firmware patching to test S5 closure reopen"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${persistenceActive ? 'text-rose-400' : 'text-emerald-400'}`} />
            <span>S5 Residue Implant:</span>
            <span className="font-bold uppercase tracking-wider">
              {persistenceActive ? 'Active (Reopens Asset)' : 'Removed (Passes)'}
            </span>
          </button>

          {/* Reveal Ground Truth */}
          <button
            onClick={() => setShowGroundTruth(!showGroundTruth)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-mono transition ${
              showGroundTruth
                ? 'bg-cyan-500/15 text-cyan-200 border-cyan-500/50'
                : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ground Truth</span>
            {showGroundTruth ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Expandable Ground Truth Inspector */}
      {showGroundTruth && (
        <div className="mt-1 p-4 rounded-xl soc-card-elevated border border-cyan-500/25 text-slate-300 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08]">
            <div className="font-bold text-cyan-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>RANGE LITE EVALUATION GROUND TRUTH (HIDDEN EVALUATION BASELINE)</span>
            </div>
            <span className="text-[10px] text-slate-400">Validated by Evaluation Harness (100% Recall · 0% FP)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 rounded-lg bg-black/40 border border-rose-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400">meridian-vpn-gw-01</span>
                <span className="text-[9px] px-1 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">S1 / S5</span>
              </div>
              <div className="text-slate-200 font-bold">STATE: TRUE COMPROMISE</div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Pre-disclosure traversal on 2026-10-04 (-14d) followed by web shell drop in /assets/.sys_cache.php and periodic port 8443 beaconing.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">harbor-vpn-gw-01</span>
                <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">S2</span>
              </div>
              <div className="text-slate-200 font-bold">STATE: UNCOMPROMISED</div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Full 45-day log coverage across all 5 telemetry sources. 0 indicators or exploit patterns found. Patch safely.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400">lotus-app-server-01</span>
                <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">S3</span>
              </div>
              <div className="text-slate-200 font-bold">STATE: BENIGN LOOK-ALIKE</div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Ansible maintenance scripts creating temporary files and health checks. Tests false-positive rejection engine.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400">meridian-web-portal-01</span>
                <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">S4</span>
              </div>
              <div className="text-slate-200 font-bold">STATE: BLIND SPOT GAP</div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Retention gap: Only 7 days of endpoint logs retained out of required 45. Verdict strictly forced to 'Cannot verify'.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
