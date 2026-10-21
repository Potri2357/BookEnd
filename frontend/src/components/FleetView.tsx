import React from 'react'
import {
  Building2, ShieldCheck, AlertTriangle, Cpu,
  CheckCircle2, Clock, ShieldAlert, ArrowRight,
  Server, Lock, Database, Activity, BarChart2,
  Layers, Users, Sparkles
} from 'lucide-react'
import { Tenant } from '../types'

interface FleetViewProps {
  tenants: Tenant[]
  onSelectTenant: (tenantId: string) => void
  onSelectView: (view: string) => void
}

export const FleetView: React.FC<FleetViewProps> = ({
  tenants,
  onSelectTenant,
  onSelectView
}) => {
  const tenantStats: Record<string, {
    assets: number
    critical: number
    compromised: number
    retentionGap: boolean
    regulatoryBody: string
    slaStatus: string
    slaBadgeClass: string
    riskScore: number
    scenarioSummary: string
  }> = {
    'meridian-finance': {
      assets: 30,
      critical: 8,
      compromised: 2,
      retentionGap: false,
      regulatoryBody: 'RBI Master Direction on Cyber Security & CERT-In Rule 12',
      slaStatus: 'URGENT: 12H SLA CLOCK ACTIVE',
      slaBadgeClass: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA] dark:bg-[#1A1314] dark:text-[#F87171] dark:border-[#3D1F23]',
      riskScore: 88,
      scenarioSummary: 'Hosts S2 (Active Compromise) & S5 (Web-facing DB with persistence). Containment required.'
    },
    'harbor-logistics': {
      assets: 30,
      critical: 6,
      compromised: 1,
      retentionGap: false,
      regulatoryBody: 'National Maritime Security & Indian Ports Cyber Directives',
      slaStatus: 'CONTAINMENT TRIAGE',
      slaBadgeClass: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A] dark:bg-[#1A1713] dark:text-[#FBBF24] dark:border-[#3B2D18]',
      riskScore: 64,
      scenarioSummary: 'Hosts S3 (Post-Patch Webshell Active). Binary was patched but backdoor persists on disk.'
    },
    'lotus-clinics': {
      assets: 30,
      critical: 7,
      compromised: 1,
      retentionGap: true,
      regulatoryBody: 'DPDPA 2023 & Indian Healthcare Telemetry Retention Code',
      slaStatus: 'RETENTION GAP (15.6%)',
      slaBadgeClass: 'bg-[#E6EEF7] text-[#5E82A7] border-[#C1D0E2] dark:bg-[#18181B] dark:text-[#E4E4E7] dark:border-[#27272A]',
      riskScore: 72,
      scenarioSummary: 'Hosts S4 (Severe Log Truncation - only 7d logs). Postern flags Cannot Verify.'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans text-[#111B36] dark:text-[#FFFFFF]">
      {/* Fleet Executive Command Header */}
      <div className="bg-white dark:bg-[#121214] p-6 rounded-2xl border border-slate-200 dark:border-[#222225] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#222225]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-[#EBF2FE] dark:bg-[#18181B] text-[#1D63ED] dark:text-[#FFFFFF] border border-[#BFDBFE] dark:border-[#27272A] uppercase tracking-wider">
                MSSP FLEET COMMAND CONSOLE
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> ROW-LEVEL TENANT ISOLATION
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] dark:text-white mt-1.5 tracking-tight">
              Managed Fleet Posture &amp; Sovereign Tenant Portfolio
            </h1>
            <p className="text-xs text-[#475569] dark:text-[#8E8E93] mt-0.5 font-sans">
              Unified cross-client triage cockpit for Managed Security Service Providers (MSSPs). Cryptographic isolation guarantees zero cross-tenant log pollution.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-center shadow-2xs">
              <span className="text-[#475569] dark:text-[#8E8E93] text-[10px] block">TOTAL FLEET ASSETS</span>
              <strong className="text-[#0F172A] dark:text-white text-base">90</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-center shadow-2xs">
              <span className="text-[#475569] dark:text-[#8E8E93] text-[10px] block">ACTIVE COMPROMISES</span>
              <strong className="text-[#DC2626] dark:text-[#F87171] text-base">4</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-center shadow-2xs">
              <span className="text-[#475569] dark:text-[#8E8E93] text-[10px] block">LOOKBACK COVERAGE</span>
              <strong className="text-[#047857] dark:text-[#34D399] text-base">45 Days</strong>
            </div>
          </div>
        </div>

        {/* Global SLA Clocks Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" />
              <div>
                <span className="text-[#475569] dark:text-[#8E8E93] text-[10px] block">CERT-IN 6-HR STATUTORY CLOCK</span>
                <span className="text-[#0F172A] dark:text-white font-bold">1 Client Under Incident Notice</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#DC2626] dark:text-[#F87171] px-2.5 py-0.5 rounded bg-[#FEE2E2] dark:bg-[#1A1314] border border-[#FECACA] dark:border-[#3D1F23]">
              ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24]" />
              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block">EMERGENCY 12-HR PATCH SLA</span>
                <span className="text-[#111B36] dark:text-white font-bold">2 Decisions Pending Dual Approval</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#B45309] dark:text-[#FBBF24] px-2 py-0.5 rounded bg-[#FEF3C7] dark:bg-[#1A1713] border border-[#FDE68A] dark:border-[#3B2D18]">
              COUNTDOWN
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1D63ED] dark:text-[#A1A1AA]" />
              <div>
                <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block">DUCKDB FORENSIC ENGINE</span>
                <span className="text-[#111B36] dark:text-white font-bold">~25,000 Events Indexed Columnar</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#047857] dark:text-[#34D399] px-2 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3A2F]">
              HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* Tenant Portfolio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tenants.map((t) => {
          const stats = tenantStats[t.id] || {
            assets: 30,
            critical: 5,
            compromised: 0,
            retentionGap: false,
            regulatoryBody: 'Indian Cybersecurity Framework',
            slaStatus: 'COMPLIANT',
            slaBadgeClass: 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0] dark:bg-[#121915] dark:text-[#34D399] dark:border-[#1E3A2F]',
            riskScore: 25,
            scenarioSummary: 'All systems within normal operating bounds.'
          }

          return (
            <div
              key={t.id}
              className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-slate-200 dark:border-[#222225] space-y-4 hover:border-slate-400 dark:hover:border-[#3F3F46] transition cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
              onClick={() => {
                onSelectTenant(t.id)
                onSelectView('queue')
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] dark:bg-[#18181B] text-[#1D63ED] dark:text-white flex items-center justify-center border border-[#BFDBFE] dark:border-[#27272A] shadow-2xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight">{t.name}</h3>
                      <p className="text-[11px] text-[#1D63ED] dark:text-[#A1A1AA] font-mono">{t.industry}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-bold ${stats.slaBadgeClass}`}>
                    {stats.slaStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs font-mono space-y-1 shadow-2xs">
                  <div className="text-[#475569] dark:text-[#8E8E93] text-[10px] font-semibold">REGULATORY GOVERNANCE:</div>
                  <div className="text-[#0F172A] dark:text-white font-semibold">{stats.regulatoryBody}</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#8E8E93] pt-1">Region: <span className="text-[#0F172A] dark:text-white font-semibold">{t.region}</span></div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] text-xs font-sans text-[#0F172A] dark:text-slate-200 leading-relaxed shadow-2xs">
                  <span className="font-mono text-[10px] text-[#475569] dark:text-[#8E8E93] uppercase font-bold block mb-0.5">FORENSIC SCENARIO POSTURE:</span>
                  {stats.scenarioSummary}
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-2xs">
                    <span className="text-[10px] text-[#475569] dark:text-[#8E8E93] block font-semibold">ASSETS</span>
                    <strong className="text-[#0F172A] dark:text-white">{stats.assets}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-2xs">
                    <span className="text-[10px] text-[#475569] dark:text-[#8E8E93] block font-semibold">CRITICAL</span>
                    <strong className="text-[#B45309] dark:text-[#FBBF24]">{stats.critical}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#18181B] border border-slate-200 dark:border-[#27272A] shadow-2xs">
                    <span className="text-[10px] text-[#475569] dark:text-[#8E8E93] block font-semibold">EXPLOITED</span>
                    <strong className={stats.compromised > 0 ? 'text-[#DC2626] dark:text-[#F87171] font-black' : 'text-[#475569] dark:text-[#8E8E93]'}>
                      {stats.compromised}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#222225]">
                <button
                  className="w-full py-2.5 px-4 rounded-xl bg-[#111B36] hover:bg-[#1D63ED] text-white dark:bg-[#18181B] dark:hover:bg-[#222225] dark:text-white dark:border dark:border-[#27272A] flex items-center justify-center gap-2 text-xs font-mono font-bold transition cursor-pointer"
                >
                  <span>Switch Context to {t.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FleetView
