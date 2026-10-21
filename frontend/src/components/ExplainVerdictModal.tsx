import React from 'react'
import {
  ShieldAlert, ShieldCheck, ShieldX, AlertTriangle,
  X, CheckCircle2, Terminal, ExternalLink, ArrowRight, FileCheck
} from 'lucide-react'
import { QueueItem } from '../types'

interface ExplainVerdictModalProps {
  item: QueueItem
  onClose: () => void
  onInspectStory: (hostName: string) => void
}

export const ExplainVerdictModal: React.FC<ExplainVerdictModalProps> = ({
  item,
  onClose,
  onInspectStory
}) => {
  const isComp = item.verdict_state === 'Likely compromised'
  const isCannotVerify = item.verdict_state === 'Cannot verify'
  const isSafe = item.verdict_state === 'No evidence found'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-150 text-[#111B36] dark:text-[#FFFFFF]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isComp
                ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA] dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]'
                : isCannotVerify
                ? 'bg-[#E6EEF7] text-[#5E82A7] border-[#C1D0E2] dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border-[#27272A]'
                : 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0] dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F]'
            }`}>
              {isComp ? (
                <ShieldAlert className="w-5 h-5" />
              ) : isCannotVerify ? (
                <ShieldX className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E8E93]">
                Explainable Forensic Verdict
              </div>
              <h3 className="text-base font-bold text-[#111B36] dark:text-white font-mono">
                {item.host_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] dark:hover:text-white hover:bg-[#F7FAFD] dark:hover:bg-[#18181B] border border-transparent hover:border-[#E1E9F2] dark:hover:border-[#27272A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verdict Breakdown Card */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isComp
            ? 'bg-[#FEE2E2]/40 border-[#FECACA] dark:bg-[#1A1314] dark:border-[#3D1F23]'
            : isCannotVerify
            ? 'bg-[#E6EEF7]/50 border-[#C1D0E2] dark:bg-[#18181B] dark:border-[#27272A]'
            : 'bg-[#D1FAE5]/40 border-[#A7F3D0] dark:bg-[#121915] dark:border-[#1E3A2F]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#64748B] dark:text-[#8E8E93]">
              Classification Verdict
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              isComp
                ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]'
                : isCannotVerify
                ? 'bg-[#E6EEF7] text-[#5E82A7] border border-[#C1D0E2] dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border-[#27272A]'
                : 'bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F]'
            }`}>
              {item.verdict_state}
            </span>
          </div>

          <p className="text-xs text-[#111B36] dark:text-slate-200 leading-relaxed">
            {isComp
              ? 'Forensic lookback matched active exploitation artifacts (e.g. web shell drop, reverse shell spawning, or C2 beaconing) prior to advisory announcement. Asset must be isolated prior to firmware flashing.'
              : isCannotVerify
              ? 'Log retention is under the 85% provability threshold. One or more mandatory telemetry sources have retention gaps, meaning benign status cannot be cryptographically proven.'
              : 'Complete 45-day historical telemetry scanned across web proxy, syslog, and EDR sources. Zero known CVE-2026-0921 exploit signatures or anomalous child processes detected.'}
          </p>
        </div>

        {/* Metrics Grid: Confidence vs Retention Probability */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
            <div className="text-[10px] font-bold text-[#64748B] dark:text-[#8E8E93] uppercase tracking-wider">
              Compromise Confidence
            </div>
            <div className="text-lg font-bold text-[#111B36] dark:text-white">
              {isComp ? '96.4%' : isCannotVerify ? 'Uncertain' : '99.8% (Clean)'}
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans">
              {isComp ? 'EDR behavioral match' : isCannotVerify ? 'Gaps in telemetry stream' : 'Zero matched anomalies'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
            <div className="text-[10px] font-bold text-[#64748B] dark:text-[#8E8E93] uppercase tracking-wider">
              Telemetry Provability
            </div>
            <div className="text-lg font-bold text-[#111B36] dark:text-white">
              {Math.round(item.coverage_score * 100)}%
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans">
              {item.coverage_score >= 0.85 ? 'Meets >= 85% audit standard' : 'Below 85% audit requirement'}
            </p>
          </div>
        </div>

        {/* Gate Policy Impact */}
        <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-[#64748B] dark:text-[#8E8E93] font-mono text-[10px] uppercase tracking-wider">Patch Gate Policy Action</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              item.gate_locked ? 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#1A1314] dark:text-[#F87171]' : 'bg-[#D1FAE5] text-[#047857] dark:bg-[#121915] dark:text-[#34D399]'
            }`}>
              {item.gate_outcome}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#8E8E93] leading-relaxed">
            {item.gate_locked
              ? 'Patching this asset without hygiene steps will fail compliance audit packs. Memory snapshot and web shell containment must be signed before gate release.'
              : 'Asset has verified zero pre-advisory intrusions and complete forensic audit history. Safe for automated or scheduled patch application.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E1E9F2] dark:border-[#222225] font-mono text-xs">
          <span className="text-[11px] text-[#64748B] dark:text-[#8E8E93]">
            Tenant: <strong className="text-[#111B36] dark:text-white capitalize">{item.tenant_id.replace('-', ' ')}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-[#27272A] bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] hover:bg-slate-200 dark:hover:bg-[#222225] cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onInspectStory(item.host_name)
              }}
              className="px-4 py-1.5 rounded-xl bg-[#1D63ED] hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-[#E4E4E7] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Inspect Raw Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplainVerdictModal
