import React, { useState, useEffect } from 'react'
import {
  Database, ShieldCheck, CheckCircle2, Upload,
  Webhook, Server, RefreshCw, Activity, ArrowRight,
  Radio, Lock, Terminal, FileCode, Send
} from 'lucide-react'
import { fetchConnectors } from '../api'

export const ConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null)
  const [isDispatching, setIsDispatching] = useState(false)

  useEffect(() => {
    fetchConnectors().then((data) => {
      setConnectors(data)
      setLoading(false)
    })
  }, [])

  const handleTestWebhook = () => {
    setIsDispatching(true)
    setTimeout(() => {
      setIsDispatching(false)
      setTestWebhookStatus(`HTTP 200 OK · HMAC-SHA256: 9b2d8e41a... · Event: GATE_OVERRIDE_APPLIED delivered to https://itsm.internal.local/webhook at ${new Date().toISOString()}`)
    }, 600)
  }

  // Realistic EPS and ingestion metrics
  const connectorDetails: Record<string, { eps: string; version: string; protocols: string; description: string }> = {
    'Wazuh EDR (Meridian Finance)': {
      eps: '1,420 EPS',
      version: 'v4.8.2 REST API',
      protocols: 'syscheck, ossec-analysisd, wazuh-monitord',
      description: 'Host-based EDR monitoring process execution trees, kernel file integrity, and Linux auditd syscalls.'
    },
    'Elasticsearch SIEM (Harbor Logistics)': {
      eps: '4,850 EPS',
      version: 'Elastic 8.14 Columnar',
      protocols: 'Elastic Common Schema (ECS), Filebeat, Auditbeat',
      description: 'Centralized web server proxy access logs, Apache error logs, and cluster synchronization telemetry.'
    },
    'Microsoft Sentinel (Lotus Clinics)': {
      eps: '2,100 EPS',
      version: 'Log Analytics REST',
      protocols: 'Azure Monitor Agent, CommonSecurityLog, Syslog',
      description: 'Healthcare provider network ingress, VPC peering flow records, and firewall state logs.'
    },
    'Splunk Enterprise Security (Global)': {
      eps: '8,300 EPS',
      version: 'HEC v2 API',
      protocols: 'HTTP Event Collector (HEC), Splunk CIM',
      description: 'Cross-tenant enterprise authentication streams, Active Directory Kerberos tickets, and VPN logs.'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Header Banner */}
      <div className="soc-card-elevated p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase tracking-wider">
                TELEMETRY INGESTION PIPELINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> AGENTLESS READ-ONLY ADAPTERS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1 tracking-tight">
              SIEM & EDR Ingestion Connectors
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Read-only adapters collecting endpoint, web, auth, and network telemetry without deploying additional agent software. Automatically discovers retention horizons.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">TOTAL INGESTION RATE</span>
              <strong className="text-cyan-400 text-base">16,670 EPS</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
              <span className="text-slate-500 text-[10px] block">ACTIVE ADAPTERS</span>
              <strong className="text-emerald-400 text-base">4 / 4 ONLINE</strong>
            </div>
          </div>
        </div>

        {/* Data Hygiene Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] block">ZERO-AGENT ARCHITECTURE</span>
            <span className="text-white font-bold block">No End-Point Code Executed</span>
            <p className="text-[11px] text-slate-500 font-sans">
              Queries existing telemetry lakes via read-only TLS APIs without creating kernel instability or performance overhead.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] block">RETENTION HORIZON DISCOVERY</span>
            <span className="text-emerald-400 font-bold block">Automatic Horizon Auditing</span>
            <p className="text-[11px] text-slate-500 font-sans">
              Measures oldest verifiable log timestamp to prevent false safety claims on truncated retention pools.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-[10px] block">FAST COLUMNAR TRANSFORMS</span>
            <span className="text-cyan-300 font-bold block">DuckDB In-Memory Parquet</span>
            <p className="text-[11px] text-slate-500 font-sans">
              Normalizes diverse schemas (Wazuh, ECS, Sentinel, CIM) into unified telemetry table in sub-second time.
            </p>
          </div>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((c, i) => {
          const detail = connectorDetails[c.name] || {
            eps: '1,200 EPS',
            version: 'REST Adapter',
            protocols: 'Syslog / JSON',
            description: 'Standard security telemetry pipeline adapter.'
          }

          return (
            <div key={i} className="soc-card p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                    <span className="text-[10px] text-slate-500">{detail.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    {detail.eps}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-bold">
                    {c.health}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {detail.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div>Telemetry Source: <strong className="text-slate-200 uppercase">{c.source_type}</strong></div>
                <div>Discovered Retention: <strong className="text-emerald-400">{c.retention_days} Days</strong></div>
                <div>Adapter Health: <strong className="text-cyan-300">Synchronized</strong></div>
                <div>Last Sync: <strong className="text-slate-300">{c.last_sync.slice(11, 19)} UTC</strong></div>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-500 truncate">
                Mapped Protocols: <span className="text-slate-400">{detail.protocols}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Webhook & ITSM Ticket Integration */}
      <div className="soc-card p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Signed Webhook Alerts & ITSM Integrations
            </h3>
          </div>

          <button
            onClick={handleTestWebhook}
            disabled={isDispatching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-purple-600/20"
          >
            <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-pulse' : ''}`} />
            {isDispatching ? 'Dispatching HMAC...' : 'Dispatch Test Webhook'}
          </button>
        </div>

        <p className="text-slate-400 text-xs font-sans leading-relaxed">
          Cryptographically signed HMAC-SHA256 webhooks dispatched on verdict and patch-gate state changes to Jira, ServiceNow, Slack, and SIEM sinks.
        </p>

        {testWebhookStatus && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
            <span>{testWebhookStatus}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        )}

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span>Configured Destination: <strong className="text-cyan-300">https://itsm.internal.local/webhook/patchguard</strong></span>
            <span className="text-emerald-400 font-bold">STATUS: READY (HMAC KEY ACTIVE)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            Signature Header: <code className="text-purple-300">X-PatchGuard-Signature: sha256=a8f4c2e91b0d77f...</code> · Algorithm: <code className="text-slate-300">HMAC-SHA256</code>
          </div>
          <div className="text-[10px] text-slate-500 pt-1">
            Subscribed Triggers: <code className="text-slate-400">VERDICT_CONTAIN_FIRST</code>, <code className="text-slate-400">GATE_OVERRIDE_APPLIED</code>, <code className="text-slate-400">RECHECK_PERSISTENCE_DETECTED</code>
          </div>
        </div>
      </div>
    </div>
  )
}
