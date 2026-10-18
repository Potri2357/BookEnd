import React from 'react'
import {
  Building, ShieldCheck, AlertTriangle, Cpu,
  CheckCircle2, Clock, ShieldAlert, ArrowRight
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
  const tenantStats: Record<string, any> = {
    'meridian-finance': {
      assets: 30,
      critical: 8,
      compromised: 2,
      slaStatus: 'Action Required',
      slaColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    'harbor-logistics': {
      assets: 30,
      critical: 6,
      compromised: 1,
      slaStatus: 'Under Triage',
      slaColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    'lotus-clinics': {
      assets: 30,
      critical: 7,
      compromised: 1,
      slaStatus: 'Under Triage',
      slaColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-cyan-400" />
          Multi-Tenant MSSP Fleet (F18)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Unified decision overview across all serviced organisations. Database row-level security isolates tenant telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tenants.map((t) => {
          const stats = tenantStats[t.id] || { assets: 30, critical: 5, compromised: 0, slaStatus: 'Compliant' }
          return (
            <div
              key={t.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition cursor-pointer"
              onClick={() => {
                onSelectTenant(t.id)
                onSelectView('queue')
              }}
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                  <Building className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${stats.slaColor}`}>
                  {stats.slaStatus}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{t.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{t.industry}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Region: {t.region}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono text-xs">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TOTAL</span>
                  <strong className="text-slate-200">{stats.assets}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CRITICAL</span>
                  <strong className="text-amber-300">{stats.critical}</strong>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">COMPROMISED</span>
                  <strong className="text-rose-400">{stats.compromised}</strong>
                </div>
              </div>

              <button
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold transition flex items-center justify-center gap-1.5"
              >
                Open Client Queue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
