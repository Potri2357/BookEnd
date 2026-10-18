import React, { useState } from 'react'
import {
  AlertTriangle, ShieldCheck, Clock, CheckCircle2,
  Lock, Unlock, ChevronRight, Filter, ShieldAlert,
  Search, ShieldX, CheckCheck
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

  const eligibleForBulk = filteredQueue.filter(
    (item) => item.verdict_state === 'No evidence found' && item.coverage_score >= 0.85
  ).length

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return 'BREACHED'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }

  const getVerdictBadge = (state: string) => {
    switch (state) {
      case 'Likely compromised':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Likely compromised
          </span>
        )
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Suspicious
          </span>
        )
      case 'Cannot verify':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/40">
            <ShieldX className="w-3.5 h-3.5 text-purple-400" />
            Cannot verify
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            No evidence found
          </span>
        )
    }
  }

  const getTierBadge = (tier: string) => {
    if (tier === 'emergency') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
          Emergency (12h)
        </span>
      )
    }
    if (tier === 'high') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
          High (24h)
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
        Standard (72h)
      </span>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-cyan-400" />
            Decision Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Prioritised list of assets requiring forensic change decisions. Sorted strictly by regulatory deadline.
          </p>
        </div>

        {/* Bulk Approval Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBulkApprove}
            disabled={eligibleForBulk === 0 || isBulkApproving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-mono border transition ${
              eligibleForBulk > 0 && !isBulkApproving
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            Bulk Approve Safe Patches ({eligibleForBulk} Eligible)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hostname or asset ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 flex-1"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono">Verdict:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value="all">All Verdicts</option>
              <option value="Likely compromised">Likely compromised</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Cannot verify">Cannot verify</option>
              <option value="No evidence found">No evidence found</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="emergency">Emergency (12h)</option>
              <option value="high">High (24h)</option>
              <option value="standard">Standard (72h)</option>
            </select>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Showing <strong className="text-cyan-300">{filteredQueue.length}</strong> decisions
          </span>
        </div>
      </div>

      {/* Decision Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ASSET / HOSTNAME</th>
                <th className="py-3 px-4">TENANT</th>
                <th className="py-3 px-4">TIER</th>
                <th className="py-3 px-4">FORENSIC VERDICT</th>
                <th className="py-3 px-4">LOG COVERAGE</th>
                <th className="py-3 px-4">TIME LEFT (CLOCK)</th>
                <th className="py-3 px-4">PATCH GATE OUTCOME</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono">
                    No decisions matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => {
                  const isEmergency = item.exposure_tier === 'emergency'
                  const isComp = item.verdict_state === 'Likely compromised'

                  return (
                    <tr
                      key={item.asset_id}
                      onClick={() => onSelectAsset(item.host_name)}
                      className={`cursor-pointer transition hover:bg-slate-800/50 ${
                        isComp ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      {/* Asset & Host */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          {item.host_name}
                          {item.status === 'needs_inventory' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                              Needs Inv
                            </span>
                          )}
                          {item.status === 'reopened' && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                              Reopened
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.asset_id} · {item.owner}</div>
                      </td>

                      {/* Tenant */}
                      <td className="py-3.5 px-4 font-mono text-slate-300 capitalize">
                        {item.tenant_id.replace('-', ' ')}
                      </td>

                      {/* Tier */}
                      <td className="py-3.5 px-4">
                        {getTierBadge(item.exposure_tier)}
                      </td>

                      {/* Verdict */}
                      <td className="py-3.5 px-4">
                        {getVerdictBadge(item.verdict_state)}
                      </td>

                      {/* Log Coverage */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.coverage_score >= 0.85 ? 'bg-emerald-400' : 'bg-purple-400'
                              }`}
                              style={{ width: `${Math.round(item.coverage_score * 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs ${item.coverage_score >= 0.85 ? 'text-slate-200' : 'text-purple-300 font-semibold'}`}>
                            {Math.round(item.coverage_score * 100)}%
                          </span>
                        </div>
                      </td>

                      {/* Countdown Clock */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className={`flex items-center gap-1.5 font-semibold ${
                          item.is_breached
                            ? 'text-red-400'
                            : isEmergency
                            ? 'text-amber-300 animate-pulse'
                            : 'text-slate-200'
                        }`}>
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatSeconds(item.seconds_remaining)}
                        </div>
                      </td>

                      {/* Gate Outcome */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold">
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

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectAsset(item.host_name)
                          }}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-xs font-mono transition inline-flex items-center gap-1"
                        >
                          Investigate <ChevronRight className="w-3.5 h-3.5" />
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
