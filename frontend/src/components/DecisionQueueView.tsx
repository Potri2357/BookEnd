import React, { useState } from 'react'
import {
  AlertTriangle, ShieldCheck, Clock, CheckCircle2,
  Lock, Unlock, ChevronRight, Filter, ShieldAlert,
  Search, ShieldX, CheckCheck, Sparkles, ArrowUpDown
} from 'lucide-react'
import { QueueItem } from '../types'

interface DecisionQueueViewProps {
  queue: QueueItem[]
  onSelectAsset: (assetId: string) => void
  onBulkApprove: () => void
  isBulkApproving: boolean
  selectedTenant: string
}

export const DecisionQueueView: React.FC<DecisionQueueViewProps> = ({
  queue,
  onSelectAsset,
  onBulkApprove,
  isBulkApproving,
  selectedTenant
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [verdictFilter, setVerdictFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')

  const filteredQueue = queue.filter((item) => {
    const matchSearch = item.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchVerdict = verdictFilter === 'all' || item.verdict_state === verdictFilter
    const matchTier = tierFilter === 'all' || item.exposure_tier === tierFilter
    return matchSearch && matchVerdict && matchTier
  })

  // Aggregate metrics
  const emergencyCount = queue.filter((i) => i.exposure_tier === 'emergency').length
  const compCount = queue.filter((i) => i.verdict_state === 'Likely compromised').length
  const gapCount = queue.filter((i) => i.verdict_state === 'Cannot verify').length
  const safeCount = queue.filter((i) => i.verdict_state === 'No evidence found' && i.coverage_score >= 0.85).length

  const eligibleForBulk = filteredQueue.filter(
    (item) => item.verdict_state === 'No evidence found' && item.coverage_score >= 0.85
  ).length

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return 'BREACHED'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const getVerdictPill = (state: string) => {
    switch (state) {
      case 'Likely compromised':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Likely Compromised
          </span>
        )
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Suspicious
          </span>
        )
      case 'Cannot verify':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            Cannot Verify
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            No Evidence Found
          </span>
        )
    }
  }

  const getTierChip = (tier: string) => {
    if (tier === 'emergency') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-red-600/15 text-red-400 border border-red-500/30 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400 animate-ping" />
          EMERGENCY (12H)
        </span>
      )
    }
    if (tier === 'high') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
          HIGH (24H)
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-800/80 text-slate-400 border border-white/[0.06]">
        STANDARD (72H)
      </span>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* Top SOC Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="soc-card p-4 rounded-xl border border-white/[0.07] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Emergency 12h Clocks</div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">{emergencyCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Internet-facing Criticals</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl border border-white/[0.07] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Containment Required</div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">{compCount}</div>
            <div className="text-[10px] text-rose-400/80 font-mono">Patch Gate Locked</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl border border-white/[0.07] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Retention Gaps</div>
            <div className="text-2xl font-black font-mono text-purple-400 mt-0.5">{gapCount}</div>
            <div className="text-[10px] text-purple-400/80 font-mono">&lt; 85% Provability</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldX className="w-5 h-5" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl border border-white/[0.07] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Safe to Patch</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{safeCount}</div>
            <div className="text-[10px] text-emerald-400/80 font-mono">Verified Zero Intrusions</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Header & Bulk Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Forensic Decision Queue
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Automated Priority Ranking
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Decide whether to contain first, review anomalies, or patch now. Sorted strictly by regulatory deadline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBulkApprove}
            disabled={eligibleForBulk === 0 || isBulkApproving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition border shadow-sm ${
              eligibleForBulk > 0 && !isBulkApproving
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 border-emerald-500/50 hover:shadow-emerald-500/10'
                : 'bg-white/[0.02] text-slate-600 border-white/[0.05] cursor-not-allowed'
            }`}
          >
            <CheckCheck className={`w-4 h-4 ${eligibleForBulk > 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
            <span>Bulk Approve Clean ({eligibleForBulk})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="soc-card p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 ml-1" />
          <input
            type="text"
            placeholder="Search host, asset ID, IP address or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 flex-1 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Verdict:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none font-mono text-xs cursor-pointer"
            >
              <option value="all">All States</option>
              <option value="Likely compromised">Likely Compromised</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Cannot verify">Cannot Verify</option>
              <option value="No evidence found">No Evidence Found</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none font-mono text-xs cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="emergency">Emergency (12h)</option>
              <option value="high">High (24h)</option>
              <option value="standard">Standard (72h)</option>
            </select>
          </div>

          <span className="text-slate-400 font-mono text-[11px] pl-2 border-l border-white/[0.08]">
            Filtered: <strong className="text-cyan-400">{filteredQueue.length}</strong> of {queue.length}
          </span>
        </div>
      </div>

      {/* High-Density Command Table */}
      <div className="soc-card rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#080b16] text-slate-400 font-mono border-b border-white/[0.08] text-[10px] tracking-wider uppercase">
              <tr>
                <th className="py-3 px-4">ASSET & HOSTNAME</th>
                <th className="py-3 px-3">ORGANISATION</th>
                <th className="py-3 px-3">EXPOSURE TIER</th>
                <th className="py-3 px-4">COMPROMISE VERDICT</th>
                <th className="py-3 px-3">RETENTION PROVABILITY</th>
                <th className="py-3 px-4">TIME LEFT (CLOCK)</th>
                <th className="py-3 px-4">GATE OUTCOME</th>
                <th className="py-3 px-4 text-right">DECISION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-slate-500 font-mono">
                    Zero items matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => {
                  const isComp = item.verdict_state === 'Likely compromised'
                  const isEmergency = item.exposure_tier === 'emergency'

                  return (
                    <tr
                      key={item.asset_id}
                      onClick={() => onSelectAsset(item.host_name)}
                      className={`cursor-pointer transition hover:bg-white/[0.03] group relative ${
                        isComp ? 'bg-rose-500/[0.03]' : ''
                      }`}
                    >
                      {/* Asset & Host */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-8 rounded-full ${
                            isComp ? 'bg-rose-500' : item.verdict_state === 'Cannot verify' ? 'bg-purple-500' : 'bg-emerald-500'
                          }`} />
                          <div>
                            <div className="font-bold text-slate-100 font-mono flex items-center gap-2 group-hover:text-cyan-300 transition">
                              <span>{item.host_name}</span>
                              {item.status === 'needs_inventory' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                                  Unknown Version
                                </span>
                              )}
                              {item.status === 'reopened' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-bold animate-pulse">
                                  Reopened Post-Patch
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {item.asset_id} • {item.owner}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="py-3 px-3 font-mono text-slate-300 capitalize text-[11px]">
                        {item.tenant_id.replace('-', ' ')}
                      </td>

                      {/* Exposure Tier */}
                      <td className="py-3 px-3">
                        {getTierChip(item.exposure_tier)}
                      </td>

                      {/* Verdict */}
                      <td className="py-3 px-4">
                        {getVerdictPill(item.verdict_state)}
                      </td>

                      {/* Retention Provability Score */}
                      <td className="py-3 px-3 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-black/50 rounded-full h-1.5 overflow-hidden border border-white/[0.06]">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.coverage_score >= 0.85 ? 'bg-emerald-400' : 'bg-purple-400'
                              }`}
                              style={{ width: `${Math.round(item.coverage_score * 100)}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-bold ${
                            item.coverage_score >= 0.85 ? 'text-slate-300' : 'text-purple-300'
                          }`}>
                            {Math.round(item.coverage_score * 100)}%
                          </span>
                        </div>
                      </td>

                      {/* Countdown Clock */}
                      <td className="py-3 px-4 font-mono">
                        <div className={`flex items-center gap-1.5 font-bold text-xs ${
                          item.is_breached
                            ? 'text-red-400'
                            : isEmergency
                            ? 'text-amber-300'
                            : 'text-slate-200'
                        }`}>
                          <Clock className={`w-3.5 h-3.5 ${isEmergency ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                          <span>{formatSeconds(item.seconds_remaining)}</span>
                        </div>
                      </td>

                      {/* Gate Outcome */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          {item.gate_locked ? (
                            <Lock className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span className={item.gate_locked ? 'text-rose-300' : 'text-emerald-300'}>
                            {item.gate_outcome}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectAsset(item.host_name)
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold transition inline-flex items-center gap-1 group-hover:border-cyan-400"
                        >
                          <span>Triage</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
