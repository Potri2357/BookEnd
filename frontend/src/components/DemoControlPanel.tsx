import React, { useState } from 'react'
import { Eye, ShieldAlert, Sparkles, RefreshCw, KeyRound, CheckSquare } from 'lucide-react'

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
    { id: 'S1', name: 'S1: Compromised Pre-Advisory', assetId: 'meridian-vpn-gw-01', color: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10' },
    { id: 'S2', name: 'S2: Clean & Well Covered', assetId: 'harbor-vpn-gw-01', color: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10' },
    { id: 'S3', name: 'S3: Benign Look-Alike', assetId: 'lotus-app-server-01', color: 'border-amber-500/40 text-amber-300 hover:bg-amber-500/10' },
    { id: 'S4', name: 'S4: Blind Spot (Incomplete Logs)', assetId: 'meridian-web-portal-01', color: 'border-purple-500/40 text-purple-300 hover:bg-purple-500/10' },
    { id: 'S5', name: 'S5: Patch Then Persist', assetId: 'meridian-vpn-gw-01', color: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10' }
  ]

  return (
    <div className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-mono text-slate-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          DEMO QUICK-LOAD:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenarioAsset(sc.assetId)}
              className={`px-2.5 py-1 rounded border font-mono transition text-[11px] font-medium bg-slate-950/60 ${sc.color}`}
            >
              {sc.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Toggle Persistence (S5 Residue) */}
        <button
          onClick={onTogglePersistence}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition ${
            persistenceActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          S5 Residue Implant: {persistenceActive ? 'PLANTED (Active)' : 'CLEARED (Passes)'}
        </button>

        {/* Reveal Ground Truth */}
        <button
          onClick={() => setShowGroundTruth(!showGroundTruth)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition ${
            showGroundTruth
              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50'
              : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          {showGroundTruth ? 'Hide Ground Truth' : 'Reveal Ground Truth'}
        </button>
      </div>

      {showGroundTruth && (
        <div className="w-full mt-1.5 p-3 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-slate-300 text-xs font-mono">
          <div className="font-bold text-cyan-400 mb-1 flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> HIDDEN RANGE LITE GROUND TRUTH (EVALUATION MATRIX):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded bg-slate-900 border border-rose-500/20">
              <span className="font-bold text-rose-400">meridian-vpn-gw-01</span>: COMPROMISED
              <div className="text-slate-400">First hit: 2026-10-04 (14d ago). Planted web shell: /var/www/html/assets/.sys_cache.php</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-emerald-500/20">
              <span className="font-bold text-emerald-400">harbor-vpn-gw-01</span>: UNCOMPROMISED
              <div className="text-slate-400">Full 45-day log coverage. Zero exploit traffic. Expected: No evidence found.</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-amber-500/20">
              <span className="font-bold text-amber-400">lotus-app-server-01</span>: BENIGN NOISE
              <div className="text-slate-400">Ansible maintenance script creates temp files. Expected: NOT Likely Compromised.</div>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-purple-500/20">
              <span className="font-bold text-purple-400">meridian-web-portal-01</span>: BLIND SPOT
              <div className="text-slate-400">Endpoint logs cover only 7 of 45 days. Expected: Cannot verify (honesty test).</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
