import React, { useState, useEffect } from 'react'
import {
  ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, KeyRound,
  FileCheck2, Copy, Check, Terminal, ExternalLink, RefreshCw, UploadCloud
} from 'lucide-react'
import { ProofPack, PublishedKeyStore } from '../types'
import { verifyProofPack, fetchPublishedKeys, rotateNotaryKey } from '../api'

interface VerifyViewProps {
  onBackToConsole?: () => void
}

export const VerifyView: React.FC<VerifyViewProps> = ({ onBackToConsole }) => {
  const [inputJson, setInputJson] = useState('')
  const [verificationResult, setVerificationResult] = useState<{
    is_valid: boolean
    message: string
    details: any
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [publishedKeys, setPublishedKeys] = useState<PublishedKeyStore | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [rotationMsg, setRotationMsg] = useState<string | null>(null)

  useEffect(() => {
    loadKeys()
  }, [])

  const loadKeys = async () => {
    try {
      const keys = await fetchPublishedKeys()
      setPublishedKeys(keys)
    } catch (e) {
      console.warn('Failed to fetch published keys:', e)
    }
  }

  const handleVerify = async () => {
    if (!inputJson.trim()) return
    setIsVerifying(true)
    try {
      const parsed = JSON.parse(inputJson) as ProofPack
      const res = await verifyProofPack(parsed)
      setVerificationResult(res)
    } catch (e: any) {
      setVerificationResult({
        is_valid: false,
        message: `Validation Error: ${e.message || 'Malformed JSON or invalid Proof Pack structure'}`,
        details: { signature_valid: false, hashes_valid: false }
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const loadSampleValid = () => {
    const sample = {
      manifest: {
        pack_id: 'PROOF-MERIDIAN-ASSET-001',
        tenant_id: 'meridian-finance',
        asset_id: 'ASSET-MERIDIAN-001',
        advisory_id: 'SIM-2026-0001',
        generated_at: new Date().toISOString(),
        verdict_state: 'Likely compromised',
        coverage_score: 1.0,
        decision_outcome: 'Contain first then patch',
        post_patch_status: 'matched',
        spec_hashes: ['spec_hash_001'],
        evidence_hashes: ['ev_hash_001'],
        limitations_statement: 'Forensic evaluation reflecting data available at time of evaluation.',
        issuer: 'Postern Trust Service (Ed25519)'
      },
      signature_b64: 'faked_for_sample_valid',
      public_key_b64: publishedKeys?.keys[0]?.public_key_b64 || 'MCowBQYDK2VwAyEAx5s8aJ2vG4Q3Z...',
      evidence_items: [],
      verdict: {
        asset_id: 'ASSET-MERIDIAN-001',
        advisory_id: 'SIM-2026-0001',
        state: 'Likely compromised',
        confidence: 'high',
        reasons: [{ text: 'Planted web shell detected', evidence_ids: ['EV-01'] }],
        coverage_score: 1.0,
        coverage_report: { asset_id: 'ASSET-MERIDIAN-001', overall_coverage: 1.0, sources: [], adequate: true, blind_spots: [], recommendations: [] },
        evaluated_at: new Date().toISOString(),
        verdict_hash: 'verdict_hash_001'
      },
      decision: {
        asset_id: 'ASSET-MERIDIAN-001',
        advisory_id: 'SIM-2026-0001',
        outcome: 'Contain first then patch',
        gate_locked: true,
        required_roles: ['Incident_Lead', 'Security_Approver'],
        override_applied: false,
        status: 'pending',
        created_at: new Date().toISOString()
      },
      clock: {
        asset_id: 'ASSET-MERIDIAN-001',
        advisory_id: 'SIM-2026-0001',
        profile: 'CERT-In 12h',
        target_tier: 'emergency',
        start_time: new Date().toISOString(),
        deadline_time: new Date(Date.now() + 43200000).toISOString(),
        seconds_remaining: 43200,
        is_paused: false,
        is_breached: false
      },
      audit_events: []
    }
    setInputJson(JSON.stringify(sample, null, 2))
    setVerificationResult(null)
  }

  const loadSampleTampered = () => {
    const sample = {
      manifest: {
        pack_id: 'PROOF-TAMPERED-001',
        tenant_id: 'meridian-finance',
        asset_id: 'ASSET-MERIDIAN-001',
        advisory_id: 'SIM-2026-0001',
        generated_at: new Date().toISOString(),
        verdict_state: 'Clean (Forged by Adversary)',
        coverage_score: 1.0,
        decision_outcome: 'Patch now',
        post_patch_status: 'matched',
        spec_hashes: [],
        evidence_hashes: [],
        limitations_statement: 'Tampered proof bundle',
        issuer: 'Forged Identity'
      },
      signature_b64: 'INVALID_SIGNATURE_DATA_TAMPERED',
      public_key_b64: publishedKeys?.keys[0]?.public_key_b64 || 'MCowBQYDK2VwAyEAx5s8aJ2vG4Q3Z...',
      evidence_items: [],
      verdict: { state: 'Likely compromised' },
      decision: { outcome: 'Contain first then patch' },
      clock: {},
      audit_events: []
    }
    setInputJson(JSON.stringify(sample, null, 2))
    setVerificationResult(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInputJson(content)
      setVerificationResult(null)
    }
    reader.readAsText(file)
  }

  const handleRotateKey = async () => {
    setIsRotating(true)
    setRotationMsg(null)
    try {
      const res = await rotateNotaryKey()
      setRotationMsg(`Successfully rotated key: New Active ID is ${res.active_key_id}`)
      await loadKeys()
    } catch (e: any) {
      setRotationMsg(`Key rotation failed: ${e.message}`)
    } finally {
      setIsRotating(false)
    }
  }

  const handleCopyKey = () => {
    if (publishedKeys?.keys[0]?.public_key_b64) {
      navigator.clipboard.writeText(publishedKeys.keys[0].public_key_b64)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8 animate-in fade-in duration-200 font-sans text-slate-800 dark:text-[#FFFFFF]">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-[#34D399] border border-emerald-200 dark:border-[#1E3A2F]">
              Zero-Trust Verification
            </span>
            <span className="text-xs text-slate-400 dark:text-[#8E8E93] font-mono">RFC 8785 • Ed25519</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Public Proof Pack Verifier
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#8E8E93] max-w-2xl font-sans">
            Anyone can independently verify that a Postern remediation decision and evidence tree
            have not been altered since issuance. No proprietary server connection required.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-300 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#18181B] text-xs font-semibold text-slate-700 dark:text-[#E4E4E7] transition-colors flex items-center gap-2 shadow-xs">
            <UploadCloud className="w-4 h-4" />
            Upload Proof File
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={handleVerify}
            disabled={!inputJson.trim() || isVerifying}
            className="px-5 py-2 rounded-xl bg-[#1D63ED] hover:bg-blue-700 dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#E4E4E7] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Verify Proof Pack
          </button>
        </div>
      </div>

      {/* Main Grid: Input / Results vs Public Key Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: JSON input & verification output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1D63ED] dark:text-white" />
                Proof Pack JSON Payload
              </label>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400 dark:text-[#8E8E93]">Samples:</span>
                <button
                  onClick={loadSampleValid}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] hover:bg-slate-200 dark:hover:bg-[#222225] text-slate-700 dark:text-white font-medium text-[11px] cursor-pointer"
                >
                  Load Sample
                </button>
                <button
                  onClick={loadSampleTampered}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-[#1A1314] hover:bg-rose-100 text-rose-700 dark:text-[#F87171] border border-rose-200 dark:border-[#3D1F23] font-medium text-[11px] cursor-pointer"
                >
                  Load Tampered
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              placeholder="Paste Proof Pack JSON bundle here (manifest, signature_b64, public_key_b64, evidence_items, verdict, decision)..."
              className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-[#52525B]"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-[#8E8E93] font-mono">
              <span>Supports RFC 8785 Canonical JSON input</span>
              <span>{inputJson ? `${inputJson.length} characters` : 'Empty payload'}</span>
            </div>
          </div>

          {/* Verification Results Panel */}
          {verificationResult && (
            <div
              className={`p-6 rounded-3xl border shadow-md animate-in slide-in-from-top-2 duration-200 ${
                verificationResult.is_valid
                  ? 'bg-emerald-50/70 dark:bg-[#121915] border-emerald-200 dark:border-[#1E3A2F] text-emerald-900 dark:text-[#34D399]'
                  : 'bg-rose-50/70 dark:bg-[#1A1314] border-rose-200 dark:border-[#3D1F23] text-rose-900 dark:text-[#F87171]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl ${
                    verificationResult.is_valid
                      ? 'bg-emerald-500 dark:bg-[#1E3A2F] text-white dark:text-[#34D399] shadow-lg shadow-emerald-500/20'
                      : 'bg-rose-500 dark:bg-[#3D1F23] text-white dark:text-[#F87171] shadow-lg shadow-rose-500/20'
                  }`}
                >
                  {verificationResult.is_valid ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">
                      {verificationResult.is_valid
                        ? 'Cryptographic Signature Valid: Authentic & Untampered'
                        : 'Cryptographic Verification Failed: Tamper Detected'}
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border bg-white/50 dark:bg-[#18181B] dark:border-[#27272A] dark:text-white">
                      {verificationResult.is_valid ? 'Status: 100% Verified' : 'Status: REJECTED'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {verificationResult.message}
                  </p>

                  {verificationResult.details && (
                    <div className="mt-4 pt-3 border-t border-black/10 dark:border-[#27272A] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="space-y-0.5">
                        <span className="text-[10px] opacity-75 uppercase">Signature Check</span>
                        <p className="font-semibold">
                          {verificationResult.details.signature_valid ? '✅ Valid' : '❌ Invalid'}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] opacity-75 uppercase">Evidence Hashes</span>
                        <p className="font-semibold">
                          {verificationResult.details.evidence_hashes_valid ? '✅ Verified' : '❌ Mismatch'}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] opacity-75 uppercase">Signed Issuer</span>
                        <p className="font-semibold truncate">
                          {verificationResult.details.signed_by || 'Unknown'}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] opacity-75 uppercase">Verification Time</span>
                        <p className="font-semibold">
                          {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Public Key Published Registry & Rotation */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-500 dark:text-[#34D399]" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Published Notary Public Key
                </h3>
              </div>
              <button
                onClick={handleCopyKey}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                title="Copy public key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#8E8E93]">
              The public key used by the Postern Trust Service to sign all emitted proof packs.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#8E8E93]">Active Key ID</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-white">
                  {publishedKeys?.active_key_id || 'ed25519-primary'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-[#8E8E93]">Algorithm</span>
                <span className="font-mono text-slate-800 dark:text-white">Ed25519 (Pure RFC 8032)</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-[#8E8E93] uppercase font-semibold">Raw Base64 Key</span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#000000] text-[10px] font-mono break-all text-slate-600 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#27272A]">
                  {publishedKeys?.keys[0]?.public_key_b64 || 'Loading key...'}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-[#222225] flex items-center justify-between">
              <span className="text-[11px] text-slate-400 dark:text-[#8E8E93]">Admin Key Lifecycle</span>
              <button
                onClick={handleRotateKey}
                disabled={isRotating}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#27272A] text-xs font-semibold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-[#18181B] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                Rotate Notary Key
              </button>
            </div>

            {rotationMsg && (
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-[#18181B] text-[11px] text-blue-700 dark:text-white border border-blue-200 dark:border-[#27272A]">
                {rotationMsg}
              </div>
            )}
          </div>

          {/* Standalone CLI Instructions Card */}
          <div className="p-6 rounded-3xl bg-slate-900 dark:bg-[#121214] text-slate-100 border border-slate-800 dark:border-[#222225] shadow-sm space-y-3 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400 dark:text-white" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 dark:text-white">
                Offline Terminal Verification
              </h4>
            </div>
            <p className="text-xs text-slate-400 dark:text-[#8E8E93] leading-relaxed font-sans">
              Verify proof packs on completely air-gapped forensic workstations using the zero-dependency Python CLI:
            </p>
            <div className="p-3 rounded-xl bg-black/50 dark:bg-[#000000] font-mono text-xs text-emerald-400 dark:text-[#34D399] overflow-x-auto border border-transparent dark:border-[#27272A]">
              python verify_proofpack.py proof_pack.json
            </div>
            <div className="text-[11px] text-slate-500 dark:text-[#8E8E93]">
              Exit code 0 indicates authentic signed evidence. Exit code 2 indicates tampering.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyView
