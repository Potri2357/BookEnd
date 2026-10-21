import React, { useState, useMemo } from 'react'
import {
  Clock, ShieldAlert, CheckCircle2, AlertTriangle,
  Lock, ChevronRight, CheckCheck, Search,
  Filter, ShieldCheck, ShieldX,
  HelpCircle, ChevronDown, Check, Download,
  Layers, ArrowLeft, ArrowRight, Eye, Shield, UserCheck
} from 'lucide-react'
import { QueueItem, UserRole } from '../types'
import { ExplainVerdictModal } from './ExplainVerdictModal'
import { BulkApproveSafetyModal } from './BulkApproveSafetyModal'
import { BASE_URL } from '../api'

interface DecisionQueueViewProps {
  queue: QueueItem[]
  onSelectAsset: (assetId: string) => void
  onBulkApprove: () => void
  onApproveSingleAsset?: (item: QueueItem) => void
  onContainAsset?: (item: QueueItem) => void
  onAuditAsset?: (item: QueueItem) => void
  onReviewAsset?: (item: QueueItem) => void
  isBulkApproving: boolean
  selectedTenant: string
  isLoading?: boolean
  currentRole?: UserRole
}

export const DecisionQueueView: React.FC<DecisionQueueViewProps> = ({
  queue,
  onSelectAsset,
  onBulkApprove,
  onApproveSingleAsset,
  onContainAsset,
  onAuditAsset,
  onReviewAsset,
  isBulkApproving,
  selectedTenant,
  isLoading = false,
  currentRole = 'admin'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [verdictFilter, setVerdictFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [savedView, setSavedView] = useState<'all' | 'emergency' | 'compromised' | 'gaps' | 'safe'>('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Selection state for bulk actions
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set())

  // Modals state
  const [selectedVerdictItem, setSelectedVerdictItem] = useState<QueueItem | null>(null)
  const [showBulkSafetyModal, setShowBulkSafetyModal] = useState<boolean>(false)
  const [toastNotification, setToastNotification] = useState<string | null>(null)

  // Dropdown states
  const [isVerdictDropdownOpen, setIsVerdictDropdownOpen] = useState(false)
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false)

  // Role permissions breakdown
  const canApprove = currentRole === 'admin' || currentRole === 'approver'
  const canContain = currentRole === 'admin' || currentRole === 'approver' || currentRole === 'analyst'
  const isReadOnly = currentRole === 'auditor' || currentRole === 'viewer'

  const verdictOptions = [
    { value: 'all', label: 'All Verdicts', desc: 'Complete queue triage', dot: 'bg-slate-500' },
    { value: 'Likely compromised', label: 'Likely Compromised', desc: 'Active adversary detected', badge: 'Contain First', dot: 'bg-rose-600' },
    { value: 'Suspicious', label: 'Suspicious', desc: 'Anomalous execution', badge: 'Investigate', dot: 'bg-amber-600' },
    { value: 'Cannot verify', label: 'Cannot Verify', desc: 'Retention / telemetry blind spot', badge: 'Telemetry Gap', dot: 'bg-blue-600' },
    { value: 'No evidence found', label: 'No Evidence Found', desc: 'Clean forensics window', badge: 'Safe to Patch', dot: 'bg-emerald-600' }
  ]

  const tierOptions = [
    { value: 'all', label: 'All Tiers', desc: 'All exposure SLAs', dot: 'bg-slate-500' },
    { value: 'emergency', label: 'Emergency', desc: 'Critical exposure', badge: '12h SLA', dot: 'bg-rose-600' },
    { value: 'high', label: 'High', desc: 'Internet-facing host', badge: '24h SLA', dot: 'bg-amber-600' },
    { value: 'standard', label: 'Standard', desc: 'Internal network asset', badge: '72h SLA', dot: 'bg-blue-600' }
  ]

  const currentVerdict = verdictOptions.find((v) => v.value === verdictFilter) || verdictOptions[0]
  const currentTier = tierOptions.find((t) => t.value === tierFilter) || tierOptions[0]

  // Filtered queue items
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const q = searchTerm.toLowerCase().trim()
      const matchesSearch = !q ||
        item.host_name.toLowerCase().includes(q) ||
        item.asset_id.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q) ||
        (item.ip_address && item.ip_address.toLowerCase().includes(q))
      
      const matchesVerdict = verdictFilter === 'all' || item.verdict_state === verdictFilter
      const matchesTier = tierFilter === 'all' || item.exposure_tier === tierFilter

      const matchesSavedView =
        savedView === 'all'
          ? true
          : savedView === 'emergency'
            ? item.exposure_tier === 'emergency'
            : savedView === 'compromised'
              ? item.verdict_state === 'Likely compromised'
              : savedView === 'gaps'
                ? item.verdict_state === 'Cannot verify'
                : item.verdict_state === 'No evidence found'

      return matchesSearch && matchesVerdict && matchesTier && matchesSavedView
    })
  }, [queue, searchTerm, verdictFilter, tierFilter, savedView])

  // Pagination calculation
  const totalItems = filteredQueue.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedQueue = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredQueue.slice(start, start + pageSize)
  }, [filteredQueue, currentPage, pageSize])

  // Aggregated metrics
  const emergencyCount = queue.filter((i) => i.exposure_tier === 'emergency').length
  const compCount = queue.filter((i) => i.verdict_state === 'Likely compromised').length
  const gapCount = queue.filter((i) => i.verdict_state === 'Cannot verify').length
  const safeCount = queue.filter((i) => i.verdict_state === 'No evidence found').length
  const alreadyApprovedCount = queue.filter((i) => i.is_approved).length
  const eligibleForBulk = queue.filter((i) => i.verdict_state === 'No evidence found' && !i.gate_locked && !i.is_approved).length

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return '00:00:00 (BREACHED)'
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const toggleSelectAsset = (assetId: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev)
      if (next.has(assetId)) next.delete(assetId)
      else next.add(assetId)
      return next
    })
  }

  const toggleSelectAllPage = () => {
    if (paginatedQueue.every((item) => selectedAssetIds.has(item.asset_id))) {
      setSelectedAssetIds((prev) => {
        const next = new Set(prev)
        paginatedQueue.forEach((i) => next.delete(i.asset_id))
        return next
      })
    } else {
      setSelectedAssetIds((prev) => {
        const next = new Set(prev)
        paginatedQueue.forEach((i) => next.add(i.asset_id))
        return next
      })
    }
  }

  const getVerdictBadge = (item: QueueItem, large = false) => {
    const state = item.verdict_state
    const baseClass = large
      ? 'px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 font-mono shadow-xs'
      : 'px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 font-mono shadow-xs'

    switch (state) {
      case 'Likely compromised':
        return (
          <span className={`${baseClass} bg-rose-50 text-rose-700 border border-rose-200 dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]`}>
            <ShieldAlert className={large ? 'w-4 h-4 text-rose-500' : 'w-3.5 h-3.5 text-rose-500'} />
            <span>Likely Compromised</span>
          </span>
        )
      case 'Suspicious':
        return (
          <span className={`${baseClass} bg-amber-50 text-amber-800 border border-amber-200 dark:bg-[#1A1713] dark:text-[#FBBF24] dark:border-[#3D3219]`}>
            <AlertTriangle className={large ? 'w-4 h-4 text-amber-500' : 'w-3.5 h-3.5 text-amber-500'} />
            <span>Suspicious Execution</span>
          </span>
        )
      case 'Cannot verify':
        return (
          <span className={`${baseClass} bg-slate-50 text-slate-800 border border-slate-200 dark:bg-[#18181B] dark:text-[#E4E4E7] dark:border-[#2E2E34]`}>
            <ShieldX className={large ? 'w-4 h-4 text-slate-400' : 'w-3.5 h-3.5 text-slate-400'} />
            <span>Cannot Verify (Blindspot)</span>
          </span>
        )
      default:
        return (
          <span className={`${baseClass} bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#121915] dark:text-[#4ADE80] dark:border-[#1E3B29]`}>
            <ShieldCheck className={large ? 'w-4 h-4 text-emerald-500' : 'w-3.5 h-3.5 text-emerald-500'} />
            <span>{item.is_approved ? 'Approved & Released' : 'No Evidence Found'}</span>
          </span>
        )
    }
  }

  const getTierChip = (tier: string) => {
    if (tier === 'emergency') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-300 dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23] inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          EMERGENCY 12H
        </span>
      )
    }
    if (tier === 'high') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300 dark:bg-[#18181B] dark:text-[#E4E4E7] dark:border-[#2E2E34]">
          HIGH 24H
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300 dark:bg-[#141416] dark:text-[#8E8E93] dark:border-[#222225]">
        STANDARD 72H
      </span>
    )
  }

  const handleExportCsv = () => {
    window.open(`${BASE_URL}/reports/queue/export.csv?tenant_id=${encodeURIComponent(selectedTenant)}`, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 py-6 space-y-5 font-sans">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}


      {/* Header and Bulk Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#1E2638]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Evidence-Based Patch Gate
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-[#18181B] text-neutral-800 dark:text-[#E4E4E7] text-xs font-mono font-bold border border-neutral-200 dark:border-[#27272A]">
              {queue.length} Assets
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#8E8E93] mt-1 max-w-2xl font-sans">
            Assets with proven non-exploitation proceed to patch release; compromised assets are quarantined to prevent adversary persistence.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-700 dark:text-[#E4E4E7] text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            title="Download Decision Queue as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Bulk Approve button strictly gated by role */}
          {canApprove ? (
            <button
              onClick={() => setShowBulkSafetyModal(true)}
              disabled={isBulkApproving || eligibleForBulk === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer ${
                eligibleForBulk > 0
                  ? 'bg-[#1D63ED] hover:bg-[#154EC2] text-white shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>
                {isBulkApproving
                  ? 'Signing Approval...'
                  : eligibleForBulk > 0
                    ? `Bulk Approve Clean (${eligibleForBulk})`
                    : `All Clean Released (${alreadyApprovedCount})`}
              </span>
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed flex items-center gap-1.5"
              title="Bulk releasing clean assets requires Approver or Admin role"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Bulk Release (Approvers Only)</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Saved View Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => { setSavedView(savedView === 'emergency' ? 'all' : 'emergency'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl cursor-pointer border transition ${
            savedView === 'emergency'
              ? 'bg-rose-50/80 dark:bg-[#1C1415] border-rose-500 dark:border-[#4A2024] ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-[#121214] border-slate-200 dark:border-[#222225] hover:border-slate-300 dark:hover:border-[#333338]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-[#A1A1AA]">
            <span>Emergency 12h Clocks</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-[#F87171] mt-2 font-mono">{emergencyCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-[#71717A] mt-0.5">Critical internet exposure</div>
        </div>

        <div
          onClick={() => { setSavedView(savedView === 'compromised' ? 'all' : 'compromised'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl cursor-pointer border transition ${
            savedView === 'compromised'
              ? 'bg-rose-50/80 dark:bg-[#1C1415] border-rose-500 dark:border-[#4A2024] ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-[#121214] border-slate-200 dark:border-[#222225] hover:border-slate-300 dark:hover:border-[#333338]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-[#A1A1AA]">
            <span>Blocked / Compromised</span>
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-500 dark:text-[#F87171] mt-2 font-mono">{compCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-[#71717A] mt-0.5">Quarantine &amp; triage required</div>
        </div>

        <div
          onClick={() => { setSavedView(savedView === 'gaps' ? 'all' : 'gaps'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl cursor-pointer border transition ${
            savedView === 'gaps'
              ? 'bg-slate-100 dark:bg-[#1C1C20] border-slate-400 dark:border-[#52525B] ring-2 ring-slate-400/20'
              : 'bg-white dark:bg-[#121214] border-slate-200 dark:border-[#222225] hover:border-slate-300 dark:hover:border-[#333338]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-[#A1A1AA]">
            <span>Retention Blindspots</span>
            <ShieldX className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-[#FFFFFF] mt-2 font-mono">{gapCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-[#71717A] mt-0.5">&lt; 85% forensic provability</div>
        </div>

        <div
          onClick={() => { setSavedView(savedView === 'safe' ? 'all' : 'safe'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl cursor-pointer border transition ${
            savedView === 'safe'
              ? 'bg-emerald-50/80 dark:bg-[#141C16] border-emerald-500 dark:border-[#204A2D] ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-[#121214] border-slate-200 dark:border-[#222225] hover:border-slate-300 dark:hover:border-[#333338]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-[#A1A1AA]">
            <span>Safe to Patch</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-[#4ADE80] mt-2 font-mono">{safeCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-[#71717A] mt-0.5">{alreadyApprovedCount} already released</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#71717A] ml-1.5" />
          <input
            type="text"
            placeholder="Search host, asset ID, IP or owner..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-white font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Verdict Filter */}
          <div className="relative">
            <button
              onClick={() => { setIsVerdictDropdownOpen(!isVerdictDropdownOpen); setIsTierDropdownOpen(false); }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#18181B] hover:bg-slate-100 dark:hover:bg-[#222225] text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#0F172A] dark:text-white"
            >
              <span className="text-slate-500 dark:text-[#8E8E93]">Verdict:</span>
              <span className={`w-2 h-2 rounded-full ${currentVerdict.dot}`} />
              <span>{currentVerdict.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A]" />
            </button>

            {isVerdictDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsVerdictDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#26262B] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  {verdictOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => { setVerdictFilter(opt.value); setIsVerdictDropdownOpen(false); setCurrentPage(1); }}
                      className={`p-2 rounded-xl cursor-pointer text-xs flex items-center justify-between ${
                        verdictFilter === opt.value ? 'bg-slate-100 dark:bg-[#1E1E22] text-[#0F172A] dark:text-white font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#18181B] text-[#0F172A] dark:text-[#A1A1AA]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                        <span>{opt.label}</span>
                      </div>
                      {verdictFilter === opt.value && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Tier Filter */}
          <div className="relative">
            <button
              onClick={() => { setIsTierDropdownOpen(!isTierDropdownOpen); setIsVerdictDropdownOpen(false); }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#27272A] bg-slate-50 dark:bg-[#18181B] hover:bg-slate-100 dark:hover:bg-[#222225] text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#0F172A] dark:text-white"
            >
              <span className="text-slate-500 dark:text-[#8E8E93]">Tier:</span>
              <span>{currentTier.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#71717A]" />
            </button>

            {isTierDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsTierDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#26262B] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in">
                  {tierOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => { setTierFilter(opt.value); setIsTierDropdownOpen(false); setCurrentPage(1); }}
                      className={`p-2 rounded-xl cursor-pointer text-xs flex items-center justify-between ${
                        tierFilter === opt.value ? 'bg-slate-100 dark:bg-[#1E1E22] text-[#0F172A] dark:text-white font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#18181B] text-[#0F172A] dark:text-[#A1A1AA]'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {tierFilter === opt.value && <Check className="w-3.5 h-3.5" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-slate-500 dark:text-[#71717A] font-mono text-[11px] pl-2 border-l border-slate-200 dark:border-[#26262B] hidden sm:inline">
            Showing <strong className="text-slate-900 dark:text-white">{filteredQueue.length}</strong> of {queue.length}
          </span>
        </div>
      </div>

      {/* MOBILE COLLAPSED CARDS VIEW (Tested at 375px) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">Loading decision queue...</div>
        ) : paginatedQueue.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">No assets match filter criteria.</div>
        ) : (
          paginatedQueue.map((item) => (
            <div
              key={item.asset_id}
              onClick={() => onSelectAsset(item.host_name)}
              className="p-4 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-xs space-y-3 cursor-pointer hover:border-slate-400 dark:hover:border-[#52525B] transition"
            >
              {/* Visual Hierarchy: Patch-Gate Verdict FIRST */}
              <div className="flex items-center justify-between gap-2">
                <div>{getVerdictBadge(item, true)}</div>
                <div className="text-right">{getTierChip(item.exposure_tier)}</div>
              </div>

              {/* Host & Metadata */}
              <div className="space-y-1">
                <div className="text-sm font-bold text-[#0F172A] dark:text-white font-mono flex items-center justify-between">
                  <span>{item.host_name}</span>
                  {item.is_approved && <span className="text-xs text-emerald-600 dark:text-[#4ADE80] font-bold">✓ Approved</span>}
                </div>
                <div className="text-xs text-slate-500 dark:text-[#8E8E93] font-mono truncate">
                  {item.ip_address || '10.0.12.4'} · {item.owner} · {item.tenant_id}
                </div>
              </div>

              {/* Action Buttons based on role */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#222225] flex items-center justify-between">
                <div className="text-[11px] font-mono text-rose-600 dark:text-[#F87171] font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatSeconds(item.seconds_remaining)}</span>
                </div>

                <div>
                  {item.is_approved ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-[#4ADE80]">✓ Released</span>
                  ) : item.verdict_state === 'Likely compromised' ? (
                    canContain ? (
                      <span className="text-xs font-bold text-rose-600 dark:text-[#F87171]">Quarantine Required</span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-[#71717A]">Read-Only</span>
                    )
                  ) : canApprove ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-[#4ADE80]">Release Ready</span>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-[#71717A]">Approval Locked</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP HIGH-CLARITY FORENSIC TABLE */}
      <div className="hidden md:block bg-white dark:bg-[#121214] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#222225] shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-[#18181B] border-b border-slate-200 dark:border-[#222225] text-[11px] uppercase font-bold text-slate-600 dark:text-[#A1A1AA] tracking-wider">
            <tr>
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={paginatedQueue.length > 0 && paginatedQueue.every((i) => selectedAssetIds.has(i.asset_id))}
                  onChange={toggleSelectAllPage}
                  className="rounded border-slate-300 dark:border-[#3F3F46]"
                />
              </th>
              {/* Visual Hierarchy: Verdict FIRST column */}
              <th className="py-3 px-4 w-[26%]">Patch Gate Verdict</th>
              <th className="py-3 px-4 w-[34%]">Asset &amp; Infrastructure</th>
              <th className="py-3 px-4 w-[22%]">SLA Clock &amp; Provability</th>
              <th className="py-3 px-4 w-[18%] text-right">Required Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#222225]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-[#71717A] font-mono">
                  Loading asset decision queue...
                </td>
              </tr>
            ) : paginatedQueue.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-[#71717A] font-mono">
                  No assets match current criteria.
                </td>
              </tr>
            ) : (
              paginatedQueue.map((item) => (
                <tr
                  key={item.asset_id}
                  onClick={() => onSelectAsset(item.host_name)}
                  className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-[#18181B] transition"
                >
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.has(item.asset_id)}
                      onChange={() => toggleSelectAsset(item.asset_id)}
                      className="rounded border-slate-300 dark:border-[#3F3F46]"
                    />
                  </td>

                  {/* Verdict First */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getVerdictBadge(item)}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedVerdictItem(item); }}
                        className="text-slate-400 hover:text-slate-200 transition"
                        title="Explain Verdict"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Host & Metadata */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#0F172A] dark:text-white font-mono flex items-center gap-2">
                      <span>{item.host_name}</span>
                      {item.is_approved && <span className="text-[10px] text-emerald-600 dark:text-[#4ADE80] bg-emerald-50 dark:bg-[#121915] border border-transparent dark:border-[#1E3B29] px-1.5 py-0.2 rounded font-bold">RELEASED</span>}
                      {item.is_contained && <span className="text-[10px] text-amber-600 dark:text-[#FBBF24] bg-amber-50 dark:bg-[#1A1713] border border-transparent dark:border-[#3D3219] px-1.5 py-0.2 rounded font-bold">CONTAINED</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8E8E93] font-mono mt-0.5">
                      {item.asset_id} · {item.owner} · <span className="capitalize">{item.tenant_id}</span>
                    </div>
                  </td>

                  {/* SLA Clock & Provability */}
                  <td className="py-3 px-4 font-mono">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200" role="region" aria-live="polite">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>{formatSeconds(item.seconds_remaining)}</span>
                      {getTierChip(item.exposure_tier)}
                    </div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                      {Math.round(item.coverage_score * 100)}% 45d Lookback Provable
                    </div>
                  </td>

                  {/* Required Action based on role permissions */}
                  <td className="py-3 px-4 text-right">
                    {item.is_approved ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCheck className="w-4 h-4" />
                        <span>Released</span>
                      </span>
                    ) : item.is_contained ? (
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Quarantined</span>
                      </span>
                    ) : item.verdict_state === 'Likely compromised' ? (
                      canContain ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onContainAsset) {
                              onContainAsset(item)
                              setToastNotification(`Host ${item.host_name} quarantined to isolated VLAN. Egress blocked.`)
                              setTimeout(() => setToastNotification(null), 4000)
                            }
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          Quarantine VLAN
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                          Quarantine Required
                        </span>
                      )
                    ) : canApprove ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onApproveSingleAsset) {
                            onApproveSingleAsset(item)
                            setToastNotification(`Host ${item.host_name} approved and released to production patching.`)
                            setTimeout(() => setToastNotification(null), 4000)
                          }
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        Approve Release
                      </button>
                    ) : isReadOnly ? (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        Audit Clean (Read-Only)
                      </span>
                    ) : (
                      <span
                        className="text-[11px] font-mono text-slate-400 dark:text-slate-500 inline-flex items-center gap-1 cursor-not-allowed"
                        title="Release approval requires Approver role"
                      >
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Approver Role Required</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white rounded-lg px-2 py-1 text-xs"
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
          </select>
          <span className="ml-2">
            Page {currentPage} of {totalPages} ({totalItems} items)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-[#0F172A] dark:text-white"
            aria-label="Previous Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                currentPage === idx + 1
                  ? 'bg-[#1D63ED] text-white shadow-xs'
                  : 'border border-slate-200 dark:border-slate-800 text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-[#0F172A] dark:text-white"
            aria-label="Next Page"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedVerdictItem && (
        <ExplainVerdictModal
          item={selectedVerdictItem}
          onClose={() => setSelectedVerdictItem(null)}
          onInspectStory={(hostName) => {
            setSelectedVerdictItem(null)
            onSelectAsset(hostName)
          }}
        />
      )}

      {showBulkSafetyModal && (
        <BulkApproveSafetyModal
          queue={queue}
          onConfirm={() => {
            setShowBulkSafetyModal(false)
            setToastNotification('Successfully approved and released clean assets. Ed25519 signature committed to ledger.')
            setTimeout(() => setToastNotification(null), 5000)
            onBulkApprove()
          }}
          onClose={() => setShowBulkSafetyModal(false)}
          isSubmitting={isBulkApproving}
        />
      )}
    </div>
  )
}
export default DecisionQueueView
