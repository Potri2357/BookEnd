import React, { useState } from 'react'
import {
  Eye, ShieldAlert, Sparkles, KeyRound, Radio, CheckCircle,
  ChevronDown, ChevronUp, Zap, Brain, UserCheck, ShieldCheck
} from 'lucide-react'

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
      verdict: 'Likely Compromised',
      accent: 'border-rose-200 text-rose-700 hover:border-rose-400 bg-rose-50/70',
      dot: 'bg-rose-500'
    },
    {
      id: 'S2',
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      verdict: 'No Evidence Found',
      accent: 'border-emerald-200 text-emerald-800 hover:border-emerald-400 bg-emerald-50/70',
      dot: 'bg-emerald-500'
    },
    {
      id: 'S3',
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      verdict: 'Benign Noise',
      accent: 'border-amber-200 text-amber-800 hover:border-amber-400 bg-amber-50/70',
      dot: 'bg-amber-500'
    },
    {
      id: 'S4',
      code: 'S4',
      title: 'Blind Spot (Retention Gap)',
      assetId: 'meridian-web-portal-01',
      verdict: 'Cannot Verify',
      accent: 'border-purple-200 text-purple-800 hover:border-purple-400 bg-purple-50/70',
      dot: 'bg-purple-500'
    },
    {
      id: 'S5',
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Reopen Trigger',
      accent: 'border-teal-200 text-teal-800 hover:border-teal-400 bg-teal-50/70',
      dot: 'bg-teal-600'
    }
  ]

  return (
    <div className="bg-[#f0f7f6] border-b border-[#cde5e3] px-6 py-2.5 flex flex-col gap-2">
      {/* 4 Pillars Header Banner matching Presentation Slide */}
      <div className="hidden lg:grid grid-cols-4 gap-3 pb-2 border-b border-[#d8ecea] text-xs font-sans">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#d2e8e6] shadow-2xs">
          <div className="w-7 h-7 rounded-md bg-[#e6f4f3] flex items-center justify-center text-[#0d9488] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#143e4c] text-[11px] leading-tight">Real-time CVE Ingestion</div>
            <div className="text-[10px] text-[#5e828f] leading-tight">Advisories & IOC extraction</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#d2e8e6] shadow-2xs">
          <div className="w-7 h-7 rounded-md bg-[#e6f4f3] flex items-center justify-center text-[#0d9488] shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#143e4c] text-[11px] leading-tight">AI Evidence Analysis</div>
            <div className="text-[10px] text-[#5e828f] leading-tight">Hypothesis H1–H4 verification</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#d2e8e6] shadow-2xs">
          <div className="w-7 h-7 rounded-md bg-[#e6f4f3] flex items-center justify-center text-[#0d9488] shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#143e4c] text-[11px] leading-tight">Human Approval</div>
            <div className="text-[10px] text-[#5e828f] leading-tight">Dual-key override controls</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#d2e8e6] shadow-2xs">
          <div className="w-7 h-7 rounded-md bg-[#e6f4f3] flex items-center justify-center text-[#0d9488] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#143e4c] text-[11px] leading-tight">Verified Remediation</div>
            <div className="text-[10px] text-[#5e828f] leading-tight">Post-patch recheck verification</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Scenario Selectors */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[#143e4c] font-mono text-[10px] uppercase font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 text-[#0d9488] animate-pulse" />
            <span>Range Scenarios:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => onSelectScenarioAsset(sc.assetId)}
                className={`group flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition shadow-2xs ${sc.accent}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                <span className="font-bold">{sc.code}:</span>
                <span>{sc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Persistence Toggle (S5) */}
          <button
            onClick={onTogglePersistence}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[11px] font-mono font-semibold transition shadow-2xs ${
              persistenceActive
                ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                : 'bg-teal-50 text-teal-800 border-teal-300 hover:bg-teal-100'
            }`}
            title="Toggle whether malicious web shell survives firmware patching to test S5 closure reopen"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${persistenceActive ? 'text-rose-600' : 'text-teal-600'}`} />
            <span>S5 Residue Implant:</span>
            <span className="font-bold uppercase tracking-wider">
              {persistenceActive ? 'Active (Reopens Asset)' : 'Removed (Passes)'}
            </span>
          </button>

          {/* Reveal Ground Truth */}
          <button
            onClick={() => setShowGroundTruth(!showGroundTruth)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-mono transition shadow-2xs ${
              showGroundTruth
                ? 'bg-[#143e4c] text-white border-[#143e4c]'
                : 'bg-white text-[#1f4a58] border-[#cbe3e1] hover:bg-[#e4f1f0]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>Ground Truth</span>
            {showGroundTruth ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expandable Ground Truth Inspector */}
      {showGroundTruth && (
        <div className="mt-1 p-4 rounded-xl bg-white border border-[#bfe0dc] text-[#1b3d4a] text-xs font-mono shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#d8ecea]">
            <div className="font-bold text-[#143e4c] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#0d9488]" />
              <span>RANGE LITE EVALUATION GROUND TRUTH (HIDDEN EVALUATION BASELINE)</span>
            </div>
            <span className="text-[10px] text-[#4d7381]">90 Assets Deterministically Seeded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
              <div className="font-bold text-rose-800 flex items-center justify-between">
                <span>SCENARIO S1</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">BREACHED</span>
              </div>
              <div className="text-[#3b5d6b]">Asset: <strong className="text-[#143e4c]">meridian-vpn-gw-01</strong></div>
              <div className="text-[10px] text-[#557784]">Exploited 5 days before disclosure via /api/v1/auth/session. Reverse shell active.</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
              <div className="font-bold text-emerald-800 flex items-center justify-between">
                <span>SCENARIO S2</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">CLEAN</span>
              </div>
              <div className="text-[#3b5d6b]">Asset: <strong className="text-[#143e4c]">harbor-vpn-gw-01</strong></div>
              <div className="text-[10px] text-[#557784]">Clean 45-day history. Zero IOCs matched. Immediate patch gate cleared.</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
              <div className="font-bold text-amber-800 flex items-center justify-between">
                <span>SCENARIO S3</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">BENIGN</span>
              </div>
              <div className="text-[#3b5d6b]">Asset: <strong className="text-[#143e4c]">lotus-app-server-01</strong></div>
              <div className="text-[10px] text-[#557784]">Internal vulnerability scanner probe without exploit. Correctly distinguished from attack.</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
              <div className="font-bold text-purple-800 flex items-center justify-between">
                <span>SCENARIO S4</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">BLIND SPOT</span>
              </div>
              <div className="text-[#3b5d6b]">Asset: <strong className="text-[#143e4c]">meridian-web-portal-01</strong></div>
              <div className="text-[10px] text-[#557784]">Only 7 days of logs (15.6% coverage). System honestly flags Cannot Verify.</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
              <div className="font-bold text-teal-800 flex items-center justify-between">
                <span>SCENARIO S5</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">PERSISTENCE</span>
              </div>
              <div className="text-[#3b5d6b]">Asset: <strong className="text-[#143e4c]">meridian-vpn-gw-01</strong></div>
              <div className="text-[10px] text-[#557784]">Simulates patch applied while webshell remains. Post-patch recheck reopens asset.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
