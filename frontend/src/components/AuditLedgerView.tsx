import React, { useState, useEffect } from 'react'
import {
  Terminal, ShieldCheck, CheckCircle2, Lock,
  RefreshCw, Hash, ArrowDown
} from 'lucide-react'
import { fetchAuditLedger } from '../api'

export const AuditLedgerView: React.FC = () => {
  const [ledgerData, setLedgerData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    setLoading(true)
    fetchAuditLedger().then((data) => {
      setLedgerData(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-cyan-400" />
            Audit Ledger & Chain of Custody (F19)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable, append-only cryptographic hash chain (SHA-256) logging every forensic evaluation, approval, and override.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Chain
        </button>
      </div>

      {ledgerData && (
        <div className="space-y-4 font-mono text-xs">
          {/* Integrity Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{ledgerData.status_message}</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
              {ledgerData.chain_length} BLOCKS VERIFIED
            </span>
          </div>

          {/* Block Chain List */}
          <div className="space-y-2">
            {ledgerData.records.map((rec: any, i: number) => (
              <div key={rec.index} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 hover:border-slate-700 transition">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-cyan-300">
                    BLOCK #{rec.index} · ACTION: <span className="text-slate-100">{rec.action}</span>
                  </span>
                  <span>{rec.timestamp}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <div>Actor: <strong className="text-slate-300">{rec.actor}</strong></div>
                  <div>Role: <strong className="text-amber-300">{rec.role}</strong></div>
                  <div>Target Object: <strong className="text-slate-300">{rec.object_id}</strong></div>
                  <div className="truncate">Hash: <code className="text-cyan-400">{rec.hash.slice(0, 16)}...</code></div>
                </div>

                <div className="text-[10px] text-slate-500 truncate pt-1">
                  Prev Hash: <code className="text-slate-400">{rec.prev_hash.slice(0, 24)}...</code> · Payload: {JSON.stringify(rec.details)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
