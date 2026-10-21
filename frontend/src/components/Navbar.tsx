import React, { useState } from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, Database,
  Layers, Terminal, Cpu, Activity,
  ChevronDown, Menu, X, Radio, ShieldAlert,
  KeyRound, Building2, Server, Check, Globe, Lock,
  Sun, Moon, HelpCircle, Compass, FileCheck, UserCheck, ExternalLink,
  Eye, ShieldCheck
} from 'lucide-react'
import { Tenant, UserRole } from '../types'
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
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
  onOpenTour?: () => void
  onOpenShortcuts?: () => void
  currentRole?: UserRole
  onSelectRole?: (role: UserRole) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  tenants,
  selectedTenant,
  onSelectTenant,
  currentView,
  onSelectView,
  onSelectScenarioAsset,
  onTogglePersistence,
  persistenceActive = true,
  isDarkMode = false,
  onToggleDarkMode,
  onOpenTour,
  onOpenShortcuts,
  currentRole = 'admin',
  onSelectRole
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false)
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false)
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
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
      dot: 'bg-rose-600',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]'
    },
    {
      id: 'S2',
      code: 'S2',
      title: 'Clean & Well Covered',
      assetId: 'harbor-vpn-gw-01',
      verdict: 'No Evidence Found',
      dot: 'bg-emerald-600',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-[#121915] dark:text-[#4ADE80] dark:border-[#1E3B29]'
    },
    {
      id: 'S3',
      code: 'S3',
      title: 'Benign Look-Alike',
      assetId: 'lotus-app-server-01',
      verdict: 'Benign Noise',
      dot: 'bg-amber-600',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#1A1713] dark:text-[#FBBF24] dark:border-[#3D3219]'
    },
    {
      id: 'S4',
      code: 'S4',
      title: 'Retention Gap Blind Spot',
      assetId: 'meridian-web-portal-01',
      verdict: 'Cannot Verify',
      dot: 'bg-blue-600',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-[#18181B] dark:text-[#E4E4E7] dark:border-[#2E2E34]'
    },
    {
      id: 'S5',
      code: 'S5',
      title: 'Patch Then Persist',
      assetId: 'meridian-vpn-gw-01',
      verdict: 'Reopen Trigger',
      dot: 'bg-purple-600',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-[#1A1520] dark:text-[#C084FC] dark:border-[#3B284C]'
    }
  ]

  const activeScenarioObj = scenarios.find((s) => s.id === activeScenario) || scenarios[0]

  const navItems = [
    {
      id: 'queue',
      label: 'Decision Queue',
      subtitle: currentRole === 'auditor' || currentRole === 'viewer' ? 'Read-only compliance triage' : 'Triage queue & SLA clocks',
      icon: AlertTriangle,
      count: '18',
      shortcut: '1'
    },
    {
      id: 'advisory',
      label: 'Threat Intelligence',
      subtitle: 'Live CISA KEV & EPSS scores',
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
      subtitle: 'DuckDB columnar telemetry',
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
      label: 'Chain of Custody & Audit',
      subtitle: 'Ed25519 hash chain & user actions',
      icon: Terminal,
      shortcut: '6'
    },
    {
      id: 'server',
      label: 'Server Infrastructure',
      subtitle: 'DuckDB snapshot & key rotation',
      icon: Server,
      badge: 'ADMIN',
      shortcut: '7'
    },
    {
      id: 'verify',
      label: 'Public Verifier',
      subtitle: 'Standalone zero-trust verification',
      icon: FileCheck,
      badge: 'OPEN',
      shortcut: '8'
    }
  ]

  const roles: Array<{ id: UserRole; label: string; desc: string; badge: string; color: string }> = [
    { id: 'admin', label: 'Admin (Root)', desc: 'Superuser: Infrastructure console, key rotation & backups', badge: 'SUPERUSER', color: 'text-purple-400' },
    { id: 'approver', label: 'Approver', desc: 'Release Lead: Authorize patch releases & gate overrides', badge: 'RELEASE LEAD', color: 'text-emerald-400' },
    { id: 'analyst', label: 'Analyst', desc: 'SOC Triage: Telemetry investigation & ticket workflows', badge: 'SOC ANALYST', color: 'text-blue-400' },
    { id: 'auditor', label: 'Auditor', desc: 'Compliance: Read-only verification & CSV audit reports', badge: 'COMPLIANCE', color: 'text-amber-400' },
    { id: 'viewer', label: 'Viewer', desc: 'Executive: Consolidated read-only fleet overview', badge: 'READ-ONLY', color: 'text-slate-400' }
  ]

  // Filter modules based on user role authorization
  const allowedViewsByRole: Record<UserRole, string[]> = {
    admin: ['queue', 'advisory', 'fleet', 'connectors', 'evaluation', 'audit', 'server', 'verify'],
    approver: ['queue', 'advisory', 'fleet', 'connectors', 'evaluation', 'audit', 'verify'],
    analyst: ['queue', 'advisory', 'fleet', 'connectors', 'evaluation', 'audit', 'verify'],
    auditor: ['queue', 'advisory', 'fleet', 'audit', 'verify'],
    viewer: ['fleet', 'queue', 'verify']
  }

  const activeAllowedViews = allowedViewsByRole[currentRole] || allowedViewsByRole.admin
  const visibleNavItems = navItems.filter((item) => activeAllowedViews.includes(item.id))

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0]

  const handleSelectScenario = (scenarioId: string, assetId: string) => {
    setActiveScenario(scenarioId)
    setIsScenarioDropdownOpen(false)
    if (onSelectScenarioAsset) {
      onSelectScenarioAsset(assetId)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-[#222225] bg-white/95 dark:bg-[#000000]/95 backdrop-blur-xl shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2">
          {/* Left: Hamburger Button + Brand Identity */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="chip-btn chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B] group focus:outline-none focus:ring-2 focus:ring-white"
              title="Open Navigation Menu [Esc]"
              aria-label="Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5 text-neutral-800 dark:text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold font-mono text-[#0F172A] dark:text-white">
                Menu
              </span>
            </button>

            {/* Brand Logo & Name */}
            <div
              className="flex items-center gap-2 cursor-pointer group focus:outline-none"
              onClick={() => onSelectView('queue')}
              tabIndex={0}
              role="button"
              aria-label="Return to Decision Queue"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md transition group-hover:scale-105">
                <Shield className="w-4 h-4 text-white dark:text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-[#0F172A] dark:text-white font-sans leading-tight">
                  POSTERN
                </span>
                <span className="text-[10px] text-slate-500 dark:text-[#8E8E93] font-mono leading-tight">
                  Patch with proof
                </span>
              </div>
            </div>

            {/* Landing page link */}
            <button
              onClick={() => onSelectView('landing')}
              className={`text-[11px] font-mono px-2 py-1 rounded-lg border transition hidden sm:inline-flex items-center gap-1 cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-[#222225] dark:text-white dark:border-[#52525B]'
                  : 'text-slate-600 dark:text-[#8E8E93] border-transparent hover:bg-slate-100 dark:hover:bg-[#18181B] hover:dark:text-white'
              }`}
              title="View Public Product Landing Page"
            >
              <span>Landing</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Guided Tour Trigger Button */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="chip-btn chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B] hidden lg:flex items-center gap-1 text-slate-700 dark:text-white"
                title="Start Guided Walkthrough of S1 → S5 Scenarios"
                aria-label="Start Guided Tour"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Tour</span>
              </button>
            )}

            {/* Range Scenario Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsScenarioDropdownOpen(!isScenarioDropdownOpen)
                  setIsTenantDropdownOpen(false)
                  setIsRoleDropdownOpen(false)
                }}
                className="chip-btn chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B] group"
                title="Select Range Benchmark Scenario"
                aria-label="Benchmark Scenarios"
              >
                <Radio className="w-3.5 h-3.5 text-neutral-800 dark:text-white" />
                <span className="font-semibold text-slate-600 dark:text-[#8E8E93] hidden xl:inline">Scenario:</span>
                <span className={`w-2 h-2 rounded-full ${activeScenarioObj.dot}`} />
                <span className="font-bold text-[#0F172A] dark:text-white font-mono">{activeScenarioObj.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-[#8E8E93] transition-transform duration-150 ${isScenarioDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isScenarioDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsScenarioDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl glass-panel border border-slate-200 dark:border-[#222225] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans dark:bg-[#121214]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#222225]">
                      <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider">
                        Range Benchmark Scenarios
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-[#4ADE80] font-semibold bg-emerald-50 dark:bg-[#121915] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-[#1E3B29]">
                        100% Recall
                      </span>
                    </div>

                    <div className="space-y-1">
                      {scenarios.map((sc) => {
                        const isSelected = activeScenario === sc.id
                        return (
                          <div
                            key={sc.id}
                            onClick={() => handleSelectScenario(sc.id, sc.assetId)}
                            className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                              isSelected
                                ? 'bg-slate-100 dark:bg-[#222225] border-slate-400 dark:border-[#52525B] shadow-xs font-semibold'
                                : 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#18181B] border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-xs text-[#0F172A] dark:text-white">
                                    {sc.code}
                                  </span>
                                  <span className="text-xs font-medium text-slate-700 dark:text-[#E4E4E7] truncate">
                                    {sc.title}
                                  </span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] truncate">
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

                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-[#222225] space-y-2">
                      {onTogglePersistence && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTogglePersistence()
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-sans transition cursor-pointer shadow-xs ${
                            persistenceActive
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-[#121915] dark:text-[#4ADE80] dark:border-[#1E3B29]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <ShieldAlert className={`w-3.5 h-3.5 ${persistenceActive ? 'text-rose-600 dark:text-[#F87171]' : 'text-emerald-600 dark:text-[#4ADE80]'}`} />
                            <span className="font-medium text-slate-800 dark:text-white">S5 Implant:</span>
                          </div>
                          <span className="font-bold font-mono text-[10px]">
                            {persistenceActive ? 'ACTIVE (REOPENS)' : 'CLEARED (PASSES)'}
                          </span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsScenarioDropdownOpen(false)
                          setIsGroundTruthOpen(true)
                        }}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#18181B] hover:bg-slate-200 dark:hover:bg-[#222225] text-slate-800 dark:text-white border border-slate-200 dark:border-[#27272A] text-xs font-semibold transition cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-700 dark:text-white" />
                        <span>Inspect Ground Truth Baseline Matrix</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tenant Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTenantDropdownOpen(!isTenantDropdownOpen)
                  setIsScenarioDropdownOpen(false)
                  setIsRoleDropdownOpen(false)
                }}
                className={`chip-btn ${
                  selectedTenant !== 'all'
                    ? 'chip-btn-primary'
                    : 'chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B]'
                } group cursor-pointer`}
                title="Filter fleet by organization tenant"
                aria-label="Select Fleet Tenant"
              >
                <Building2 className={`w-3.5 h-3.5 ${selectedTenant !== 'all' ? 'text-white dark:text-black' : 'text-neutral-800 dark:text-white'}`} />
                <span className="font-bold text-xs truncate max-w-[100px] sm:max-w-[130px]">
                  {selectedTenantLabel}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    selectedTenant !== 'all' ? 'text-white/80 dark:text-black/80' : 'text-slate-500 dark:text-[#8E8E93]'
                  } ${isTenantDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isTenantDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsTenantDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 md:w-80 rounded-2xl glass-panel border border-slate-200 dark:border-[#222225] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans dark:bg-[#121214]">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#222225] px-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider">
                        ORGANIZATION TENANT
                      </span>
                      <span className="text-[10px] text-neutral-800 dark:text-white font-semibold bg-neutral-100 dark:bg-[#18181B] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-[#27272A]">
                        {tenants.length} Fleets
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div
                        onClick={() => {
                          onSelectTenant('all')
                          setIsTenantDropdownOpen(false)
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                          selectedTenant === 'all'
                            ? 'bg-neutral-100 dark:bg-[#222225] border-neutral-300 dark:border-[#52525B] shadow-xs font-semibold'
                            : 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#18181B] border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedTenant === 'all' ? 'bg-neutral-900 dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-[#18181B] text-slate-500 dark:text-white'
                          }`}>
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                              All Fleets (Consolidated)
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-[#8E8E93] font-mono truncate">
                              Cross-tenant unified triage
                            </div>
                          </div>
                        </div>
                        {selectedTenant === 'all' && <Check className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />}
                      </div>

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
                                ? 'bg-neutral-100 dark:bg-[#222225] border-neutral-300 dark:border-[#52525B] shadow-xs font-semibold'
                                : 'bg-transparent hover:bg-slate-50 dark:hover:bg-[#18181B] border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-neutral-900 dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-[#18181B] text-slate-500 dark:text-white'
                              }`}>
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                                  {t.name}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-[#8E8E93] truncate">
                                  {t.industry}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-neutral-900 dark:text-white" />}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-[#222225] px-1 text-[10px] text-slate-500 dark:text-[#8E8E93] flex items-center justify-between font-mono">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600 dark:text-[#4ADE80]" /> Tenant Isolation
                      </span>
                      <span className="text-emerald-600 dark:text-[#4ADE80] font-semibold">AIR-GAPPED</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Granular RBAC Role Switcher (Distinguishes role hierarchy) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen)
                  setIsScenarioDropdownOpen(false)
                  setIsTenantDropdownOpen(false)
                }}
                className="chip-btn chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B] flex items-center gap-1.5"
                title="Switch User Role to test Granular Authorization"
              >
                <UserCheck className="w-3.5 h-3.5 text-neutral-800 dark:text-white" />
                <span className="font-mono text-xs font-bold uppercase text-neutral-900 dark:text-white">
                  {currentRole}
                </span>
                <span className="hidden md:inline text-[9px] px-1 rounded bg-slate-100 dark:bg-[#18181B] text-slate-600 dark:text-[#E4E4E7] border border-transparent dark:border-[#27272A] font-mono">
                  {currentRoleObj.badge}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-500 dark:text-[#8E8E93] transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel border border-slate-200 dark:border-[#222225] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans dark:bg-[#121214]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-[#222225]">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider">
                        ENFORCED ROLE HIERARCHY
                      </span>
                      <span className="text-[10px] text-neutral-700 dark:text-white font-bold font-mono">
                        RBAC
                      </span>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {roles.map((r) => {
                        const isSelected = currentRole === r.id
                        return (
                          <div
                            key={r.id}
                            onClick={() => {
                              if (onSelectRole) onSelectRole(r.id)
                              setIsRoleDropdownOpen(false)
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                              isSelected
                                ? 'bg-neutral-100 dark:bg-[#222225] border-neutral-300 dark:border-[#52525B] font-semibold'
                                : 'hover:bg-slate-50 dark:hover:bg-[#18181B] border-transparent'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#0F172A] dark:text-white capitalize">{r.label}</span>
                                <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-slate-100 dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] border border-transparent dark:border-[#27272A]">
                                  {r.badge}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-[#8E8E93] font-sans mt-0.5 leading-snug">
                                {r.desc}
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Server Console Button (Admin only) */}
            {currentRole === 'admin' && (
              <button
                onClick={() => onSelectView('server')}
                className={`chip-btn ${
                  currentView === 'server'
                    ? 'chip-btn-primary'
                    : 'chip-btn-secondary hover:border-blue-300 dark:hover:border-[#52525B]'
                } hidden md:flex items-center gap-1.5`}
                title="Server Infrastructure Console (Admin Only) [7]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Server className="w-3.5 h-3.5" />
                <span className="font-mono text-xs font-semibold">PROD-AP</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#18181B] text-slate-600 dark:text-white transition cursor-pointer"
                title={isDarkMode ? 'Switch to Light Theme [T]' : 'Switch to Pitch Black Theme [T]'}
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}

            {/* Keyboard Shortcuts Trigger */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#18181B] text-slate-600 dark:text-white transition cursor-pointer font-mono text-xs font-bold"
                title="Keyboard Shortcuts [?]"
                aria-label="Keyboard Shortcuts"
              >
                <HelpCircle className="w-4 h-4 text-slate-700 dark:text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hamburger Navigation Drawer Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative w-full max-w-sm glass-panel border-r border-slate-200 dark:border-[#222225] shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-200 font-sans dark:bg-[#121214]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-[#222225]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-black shadow-md">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#0F172A] dark:text-white tracking-tight leading-none">
                      Console Surfaces
                    </h2>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] mt-0.5">
                      Role: <strong className="uppercase text-neutral-900 dark:text-white">{currentRole}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {onToggleDarkMode && (
                    <button
                      onClick={onToggleDarkMode}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-[#27272A] hover:bg-slate-100 dark:hover:bg-[#18181B] text-slate-600 dark:text-white transition cursor-pointer"
                      title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Pitch Black Theme'}
                      aria-label="Toggle Dark Mode"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-700" />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    title="Close Navigation [Esc]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider px-2 font-mono flex items-center justify-between">
                  <span>Authorized Modules</span>
                  <span className="text-[9px] px-1.5 rounded bg-slate-100 dark:bg-[#18181B] text-slate-600 dark:text-[#E4E4E7] border border-transparent dark:border-[#27272A]">
                    {visibleNavItems.length} Available
                  </span>
                </div>

                {visibleNavItems.map((item) => {
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
                          ? 'bg-neutral-100 dark:bg-[#222225] border border-neutral-300 dark:border-[#52525B] shadow-sm'
                          : 'hover:bg-slate-100 dark:hover:bg-[#18181B] border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${
                        isActive
                          ? 'bg-neutral-900 dark:bg-white text-white dark:text-black shadow-md'
                          : 'bg-slate-100 dark:bg-[#18181B] text-slate-600 dark:text-[#E4E4E7]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate text-[#0F172A] dark:text-white">
                            {item.label}
                          </span>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-slate-100 dark:bg-[#18181B] text-slate-600 dark:text-[#E4E4E7] border border-slate-200 dark:border-[#27272A]">
                                {item.badge}
                              </span>
                            )}
                            <kbd className="font-mono text-[10px] px-1 rounded bg-slate-200 dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] border border-transparent dark:border-[#27272A]">{item.shortcut}</kbd>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-[#8E8E93] truncate mt-0.5 font-sans">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-[#222225] flex items-center justify-between text-slate-500 dark:text-[#8E8E93] text-[10px] px-1 font-mono">
              <span>Jump: <kbd className="px-1 rounded bg-slate-200 dark:bg-[#18181B] text-neutral-900 dark:text-white border border-transparent dark:border-[#27272A]">1-8</kbd></span>
              <span>Help: <kbd className="px-1 rounded bg-slate-200 dark:bg-[#18181B] text-neutral-900 dark:text-white border border-transparent dark:border-[#27272A]">?</kbd></span>
              <span>Close: <kbd className="px-1 rounded bg-slate-200 dark:bg-[#18181B] text-neutral-900 dark:text-white border border-transparent dark:border-[#27272A]">Esc</kbd></span>
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
export default Navbar
