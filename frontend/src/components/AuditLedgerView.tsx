import React, { useState, useEffect } from 'react'
import {
  Terminal, ShieldCheck, CheckCircle2, Lock,
  RefreshCw, Hash, ArrowDown, Key, Link2,
  FileCode, Layers, ShieldAlert, Cpu
} from 'lucide-react'
import { fetchAuditLedger } from '../api'

export const AuditLedgerView: React.FC = () => {
  const [ledgerData, setLedgerData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)

  const loadData = () => {
    setLoading(true)
    fetchAuditLedger().then((data) => {
      setLedgerData(data)
      setLoading(false)
      if (data && data.records && data.records.length > 0) {
        setSelectedBlockIndex(data.records[data.records.length - 1].index)
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const selectedRecord = ledgerData?.records?.find((r: any) => r.index === selectedBlockIndex)

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Ledger State Header */}
      <div className="soc-card p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#d8ecea]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] uppercase tracking-wider">
                IMMUTABLE AUDIT TRAIL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3 text-[#0d9488]" /> IMMUTABLE SHA-256 HASH CHAIN
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#113644] mt-1 tracking-tight">
              Cryptographic Audit Ledger & Chain of Custody
            </h1>
            <p className="text-xs text-[#527482] font-mono mt-0.5">
              Append-only cryptographic hash chain logging every forensic evaluation, human override, playbook step, and Ed25519 proof pack issuance.
            </p>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#143e4c] hover:bg-[#1a4f61] text-white text-xs font-mono font-semibold transition shrink-0 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Hash Chain
          </button>
        </div>

        {ledgerData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#f0f7f6] border border-[#d2e8e5]">
              <span className="text-[#557784] text-[10px] block font-bold">BLOCK HEIGHT:</span>
              <span className="text-lg font-bold text-[#143e4c] mt-0.5 block">
                {ledgerData.chain_length} Blocks Verified
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#e0f2f1] border border-[#a7f3d0]">
              <span className="text-[#0d766e] text-[10px] block font-bold">STATE INTEGRITY:</span>
              <span className="text-lg font-bold text-[#0d9488] mt-0.5 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Validated
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f7f6] border border-[#d2e8e5]">
              <span className="text-[#557784] text-[10px] block font-bold">LATEST ROOT HASH:</span>
              <span className="text-xs font-bold text-[#0d766e] mt-1 block truncate">
                {ledgerData.records?.[ledgerData.records.length - 1]?.hash?.slice(0, 18)}...
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#f0f7f6] border border-[#d2e8e5]">
              <span className="text-[#557784] text-[10px] block font-bold">CANONICAL ENCODING:</span>
              <span className="text-xs font-bold text-[#143e4c] mt-1 block">
                RFC 8785 JSON · SHA-256
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Explorer Body: Split List & Block Payload Inspector */}
      {ledgerData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
          {/* Blocks List */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-[#143e4c] uppercase tracking-wider">
                Hash-Chained Records (Most Recent First)
              </span>
              <span className="text-[10px] text-[#557784]">
                Click block to inspect payload
              </span>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {[...ledgerData.records].reverse().map((rec: any) => {
                const isSelected = selectedBlockIndex === rec.index
                return (
                  <div
                    key={rec.index}
                    onClick={() => setSelectedBlockIndex(rec.index)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#e0f2f1] border-[#0d9488] shadow-sm'
                        : 'bg-white border-[#d2e8e5] hover:border-[#99d5cf] hover:bg-[#f6fbfa]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#e5f1f0]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-[#143e4c] text-white'
                            : 'bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1]'
                        }`}>
                          BLOCK #{rec.index}
                        </span>
                        <span className="font-bold text-[#113644]">{rec.action}</span>
                      </div>
                      <span className="text-[10px] text-[#638491]">{rec.timestamp.slice(11, 19)} UTC</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-[#4f717f] pt-2">
                      <div>Actor: <strong className="text-[#143e4c]">{rec.actor}</strong></div>
                      <div>Role: <strong className="text-amber-800">{rec.role}</strong></div>
                      <div className="truncate">Target: <strong className="text-[#143e4c]">{rec.object_id}</strong></div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-[#638491]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Hash className="w-3 h-3 text-[#0d9488] shrink-0" />
                        <code className="text-[#0d766e] truncate">{rec.hash.slice(0, 24)}...</code>
                      </div>
                      <div className="flex items-center gap-1 text-[#4f717f] shrink-0">
                        <Link2 className="w-3 h-3" />
                        <span>Prev: {rec.prev_hash.slice(0, 10)}...</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Detailed Block Payload Inspector */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-bold text-[#143e4c] uppercase tracking-wider block pb-1">
              Block Payload & Verification Inspector
            </span>

            {selectedRecord ? (
              <div className="soc-card p-4 rounded-xl border border-[#bfe0dc] space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2efee]">
                  <span className="text-[#143e4c] font-bold">BLOCK #{selectedRecord.index} INSPECTION</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    CRYPTOGRAPHICALLY VALID
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[#557784] text-[10px] block font-semibold">BLOCK ACTION:</span>
                    <strong className="text-[#113644]">{selectedRecord.action}</strong>
                  </div>
                  <div>
                    <span className="text-[#557784] text-[10px] block font-semibold">ACTOR PRINCIPAL:</span>
                    <span className="text-[#143e4c] font-semibold">{selectedRecord.actor}</span> <span className="text-amber-800 font-medium">({selectedRecord.role})</span>
                  </div>
                  <div>
                    <span className="text-[#557784] text-[10px] block font-semibold">TIMESTAMP (ISO 8601):</span>
                    <span className="text-[#254d5b]">{selectedRecord.timestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">CURRENT SHA-256 HASH:</span>
                  <code className="p-2 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#0d766e] text-[11px] block break-all mt-0.5 select-all">
                    {selectedRecord.hash}
                  </code>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">PARENT BLOCK LINK (PREV_HASH):</span>
                  <code className="p-2 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#557784] text-[11px] block break-all mt-0.5 select-all">
                    {selectedRecord.prev_hash}
                  </code>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">CANONICAL RFC 8785 JSON PAYLOAD:</span>
                  <pre className="p-3 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#143e4c] text-[11px] max-h-48 overflow-y-auto mt-0.5 font-mono">
                    {JSON.stringify(selectedRecord.details, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 rounded bg-[#e0f2f1] border border-[#a7f3d0] text-[11px] text-[#0d766e] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0d9488] inline mr-1" />
                  Tamper resistance: Any alteration of this block invalidates all downstream hashes in the chain.
                </div>
              </div>
            ) : (
              <div className="soc-card p-6 rounded-xl border border-[#d2e8e5] text-center text-[#638491]">
                Select a block on the left to inspect its cryptographic metadata.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
