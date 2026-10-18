import React from 'react'
import {
  CheckCheck, ShieldCheck, ShieldAlert, AlertTriangle,
  X, Check, Lock, ShieldX, Info
} from 'lucide-react'
import { QueueItem } from '../types'

interface BulkApproveSafetyModalProps {
  queue: QueueItem[]
  onConfirm: () => void
  onClose: () => void
  isSubmitting: boolean
}

export const BulkApproveSafetyModal: React.FC<BulkApproveSafetyModalProps> = ({
  queue,
  onConfirm,
  onClose,
  isSubmitting
}) => {
  // Qualifying clean assets: No evidence found, gate unlocked, and not yet approved
  const eligibleAssets = queue.filter(
    (i) => i.verdict_state === 'No evidence found' && !i.gate_locked && !i.is_approved
  )

  // Disqualified / blocked assets: Compromised, suspicious, retention gaps, or gate locked
  const blockedAssets = queue.filter(
    (i) => (i.verdict_state !== 'No evidence found' || i.gate_locked) && !i.is_approved
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/30 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="glass-panel border border-white/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-left font-sans animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E1E9F2] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Cryptographic Patch Gate Safety Guardrail
              </div>
              <h3 className="text-base font-bold text-[#111B36]">
                Confirm Bulk Patch Approval ({eligibleAssets.length} Assets)
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

        {/* Safety Policy Notice */}
        <div className="p-3.5 rounded-xl bg-[#E6EEF7]/50 border border-[#C1D0E2] text-xs text-[#111B36] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#5E82A7] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Policy-Enforced Safety Guarantee:
            </p>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Only assets with verified 45-day lookback coverage (&gt;=85%) and zero compromise indicators are eligible. Any asset with active beacons, web shells, or retention gaps is strictly barred from bulk approval.
            </p>
          </div>
        </div>

        {/* Eligible Assets Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#111B36]">
            <span className="flex items-center gap-1.5 text-[#047857]">
              <ShieldCheck className="w-4 h-4" />
              Eligible Assets Verified Safe ({eligibleAssets.length})
            </span>
            <span className="text-[10px] text-[#64748B]">Gate: Immediate Release</span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2]">
            {eligibleAssets.length === 0 ? (
              <p className="text-xs text-[#64748B] p-3 text-center">Zero assets eligible for bulk approval.</p>
            ) : (
              eligibleAssets.map((asset) => (
                <div
                  key={asset.asset_id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E1E9F2] text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    <span className="font-bold text-[#111B36]">{asset.host_name}</span>
                    <span className="text-[10px] text-[#64748B]">({asset.asset_id})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-[#64748B] capitalize">{asset.tenant_id.replace('-', ' ')}</span>
                    <span className="px-2 py-0.5 rounded bg-[#D1FAE5] text-[#047857] font-bold text-[10px]">
                      {Math.round(asset.coverage_score * 100)}% Retained
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blocked / Protected Assets Indicator */}
        {blockedAssets.length > 0 && (
          <div className="p-3 rounded-xl bg-[#FEE2E2]/30 border border-[#FECACA] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#DC2626]">
              <Lock className="w-4 h-4" />
              <span className="font-bold">
                {blockedAssets.length} Assets Protected (Excluded from Bulk Approval)
              </span>
            </div>
            <span className="text-[10px] text-[#64748B]">
              Compromised or Gapped Assets Kept Gated
            </span>
          </div>
        )}

        {/* Audit Commitment */}
        <div className="text-[11px] text-[#64748B] font-mono border-t border-[#E1E9F2] pt-3 flex items-center justify-between">
          <span>Signed with: <strong className="text-[#111B36]">Ed25519 Lead Approver Key</strong></span>
          <span>Ledger: <strong className="text-[#111B36]">Append Block to Hash Chain</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="chip-btn chip-btn-secondary px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={eligibleAssets.length === 0 || isSubmitting}
            className="chip-btn chip-btn-primary px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Signing Approval...' : `Confirm & Release ${eligibleAssets.length} Assets`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
