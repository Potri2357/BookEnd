import React, { useState } from 'react'
import {
  Clock, ShieldAlert, CheckCircle2, AlertTriangle,
  Lock, Unlock, ChevronRight, CheckCheck, Search,
  Filter, ArrowUpDown, ShieldCheck, ShieldX, Sparkles,
  Info, HelpCircle, ChevronDown, Check
} from 'lucide-react'
import { QueueItem } from '../types'
import { ExplainVerdictModal } from './ExplainVerdictModal'
import { BulkApproveSafetyModal } from './BulkApproveSafetyModal'

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
  const [verdictFilter, setVerdictFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [kpiFilter, setKpiFilter] = useState<'all' | 'emergency' | 'compromised' | 'gaps' | 'safe'>('all')

  // Modals state
  const [selectedVerdictItem, setSelectedVerdictItem] = useState<QueueItem | null>(null)
  const [showBulkSafetyModal, setShowBulkSafetyModal] = useState<boolean>(false)
  const [toastNotification, setToastNotification] = useState<string | null>(null)

  // Custom Dropdown Open States
  const [isVerdictDropdownOpen, setIsVerdictDropdownOpen] = useState(false)
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false)

  const verdictOptions = [
    { value: 'all', label: 'All Verdicts', desc: 'Complete queue triage', dot: 'bg-[#64748B]' },
    { value: 'Likely compromised', label: 'Likely Compromised', desc: 'Active adversary detected', badge: 'Contain First', dot: 'bg-[#DC2626]' },
    { value: 'Suspicious', label: 'Suspicious', desc: 'Anomalous execution', badge: 'Investigate', dot: 'bg-[#D97706]' },
    { value: 'Cannot verify', label: 'Cannot Verify', desc: 'Retention / telemetry blind spot', badge: 'Telemetry Gap', dot: 'bg-[#7194B7]' },
    { value: 'No evidence found', label: 'No Evidence Found', desc: 'Clean forensics window', badge: 'Safe to Patch', dot: 'bg-[#047857]' }
  ]

  const tierOptions = [
    { value: 'all', label: 'All Tiers', desc: 'All exposure SLAs', dot: 'bg-[#64748B]' },
    { value: 'emergency', label: 'Emergency', desc: 'Critical exposure', badge: '12h SLA', dot: 'bg-[#DC2626]' },
    { value: 'high', label: 'High', desc: 'Internet-facing host', badge: '24h SLA', dot: 'bg-[#D97706]' },
    { value: 'standard', label: 'Standard', desc: 'Internal network asset', badge: '72h SLA', dot: 'bg-[#1D63ED]' }
  ]

  const currentVerdict = verdictOptions.find((v) => v.value === verdictFilter) || verdictOptions[0]
  const currentTier = tierOptions.find((t) => t.value === tierFilter) || tierOptions[0]

  // Filtered queue items
  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVerdict = verdictFilter === 'all' || item.verdict_state === verdictFilter
    const matchesTier = tierFilter === 'all' || item.exposure_tier === tierFilter

    const matchesKpi =
      kpiFilter === 'all'
        ? true
        : kpiFilter === 'emergency'
          ? item.exposure_tier === 'emergency'
          : kpiFilter === 'compromised'
            ? item.verdict_state === 'Likely compromised'
            : kpiFilter === 'gaps'
              ? item.verdict_state === 'Cannot verify'
              : item.verdict_state === 'No evidence found'

    return matchesSearch && matchesVerdict && matchesTier && matchesKpi
  })

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
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleKpiClick = (type: 'emergency' | 'compromised' | 'gaps' | 'safe') => {
    setKpiFilter((prev) => (prev === type ? 'all' : type))
  }

  const getVerdictPill = (item: QueueItem) => {
    const state = item.verdict_state
    switch (state) {
      case 'Likely compromised':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVerdictItem(item)
            }}
            title="Click to inspect evidence factors and confidence"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] font-mono hover:border-[#DC2626] transition cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
            <span>Likely Compromised</span>
            <HelpCircle className="w-3 h-3 text-[#DC2626]/70 group-hover:text-[#DC2626]" />
          </button>
        )
      case 'Suspicious':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVerdictItem(item)
            }}
            title="Click to inspect evidence factors"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] font-mono hover:border-[#B45309] transition cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            <span>Suspicious</span>
            <HelpCircle className="w-3 h-3 text-[#B45309]/70 group-hover:text-[#B45309]" />
          </button>
        )
      case 'Cannot verify':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVerdictItem(item)
            }}
            title="Click to view retention blind spots"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6EEF7] text-[#5E82A7] border border-[#C1D0E2] font-mono hover:border-[#5E82A7] transition cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7194B7]" />
            <span>Cannot Verify</span>
            <HelpCircle className="w-3 h-3 text-[#5E82A7]/70 group-hover:text-[#5E82A7]" />
          </button>
        )
      default:
        return (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVerdictItem(item)
            }}
            title="Click to inspect verified clean proof"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] font-mono hover:border-[#047857] transition cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            <span>{item.is_approved ? 'Approved & Released' : 'No Evidence Found'}</span>
            <HelpCircle className="w-3 h-3 text-[#047857]/70 group-hover:text-[#047857]" />
          </button>
        )
    }
  }

  const getTierChip = (tier: string) => {
    if (tier === 'emergency') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#DC2626] animate-ping" />
          EMERGENCY (12H)
        </span>
      )
    }
    if (tier === 'high') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
          HIGH (24H)
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-[#E6EEF7] text-[#64748B] border border-[#E1E9F2]">
        STANDARD (72H)
      </span>
    )
  }

  const renderContextualButton = (item: QueueItem) => {
    if (item.is_approved) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectAsset(item.host_name)
          }}
          className="chip-btn bg-[#D1FAE5] text-[#047857] border-[#A7F3D0] hover:bg-[#A7F3D0]/40 text-xs font-semibold"
          title="Asset patch gate approved and released. Click to view story."
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#047857]" />
          <span>Approved & Released</span>
        </button>
      )
    }
    if (item.verdict_state === 'Likely compromised') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectAsset(item.host_name)
          }}
          className="chip-btn chip-btn-emergency text-xs"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Contain Asset</span>
        </button>
      )
    }
    if (item.verdict_state === 'Cannot verify') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectAsset(item.host_name)
          }}
          className="chip-btn chip-btn-secondary text-[#1D63ED] border-[#BFDBFE] hover:bg-[#EBF2FE] text-xs font-semibold"
        >
          <Search className="w-3.5 h-3.5 text-[#1D63ED]" />
          <span>Investigate Gap</span>
        </button>
      )
    }
    if (item.verdict_state === 'Suspicious') {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelectAsset(item.host_name)
          }}
          className="chip-btn chip-btn-warning text-xs"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Review Evidence</span>
        </button>
      )
    }
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          onSelectAsset(item.host_name)
        }}
        className="chip-btn chip-btn-primary text-xs"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Approve Patch</span>
      </button>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Informative, Functional & Clickable Glassmorphic KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Emergency Clocks */}
        <div
          onClick={() => handleKpiClick('emergency')}
          className={`glass-card p-4.5 rounded-2xl cursor-pointer relative ${kpiFilter === 'emergency'
              ? 'bg-[#FEE2E2]/40 border-[#DC2626] ring-2 ring-[#DC2626]/20 shadow-md'
              : 'hover:border-[#BFDBFE]'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">Emergency 12h Clocks</span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans tracking-tight text-[#0F172A] mt-2">
            {emergencyCount}
          </div>
          <p className="text-[11px] text-[#475569] mt-1 font-sans">
            Internet-facing assets facing weaponization
          </p>
          {kpiFilter === 'emergency' && (
            <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-full shadow-2xs">
              Active Filter
            </span>
          )}
        </div>

        {/* Card 2: Containment Required */}
        <div
          onClick={() => handleKpiClick('compromised')}
          className={`glass-card p-4.5 rounded-2xl cursor-pointer relative ${kpiFilter === 'compromised'
              ? 'bg-[#FEE2E2]/40 border-[#DC2626] ring-2 ring-[#DC2626]/20 shadow-md'
              : 'hover:border-[#BFDBFE]'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">Containment Required</span>
            <div className="p-2 rounded-xl bg-[#FEE2E2] text-[#DC2626] shadow-2xs">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans tracking-tight text-[#DC2626] mt-2">
            {compCount}
          </div>
          <p className="text-[11px] text-[#475569] mt-1 font-sans">
            Malicious implant or backdoor detected
          </p>
          {kpiFilter === 'compromised' && (
            <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-full shadow-2xs">
              Active Filter
            </span>
          )}
        </div>

        {/* Card 3: Retention Gaps */}
        <div
          onClick={() => handleKpiClick('gaps')}
          className={`glass-card p-4.5 rounded-2xl cursor-pointer relative ${kpiFilter === 'gaps'
              ? 'bg-[#EBF2FE] border-[#1D63ED] ring-2 ring-[#1D63ED]/20 shadow-md'
              : 'hover:border-[#BFDBFE]'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">Retention Gaps</span>
            <div className="p-2 rounded-xl bg-[#EBF2FE] text-[#1D63ED] shadow-2xs">
              <ShieldX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans tracking-tight text-[#0F172A] mt-2">
            {gapCount}
          </div>
          <p className="text-[11px] text-[#475569] mt-1 font-sans">
            Under 85% provability across DuckDB lake
          </p>
          {kpiFilter === 'gaps' && (
            <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#1D63ED] text-white px-2 py-0.5 rounded-full shadow-2xs">
              Active Filter
            </span>
          )}
        </div>

        {/* Card 4: Safe to Patch */}
        <div
          onClick={() => handleKpiClick('safe')}
          className={`glass-card p-4.5 rounded-2xl cursor-pointer relative ${kpiFilter === 'safe'
              ? 'bg-[#D1FAE5]/50 border-[#059669] ring-2 ring-[#059669]/20 shadow-md'
              : 'hover:border-[#BFDBFE]'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#475569]">Safe to Patch</span>
            <div className="p-2 rounded-xl bg-[#D1FAE5] text-[#047857] shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-sans tracking-tight text-[#047857] mt-2">
            {safeCount}
          </div>
          <p className="text-[11px] text-[#475569] mt-1 font-sans">
            Zero IOCs across complete 45-day lookback
          </p>
          {kpiFilter === 'safe' && (
            <span className="absolute top-2.5 right-2.5 text-[9px] font-mono font-bold bg-[#059669] text-white px-2 py-0.5 rounded-full shadow-2xs">
              Active Filter
            </span>
          )}
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="p-3.5 rounded-xl bg-[#D1FAE5] border border-[#A7F3D0] text-[#047857] text-xs font-mono flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCheck className="w-4 h-4 text-[#047857] shrink-0" />
            <span className="font-semibold">{toastNotification}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-[#047857]/70 hover:text-[#047857] p-1 text-base font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Header & Bulk Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
              Forensic Decision Queue
            </h1>
          </div>
          <p className="text-xs text-[#475569] mt-0.5 font-sans">
            Incident response actions per asset: isolate backdoors first, investigate gaps, or release clean assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (eligibleForBulk > 0) {
                setShowBulkSafetyModal(true)
              } else if (alreadyApprovedCount > 0) {
                setToastNotification(`All ${alreadyApprovedCount} clean assets in the fleet have already been approved and released to patch automation.`)
                setTimeout(() => setToastNotification(null), 5000)
              } else {
                setToastNotification('Zero clean assets currently eligible for bulk approval.')
                setTimeout(() => setToastNotification(null), 4000)
              }
            }}
            disabled={isBulkApproving}
            className={`chip-btn ${eligibleForBulk > 0 && !isBulkApproving
                ? 'chip-btn-primary'
                : 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0] hover:bg-[#A7F3D0]/40'
              } px-4 py-2 text-xs font-mono`}
            title={
              eligibleForBulk > 0
                ? `Bulk approve ${eligibleForBulk} clean assets with 45-day lookback evidence`
                : `All ${alreadyApprovedCount} clean assets have been approved and released`
            }
          >
            <CheckCheck className={`w-4 h-4 ${eligibleForBulk > 0 ? 'text-white' : 'text-[#047857]'}`} />
            <span>
              {isBulkApproving
                ? 'Signing Approval...'
                : eligibleForBulk > 0
                  ? `Bulk Approve Clean (${eligibleForBulk})`
                  : `All Clean Released (${alreadyApprovedCount})`}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Glassmorphic) */}
      <div className="glass-card p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-[#64748B] ml-1.5" />
          <input
            type="text"
            placeholder="Search host, asset ID, IP address or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/90 border border-[#E2E8F0] rounded-full px-3.5 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#1D63ED] flex-1 font-mono shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Custom Glassmorphic Verdict Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsVerdictDropdownOpen(!isVerdictDropdownOpen)
                setIsTierDropdownOpen(false)
              }}
              className="chip-btn chip-btn-secondary px-3 py-1.5 flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/90 hover:bg-[#EBF2FE]/60 text-xs font-medium text-[#0F172A] shadow-2xs transition-all"
            >
              <span className="text-[#64748B] text-[11px] font-medium">Verdict:</span>
              <span className={`w-2 h-2 rounded-full ${currentVerdict.dot}`} />
              <span className="font-semibold text-[#0F172A]">{currentVerdict.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                  isVerdictDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isVerdictDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsVerdictDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl border border-[#E1E9F2] rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1.5 border-b border-[#E1E9F2]/80 mb-1 text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
                    Forensic Verdict Filter
                  </div>
                  <div className="space-y-1">
                    {verdictOptions.map((opt) => {
                      const isSelected = verdictFilter === opt.value
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setVerdictFilter(opt.value)
                            setIsVerdictDropdownOpen(false)
                          }}
                          className={`p-2 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-[#EBF2FE] border-[#1D63ED] shadow-2xs font-semibold'
                              : 'bg-transparent hover:bg-white/70 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#0F172A] truncate">
                                {opt.label}
                              </div>
                              <div className="text-[10px] text-[#64748B] truncate">
                                {opt.desc}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {opt.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F4F7FC] text-[#475569] border border-[#E1E9F2]">
                                {opt.badge}
                              </span>
                            )}
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1D63ED]" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Custom Glassmorphic Exposure Tier Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTierDropdownOpen(!isTierDropdownOpen)
                setIsVerdictDropdownOpen(false)
              }}
              className="chip-btn chip-btn-secondary px-3 py-1.5 flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white/90 hover:bg-[#EBF2FE]/60 text-xs font-medium text-[#0F172A] shadow-2xs transition-all"
            >
              <span className="text-[#64748B] text-[11px] font-medium">Tier:</span>
              <span className={`w-2 h-2 rounded-full ${currentTier.dot}`} />
              <span className="font-semibold text-[#0F172A]">{currentTier.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                  isTierDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isTierDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsTierDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-60 bg-white/95 backdrop-blur-xl border border-[#E1E9F2] rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1.5 border-b border-[#E1E9F2]/80 mb-1 text-[10px] font-bold tracking-wider text-[#64748B] uppercase">
                    Exposure SLA Filter
                  </div>
                  <div className="space-y-1">
                    {tierOptions.map((opt) => {
                      const isSelected = tierFilter === opt.value
                      return (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setTierFilter(opt.value)
                            setIsTierDropdownOpen(false)
                          }}
                          className={`p-2 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                            isSelected
                              ? 'bg-[#EBF2FE] border-[#1D63ED] shadow-2xs font-semibold'
                              : 'bg-transparent hover:bg-white/70 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#0F172A] truncate">
                                {opt.label}
                              </div>
                              <div className="text-[10px] text-[#64748B] truncate">
                                {opt.desc}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {opt.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F4F7FC] text-[#475569] border border-[#E1E9F2]">
                                {opt.badge}
                              </span>
                            )}
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#1D63ED]" />}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <span className="text-[#475569] text-[11px] pl-2 border-l border-[#E2E8F0]">
            Filtered: <strong className="text-[#0F172A] font-mono">{filteredQueue.length}</strong> of {queue.length}
          </span>
        </div>
      </div>

      {/* High-Clarity Forensic Table (Streamlined 4 Columns - Zero Horizontal Scroll) */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/80 shadow-[0_12px_36px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="glass-table-header border-b border-[#E2E8F0] text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[34%]">Asset & Organisation</th>
                <th className="py-3 px-4 w-[24%]">Response Deadline</th>
                <th className="py-3 px-4 w-[24%]">Forensic Verdict & Retention</th>
                <th className="py-3 px-4 w-[18%] text-right">Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-[#64748B] font-mono">
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
                      className={`cursor-pointer transition hover:bg-[#EBF2FE]/40 group relative ${isComp ? 'bg-[#FEE2E2]/20' : ''
                        }`}
                    >
                      {/* Asset & Organisation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-10 rounded-full shrink-0 ${isComp ? 'bg-[#DC2626]' : item.verdict_state === 'Cannot verify' ? 'bg-[#1D63ED]' : 'bg-[#059669]'
                            }`} />
                          <div className="min-w-0">
                            <div className="font-bold text-[#0F172A] font-mono text-[13px] flex items-center gap-2 group-hover:text-[#1D63ED] transition truncate">
                              <span className="truncate">{item.host_name}</span>
                              {item.status === 'needs_inventory' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FEF3C7] text-[#B45309] font-mono font-bold shrink-0">
                                  Unknown Version
                                </span>
                              )}
                              {item.status === 'reopened' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FEE2E2] text-[#DC2626] font-mono font-bold shrink-0 animate-pulse">
                                  Reopened Post-Patch
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#475569] font-sans truncate mt-0.5">
                              <strong className="capitalize text-[#0F172A] font-semibold">{item.tenant_id.replace('-', ' ')}</strong>
                              <span className="mx-1 text-[#CBD5E1]">•</span>
                              <span>{item.asset_id}</span>
                              <span className="mx-1 text-[#CBD5E1]">•</span>
                              <span>{item.owner}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Response SLA & Deadline */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className={`flex items-center gap-1.5 font-bold text-xs ${item.is_breached
                            ? 'text-[#DC2626]'
                            : isEmergency
                              ? 'text-[#DC2626]'
                              : 'text-[#0F172A]'
                          }`}>
                          <Clock className={`w-3.5 h-3.5 ${isEmergency ? 'text-[#DC2626] animate-pulse' : 'text-[#64748B]'}`} />
                          <span>{formatSeconds(item.seconds_remaining)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 font-sans">
                          {getTierChip(item.exposure_tier)}
                        </div>
                      </td>

                      {/* Forensic Verdict & Retention */}
                      <td className="py-3.5 px-4 font-mono">
                        <div>
                          {getVerdictPill(item)}
                        </div>
                        <div className="text-[11px] text-[#475569] mt-1 flex items-center gap-1.5 font-sans">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.coverage_score >= 0.85 ? 'bg-[#059669]' : 'bg-[#1D63ED]'
                            }`} />
                          <span>
                            {item.coverage_score >= 0.85 ? (
                              <span className="text-[#059669] font-semibold">45d Lookback Provable ({Math.round(item.coverage_score * 100)}%)</span>
                            ) : (
                              <span className="text-[#1D63ED] font-semibold">Retention Blind Spot ({Math.round(item.coverage_score * 100)}%)</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {renderContextualButton(item)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
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
          onConfirm={async () => {
            await onBulkApprove()
            setShowBulkSafetyModal(false)
            setToastNotification(`Successfully approved and released clean assets to automated patch automation. Ed25519 signature committed to ledger.`)
            setTimeout(() => setToastNotification(null), 5000)
          }}
          onClose={() => setShowBulkSafetyModal(false)}
          isSubmitting={isBulkApproving}
        />
      )}
    </div>
  )
}
