import React, { useState } from 'react'
import {
  ShieldCheck, X, Download, Printer, CheckCircle2,
  AlertTriangle, KeyRound, Copy, Check, FileCode
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
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Cryptographic Proof Pack</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Ed25519 Signed
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{pack.manifest.pack_id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Status Alert */}
        {verificationResult && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs font-mono ${
              verificationResult.verified
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {verificationResult.verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span>{verificationResult.message}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {verificationResult.verified ? 'SIGNATURE VALID' : 'TAMPER DETECTED'}
            </span>
          </div>
        )}

        {/* Key Manifest Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">TENANT:</span>
            <div className="font-bold text-slate-200 capitalize mt-0.5">{pack.manifest.tenant_id}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">FOCAL ASSET:</span>
            <div className="font-bold text-cyan-300 mt-0.5">{pack.manifest.asset_id}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">VERDICT STATE:</span>
            <div className="font-bold text-slate-100 mt-0.5">{pack.manifest.verdict_state}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 text-[10px]">LOG COVERAGE:</span>
            <div className="font-bold text-emerald-400 mt-0.5">
              {Math.round(pack.manifest.coverage_score * 100)}% Verified
            </div>
          </div>
        </div>

        {/* Signature & Public Key Inspector */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-cyan-400 font-semibold border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Ed25519 Asymmetric Signature Details:
            </div>
            <span className="text-[10px] text-slate-400">RFC 8785 Canonical JSON Tree</span>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Digital Signature (Base64):</span>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 select-all break-all">
              {pack.signature_b64}
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Public Verification Key:</span>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 select-all break-all">
              {pack.public_key_b64}
            </div>
          </div>

          <div>
            <span className="text-slate-400 text-[11px]">Evidence Content Hashes ({pack.manifest.evidence_hashes.length}):</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {pack.manifest.evidence_hashes.map((h, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                  {h.slice(0, 16)}...
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mandatory Limitations Statement (PRD Section 3 & 16) */}
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed font-sans">
          <strong>Mandatory Limitations Statement:</strong> {pack.manifest.limitations_statement}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVerify(false)}
              disabled={isVerifying}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isVerifying ? 'Verifying...' : 'Verify Cryptographic Signature'}
            </button>

            <button
              onClick={() => handleVerify(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-mono transition"
              title="Tamper manifest bytes to demonstrate independent detection"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Tamper Test
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Canonical JSON'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Audit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
