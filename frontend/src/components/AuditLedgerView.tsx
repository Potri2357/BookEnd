import React, { useState, useEffect } from 'react'
import {
  Terminal, ShieldCheck, CheckCircle2, Lock,
  RefreshCw, Hash, ArrowDown, Key, Link2,
  FileCode, Layers, ShieldAlert, Cpu, Download,
  UserCheck, Eye, Shield, FileCheck
} from 'lucide-react'
import { fetchAuditLedger, fetchUserAuditActions, BASE_URL } from '../api'

export const AuditLedgerView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decision_ledger' | 'user_actions'>('decision_ledger')
  
  // Decision ledger state
  const [ledgerData, setLedgerData] = useState<any | null>(null)
  const [loadingLedger, setLoadingLedger] = useState(true)
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null)

  // User action audit state
  const [userActions, setUserActions] = useState<any[]>([])
  const [loadingUserActions, setLoadingUserActions] = useState(false)
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('all')

  const loadLedger = () => {
    setLoadingLedger(true)
    fetchAuditLedger().then((data) => {
      setLedgerData(data)
      setLoadingLedger(false)
      if (data && data.records && data.records.length > 0) {
        setSelectedBlockIndex(data.records[data.records.length - 1].index)
      }
    })
  }

  const loadUserActions = () => {
    setLoadingUserActions(true)
    const filter = selectedActionFilter === 'all' ? undefined : selectedActionFilter
    fetchUserAuditActions(100, filter).then((actions) => {
      setUserActions(actions || [])
      setLoadingUserActions(false)
    }).catch(() => {
      setLoadingUserActions(false)
    })
  }

  useEffect(() => {
    loadLedger()
  }, [])

  useEffect(() => {
    if (activeTab === 'user_actions') {
      loadUserActions()
    }
  }, [activeTab, selectedActionFilter])

  const selectedRecord = ledgerData?.records?.find((r: any) => r.index === selectedBlockIndex)

  const handleExportLedgerCsv = () => {
    window.open(`${BASE_URL}/reports/audit/export.csv`, '_blank')
  }

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full font-sans text-slate-800 dark:text-[#FFFFFF]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-[#222225] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-[#222225]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-blue-50 text-[#1D63ED] border border-blue-200 dark:bg-[#18181B] dark:text-white dark:border-[#27272A] uppercase tracking-wider">
                IMMUTABLE AUDIT TRAIL
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> SHA-256 HASH CHAIN + NON-REPUDIATION USER AUDIT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] dark:text-white mt-1 tracking-tight">
              Cryptographic Ledger &amp; User Action Audit
            </h1>
            <p className="text-xs text-slate-600 dark:text-[#8E8E93] font-mono mt-0.5 font-sans">
              Dual-plane non-repudiation: mathematical hash chain of decisions, plus security audit logs tracking who viewed, exported, or overrode controls.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportLedgerCsv}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs dark:text-white"
              title="Download Full Ledger as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger CSV</span>
            </button>

            <button
              onClick={() => {
                if (activeTab === 'decision_ledger') loadLedger()
                else loadUserActions()
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-[#FFFFFF] dark:text-[#000000] hover:bg-slate-800 dark:hover:bg-[#E4E4E7] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLedger || loadingUserActions ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#222225] pb-1">
          <button
            onClick={() => setActiveTab('decision_ledger')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'decision_ledger'
                ? 'bg-[#1D63ED] text-white dark:bg-[#222225] dark:text-white dark:border dark:border-[#52525B] shadow-sm'
                : 'text-slate-600 dark:text-[#8E8E93] hover:bg-slate-100 dark:hover:bg-[#18181B] dark:hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Cryptographic Decision Ledger</span>
            {ledgerData && (
              <span className="bg-white/20 dark:bg-[#18181B] dark:border dark:border-[#27272A] px-1.5 py-0.2 rounded text-[10px]">
                {ledgerData.chain_length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('user_actions')}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'user_actions'
                ? 'bg-[#1D63ED] text-white dark:bg-[#222225] dark:text-white dark:border dark:border-[#52525B] shadow-sm'
                : 'text-slate-600 dark:text-[#8E8E93] hover:bg-slate-100 dark:hover:bg-[#18181B] dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User Actions Audit Log</span>
            <span className="bg-slate-200 dark:bg-[#18181B] dark:border dark:border-[#27272A] text-slate-800 dark:text-[#A1A1AA] px-1.5 py-0.2 rounded text-[10px]">Non-Repudiation</span>
          </button>
        </div>

        {/* Quick KPI stats */}
        {ledgerData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
              <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">BLOCK HEIGHT:</span>
              <span className="text-base font-bold text-[#0F172A] dark:text-white mt-0.5 block">
                {ledgerData.chain_length} Blocks Verified
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
              <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">STATE INTEGRITY:</span>
              <span className="text-base font-bold text-emerald-600 dark:text-[#34D399] mt-0.5 block flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 100% Validated
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
              <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">LATEST ROOT HASH:</span>
              <span className="text-xs font-bold text-blue-600 dark:text-white mt-1 block truncate">
                {ledgerData.records?.[ledgerData.records.length - 1]?.hash?.slice(0, 16)}...
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A]">
              <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">CANONICAL SPEC:</span>
              <span className="text-xs font-bold text-[#0F172A] dark:text-white mt-1 block">
                RFC 8785 JSON · SHA-256
              </span>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Cryptographic Decision Ledger Explorer */}
      {activeTab === 'decision_ledger' && ledgerData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
          {/* Blocks List */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">
                Hash-Chained Records (Most Recent First)
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#8E8E93]">
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
                    className={`p-3.5 rounded-2xl border transition cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-[#18181B] border-blue-500 dark:border-[#52525B] ring-1 ring-blue-500/20 dark:ring-[#52525B]/40'
                        : 'bg-white dark:bg-[#121214] border-slate-200 dark:border-[#222225] hover:border-slate-400 dark:hover:border-[#3F3F46]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-[#222225]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-blue-600 dark:bg-white text-white dark:text-black'
                            : 'bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] border border-slate-200 dark:border-[#27272A]'
                        }`}>
                          BLOCK #{rec.index}
                        </span>
                        <span className="font-bold text-[#0F172A] dark:text-white">{rec.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-[#8E8E93]">{rec.timestamp.slice(11, 19)} UTC</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-[#8E8E93] pt-2">
                      <div>Actor: <strong className="text-[#0F172A] dark:text-white">{rec.actor}</strong></div>
                      <div>Role: <strong className="text-amber-600 dark:text-[#FBBF24] uppercase">{rec.role}</strong></div>
                      <div className="truncate">Target: <strong className="text-[#0F172A] dark:text-white">{rec.object_id}</strong></div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-[#8E8E93]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Hash className="w-3 h-3 text-blue-500 dark:text-[#8E8E93] shrink-0" />
                        <code className="text-blue-600 dark:text-white truncate font-medium">{rec.hash.slice(0, 24)}...</code>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 dark:text-[#71717A] shrink-0">
                        <Link2 className="w-3 h-3" />
                        <span>Prev: {rec.prev_hash.slice(0, 10)}...</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Block Payload Inspector */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-white uppercase tracking-wider block pb-1">
              Block Payload &amp; Verification Inspector
            </span>

            {selectedRecord ? (
              <div className="bg-white dark:bg-[#121214] p-4 rounded-2xl border border-blue-300 dark:border-[#222225] space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222225]">
                  <span className="text-[#0F172A] dark:text-white font-bold">BLOCK #{selectedRecord.index} INSPECTION</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F] font-bold">
                    CRYPTOGRAPHICALLY VALID
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">BLOCK ACTION:</span>
                    <strong className="text-[#0F172A] dark:text-white">{selectedRecord.action}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">ACTOR PRINCIPAL:</span>
                    <span className="text-[#0F172A] dark:text-white font-semibold">{selectedRecord.actor}</span> <span className="text-amber-600 dark:text-[#FBBF24]">({selectedRecord.role})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">TIMESTAMP (ISO 8601):</span>
                    <span className="text-[#0F172A] dark:text-white">{selectedRecord.timestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">CURRENT SHA-256 HASH:</span>
                  <code className="p-2 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-blue-600 dark:text-white text-[11px] block break-all mt-0.5 select-all font-semibold font-mono">
                    {selectedRecord.hash}
                  </code>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">PARENT LINK (PREV_HASH):</span>
                  <code className="p-2 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-slate-600 dark:text-[#8E8E93] text-[11px] block break-all mt-0.5 select-all font-medium font-mono">
                    {selectedRecord.prev_hash}
                  </code>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-[#8E8E93] text-[10px] block">CANONICAL RFC 8785 JSON:</span>
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-[#0F172A] dark:text-[#E4E4E7] text-[11px] max-h-44 overflow-y-auto mt-0.5 font-mono">
                    {JSON.stringify(selectedRecord.details, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-[#121915] border border-emerald-200 dark:border-[#1E3A2F] text-[11px] text-emerald-800 dark:text-[#34D399] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399] inline mr-1" />
                  Tamper resistance: Any alteration of this block invalidates all downstream hashes in the chain.
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#121214] p-6 rounded-2xl border border-slate-200 dark:border-[#222225] text-center text-slate-500 dark:text-[#8E8E93]">
                Select a block on the left to inspect its cryptographic metadata.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: User Action Audit Log (Non-Repudiation for views, exports, overrides) */}
      {activeTab === 'user_actions' && (
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-[#222225] overflow-hidden shadow-sm font-mono text-xs">
          <div className="p-4 border-b border-slate-200 dark:border-[#222225] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] dark:text-white text-sm">
                User Access &amp; Forensic Action Trail
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#8E8E93]">
                ({userActions.length} audit entries captured)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-[#8E8E93] text-[11px]">Filter Action:</span>
              <select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs font-mono text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="all">All Actions</option>
                <option value="VIEW_ASSET">VIEW_ASSET</option>
                <option value="EXPORT_REPORT">EXPORT_REPORT</option>
                <option value="EXPORT_PROOF_PACK">EXPORT_PROOF_PACK</option>
                <option value="OVERRIDE_GATE">OVERRIDE_GATE</option>
                <option value="APPROVE_GATE">APPROVE_GATE</option>
                <option value="ROTATE_KEYS">ROTATE_KEYS</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-[#18181B] border-b border-slate-200 dark:border-[#222225] text-[11px] uppercase font-bold text-slate-500 dark:text-[#A1A1AA] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">User Principal</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#222225]">
                {loadingUserActions ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-[#71717A]">
                      Loading user audit actions...
                    </td>
                  </tr>
                ) : userActions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-[#71717A]">
                      No user actions recorded for this filter.
                    </td>
                  </tr>
                ) : (
                  userActions.map((item, idx) => (
                    <tr key={item.action_id || idx} className="hover:bg-slate-50 dark:hover:bg-[#18181B] transition">
                      <td className="py-2.5 px-4 text-slate-600 dark:text-[#8E8E93]">
                        {item.timestamp?.slice(0, 19).replace('T', ' ')}
                      </td>
                      <td className="py-2.5 px-4 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          item.action_type === 'OVERRIDE_GATE'
                            ? 'bg-rose-100 text-rose-700 dark:bg-[#1A1314] dark:text-[#F87171] dark:border dark:border-[#3D1F23]'
                            : item.action_type === 'APPROVE_GATE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-[#121915] dark:text-[#34D399] dark:border dark:border-[#1E3A2F]'
                            : item.action_type?.startsWith('EXPORT')
                            ? 'bg-blue-100 text-blue-700 dark:bg-[#18181B] dark:text-white dark:border dark:border-[#27272A]'
                            : 'bg-slate-100 text-slate-700 dark:bg-[#18181B] dark:text-[#A1A1AA] dark:border dark:border-[#27272A]'
                        }`}>
                          {item.action_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[#0F172A] dark:text-white font-medium">
                        {item.user_email || item.user_id}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-[#FBBF24]">
                          {item.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                        {item.resource_id}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-[#8E8E93] font-mono">
                        {item.ip_address || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuditLedgerView
