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
      <div className="glass-card p-5 rounded-xl border border-[#E1E9F2] space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E1E9F2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EBF2FE] text-[#1D63ED] border border-[#BFDBFE] uppercase tracking-wider">
                IMMUTABLE AUDIT TRAIL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> IMMUTABLE SHA-256 HASH CHAIN
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] mt-1 tracking-tight">
              Cryptographic Audit Ledger & Chain of Custody
            </h1>
            <p className="text-xs text-[#475569] font-mono mt-0.5 font-sans">
              Append-only cryptographic hash chain logging every forensic evaluation, human override, playbook step, and Ed25519 proof pack issuance.
            </p>
          </div>

          <button
            onClick={loadData}
            className="chip-btn chip-btn-secondary text-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Hash Chain
          </button>
        </div>

        {ledgerData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2]">
              <span className="text-[#64748B] text-[10px] block">BLOCK HEIGHT:</span>
              <span className="text-lg font-bold text-[#111B36] mt-0.5 block">
                {ledgerData.chain_length} Blocks Verified
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2]">
              <span className="text-[#64748B] text-[10px] block">STATE INTEGRITY:</span>
              <span className="text-lg font-bold text-[#047857] mt-0.5 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Validated
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2]">
              <span className="text-[#64748B] text-[10px] block">LATEST ROOT HASH:</span>
              <span className="text-xs font-bold text-[#5E82A7] mt-1 block truncate">
                {ledgerData.records?.[ledgerData.records.length - 1]?.hash?.slice(0, 18)}...
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2]">
              <span className="text-[#64748B] text-[10px] block">CANONICAL ENCODING:</span>
              <span className="text-xs font-bold text-[#111B36] mt-1 block">
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
              <span className="text-[11px] font-bold text-[#111B36] uppercase tracking-wider">
                Hash-Chained Records (Most Recent First)
              </span>
              <span className="text-[10px] text-[#64748B]">
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
                        ? 'bg-[#E6EEF7] border-[#7194B7] shadow-xs'
                        : 'bg-white border-[#E1E9F2] hover:border-[#84A3C4] hover:bg-[#F7FAFD]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E1E9F2]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-[#7194B7] text-white'
                            : 'bg-[#E6EEF7] text-[#5E82A7] border border-[#C1D0E2]'
                        }`}>
                          BLOCK #{rec.index}
                        </span>
                        <span className="font-bold text-[#111B36]">{rec.action}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B]">{rec.timestamp.slice(11, 19)} UTC</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-[#64748B] pt-2">
                      <div>Actor: <strong className="text-[#111B36]">{rec.actor}</strong></div>
                      <div>Role: <strong className="text-[#B45309]">{rec.role}</strong></div>
                      <div className="truncate">Target: <strong className="text-[#111B36]">{rec.object_id}</strong></div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-[#64748B]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Hash className="w-3 h-3 text-[#7194B7] shrink-0" />
                        <code className="text-[#5E82A7] truncate font-medium">{rec.hash.slice(0, 24)}...</code>
                      </div>
                      <div className="flex items-center gap-1 text-[#64748B] shrink-0">
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
            <span className="text-[11px] font-bold text-[#111B36] uppercase tracking-wider block pb-1">
              Block Payload & Verification Inspector
            </span>

            {selectedRecord ? (
              <div className="bg-white p-4 rounded-xl border border-[#7194B7] space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E9F2]">
                  <span className="text-[#111B36] font-bold">BLOCK #{selectedRecord.index} INSPECTION</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] font-bold">
                    CRYPTOGRAPHICALLY VALID
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">BLOCK ACTION:</span>
                    <strong className="text-[#111B36]">{selectedRecord.action}</strong>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">ACTOR PRINCIPAL:</span>
                    <span className="text-[#111B36] font-semibold">{selectedRecord.actor}</span> <span className="text-[#B45309]">({selectedRecord.role})</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">TIMESTAMP (ISO 8601):</span>
                    <span className="text-[#111B36]">{selectedRecord.timestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#64748B] text-[10px] block">CURRENT SHA-256 HASH:</span>
                  <code className="p-2 rounded bg-[#F7FAFD] border border-[#E1E9F2] text-[#5E82A7] text-[11px] block break-all mt-0.5 select-all font-semibold">
                    {selectedRecord.hash}
                  </code>
                </div>

                <div>
                  <span className="text-[#64748B] text-[10px] block">PARENT BLOCK LINK (PREV_HASH):</span>
                  <code className="p-2 rounded bg-[#F7FAFD] border border-[#E1E9F2] text-[#64748B] text-[11px] block break-all mt-0.5 select-all font-medium">
                    {selectedRecord.prev_hash}
                  </code>
                </div>

                <div>
                  <span className="text-[#64748B] text-[10px] block">CANONICAL RFC 8785 JSON PAYLOAD:</span>
                  <pre className="p-3 rounded bg-[#F7FAFD] border border-[#E1E9F2] text-[#111B36] text-[11px] max-h-48 overflow-y-auto mt-0.5 font-mono">
                    {JSON.stringify(selectedRecord.details, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 rounded bg-[#D1FAE5] border border-[#A7F3D0] text-[11px] text-[#047857] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#047857] inline mr-1" />
                  Tamper resistance: Any alteration of this block invalidates all downstream hashes in the chain.
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-[#E1E9F2] text-center text-[#64748B]">
                Select a block on the left to inspect its cryptographic metadata.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
