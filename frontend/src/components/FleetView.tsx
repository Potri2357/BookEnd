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
      slaBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
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
      slaBadgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
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
      slaBadgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      riskScore: 72,
      scenarioSummary: 'Hosts S4 (Severe Log Truncation - only 7d logs). Patch Assurance flags Cannot Verify.'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Fleet Executive Command Header */}
      <div className="soc-card-elevated p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                F18 MSSP MULTI-TENANT CONSOLE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> ROW-LEVEL TENANT ISOLATION
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1 tracking-tight">
              Managed Fleet Posture & Sovereign Tenant Portfolio
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Unified cross-client triage cockpit for Managed Security Service Providers (MSSPs). Cryptographic isolation guarantees zero cross-tenant log pollution.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">TOTAL FLEET ASSETS</span>
              <strong className="text-white text-base">90</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">ACTIVE COMPROMISES</span>
              <strong className="text-rose-400 text-base">4</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">LOOKBACK COVERAGE</span>
              <strong className="text-emerald-400 text-base">45 Days</strong>
            </div>
          </div>
        </div>

        {/* Global SLA Clocks Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">CERT-IN 6-HR STATUTORY CLOCK</span>
                <span className="text-white font-bold">1 Client Under Incident Notice</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
              ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">EMERGENCY 12-HR PATCH SLA</span>
                <span className="text-white font-bold">2 Decisions Pending Dual Approval</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              COUNTDOWN
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 text-[10px] block">DUCKDB FORENSIC ENGINE</span>
                <span className="text-white font-bold">~25,000 Events Indexed Columnar</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
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
            slaBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
            riskScore: 25,
            scenarioSummary: 'All systems within normal operating bounds.'
          }

          return (
            <div
              key={t.id}
              className="soc-card p-5 rounded-xl border border-slate-800 space-y-4 hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between"
              onClick={() => {
                onSelectTenant(t.id)
                onSelectView('queue')
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{t.name}</h3>
                      <p className="text-[11px] text-cyan-300 font-mono">{t.industry}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${stats.slaBadgeClass}`}>
                    {stats.slaStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="text-slate-500 text-[10px]">REGULATORY GOVERNANCE:</div>
                  <div className="text-slate-300 font-semibold">{stats.regulatoryBody}</div>
                  <div className="text-[11px] text-slate-500 pt-1">Region: <span className="text-slate-400">{t.region}</span></div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed">
                  <span className="font-mono text-[10px] text-slate-500 uppercase block mb-0.5">FORENSIC SCENARIO POSTURE:</span>
                  {stats.scenarioSummary}
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">ASSETS</span>
                    <strong className="text-slate-200">{stats.assets}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CRITICAL</span>
                    <strong className="text-amber-300">{stats.critical}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">EXPLOITED</span>
                    <strong className={stats.compromised > 0 ? 'text-rose-400 font-black' : 'text-slate-400'}>
                      {stats.compromised}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <button
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-800 text-slate-300 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
                >
                  Switch Context to {t.name} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
