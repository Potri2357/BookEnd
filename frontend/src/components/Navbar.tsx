import React from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, Database,
  Layers, Terminal, RefreshCw, Cpu, Activity,
  Radio, Lock, ChevronDown, Zap, Network
} from 'lucide-react'
import { Tenant } from '../types'

interface NavbarProps {
  tenants: Tenant[]
  selectedTenant: string
  onSelectTenant: (id: string) => void
  currentView: string
  onSelectView: (view: string) => void
  onResetDemo: () => void
  isResetting: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  selectedTenant,
  onSelectTenant,
  currentView,
  onSelectView,
  onResetDemo,
  isResetting
}) => {
  return (
    <header className="sticky top-0 z-50 flex flex-col border-b border-[#cde5e3] bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Defense Command Ribbon */}
      <div className="flex items-center justify-between bg-[#eaf4f3] px-6 py-1 text-[11px] font-mono border-b border-[#d8ecea] text-[#2c5361]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5edea] text-[#0f5462] border border-[#a8dbd6]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d9488]"></span>
            </span>
            <span className="font-bold tracking-wider text-[10px]">RANGE LITE SIMULATOR</span>
          </div>
          <span className="text-[#99bdbe]">|</span>
          <span className="text-[#3a6270] hidden md:inline font-medium">
            Deterministic Telemetry · 90 Synthetic Assets · RFC 5737 Test Subnets (192.0.2.0/24)
          </span>
          <span className="text-[#99bdbe] hidden md:inline">|</span>
          <span className="text-[#0d9488] font-semibold hidden lg:inline">
            CERT-In 12h Emergency & CISA BOD 26-04 Enforced
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#0f766e] text-[10px] font-bold">
            <Lock className="w-3 h-3 text-[#0d9488]" />
            <span>Ed25519 HSM READY</span>
          </div>
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white hover:bg-[#e0f2f1] text-[#134e5e] border border-[#bce2df] transition text-[10px] active:scale-95 font-semibold shadow-2xs"
            title="Reset telemetry and state to initial seed (<1s)"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin text-[#0d9488]' : 'text-[#134e5e]'}`} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white">
        {/* Brand Identity - Exact PatchGate branding from presentation */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectView('queue')}
        >
          {/* PatchGate Dual-Tone Shield Logo */}
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#eaf4f3] border border-[#bfe0dc] p-1 shadow-xs transition group-hover:border-[#0d9488]">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M12 2L4 5v6.5C4 17.5 7.5 21 12 22V2z" fill="#133d4b" />
              <path d="M12 2v20c4.5-1 8-4.5 8-10.5V5l-8-3z" fill="#0d9488" />
            </svg>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#10b981] rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-[#113644]">PatchGate</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0]">
                PROD v2.0
              </span>
            </div>
            <div className="text-[11px] text-[#597885] font-sans font-medium flex items-center gap-1.5 -mt-0.5">
              <span>Investigate. Validate. Remediate.</span>
              <span className="text-[#a5c6c4]">•</span>
              <span className="text-[#0d9488] font-semibold">Zero-Tamper Guarantee</span>
            </div>
          </div>
        </div>

        {/* Center High-Density Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f0f7f6] p-1 rounded-xl border border-[#d2e8e5]">
          {[
            { id: 'queue', label: 'Decision Queue', icon: AlertTriangle, count: '18' },
            { id: 'advisory', label: 'Advisories & Intel', icon: Layers },
            { id: 'fleet', label: 'MSSP Fleet', icon: Cpu, badge: '3 Clients' },
            { id: 'connectors', label: 'SIEM Ingress', icon: Database },
            { id: 'evaluation', label: 'Benchmark', icon: Activity, badge: 'S1-S6' },
            { id: 'audit', label: 'Chain of Custody', icon: Terminal }
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#143e4c] text-white shadow-xs'
                    : 'text-[#446876] hover:text-[#113644] hover:bg-white/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#5eead4]' : 'text-[#628795]'}`} />
                <span>{item.label}</span>
                {item.count && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-[#215769] text-white' : 'bg-white text-[#38616f] border border-[#cbe4e1]'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-[#215769] text-[#a7f3d0]' : 'bg-[#e0f0ee] text-[#4a7280]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Tenant Switcher & Analyst Context */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-[#f0f7f6] border border-[#cce4e1] hover:border-[#0d9488] rounded-xl px-3 py-1.5 transition shadow-2xs">
            <span className="text-[10px] font-mono font-semibold text-[#5a7f8d] mr-2 uppercase tracking-wider">
              Tenant:
            </span>
            <select
              value={selectedTenant}
              onChange={(e) => onSelectTenant(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#113644] focus:outline-none cursor-pointer appearance-none pr-5"
            >
              <option value="all" className="bg-white text-[#113644]">All Fleets (Aggregated)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-white text-[#113644]">
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5a7f8d] absolute right-2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-[#d2e8e5]">
            <div className="w-8 h-8 rounded-lg bg-[#143e4c] flex items-center justify-center font-bold text-white text-xs shadow-xs">
              IR
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-[#113644] leading-none">Incident Lead</div>
              <div className="text-[10px] text-[#597885] font-mono mt-0.5">SOC Tier-3 / Change Approver</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
