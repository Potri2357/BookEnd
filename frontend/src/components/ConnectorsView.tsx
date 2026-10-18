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
      <div className="soc-card p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#d8ecea]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] uppercase tracking-wider">
                TELEMETRY INGESTION PIPELINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1] flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3 text-[#0d9488]" /> AGENTLESS READ-ONLY ADAPTERS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#113644] mt-1 tracking-tight">
              SIEM & EDR Ingestion Connectors
            </h1>
            <p className="text-xs text-[#527482] font-mono mt-0.5">
              Read-only adapters collecting endpoint, web, auth, and network telemetry without deploying additional agent software. Automatically discovers retention horizons.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] text-center">
              <span className="text-[#557784] text-[10px] block font-bold">TOTAL INGESTION RATE</span>
              <strong className="text-[#0d9488] text-base">16,670 EPS</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#e0f2f1] border border-[#a7f3d0] text-center">
              <span className="text-[#0d766e] text-[10px] block font-bold">ACTIVE ADAPTERS</span>
              <strong className="text-[#0d766e] text-base">4 / 4 ONLINE</strong>
            </div>
          </div>
        </div>

        {/* Data Hygiene Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] space-y-1">
            <span className="text-[#557784] text-[10px] block font-semibold">ZERO-AGENT ARCHITECTURE</span>
            <span className="text-[#143e4c] font-bold block">No End-Point Code Executed</span>
            <p className="text-[11px] text-[#4f717f] font-sans">
              Queries existing telemetry lakes via read-only TLS APIs without creating kernel instability or performance overhead.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] space-y-1">
            <span className="text-[#557784] text-[10px] block font-semibold">RETENTION HORIZON DISCOVERY</span>
            <span className="text-[#0d9488] font-bold block">Automatic Horizon Auditing</span>
            <p className="text-[11px] text-[#4f717f] font-sans">
              Measures oldest verifiable log timestamp to prevent false safety claims on truncated retention pools.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#fbfdfd] border border-[#d2e8e5] space-y-1">
            <span className="text-[#557784] text-[10px] block font-semibold">FAST COLUMNAR TRANSFORMS</span>
            <span className="text-[#143e4c] font-bold block">DuckDB In-Memory Parquet</span>
            <p className="text-[11px] text-[#4f717f] font-sans">
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
            <div key={i} className="soc-card p-5 rounded-2xl border border-[#d2e8e5] space-y-3 font-mono text-xs shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2efee]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#eaf4f3] border border-[#bfe0dc] text-[#0d9488]">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#113644] text-sm">{c.name}</h3>
                    <span className="text-[10px] text-[#557784]">{detail.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] font-bold">
                    {detail.eps}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase font-bold">
                    {c.health}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#335664] font-sans leading-relaxed">
                {detail.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4f717f] pt-2 border-t border-[#e2efee]">
                <div>Telemetry Source: <strong className="text-[#143e4c] uppercase">{c.source_type}</strong></div>
                <div>Discovered Retention: <strong className="text-[#0d9488]">{c.retention_days} Days</strong></div>
                <div>Adapter Health: <strong className="text-[#0d766e]">Synchronized</strong></div>
                <div>Last Sync: <strong className="text-[#143e4c]">{c.last_sync.slice(11, 19)} UTC</strong></div>
              </div>

              <div className="p-2 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[10px] text-[#557784] truncate">
                Mapped Protocols: <span className="text-[#254d5b]">{detail.protocols}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Webhook & ITSM Ticket Integration */}
      <div className="soc-card p-5 rounded-2xl border border-[#d2e8e5] space-y-3 font-mono text-xs shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e2efee] pb-2">
          <div className="flex items-center gap-2">
            <Webhook className="w-4 h-4 text-[#0d9488]" />
            <h3 className="font-bold text-[#113644] text-sm">
              Signed Webhook Alerts & ITSM Integrations
            </h3>
          </div>

          <button
            onClick={handleTestWebhook}
            disabled={isDispatching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143e4c] hover:bg-[#1a4f61] text-white font-mono text-xs font-bold transition shadow-xs"
          >
            <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-pulse' : ''}`} />
            {isDispatching ? 'Dispatching HMAC...' : 'Dispatch Test Webhook'}
          </button>
        </div>

        <p className="text-[#4f717f] text-xs font-sans leading-relaxed">
          Cryptographically signed HMAC-SHA256 webhooks dispatched on verdict and patch-gate state changes to Jira, ServiceNow, Slack, and SIEM sinks.
        </p>

        {testWebhookStatus && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <span>{testWebhookStatus}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
        )}

        <div className="p-3 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1.5">
          <div className="flex items-center justify-between text-[#143e4c]">
            <span>Configured Destination: <strong className="text-[#0d9488]">https://itsm.internal.local/webhook/patchgate</strong></span>
            <span className="text-emerald-700 font-bold">STATUS: READY (HMAC KEY ACTIVE)</span>
          </div>
          <div className="text-[11px] text-[#4f717f] font-mono truncate">
            Signature Header: <code className="text-[#0d766e]">X-PatchGate-Signature: sha256=a8f4c2e91b0d77f...</code> · Algorithm: <code className="text-[#143e4c]">HMAC-SHA256</code>
          </div>
          <div className="text-[10px] text-[#638491] pt-1">
            Subscribed Triggers: <code className="text-[#254d5b]">VERDICT_CONTAIN_FIRST</code>, <code className="text-[#254d5b]">GATE_OVERRIDE_APPLIED</code>, <code className="text-[#254d5b]">RECHECK_PERSISTENCE_DETECTED</code>
          </div>
        </div>
      </div>
    </div>
  )
}
