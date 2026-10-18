import React, { useState } from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, Database,
  Layers, Terminal, Cpu, Activity,
  ChevronDown, Menu, X, Radio, ShieldAlert,
  KeyRound, Building2, Server, Check, Globe, Lock
} from 'lucide-react'
import { Tenant } from '../types'
import { GroundTruthModal } from './GroundTruthModal'

interface NavbarProps {
  tenants: Tenant[]
  selectedTenant: string
  onSelectTenant: (id: string) => void
  currentView: string
  onSelectView: (view: string) => void
  onSelectScenarioAsset?: (assetId: string) => void
  onTogglePersistence?: () => void
  persistenceActive?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  selectedTenant,
  onSelectTenant,
  currentView,
  onSelectView,
  onSelectScenarioAsset,
  onTogglePersistence,
  persistenceActive = true
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false)
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false)
  const [activeScenario, setActiveScenario] = useState<string>('S1')
  const [isGroundTruthOpen, setIsGroundTruthOpen] = useState(false)

  const selectedTenantObj = tenants.find((t) => t.id === selectedTenant)
  const selectedTenantLabel = selectedTenantObj ? selectedTenantObj.name : 'All Fleets'

  const scenarios = [
    {
      id: 'S1',
      code: 'S1',
      title: 'Compromised Pre-Advisory',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Likely Compromised',
      dot: 'bg-[#DC2626]',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'S2',
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      verdict: 'No Evidence Found',
      dot: 'bg-[#047857]',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'S3',
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      verdict: 'Benign Noise',
      dot: 'bg-[#D97706]',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'S4',
      code: 'S4',
      title: 'Retention Gap Blind Spot',
      assetId: 'meridian-web-portal-01',
      verdict: 'Cannot Verify',
      dot: 'bg-[#7194B7]',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      id: 'S5',
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Reopen Trigger',
      dot: 'bg-[#84A3C4]',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ]

  const activeScenarioObj = scenarios.find((s) => s.id === activeScenario) || scenarios[0]

  const navItems = [
    {
      id: 'queue',
      label: 'Decision Queue',
      subtitle: 'Triage queue & SLA clocks',
      icon: AlertTriangle,
      count: '18',
      shortcut: '1'
    },
    {
      id: 'advisory',
      label: 'Threat Intelligence',
      subtitle: 'CISA KEV & sentence citations',
      icon: Layers,
      shortcut: '2'
    },
    {
      id: 'fleet',
      label: 'MSSP Fleet Posture',
      subtitle: 'Multi-tenant organization health',
      icon: Cpu,
      badge: '3 Clients',
      shortcut: '3'
    },
    {
      id: 'connectors',
      label: 'SIEM & EDR Ingress',
      subtitle: '16.6k EPS telemetry stream',
      icon: Database,
      shortcut: '4'
    },
    {
      id: 'evaluation',
      label: 'Validation Benchmark',
      subtitle: 'Empirical scoring harness',
      icon: Activity,
      badge: 'S1-S6',
      shortcut: '5'
    },
    {
      id: 'audit',
      label: 'Chain of Custody',
      subtitle: 'Ed25519 hash chain ledger',
      icon: Terminal,
      shortcut: '6'
    },
    {
      id: 'server',
      label: 'Server Infrastructure',
      subtitle: 'Cluster topology & live console',
      icon: Server,
      badge: 'PROD',
      shortcut: '7'
    }
  ]

  const handleSelectScenario = (scenarioId: string, assetId: string) => {
    setActiveScenario(scenarioId)
    setIsScenarioDropdownOpen(false)
    if (onSelectScenarioAsset) {
      onSelectScenarioAsset(assetId)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-6 py-2.5">
          {/* Left: Hamburger Button + Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="chip-btn chip-btn-secondary hover:border-[#BFDBFE] group"
              title="Open Navigation Menu [Esc]"
              aria-label="Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5 text-[#1D63ED] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold font-mono text-[#0F172A]">
                Menu
              </span>
            </button>

            {/* Brand Logo & Name */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => onSelectView('queue')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#1D63ED] text-white shadow-md shadow-[#1D63ED]/25 transition group-hover:bg-[#154EC2] group-hover:scale-105">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-[#0F172A] font-sans leading-tight">
                  BOOKEND
                </span>
                <span className="text-[10px] text-[#475569] font-mono leading-tight">
                  Patch with proof
                </span>
              </div>
            </div>
          </div>

          {/* Right: Range Scenario Dropdown, Tenant Selector, Reset & IR Lead */}
          <div className="flex items-center gap-2.5">
            {/* Range Scenario Dropdown (High-Visibility Pill Chip) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsScenarioDropdownOpen(!isScenarioDropdownOpen)
                  setIsTenantDropdownOpen(false)
                }}
                className="chip-btn chip-btn-secondary hover:border-[#BFDBFE] group"
                title="Select Range Benchmark Scenario"
              >
                <Radio className="w-3.5 h-3.5 text-[#1D63ED]" />
                <span className="font-semibold text-[#475569] hidden sm:inline">Scenario:</span>
                <span className={`w-2 h-2 rounded-full ${activeScenarioObj.dot}`} />
                <span className="font-bold text-[#0F172A] font-mono">{activeScenarioObj.code}</span>
                <span className="hidden md:inline font-medium text-[#0F172A] max-w-[140px] truncate">
                  {activeScenarioObj.title}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#475569] transition-transform duration-150 ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Scenario Dropdown Floating Menu */}
              {isScenarioDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsScenarioDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl glass-panel border border-white/80 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]/80">
                      <div className="text-[10px] font-mono font-bold text-[#475569] uppercase tracking-wider">
                        Range Benchmark Scenarios
                      </div>
                      <span className="text-[10px] text-[#047857] font-semibold bg-[#D1FAE5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                        100% Recall
                      </span>
                    </div>

                    {/* Scenario List */}
                    <div className="space-y-1">
                      {scenarios.map((sc) => {
                        const isSelected = activeScenario === sc.id
                        return (
                          <div
                            key={sc.id}
                            onClick={() => handleSelectScenario(sc.id, sc.assetId)}
                            className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                              isSelected
                                ? 'bg-[#EBF2FE] border-[#1D63ED] shadow-2xs font-semibold'
                                : 'bg-transparent hover:bg-white/70 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-xs text-[#111B36]">
                                    {sc.code}
                                  </span>
                                  <span className="text-xs font-medium text-[#111B36] truncate">
                                    {sc.title}
                                  </span>
                                </div>
                                <div className="text-[10px] font-mono text-[#64748B] truncate">
                                  Target: {sc.assetId}
                                </div>
                              </div>
                            </div>

                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${sc.badgeClass}`}>
                              {sc.verdict}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Footer Controls inside Dropdown */}
                    <div className="mt-2.5 pt-2.5 border-t border-[#E1E9F2] space-y-2">
                      {/* S5 Implant Toggle */}
                      {onTogglePersistence && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTogglePersistence()
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-sans transition cursor-pointer shadow-2xs ${
                            persistenceActive
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <ShieldAlert className={`w-3.5 h-3.5 ${persistenceActive ? 'text-rose-600' : 'text-emerald-600'}`} />
                            <span className="font-medium">S5 Implant:</span>
                          </div>
                          <span className="font-bold font-mono text-[10px]">
                            {persistenceActive ? 'ACTIVE (REOPENS)' : 'CLEARED (PASSES)'}
                          </span>
                        </button>
                      )}

                      {/* Ground Truth Modal Opener */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsScenarioDropdownOpen(false)
                          setIsGroundTruthOpen(true)
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF2FE] hover:bg-[#DBEAFE] text-[#1D63ED] border border-[#BFDBFE] text-xs font-semibold transition cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-[#1D63ED]" />
                        <span>Inspect Ground Truth Baseline Matrix</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Custom Glassmorphic Tenant Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTenantDropdownOpen(!isTenantDropdownOpen)
                  setIsScenarioDropdownOpen(false)
                }}
                className={`chip-btn ${
                  selectedTenant !== 'all'
                    ? 'chip-btn-primary'
                    : 'chip-btn-secondary hover:border-[#BFDBFE]'
                } group cursor-pointer`}
                title="Filter fleet by organization tenant"
                aria-label="Select Fleet Tenant"
              >
                <Building2 className={`w-3.5 h-3.5 ${selectedTenant !== 'all' ? 'text-white' : 'text-[#1D63ED]'}`} />
                <span className="font-bold text-xs truncate max-w-[130px]">
                  {selectedTenantLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    selectedTenant !== 'all' ? 'text-white/80' : 'text-[#475569]'
                  } ${isTenantDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Tenant Floating Glassmorphic Menu */}
              {isTenantDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsTenantDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 md:w-80 rounded-2xl glass-panel border border-white/80 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0]/80 px-1">
                      <span className="text-[10px] font-mono font-bold text-[#475569] uppercase tracking-wider">
                        ORGANIZATION TENANT
                      </span>
                      <span className="text-[10px] text-[#1D63ED] font-semibold bg-[#EBF2FE] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                        {tenants.length} Fleets
                      </span>
                    </div>

                    {/* Options */}
                    <div className="space-y-1">
                      {/* All Fleets option */}
                      <div
                        onClick={() => {
                          onSelectTenant('all')
                          setIsTenantDropdownOpen(false)
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                          selectedTenant === 'all'
                            ? 'bg-[#EBF2FE] border-[#1D63ED] shadow-2xs font-semibold'
                            : 'bg-transparent hover:bg-white/70 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedTenant === 'all' ? 'bg-[#1D63ED] text-white' : 'bg-[#F4F7FC] text-[#475569]'
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#0F172A] truncate">
                              All Fleets (Consolidated)
                            </div>
                            <div className="text-[10px] text-[#64748B] font-mono truncate">
                              Cross-tenant unified triage
                            </div>
                          </div>
                        </div>

                        {selectedTenant === 'all' && (
                          <Check className="w-4 h-4 text-[#1D63ED] shrink-0" />
                        )}
                      </div>

                      {/* Each Tenant Option */}
                      {tenants.map((t) => {
                        const isSelected = selectedTenant === t.id
                        return (
                          <div
                            key={t.id}
                            onClick={() => {
                              onSelectTenant(t.id)
                              setIsTenantDropdownOpen(false)
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                              isSelected
                                ? 'bg-[#EBF2FE] border-[#1D63ED] shadow-2xs font-semibold'
                                : 'bg-transparent hover:bg-white/70 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-[#1D63ED] text-white' : 'bg-[#F4F7FC] text-[#475569]'
                              }`}>
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#0F172A] truncate">
                                  {t.name}
                                </div>
                                <div className="text-[10px] text-[#64748B] truncate">
                                  {t.industry}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4F7FC] text-[#475569] border border-[#E1E9F2]">
                                30 Assets
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#1D63ED]" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Footer isolation notice */}
                    <div className="mt-2 pt-2 border-t border-[#E1E9F2]/80 px-1 text-[10px] text-[#64748B] flex items-center justify-between font-mono">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#047857]" /> Tenant Isolation Verified
                      </span>
                      <span className="text-[#047857] font-semibold">AIR-GAPPED</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Live Enterprise Server Chip */}
            <button
              onClick={() => onSelectView('server')}
              className={`chip-btn ${
                currentView === 'server'
                  ? 'chip-btn-primary'
                  : 'chip-btn-secondary hover:border-[#BFDBFE]'
              } hidden md:flex items-center gap-1.5`}
              title="Open Server Infrastructure Console [7]"
            >
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
              <Server className="w-3.5 h-3.5" />
              <span className="font-mono text-xs font-semibold">PROD-AP-SOUTH</span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
              <div
                className="w-8 h-8 rounded-full bg-[#1D63ED] flex items-center justify-center font-bold text-white text-xs shadow-md shadow-[#1D63ED]/25"
                title="Incident Lead (Lead Approver)"
              >
                IR
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Navigation Sliding Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Frosted Glass Backdrop */}
          <div
            className="fixed inset-0 bg-[#111B36]/25 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Glassmorphic & Claymorphic Sidebar Panel */}
          <div className="relative w-full max-w-sm glass-panel border-r border-white/80 shadow-[0_20px_50px_rgba(17,27,54,0.15)] flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200 font-sans">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E1E9F2]/80">
                <div className="flex items-center gap-2.5">
                  <div className="clay-icon-active w-8 h-8 flex items-center justify-center text-white">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#111B36] tracking-tight leading-none">
                      Console Surfaces
                    </h2>
                    <p className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      BookEnd Platform
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="clay-card p-1.5 text-[#64748B] hover:text-[#111B36] transition cursor-pointer"
                  title="Close Navigation [Esc]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compact Claymorphic Navigation Items */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 font-mono">
                  Core Modules
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentView === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id)
                        setIsMenuOpen(false)
                      }}
                      className={`w-full py-2.5 px-3 rounded-2xl flex items-center gap-2.5 transition cursor-pointer text-left relative ${
                        isActive
                          ? 'clay-active shadow-md'
                          : 'clay-card'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <span className="w-1.5 h-6 rounded-full bg-[#7194B7] shadow-xs shrink-0" />
                      )}

                      {/* Icon Container with Clay Depth */}
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive
                          ? 'clay-icon-active text-white'
                          : 'clay-icon-container text-[#5E82A7]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${
                            isActive ? 'text-[#111B36]' : 'text-[#111B36]'
                          }`}>
                            {item.label}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.count && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#7194B7] text-white clay-badge">
                                {item.count}
                              </span>
                            )}
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#E6EEF7] text-[#5E82A7] border border-[#C1D0E2] clay-badge">
                                {item.badge}
                              </span>
                            )}
                            <kbd className="clay-badge font-mono">{item.shortcut}</kbd>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer with shortcuts */}
            <div className="pt-3 border-t border-[#E2E8F0]/80 flex items-center justify-between text-[#64748B] text-[10px] px-1 font-mono">
              <span>Jump: <kbd className="clay-badge">1-6</kbd></span>
              <span>Close: <kbd className="clay-badge">Esc</kbd></span>
            </div>
          </div>
        </div>
      )}

      {/* Ground Truth Baseline Modal */}
      <GroundTruthModal
        isOpen={isGroundTruthOpen}
        onClose={() => setIsGroundTruthOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </>
  )
}
