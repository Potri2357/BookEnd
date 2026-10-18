import React from 'react'
import { Search, Bell, RotateCcw } from 'lucide-react'
import { Tenant } from '../types'

interface TopHeaderProps {
  tenants: Tenant[]
  selectedTenant: string
  onSelectTenant: (tenantId: string) => void
  onResetDemo: () => void
  isResetting: boolean
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  tenants,
  selectedTenant,
  onSelectTenant,
  onResetDemo,
  isResetting
}) => {
  return (
    <header className="h-16 px-6 border-b border-[#e2e8f0] bg-[#f4f7fb] flex items-center justify-between gap-4">
      {/* Search Input matching screenshot */}
      <div className="relative flex-1 max-w-xl">
        <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search CVE, asset, tag, or investigation..."
          className="w-full pl-9 pr-4 py-2 bg-[#edf2f7] hover:bg-[#e8eff5] focus:bg-white border border-transparent focus:border-[#cbd5e1] rounded-xl text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none transition shadow-xs"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Tenant Switcher */}
        <div className="flex items-center gap-1.5 bg-white border border-[#e2e8f0] rounded-xl px-2.5 py-1 text-xs font-semibold shadow-xs">
          <span className="text-[#64748b] text-[11px]">Tenant:</span>
          <select
            value={selectedTenant}
            onChange={(e) => onSelectTenant(e.target.value)}
            className="bg-transparent text-[#0f172a] text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">Enterprise Fleet (All)</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Demo Reset Button */}
        <button
          onClick={onResetDemo}
          disabled={isResetting}
          title="Reset Range Lite & DuckDB Evidence"
          className="p-2 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#edf2f7] transition shadow-xs"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-[#3b6998]' : ''}`} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#0f172a] hover:bg-[#edf2f7] transition shadow-xs">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User Avatar Badge */}
        <div className="w-8 h-8 rounded-full bg-[#d6e2f0] border border-[#c5d5e7] flex items-center justify-center text-xs font-bold text-[#1e3a5f] shadow-xs cursor-pointer">
          SK
        </div>
      </div>
    </header>
  )
}
