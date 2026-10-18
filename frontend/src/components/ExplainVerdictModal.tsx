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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/30 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="glass-panel border border-white/80 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-left font-sans animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E1E9F2] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isComp
                ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                : isCannotVerify
                ? 'bg-[#E6EEF7] text-[#5E82A7] border-[#C1D0E2]'
                : 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]'
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
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Explainable Forensic Verdict
              </div>
              <h3 className="text-base font-bold text-[#111B36] font-mono">
                {item.host_name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111B36] hover:bg-[#F7FAFD] border border-transparent hover:border-[#E1E9F2] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verdict Breakdown Card */}
        <div className={`p-4 rounded-xl border space-y-2 ${
          isComp
            ? 'bg-[#FEE2E2]/40 border-[#FECACA]'
            : isCannotVerify
            ? 'bg-[#E6EEF7]/50 border-[#C1D0E2]'
            : 'bg-[#D1FAE5]/40 border-[#A7F3D0]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-[#64748B]">
              Classification Verdict
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              isComp
                ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                : isCannotVerify
                ? 'bg-[#E6EEF7] text-[#5E82A7] border border-[#C1D0E2]'
                : 'bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]'
            }`}>
              {item.verdict_state}
            </span>
          </div>

          <p className="text-xs text-[#111B36] leading-relaxed">
            {isComp
              ? 'Forensic lookback matched active exploitation artifacts (e.g. web shell drop, reverse shell spawning, or C2 beaconing) prior to advisory announcement. Asset must be isolated prior to firmware flashing.'
              : isCannotVerify
              ? 'Log retention is under the 85% provability threshold. One or more mandatory telemetry sources have retention gaps, meaning benign status cannot be cryptographically proven.'
              : 'Complete 45-day historical telemetry scanned across web proxy, syslog, and EDR sources. Zero known CVE-2026-0921 exploit signatures or anomalous child processes detected.'}
          </p>
        </div>

        {/* Metrics Grid: Confidence vs Retention Probability */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-1">
            <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Compromise Confidence
            </div>
            <div className="text-lg font-bold text-[#111B36] font-mono">
              {isComp ? '96.4%' : isCannotVerify ? 'Uncertain' : '99.8% (Clean)'}
            </div>
            <p className="text-[11px] text-[#64748B]">
              {isComp ? 'EDR behavioral match' : isCannotVerify ? 'Gaps in telemetry stream' : 'Zero matched anomalies'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-1">
            <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Telemetry Provability
            </div>
            <div className="text-lg font-bold text-[#111B36] font-mono">
              {Math.round(item.coverage_score * 100)}%
            </div>
            <p className="text-[11px] text-[#64748B]">
              {item.coverage_score >= 0.85 ? 'Meets &gt;= 85% audit standard' : 'Below 85% audit requirement'}
            </p>
          </div>
        </div>

        {/* Gate Policy Impact */}
        <div className="p-3.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] space-y-1.5 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-[#64748B] font-mono text-[10px] uppercase tracking-wider">Patch Gate Policy Action</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              item.gate_locked ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#D1FAE5] text-[#047857]'
            }`}>
              {item.gate_outcome}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            {item.gate_locked
              ? 'Patching this asset without hygiene steps will fail compliance audit packs. Memory snapshot and web shell containment must be signed before gate release.'
              : 'Asset has verified zero pre-advisory intrusions and complete forensic audit history. Safe for automated or scheduled patch application.'}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E1E9F2]">
          <span className="text-[11px] text-[#64748B] font-mono">
            Tenant: <strong className="text-[#111B36] capitalize">{item.tenant_id.replace('-', ' ')}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="chip-btn chip-btn-secondary px-4 py-1.5"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onInspectStory(item.host_name)
              }}
              className="chip-btn chip-btn-primary px-4 py-1.5"
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
