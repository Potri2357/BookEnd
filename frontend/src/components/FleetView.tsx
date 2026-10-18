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
      slaBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      riskScore: 88,
      scenarioSummary: 'Hosts S1 (Compromised Pre-Advisory) & S5 (Patch then Persist). Containment required before gate clearance.'
    },
    'harbor-logistics': {
      assets: 30,
      critical: 6,
      compromised: 1,
      retentionGap: false,
      regulatoryBody: 'National Maritime Security & Indian Ports Cyber Directives',
      slaStatus: 'CONTAINMENT TRIAGE',
      slaBadgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      riskScore: 64,
      scenarioSummary: 'Hosts S2 (Clean & Well Covered). Verified zero anomalies across 45-day lookback window.'
    },
    'lotus-clinics': {
      assets: 30,
      critical: 7,
      compromised: 1,
      retentionGap: true,
      regulatoryBody: 'DPDPA 2023 & Indian Healthcare Telemetry Retention Code',
      slaStatus: 'RETENTION GAP (15.6%)',
      slaBadgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      riskScore: 72,
      scenarioSummary: 'Hosts S4 (Severe Log Truncation - only 7d logs). PatchGate honestly flags Cannot Verify.'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Fleet Executive Command Header */}
      <div className="soc-card p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#d8ecea]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] uppercase tracking-wider">
                MSSP FLEET COMMAND CONSOLE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3 text-[#0d9488]" /> ROW-LEVEL TENANT ISOLATION
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#113644] mt-1 tracking-tight">
              Managed Fleet Posture & Sovereign Tenant Portfolio
            </h1>
            <p className="text-xs text-[#527482] font-mono mt-0.5">
              Unified cross-client triage cockpit for Managed Security Service Providers (MSSPs). Cryptographic isolation guarantees zero cross-tenant log pollution.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] text-center">
              <span className="text-[#557784] text-[10px] block font-bold">TOTAL FLEET ASSETS</span>
              <strong className="text-[#143e4c] text-base">90</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
              <span className="text-rose-700 text-[10px] block font-bold">ACTIVE COMPROMISES</span>
              <strong className="text-rose-600 text-base">4</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#e0f2f1] border border-[#a7f3d0] text-center">
              <span className="text-[#0d766e] text-[10px] block font-bold">LOOKBACK COVERAGE</span>
              <strong className="text-[#0d9488] text-base">45 Days</strong>
            </div>
          </div>
        </div>

        {/* Global SLA Clocks Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <div>
                <span className="text-[#557784] text-[10px] block font-semibold">CERT-IN 6-HR STATUTORY CLOCK</span>
                <span className="text-[#143e4c] font-bold">1 Client Under Incident Notice</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
              ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-[#557784] text-[10px] block font-semibold">EMERGENCY 12-HR PATCH SLA</span>
                <span className="text-[#143e4c] font-bold">2 Decisions Pending Dual Approval</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
              COUNTDOWN
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0d9488]" />
              <div>
                <span className="text-[#557784] text-[10px] block font-semibold">DUCKDB FORENSIC ENGINE</span>
                <span className="text-[#143e4c] font-bold">~25,000 Events Indexed Columnar</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#0d766e] px-2 py-0.5 rounded bg-[#e0f2f1] border border-[#a7f3d0]">
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
            slaBadgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
            riskScore: 25,
            scenarioSummary: 'All systems within normal operating bounds.'
          }

          return (
            <div
              key={t.id}
              className="soc-card p-5 rounded-2xl border border-[#d2e8e5] space-y-4 hover:border-[#0d9488] transition cursor-pointer flex flex-col justify-between shadow-xs"
              onClick={() => {
                onSelectTenant(t.id)
                onSelectView('queue')
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#eaf4f3] border border-[#bfe0dc] text-[#0d9488]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#113644] tracking-tight">{t.name}</h3>
                      <p className="text-[11px] text-[#0d766e] font-mono font-semibold">{t.industry}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${stats.slaBadgeClass}`}>
                    {stats.slaStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] text-xs font-mono space-y-1">
                  <div className="text-[#557784] text-[10px] font-bold">REGULATORY GOVERNANCE:</div>
                  <div className="text-[#143e4c] font-semibold">{stats.regulatoryBody}</div>
                  <div className="text-[11px] text-[#557784] pt-1">Region: <span className="text-[#254d5b]">{t.region}</span></div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] text-xs font-sans text-[#2f5564] leading-relaxed">
                  <span className="font-mono text-[10px] text-[#557784] uppercase block mb-0.5 font-bold">FORENSIC SCENARIO POSTURE:</span>
                  {stats.scenarioSummary}
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded bg-[#f0f7f6] border border-[#d2e8e5]">
                    <span className="text-[10px] text-[#557784] block font-bold">ASSETS</span>
                    <strong className="text-[#143e4c]">{stats.assets}</strong>
                  </div>
                  <div className="p-2 rounded bg-amber-50 border border-amber-200">
                    <span className="text-[10px] text-amber-800 block font-bold">CRITICAL</span>
                    <strong className="text-amber-800">{stats.critical}</strong>
                  </div>
                  <div className="p-2 rounded bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-rose-700 block font-bold">EXPLOITED</span>
                    <strong className={stats.compromised > 0 ? 'text-rose-600 font-black' : 'text-slate-400'}>
                      {stats.compromised}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e2efee]">
                <button
                  className="w-full py-2 px-3 rounded-lg bg-[#143e4c] hover:bg-[#1a4f61] text-white text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
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
