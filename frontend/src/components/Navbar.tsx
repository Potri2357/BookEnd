import React from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, Database,
  Layers, Terminal, RefreshCw, Cpu, Activity
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
    <header className="sticky top-0 z-50 flex flex-col border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Permanent Simulated Data Banner (PRD Section 11.8) */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 px-4 py-1 text-xs text-amber-300/90 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wider">RANGE LITE SIMULATOR ACTIVE</span>
          <span className="text-amber-400/60">|</span>
          <span className="text-slate-300">Deterministic Synthetic Data · Reserved Test IPs (192.0.2.0/24) · CERT-In 12h & CISA BOD 26-04 Triage Rules</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ed25519 Signing Ready
          </span>
          <button
            onClick={onResetDemo}
            disabled={isResetting}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
            Reset State (&lt;1s)
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('queue')}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">PATCH ASSURANCE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-mono -mt-0.5">Patch with proof.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800/80">
          {[
            { id: 'queue', label: 'Decision Queue', icon: AlertTriangle, badge: 'Active' },
            { id: 'advisory', label: 'Advisory Hub', icon: Layers },
            { id: 'fleet', label: 'MSSP Fleet', icon: Cpu },
            { id: 'connectors', label: 'SIEM Connectors', icon: Database },
            { id: 'evaluation', label: 'Evaluation Harness', icon: Activity, badge: 'S1-S6' },
            { id: 'audit', label: 'Audit Ledger', icon: Terminal }
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
                {item.badge && (
                  <span className={`text-[9px] px-1 rounded font-mono ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Tenant Switcher & Session State */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-mono text-slate-400">Tenant:</span>
            <select
              value={selectedTenant}
              onChange={(e) => onSelectTenant(e.target.value)}
              className="bg-transparent text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Clients (Fleet Queue)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-xs">
              SA
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-[11px] font-semibold text-slate-200 leading-none">Security Analyst</div>
              <div className="text-[10px] text-slate-400 font-mono">SOC Tier 2 / Approver</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
