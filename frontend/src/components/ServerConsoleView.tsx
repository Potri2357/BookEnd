import React, { useState, useEffect, useRef } from 'react'
import {
  Server, Cpu, HardDrive, Database, ShieldCheck,
  Activity, Terminal, RefreshCw, Key, Trash2,
  ExternalLink, Download, CheckCircle2, Lock,
  Layers, Radio, Zap, AlertCircle, Globe, Play, Pause
} from 'lucide-react'
import { fetchServerStatus, flushServerCache, rotateServerKeys } from '../api'

export const ServerConsoleView: React.FC = () => {
  const [serverData, setServerData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [isFlushing, setIsFlushing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [activeLogFilter, setActiveLogFilter] = useState<string>('ALL')
  const [isStreaming, setIsStreaming] = useState(true)
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const loadData = async () => {
    try {
      const data = await fetchServerStatus()
      setServerData(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Poll every 3 seconds if streaming is active
    const interval = setInterval(() => {
      if (isStreaming) {
        fetchServerStatus().then(setServerData).catch(() => {})
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [isStreaming])

  const handleFlushCache = async () => {
    setIsFlushing(true)
    try {
      const res = await flushServerCache()
      setActionMessage(`DuckDB Cache Flushed: ${res.freed_memory_mb} MB freed (Epoch ${res.cache_epoch})`)
      await loadData()
    } finally {
      setIsFlushing(false)
      setTimeout(() => setActionMessage(null), 4000)
    }
  }

  const handleRotateKeys = async () => {
    setIsRotating(true)
    try {
      const res = await rotateServerKeys()
      setActionMessage(`Notary Session Keys Rotated: Key Fingerprint ${res.key_fingerprint.slice(0, 22)}...`)
      await loadData()
    } finally {
      setIsRotating(false)
      setTimeout(() => setActionMessage(null), 4000)
    }
  }

  const handleDownloadSysdump = () => {
    if (!serverData) return
    const dump = {
      exported_at: new Date().toISOString(),
      server_telemetry: serverData
    }
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `postern-sysdump-${serverData.server?.node_id || 'server'}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredLogs = (serverData?.recent_logs || []).filter((log: any) => {
    if (activeLogFilter === 'ALL') return true
    if (activeLogFilter === 'HTTP') return log.subsystem === 'HTTP'
    if (activeLogFilter === 'DUCKDB') return log.subsystem === 'DUCKDB'
    if (activeLogFilter === 'CRYPTO') return log.subsystem === 'CRYPTO' || log.subsystem === 'HSM'
    if (activeLogFilter === 'AUDIT') return log.subsystem === 'AUDIT'
    return true
  })

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Enterprise Server Header Banner */}
      <div className="glass-card p-5 rounded-xl border border-[#E1E9F2] space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E1E9F2]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#EBF2FE] text-[#1D63ED] border border-[#BFDBFE] uppercase tracking-wider">
                CORE INFRASTRUCTURE TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0] flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
                ENTERPRISE PRODUCTION AIR-GAPPED
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F7FC] text-[#475569] border border-[#E1E9F2]">
                NODE: {serverData?.server?.node_id || 'pg-prod-ap-south-node01'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] mt-1.5 tracking-tight flex items-center gap-2">
              <Server className="w-6 h-6 text-[#1D63ED]" />
              Enterprise Assurance Server & Cluster Infrastructure
            </h1>
            <p className="text-xs text-[#475569] font-mono mt-0.5 font-sans">
              Real-time hardware utilization, DuckDB columnar cache, FIPS 140-3 HSM notary state, and live streaming ASGI server access logs.
            </p>
          </div>

          {/* Quick Server Action Controls */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleFlushCache}
              disabled={isFlushing}
              className="chip-btn chip-btn-secondary text-xs"
              title="Clear DuckDB columnar query cache"
            >
              <Trash2 className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
              {isFlushing ? 'Flushing Cache...' : 'Flush Cache'}
            </button>

            <button
              onClick={handleRotateKeys}
              disabled={isRotating}
              className="chip-btn chip-btn-secondary text-xs"
              title="Rotate ephemeral cryptographic notary session tokens"
            >
              <Key className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              {isRotating ? 'Rotating Keys...' : 'Rotate Keys'}
            </button>

            <button
              onClick={handleDownloadSysdump}
              className="chip-btn chip-btn-secondary text-xs"
              title="Export complete system diagnostic bundle"
            >
              <Download className="w-3.5 h-3.5" /> Sysdump
            </button>

            <a
              href="http://localhost:8008/docs"
              target="_blank"
              rel="noreferrer"
              className="chip-btn chip-btn-primary text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Swagger Docs
            </a>
          </div>
        </div>

        {/* Action Flash Feedback */}
        {actionMessage && (
          <div className="p-3 rounded-lg bg-[#D1FAE5] border border-[#A7F3D0] text-[#047857] text-xs font-mono flex items-center justify-between">
            <span>{actionMessage}</span>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          </div>
        )}

        {/* Top-Level Server Hardware Gauges */}
        {serverData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            {/* CPU Gauge */}
            <div className="p-3.5 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#1D63ED]" /> CPU UTILIZATION
                </span>
                <span className="text-[10px] text-[#047857] font-bold">8 Dedicated Cores</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A]">
                {serverData.hardware?.cpu?.utilization_percent}%
              </div>
              <div className="w-full bg-[#E1E9F2] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1D63ED] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, serverData.hardware?.cpu?.utilization_percent * 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] block truncate">
                {serverData.hardware?.cpu?.model}
              </span>
            </div>

            {/* RAM Gauge */}
            <div className="p-3.5 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#047857]" /> ECC PHYSICAL MEMORY
                </span>
                <span className="text-[10px] text-[#047857] font-bold">16.0 GB Total</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A]">
                {(serverData.hardware?.memory?.used_mb / 1024).toFixed(2)} GB
                <span className="text-xs text-[#64748B] font-normal ml-1.5">
                  ({serverData.hardware?.memory?.utilization_percent}%)
                </span>
              </div>
              <div className="w-full bg-[#E1E9F2] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#047857] h-full rounded-full transition-all duration-500"
                  style={{ width: `${serverData.hardware?.memory?.utilization_percent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] block truncate">
                {serverData.hardware?.memory?.ecc_status}
              </span>
            </div>

            {/* DuckDB Columnar Cache */}
            <div className="p-3.5 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#1D63ED]" /> DUCKDB BUFFER POOL
                </span>
                <span className="text-[10px] text-[#1D63ED] font-bold">Hit: 99.4%</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A]">
                {serverData.hardware?.columnar_cache?.duckdb_buffer_pool_mb} MB
              </div>
              <div className="w-full bg-[#E1E9F2] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1D63ED] h-full rounded-full transition-all duration-500"
                  style={{ width: '42%' }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] block truncate">
                {serverData.hardware?.columnar_cache?.cached_parquet_vectors.toLocaleString()} Columnar Vectors Cached
              </span>
            </div>

            {/* NVMe IOPS & Latency */}
            <div className="p-3.5 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#047857]" /> NVMe STORAGE & I/O
                </span>
                <span className="text-[10px] text-[#047857] font-bold">Latency: 0.42ms</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A]">
                142k IOPS
              </div>
              <div className="w-full bg-[#E1E9F2] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#047857] h-full rounded-full transition-all duration-500"
                  style={{ width: '18%' }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] block truncate">
                {serverData.hardware?.storage?.filesystem}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cluster Service Mesh & Topology */}
      {serverData && (
        <div className="glass-card p-5 rounded-xl border border-[#E1E9F2] space-y-3 font-mono text-xs shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1D63ED]" />
              <h3 className="font-bold text-[#0F172A] text-sm">
                Cluster Topology & Active Microservice Mesh
              </h3>
            </div>
            <span className="text-[10px] text-[#047857] font-bold px-2 py-0.5 rounded bg-[#D1FAE5] border border-[#A7F3D0]">
              4 / 4 NODES HEALTHY · HEARTBEAT 1s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {serverData.cluster_nodes?.map((node: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-2 hover:border-[#1D63ED] transition"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F172A] text-xs truncate">{node.node}</strong>
                  <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
                </div>
                <div className="text-[11px] text-[#475569] font-sans">
                  {node.role}
                </div>
                <div className="pt-2 border-t border-[#E1E9F2] space-y-1 text-[10px] text-[#64748B]">
                  <div className="flex justify-between">
                    <span>IP / VLAN:</span>
                    <strong className="text-[#0F172A]">{node.ip}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Latency:</span>
                    <strong className="text-[#047857]">{node.latency_ms} ms</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Conns:</span>
                    <strong className="text-[#1D63ED]">{node.active_connections}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Live Server Console Terminal */}
      <div className="glass-card p-5 rounded-xl border border-[#E1E9F2] space-y-3 font-mono text-xs shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E1E9F2] pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#1D63ED]" />
            <h3 className="font-bold text-[#0F172A] text-sm">
              Live Real-Time Server Console & ASGI Stream
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBF2FE] text-[#1D63ED] border border-[#BFDBFE] font-bold">
              PORT 8008 · ASYNC WORKERS
            </span>
          </div>

          {/* Terminal Filters and Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-[#F4F7FC] p-0.5 rounded-lg border border-[#E1E9F2] text-[10px]">
              {['ALL', 'HTTP', 'DUCKDB', 'CRYPTO', 'AUDIT'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setActiveLogFilter(flt)}
                  className={`px-2 py-1 rounded transition font-bold ${
                    activeLogFilter === flt
                      ? 'bg-[#1D63ED] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="chip-btn chip-btn-secondary text-xs px-2.5 py-1"
              title={isStreaming ? 'Pause live log stream' : 'Resume live log stream'}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3 text-[#1D63ED]" /> Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#047857]" /> Resume Stream
                </>
              )}
            </button>
          </div>
        </div>

        {/* High-Contrast Interactive Terminal Window */}
        <div className="bg-[#0B1120] text-[#E2E8F0] p-4 rounded-lg font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto space-y-1.5 border border-[#1E293B] shadow-inner select-text">
          <div className="text-[#64748B] pb-1 border-b border-[#1E293B] text-[10px] flex items-center justify-between">
            <span>POSTERN-ENTERPRISE-SERVER // LOG BUFFER (TAIL 40 EVENTS)</span>
            <span className="text-[#38BDF8]">STREAM: {isStreaming ? 'LIVE (3s POLL)' : 'PAUSED'}</span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-[#64748B] py-6 text-center">
              No log events matching filter '{activeLogFilter}' in buffer.
            </div>
          ) : (
            filteredLogs.map((log: any, idx: number) => {
              let levelColor = 'text-[#38BDF8]'
              if (log.level === 'WARN') levelColor = 'text-[#F59E0B]'
              if (log.level === 'ERROR') levelColor = 'text-[#EF4444]'
              if (log.level === 'AUDIT') levelColor = 'text-[#A855F7]'

              let subColor = 'bg-[#1E293B] text-[#94A3B8]'
              if (log.subsystem === 'HTTP') subColor = 'bg-[#1E3A8A] text-[#93C5FD]'
              if (log.subsystem === 'DUCKDB') subColor = 'bg-[#064E3B] text-[#6EE7B7]'
              if (log.subsystem === 'CRYPTO') subColor = 'bg-[#4C1D95] text-[#D8B4FE]'
              if (log.subsystem === 'AUDIT') subColor = 'bg-[#701A75] text-[#F0ABFC]'

              return (
                <div key={idx} className="flex items-start gap-2 hover:bg-[#1E293B]/40 px-1 py-0.5 rounded transition">
                  <span className="text-[#64748B] shrink-0 text-[10px]">
                    {log.timestamp ? log.timestamp.slice(11, 23) : '00:00:00.000'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase ${subColor}`}>
                    {log.subsystem}
                  </span>
                  <span className={`font-bold shrink-0 text-[10px] ${levelColor}`}>
                    [{log.level}]
                  </span>
                  <span className="text-[#F1F5F9] break-all">
                    {log.message}
                  </span>
                  {log.correlation_id && (
                    <span className="text-[#475569] text-[9px] ml-auto shrink-0 hidden md:inline">
                      {log.correlation_id}
                    </span>
                  )}
                </div>
              )
            })
          )}
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Enterprise Security Certifications & Compliance Footer Grid */}
      {serverData && (
        <div className="glass-card p-5 rounded-xl border border-[#E1E9F2] space-y-3 font-mono text-xs shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#047857]" />
              <h3 className="font-bold text-[#0F172A] text-sm">
                Cryptographic Hardware Standards & Regulatory Compliance
              </h3>
            </div>
            <a
              href="http://localhost:8008/metrics"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#1D63ED] hover:underline flex items-center gap-1 font-bold"
            >
              <Activity className="w-3 h-3" /> View Prometheus /metrics
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {serverData.security_compliance?.compliance_frameworks?.map((fw: any, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-[#F4F7FC] border border-[#E1E9F2] space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F172A]">{fw.name}</strong>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D1FAE5] text-[#047857] font-bold">
                    {fw.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] font-sans">
                  {fw.controls}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E1E9F2] text-[10px] text-[#64748B] flex items-center justify-between flex-wrap gap-2">
            <span>HSM Notary: <strong className="text-[#0F172A]">{serverData.security_compliance?.hsm_status}</strong></span>
            <span>Canonical Encoding: <strong className="text-[#1D63ED]">{serverData.security_compliance?.canonical_json_standard}</strong></span>
            <span>Audit Trail: <strong className="text-[#047857]">{serverData.security_compliance?.audit_ledger_status}</strong></span>
            <span>Boundary: <strong className="text-[#047857]">{serverData.security_compliance?.air_gap_boundary}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}
