import React, { useState, useEffect } from 'react'
import {
  Database, ShieldCheck, CheckCircle2, Upload,
  Webhook, Server, RefreshCw
} from 'lucide-react'
import { fetchConnectors } from '../api'

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConnectors().then((data) => {
      setConnectors(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Database className="w-6 h-6 text-cyan-400" />
          SIEM & EDR Connectors (F21 - V1)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Read-only adapters collecting endpoint, web, auth, and network telemetry without deploying additional agent software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((c, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-100">{c.name}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                {c.health}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <div>Telemetry Source: <strong className="text-slate-200 uppercase">{c.source_type}</strong></div>
              <div>Discovered Retention: <strong className="text-emerald-400">{c.retention_days} Days</strong></div>
              <div>Adapter Status: <strong className="text-cyan-300">Synchronized</strong></div>
              <div>Last Polled: <strong className="text-slate-300">{c.last_sync.slice(11, 19)} UTC</strong></div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook & ITSM Ticket Integration (F27) */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
        <h3 className="font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Webhook className="w-4 h-4 text-purple-400" />
          Signed Webhook Alerts & ITSM Integrations (F27)
        </h3>
        <p className="text-slate-400 text-[11px] font-sans">
          Signed HMAC-SHA256 webhooks dispatched on verdict and patch-gate state changes to Jira, ServiceNow, Slack, and SIEM sinks.
        </p>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>Destination: <strong>https://itsm.internal.local/webhook</strong></span>
            <span className="text-emerald-400">STATUS: DELIVERED (200 OK)</span>
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            Signature: sha256=a8f4c2e91b... · Event: GATE_OVERRIDE_APPLIED · HMAC Verified
          </div>
        </div>
      </div>
    </div>
  )
}
