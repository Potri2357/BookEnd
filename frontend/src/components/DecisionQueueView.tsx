import React, { useState } from 'react'
import {
  ShieldAlert, ShieldCheck, ShieldX, Clock,
  Filter, Search, ArrowUpDown, ChevronRight, Lock,
  Unlock, CheckCircle2, AlertTriangle, AlertCircle,
  ExternalLink, Layers, CheckCheck
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

  // Metrics
  const emergencyCount = queue.filter(q => q.exposure_tier === 'emergency' && q.verdict_state === 'Likely compromised').length
  const compCount = queue.filter(q => q.verdict_state === 'Likely compromised').length
  const gapCount = queue.filter(q => q.verdict_state === 'Cannot verify').length
  const safeCount = queue.filter(q => q.verdict_state === 'No evidence found').length
  const eligibleForBulk = queue.filter(q => q.verdict_state === 'No evidence found' && !q.gate_locked).length

  // Filtered queue
  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesVerdict =
      verdictFilter === 'all' || item.verdict_state === verdictFilter

    const matchesTier =
      tierFilter === 'all' || item.exposure_tier === tierFilter

    return matchesSearch && matchesVerdict && matchesTier
  })

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Likely Compromised
          </span>
        )
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Suspicious
          </span>
        )
      case 'Cannot verify':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Cannot Verify
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            No Evidence Found
          </span>
        )
    }
  }

  const getTierChip = (tier: string) => {
    if (tier === 'emergency') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
          EMERGENCY (12H)
        </span>
      )
    }
    if (tier === 'high') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          HIGH (24H)
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-[#eaf4f3] text-[#3d6574] border border-[#cbe4e1]">
        STANDARD (72H)
      </span>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Top SOC Metrics Ribbon in PatchGate styling */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="soc-card p-4 rounded-xl flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#557784] uppercase tracking-wider">Emergency 12h Clocks</div>
            <div className="text-2xl font-black font-mono text-rose-600 mt-0.5">{emergencyCount}</div>
            <div className="text-[10px] text-[#71919e] font-mono">Internet-facing Criticals</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#557784] uppercase tracking-wider">Containment Required</div>
            <div className="text-2xl font-black font-mono text-rose-600 mt-0.5">{compCount}</div>
            <div className="text-[10px] text-rose-600/80 font-mono">Patch Gate Locked</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#557784] uppercase tracking-wider">Retention Gaps</div>
            <div className="text-2xl font-black font-mono text-purple-700 mt-0.5">{gapCount}</div>
            <div className="text-[10px] text-purple-700/80 font-mono">&lt; 85% Provability</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldX className="w-5 h-5" />
          </div>
        </div>

        <div className="soc-card p-4 rounded-xl flex items-center justify-between border-l-4 border-l-[#0d9488]">
          <div>
            <div className="text-[10px] font-mono font-bold text-[#557784] uppercase tracking-wider">Safe to Patch</div>
            <div className="text-2xl font-black font-mono text-[#0d9488] mt-0.5">{safeCount}</div>
            <div className="text-[10px] text-[#0d9488]/80 font-mono">Verified Zero Intrusions</div>
          </div>
          <div className="p-3 rounded-xl bg-[#e0f2f1] text-[#0d9488] border border-[#a7f3d0]">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Header & Bulk Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-[#113644] flex items-center gap-2">
              Forensic Decision Queue
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] font-bold">
              Automated Priority Ranking
            </span>
          </div>
          <p className="text-xs text-[#527482] mt-0.5">
            Decide whether to contain first, review anomalies, or patch now. Sorted strictly by regulatory deadline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBulkApprove}
            disabled={eligibleForBulk === 0 || isBulkApproving}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition border shadow-xs ${
              eligibleForBulk > 0 && !isBulkApproving
                ? 'bg-[#143e4c] hover:bg-[#1a4f61] text-white border-[#143e4c]'
                : 'bg-white text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <CheckCheck className={`w-4 h-4 ${eligibleForBulk > 0 ? 'text-[#5eead4]' : 'text-slate-400'}`} />
            <span>Bulk Approve Clean ({eligibleForBulk})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="soc-card p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#608390] ml-1" />
          <input
            type="text"
            placeholder="Search host, asset ID, IP address or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#f0f7f6] border border-[#cbe4e1] rounded-lg px-3 py-1.5 text-xs text-[#113644] placeholder-[#799ba8] focus:outline-none focus:border-[#0d9488] flex-1 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[#557784] font-mono text-[11px] uppercase tracking-wider font-semibold">Verdict:</span>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="bg-[#f0f7f6] border border-[#cbe4e1] rounded-lg px-2.5 py-1 text-[#113644] focus:outline-none font-mono text-xs cursor-pointer font-medium"
            >
              <option value="all">All States</option>
              <option value="Likely compromised">Likely Compromised</option>
              <option value="Suspicious">Suspicious</option>
              <option value="Cannot verify">Cannot Verify</option>
              <option value="No evidence found">No Evidence Found</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#557784] font-mono text-[11px] uppercase tracking-wider font-semibold">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-[#f0f7f6] border border-[#cbe4e1] rounded-lg px-2.5 py-1 text-[#113644] focus:outline-none font-mono text-xs cursor-pointer font-medium"
            >
              <option value="all">All Tiers</option>
              <option value="emergency">Emergency (12h)</option>
              <option value="high">High (24h)</option>
              <option value="standard">Standard (72h)</option>
            </select>
          </div>

          <span className="text-[#557784] font-mono text-[11px] pl-2 border-l border-[#d2e8e5]">
            Filtered: <strong className="text-[#0d9488]">{filteredQueue.length}</strong> of {queue.length}
          </span>
        </div>
      </div>

      {/* High-Density Command Table */}
      <div className="soc-card rounded-2xl overflow-hidden border border-[#d2e8e5] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#eaf4f3] text-[#143e4c] font-mono border-b border-[#cbe4e1] text-[10px] tracking-wider uppercase font-bold">
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
            <tbody className="divide-y divide-[#e5f1f0]">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-[#688a96] font-mono">
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
                      className={`cursor-pointer transition hover:bg-[#f1f8f7] group relative ${
                        isComp ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Asset & Host */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-1 h-8 rounded-full ${
                            isComp ? 'bg-rose-500' : item.verdict_state === 'Cannot verify' ? 'bg-purple-500' : 'bg-teal-500'
                          }`} />
                          <div>
                            <div className="font-bold text-[#113644] font-mono flex items-center gap-2 group-hover:text-[#0d9488] transition">
                              <span>{item.host_name}</span>
                              {item.status === 'needs_inventory' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                                  Unknown Version
                                </span>
                              )}
                              {item.status === 'reopened' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold animate-pulse">
                                  Reopened Post-Patch
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#638491] font-mono mt-0.5">
                              {item.asset_id} • {item.owner}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tenant */}
                      <td className="py-3 px-3 font-mono text-[#254d5b] capitalize text-[11px] font-medium">
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
                          <div className="w-14 bg-[#d8ece9] rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                item.coverage_score >= 0.85 ? 'bg-[#0d9488]' : 'bg-purple-500'
                              }`}
                              style={{ width: `${Math.round(item.coverage_score * 100)}%` }}
                            />
                          </div>
                          <span className={`text-[11px] font-bold ${
                            item.coverage_score >= 0.85 ? 'text-[#143e4c]' : 'text-purple-700'
                          }`}>
                            {Math.round(item.coverage_score * 100)}%
                          </span>
                        </div>
                      </td>

                      {/* Countdown Clock */}
                      <td className="py-3 px-4 font-mono">
                        <div className={`flex items-center gap-1.5 font-bold text-xs ${
                          item.is_breached
                            ? 'text-rose-600'
                            : isEmergency
                            ? 'text-amber-700'
                            : 'text-[#143e4c]'
                        }`}>
                          <Clock className={`w-3.5 h-3.5 ${isEmergency ? 'text-amber-600 animate-pulse' : 'text-[#638491]'}`} />
                          <span>{formatSeconds(item.seconds_remaining)}</span>
                        </div>
                      </td>

                      {/* Gate Outcome */}
                      <td className="py-3 px-4 font-mono text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          {item.gate_locked ? (
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-[#0d9488]" />
                          )}
                          <span className={item.gate_locked ? 'text-rose-700' : 'text-[#0d766e]'}>
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
                          className="px-3 py-1 rounded-lg bg-[#e0f2f1] hover:bg-[#bbf0eb] text-[#0d766e] border border-[#a7f3d0] text-[11px] font-mono font-bold transition inline-flex items-center gap-1 group-hover:border-[#0d9488] shadow-2xs"
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
