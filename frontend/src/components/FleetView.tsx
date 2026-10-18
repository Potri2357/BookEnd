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
      slaBadgeClass: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
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
      slaBadgeClass: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
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
      slaBadgeClass: 'bg-[#E6EEF7] text-[#5E82A7] border-[#C1D0E2]',
      riskScore: 72,
      scenarioSummary: 'Hosts S4 (Severe Log Truncation - only 7d logs). Postern flags Cannot Verify.'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Fleet Executive Command Header */}
      <div className="glass-card p-6 rounded-2xl border border-white/80 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-[#EBF2FE] text-[#1D63ED] border border-[#BFDBFE] uppercase tracking-wider">
                MSSP FLEET COMMAND CONSOLE
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> ROW-LEVEL TENANT ISOLATION
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] mt-1.5 tracking-tight">
              Managed Fleet Posture & Sovereign Tenant Portfolio
            </h1>
            <p className="text-xs text-[#475569] mt-0.5 font-sans">
              Unified cross-client triage cockpit for Managed Security Service Providers (MSSPs). Cryptographic isolation guarantees zero cross-tenant log pollution.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2E8F0] text-center shadow-2xs">
              <span className="text-[#475569] text-[10px] block">TOTAL FLEET ASSETS</span>
              <strong className="text-[#0F172A] text-base">90</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2E8F0] text-center shadow-2xs">
              <span className="text-[#475569] text-[10px] block">ACTIVE COMPROMISES</span>
              <strong className="text-[#DC2626] text-base">4</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2E8F0] text-center shadow-2xs">
              <span className="text-[#475569] text-[10px] block">LOOKBACK COVERAGE</span>
              <strong className="text-[#047857] text-base">45 Days</strong>
            </div>
          </div>
        </div>

        {/* Global SLA Clocks Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-white/80 border border-[#E2E8F0] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DC2626]" />
              <div>
                <span className="text-[#475569] text-[10px] block">CERT-IN 6-HR STATUTORY CLOCK</span>
                <span className="text-[#0F172A] font-bold">1 Client Under Incident Notice</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#DC2626] px-2.5 py-0.5 rounded-full bg-[#FEE2E2] border border-[#FECACA]">
              ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B45309]" />
              <div>
                <span className="text-[#64748B] text-[10px] block">EMERGENCY 12-HR PATCH SLA</span>
                <span className="text-[#111B36] font-bold">2 Decisions Pending Dual Approval</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#B45309] px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A]">
              COUNTDOWN
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#7194B7]" />
              <div>
                <span className="text-[#64748B] text-[10px] block">DUCKDB FORENSIC ENGINE</span>
                <span className="text-[#111B36] font-bold">~25,000 Events Indexed Columnar</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#047857] px-2 py-0.5 rounded bg-[#D1FAE5] border border-[#A7F3D0]">
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
            slaBadgeClass: 'bg-[#D1FAE5] text-[#047857] border-[#A7F3D0]',
            riskScore: 25,
            scenarioSummary: 'All systems within normal operating bounds.'
          }

          return (
            <div
              key={t.id}
              className="glass-card p-5 rounded-2xl border border-white/80 space-y-4 hover:border-[#BFDBFE] transition cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-lg"
              onClick={() => {
                onSelectTenant(t.id)
                onSelectView('queue')
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF2FE] text-[#1D63ED] flex items-center justify-center shadow-2xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] tracking-tight">{t.name}</h3>
                      <p className="text-[11px] text-[#1D63ED] font-mono">{t.industry}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border uppercase font-bold ${stats.slaBadgeClass}`}>
                    {stats.slaStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2E8F0] text-xs font-mono space-y-1 shadow-2xs">
                  <div className="text-[#475569] text-[10px] font-semibold">REGULATORY GOVERNANCE:</div>
                  <div className="text-[#0F172A] font-semibold">{stats.regulatoryBody}</div>
                  <div className="text-[11px] text-[#475569] pt-1">Region: <span className="text-[#0F172A] font-semibold">{t.region}</span></div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-[#E2E8F0] text-xs font-sans text-[#0F172A] leading-relaxed shadow-2xs">
                  <span className="font-mono text-[10px] text-[#475569] uppercase font-bold block mb-0.5">FORENSIC SCENARIO POSTURE:</span>
                  {stats.scenarioSummary}
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                  <div className="p-2 rounded-xl bg-white/80 border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#475569] block font-semibold">ASSETS</span>
                    <strong className="text-[#0F172A]">{stats.assets}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#475569] block font-semibold">CRITICAL</span>
                    <strong className="text-[#B45309]">{stats.critical}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/80 border border-[#E2E8F0] shadow-2xs">
                    <span className="text-[10px] text-[#475569] block font-semibold">EXPLOITED</span>
                    <strong className={stats.compromised > 0 ? 'text-[#DC2626] font-black' : 'text-[#475569]'}>
                      {stats.compromised}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0]">
                <button
                  className="chip-btn chip-btn-primary w-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-mono font-bold"
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
