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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="soc-card-elevated rounded-3xl max-w-4xl w-full p-7 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto font-sans border border-white/[0.1]">
        {/* Certificate Header Banner */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Cryptographic Proof Pack Certificate
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  RFC 8785 Ed25519 Signed
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Certificate ID: <strong className="text-cyan-300">{pack.manifest.pack_id}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cryptographic Verification Alert */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono transition ${
              verificationResult.verified
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 glow-emerald'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200 glow-crimson'
            }`}
          >
            <div className="flex items-center gap-3">
              {verificationResult.verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{verificationResult.message}</span>
            </div>
            <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.08]">
              {verificationResult.verified ? 'SIGNATURE VALID (100% AUTHENTIC)' : 'TAMPERING DETECTED'}
            </span>
          </div>
        )}

        {/* Core Certificate Properties */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl soc-card border border-white/[0.06]">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Client Tenant:</span>
            <div className="font-bold text-slate-200 capitalize mt-1 text-sm">{pack.manifest.tenant_id}</div>
          </div>
          <div className="p-3.5 rounded-xl soc-card border border-white/[0.06]">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Focal Asset:</span>
            <div className="font-bold text-cyan-300 mt-1 text-sm">{pack.manifest.asset_id}</div>
          </div>
          <div className="p-3.5 rounded-xl soc-card border border-white/[0.06]">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Forensic Verdict:</span>
            <div className="font-bold text-rose-400 mt-1 text-sm">{pack.manifest.verdict_state}</div>
          </div>
          <div className="p-3.5 rounded-xl soc-card border border-white/[0.06]">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Provability:</span>
            <div className="font-bold text-emerald-400 mt-1 text-sm">
              {Math.round(pack.manifest.coverage_score * 100)}% Retained
            </div>
          </div>
        </div>

        {/* Cryptographic Keys & Hash Tree */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/[0.08] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              <span>Ed25519 Asymmetric Signature & Merkle Root Hashes:</span>
            </div>
            <span className="text-[10px] text-slate-500">Algorithm: Curve25519 / SHA-512</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[11px] font-bold">Digital Signature (Base64):</span>
            <div className="p-2.5 rounded-lg bg-[#080b16] border border-white/[0.08] text-[11px] text-slate-300 select-all break-all">
              {pack.signature_b64}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[11px] font-bold">Public Verification Key:</span>
            <div className="p-2.5 rounded-lg bg-[#080b16] border border-white/[0.08] text-[11px] text-cyan-300 select-all break-all">
              {pack.public_key_b64}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 text-[11px] font-bold">Evidence Event Content Hashes ({pack.manifest.evidence_hashes.length}):</span>
            <div className="flex flex-wrap gap-1.5">
              {pack.manifest.evidence_hashes.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-[#0c1020] border border-white/[0.08] text-[10px] text-slate-400 font-mono">
                  {h.slice(0, 16)}...
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mandatory Limitations Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/25 text-xs text-amber-200/90 leading-relaxed font-sans">
          <strong>Mandatory DFIR Limitations Statement:</strong> {pack.manifest.limitations_statement}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono transition shadow-lg shadow-cyan-600/20 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Signature Authenticity'}</span>
            </button>

            <button
              onClick={() => handleVerify(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition"
              title="Intentionally alter 1 byte in the manifest to demonstrate instant cryptographic detection"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Tamper Test</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-mono transition border border-white/[0.08]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Canonical JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-mono transition border border-white/[0.08]"
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
