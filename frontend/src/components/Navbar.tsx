import React from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, Database,
  Layers, Terminal, RefreshCw, Cpu, Activity,
  Radio, Lock, ChevronDown, Zap
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
    <header className="sticky top-0 z-50 flex flex-col border-b border-white/[0.08] bg-[#070913]/95 backdrop-blur-xl">
      {/* Top Defense Command Ribbon */}
      <div className="flex items-center justify-between bg-black/60 px-5 py-1 text-[11px] font-mono border-b border-white/[0.05] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold tracking-wider text-[10px]">RANGE LITE SIMULATOR</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 hidden md:inline">
            Deterministic Telemetry · 90 Synthetic Assets · RFC 5737 Test Subnets (192.0.2.0/24)
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-cyan-400 font-semibold hidden lg:inline">
            CERT-In 12h Emergency & CISA BOD 26-04 Enforced
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Ed25519 HSM READY</span>
          </div>
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] transition text-[10px] active:scale-95"
            title="Reset telemetry and state to initial seed (<1s)"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="flex items-center justify-between px-6 py-2.5">
        {/* Brand Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSelectView('queue')}
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-slate-900 p-[1px] shadow-lg shadow-cyan-500/10 transition group-hover:shadow-cyan-500/25">
            <div className="w-full h-full bg-[#0a0d1a] rounded-[11px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400 transition group-hover:scale-105" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070913]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white">PATCH ASSURANCE</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PROD v2.0
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 -mt-0.5">
              <span>Patch with proof.</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">Zero-Tamper Guarantee</span>
            </div>
          </div>
        </div>

        {/* Center High-Density Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0c0f1d] p-1 rounded-xl border border-white/[0.06] shadow-inner">
          {[
            { id: 'queue', label: 'Decision Queue', icon: AlertTriangle, count: '18' },
            { id: 'advisory', label: 'Advisories & Hunts', icon: Layers },
            { id: 'fleet', label: 'MSSP Fleet', icon: Cpu, badge: '3 Clients' },
            { id: 'connectors', label: 'SIEM Ingress', icon: Database },
            { id: 'evaluation', label: 'Benchmark & Recall', icon: Activity, badge: 'S1-S6' },
            { id: 'audit', label: 'Chain of Custody', icon: Terminal }
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.count && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1 rounded ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800/80 text-slate-500'
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
          <div className="relative flex items-center bg-[#0c0f1d] border border-white/[0.08] hover:border-cyan-500/40 rounded-xl px-3 py-1.5 transition">
            <span className="text-[10px] font-mono font-semibold text-slate-400 mr-2 uppercase tracking-wider">
              Tenant:
            </span>
            <select
              value={selectedTenant}
              onChange={(e) => onSelectTenant(e.target.value)}
              className="bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer appearance-none pr-5"
            >
              <option value="all" className="bg-[#0b0e1a] text-white">All Fleets (Aggregated)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0b0e1a] text-white">
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-cyan-600/20">
              IR
            </div>
            <div className="text-left hidden xl:block">
              <div className="text-xs font-bold text-slate-200 leading-none">Incident Lead</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">SOC Tier-3 / Change Approver</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
