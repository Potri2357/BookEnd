import React, { useState } from 'react'
import {
  ShieldCheck, X, Printer, CheckCircle2,
  AlertTriangle, KeyRound, Copy, Check, Lock,
  Shield, FileText, CheckCheck
} from 'lucide-react'
import { ProofPack } from '../types'
import { verifyProofPack } from '../api'

interface ProofPackModalProps {
  pack: ProofPack
  onClose: () => void
}

export const ProofPackModal: React.FC<ProofPackModalProps> = ({ pack, onClose }) => {
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    message: string
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleVerify = async (tamper: boolean = false) => {
    setIsVerifying(true)
    try {
      const payload = JSON.parse(JSON.stringify(pack))
      if (tamper) {
        payload.manifest.verdict_state = 'clean' // Forbidden altered state
      }
      const res = await verifyProofPack(payload)
      setVerificationResult({
        verified: res.is_valid,
        message: res.message
      })
    } catch (e: any) {
      setVerificationResult({
        verified: false,
        message: 'Network verification failed'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(pack, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121214] rounded-3xl max-w-4xl w-full p-7 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto font-sans border border-[#E1E9F2] dark:border-[#222225] text-[#111B36] dark:text-[#FFFFFF]">
        {/* Certificate Header Banner */}
        <div className="flex items-start justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3A2F] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#047857] dark:text-[#34D399]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#111B36] dark:text-white tracking-tight">
                  Cryptographic Proof Pack Certificate
                </h2>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] font-bold uppercase">
                  RFC 8785 Ed25519 Signed
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#8E8E93] font-mono mt-1">
                Certificate ID: <strong className="text-[#5E82A7] dark:text-white">{pack.manifest.pack_id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#E6EEF7] dark:bg-[#18181B] text-[#111B36] dark:text-white hover:bg-[#C1D0E2] dark:hover:bg-[#222225] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cryptographic Verification Alert */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono transition ${
              verificationResult.verified
                ? 'bg-[#D1FAE5] dark:bg-[#121915] border-[#A7F3D0] dark:border-[#1E3A2F] text-[#047857] dark:text-[#34D399]'
                : 'bg-[#FEE2E2] dark:bg-[#1A1314] border-[#FECACA] dark:border-[#3D1F23] text-[#DC2626] dark:text-[#F87171]'
            }`}
          >
            <div className="flex items-center gap-3">
              {verificationResult.verified ? (
                <CheckCircle2 className="w-5 h-5 text-[#047857] dark:text-[#34D399] shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#DC2626] dark:text-[#F87171] shrink-0" />
              )}
              <span className="font-semibold">{verificationResult.message}</span>
            </div>
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-white dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] dark:text-white">
              {verificationResult.verified ? 'SIGNATURE VALID (100% AUTHENTIC)' : 'TAMPERING DETECTED'}
            </span>
          </div>
        )}

        {/* Core Certificate Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] uppercase font-bold">Client Tenant:</span>
            <div className="font-bold text-[#111B36] dark:text-white capitalize mt-1 text-sm">{pack.manifest.tenant_id}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] uppercase font-bold">Focal Asset:</span>
            <div className="font-bold text-[#5E82A7] dark:text-[#E4E4E7] mt-1 text-sm">{pack.manifest.asset_id}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] uppercase font-bold">Forensic Verdict:</span>
            <div className="font-bold text-[#DC2626] dark:text-[#F87171] mt-1 text-sm">{pack.manifest.verdict_state}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] uppercase font-bold">Provability:</span>
            <div className="font-bold text-[#047857] dark:text-[#34D399] mt-1 text-sm">
              {Math.round(pack.manifest.coverage_score * 100)}% Retained
            </div>
          </div>
        </div>

        {/* Cryptographic Keys & Hash Tree */}
        <div className="p-5 rounded-2xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#111B36] dark:text-white font-bold border-b border-[#E1E9F2] dark:border-[#222225] pb-2.5">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#7194B7] dark:text-white" />
              <span>Ed25519 Asymmetric Signature &amp; Merkle Root Hashes:</span>
            </div>
            <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">Algorithm: Curve25519 / SHA-512</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[11px] font-bold">Digital Signature (Base64):</span>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#000000] border border-[#E1E9F2] dark:border-[#27272A] text-[11px] text-[#111B36] dark:text-[#E4E4E7] select-all break-all">
              {pack.signature_b64}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[11px] font-bold">Public Verification Key:</span>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#000000] border border-[#E1E9F2] dark:border-[#27272A] text-[11px] text-[#5E82A7] dark:text-[#A1A1AA] select-all break-all font-semibold">
              {pack.public_key_b64}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[11px] font-bold">Evidence Event Content Hashes ({pack.manifest.evidence_hashes.length}):</span>
            <div className="flex flex-wrap gap-1.5">
              {pack.manifest.evidence_hashes.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#000000] border border-[#E1E9F2] dark:border-[#27272A] text-[10px] text-[#64748B] dark:text-[#A1A1AA] font-mono">
                  {h.slice(0, 16)}...
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mandatory Limitations Disclaimer */}
        <div className="p-4 rounded-xl bg-[#FEF3C7] dark:bg-[#1A1713] border border-[#FDE68A] dark:border-[#3B2D18] text-xs text-[#B45309] dark:text-[#FBBF24] leading-relaxed font-sans">
          <strong>Mandatory DFIR Limitations Statement:</strong> {pack.manifest.limitations_statement}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E1E9F2] dark:border-[#222225] font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D63ED] hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-[#E4E4E7] font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Signature Authenticity'}</span>
            </button>

            <button
              onClick={() => handleVerify(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FEE2E2] dark:bg-[#1A1314] hover:bg-[#FEE2E2]/80 text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#3D1F23] transition cursor-pointer"
              title="Intentionally alter 1 byte in the manifest to demonstrate instant cryptographic detection"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#F87171]" />
              <span>Simulate Tamper Test</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6EEF7] dark:bg-[#18181B] hover:bg-[#C1D0E2] dark:hover:bg-[#222225] text-[#111B36] dark:text-[#E4E4E7] transition border border-[#C1D0E2] dark:border-[#27272A] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Canonical JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6EEF7] dark:bg-[#18181B] hover:bg-[#C1D0E2] dark:hover:bg-[#222225] text-[#111B36] dark:text-[#E4E4E7] transition border border-[#C1D0E2] dark:border-[#27272A] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProofPackModal
