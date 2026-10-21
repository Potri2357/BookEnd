import React, { useState, useEffect, useRef } from 'react'
import {
  Server, Cpu, HardDrive, Database, ShieldCheck,
  Activity, Terminal, RefreshCw, Key, Trash2,
  ExternalLink, Download, CheckCircle2, Lock,
  Layers, Radio, Zap, AlertCircle, Globe, Play, Pause
} from 'lucide-react'
import { fetchServerStatus, flushServerCache, rotateServerKeys } from '../api'
import { UserRole } from '../types'

interface ServerConsoleViewProps {
  currentRole?: UserRole
}

export const ServerConsoleView: React.FC<ServerConsoleViewProps> = ({ currentRole = 'admin' }) => {
  const isAdmin = currentRole === 'admin'
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
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans text-[#111B36] dark:text-[#FFFFFF]">

      {/* Enterprise Server Header Banner */}
      <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E1E9F2] dark:border-[#222225]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-[#EBF2FE] dark:bg-[#18181B] text-[#1D63ED] dark:text-white border border-[#BFDBFE] dark:border-[#27272A] uppercase tracking-wider">
                CORE INFRASTRUCTURE TELEMETRY
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-[#34D399] animate-pulse" />
                ENTERPRISE PRODUCTION AIR-GAPPED
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#F4F7FC] dark:bg-[#18181B] text-[#475569] dark:text-[#8E8E93] border border-[#E1E9F2] dark:border-[#27272A]">
                NODE: {serverData?.server?.node_id || 'pg-prod-ap-south-node01'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0F172A] dark:text-white mt-1.5 tracking-tight flex items-center gap-2">
              <Server className="w-6 h-6 text-[#1D63ED] dark:text-white" />
              Enterprise Assurance Server &amp; Cluster Infrastructure
            </h1>
            <p className="text-xs text-[#475569] dark:text-[#8E8E93] font-mono mt-0.5 font-sans">
              Real-time hardware utilization, DuckDB columnar cache, FIPS 140-3 HSM notary state, and live streaming ASGI server access logs.
            </p>
          </div>

          {/* Quick Server Action Controls */}
          <div className="flex items-center gap-2 flex-wrap shrink-0 font-mono text-xs">
            <button
              onClick={handleFlushCache}
              disabled={isFlushing || !isAdmin}
              className={`px-3 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                !isAdmin
                  ? 'bg-slate-200 dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] border-slate-300 dark:border-[#27272A] cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#222225] dark:hover:text-white'
              }`}
              title={isAdmin ? "Clear DuckDB columnar query cache" : "Admin role required to flush cache"}
            >
              <Trash2 className={`w-3.5 h-3.5 ${isFlushing ? 'animate-spin' : ''}`} />
              <span>{!isAdmin ? '🔒 Flush (Admin)' : isFlushing ? 'Flushing Cache...' : 'Flush Cache'}</span>
            </button>

            <button
              onClick={handleRotateKeys}
              disabled={isRotating || !isAdmin}
              className={`px-3 py-2 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                !isAdmin
                  ? 'bg-slate-200 dark:bg-[#18181B] text-slate-400 dark:text-[#71717A] border-slate-300 dark:border-[#27272A] cursor-not-allowed opacity-60'
                  : 'bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#222225] dark:hover:text-white'
              }`}
              title={isAdmin ? "Rotate ephemeral cryptographic notary session tokens" : "Admin role required to rotate keys"}
            >
              <Key className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{!isAdmin ? '🔒 Rotate (Admin)' : isRotating ? 'Rotating Keys...' : 'Rotate Keys'}</span>
            </button>

            <button
              onClick={handleDownloadSysdump}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] hover:bg-slate-50 dark:hover:bg-[#222225] dark:hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Export complete system diagnostic bundle"
            >
              <Download className="w-3.5 h-3.5" /> Sysdump
            </button>

            <a
              href="http://localhost:8008/docs"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#1D63ED] hover:bg-blue-700 text-white dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#E4E4E7] font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Swagger Docs
            </a>
          </div>
        </div>

        {/* Action Flash Feedback */}
        {actionMessage && (
          <div className="p-3 rounded-xl bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3A2F] text-[#047857] dark:text-[#34D399] text-xs font-mono flex items-center justify-between">
            <span>{actionMessage}</span>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          </div>
        )}

        {/* Top-Level Server Hardware Gauges */}
        {serverData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            {/* CPU Gauge */}
            <div className="p-3.5 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569] dark:text-[#8E8E93]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#1D63ED] dark:text-white" /> CPU UTILIZATION
                </span>
                <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold">8 Dedicated Cores</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                {serverData.hardware?.cpu?.utilization_percent}%
              </div>
              <div className="w-full bg-[#E1E9F2] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1D63ED] dark:bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, serverData.hardware?.cpu?.utilization_percent * 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] block truncate">
                {serverData.hardware?.cpu?.model}
              </span>
            </div>

            {/* RAM Gauge */}
            <div className="p-3.5 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569] dark:text-[#8E8E93]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> ECC PHYSICAL MEMORY
                </span>
                <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold">16.0 GB Total</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                {(serverData.hardware?.memory?.used_mb / 1024).toFixed(2)} GB
                <span className="text-xs text-[#64748B] dark:text-[#8E8E93] font-normal ml-1.5">
                  ({serverData.hardware?.memory?.utilization_percent}%)
                </span>
              </div>
              <div className="w-full bg-[#E1E9F2] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#047857] dark:bg-[#34D399] h-full rounded-full transition-all duration-500"
                  style={{ width: `${serverData.hardware?.memory?.utilization_percent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] block truncate">
                {serverData.hardware?.memory?.ecc_status}
              </span>
            </div>

            {/* DuckDB Columnar Cache */}
            <div className="p-3.5 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569] dark:text-[#8E8E93]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#1D63ED] dark:text-white" /> DUCKDB BUFFER POOL
                </span>
                <span className="text-[10px] text-[#1D63ED] dark:text-[#A1A1AA] font-bold">Hit: 99.4%</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                {serverData.hardware?.columnar_cache?.duckdb_buffer_pool_mb} MB
              </div>
              <div className="w-full bg-[#E1E9F2] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#1D63ED] dark:bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: '42%' }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] block truncate">
                {serverData.hardware?.columnar_cache?.cached_parquet_vectors.toLocaleString()} Columnar Vectors Cached
              </span>
            </div>

            {/* NVMe IOPS & Latency */}
            <div className="p-3.5 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1.5">
              <div className="flex items-center justify-between text-[#475569] dark:text-[#8E8E93]">
                <span className="text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> NVMe STORAGE &amp; I/O
                </span>
                <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold">Latency: 0.42ms</span>
              </div>
              <div className="text-2xl font-black text-[#0F172A] dark:text-white">
                142k IOPS
              </div>
              <div className="w-full bg-[#E1E9F2] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#047857] dark:bg-[#34D399] h-full rounded-full transition-all duration-500"
                  style={{ width: '18%' }}
                />
              </div>
              <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] block truncate">
                {serverData.hardware?.storage?.filesystem}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cluster Service Mesh & Topology */}
      {serverData && (
        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1D63ED] dark:text-white" />
              <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">
                Cluster Topology &amp; Active Microservice Mesh
              </h3>
            </div>
            <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold px-2 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3A2F]">
              4 / 4 NODES HEALTHY · HEARTBEAT 1s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {serverData.cluster_nodes?.map((node: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-2 hover:border-[#1D63ED] dark:hover:border-[#3F3F46] transition"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F172A] dark:text-white text-xs truncate">{node.node}</strong>
                  <span className="w-2 h-2 rounded-full bg-[#047857] dark:bg-[#34D399] animate-pulse" />
                </div>
                <div className="text-[11px] text-[#475569] dark:text-[#8E8E93] font-sans">
                  {node.role}
                </div>
                <div className="pt-2 border-t border-[#E1E9F2] dark:border-[#222225] space-y-1 text-[10px] text-[#64748B] dark:text-[#8E8E93]">
                  <div className="flex justify-between">
                    <span>IP / VLAN:</span>
                    <strong className="text-[#0F172A] dark:text-white">{node.ip}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Internal Latency:</span>
                    <strong className="text-[#047857] dark:text-[#34D399]">{node.latency_ms} ms</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Conns:</span>
                    <strong className="text-[#1D63ED] dark:text-white">{node.active_connections}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Live Server Console Terminal */}
      <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] space-y-3 font-mono text-xs shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#1D63ED] dark:text-white" />
            <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">
              Live Real-Time Server Console &amp; ASGI Stream
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#EBF2FE] dark:bg-[#18181B] text-[#1D63ED] dark:text-white border border-[#BFDBFE] dark:border-[#27272A] font-bold">
              PORT 8008 · ASYNC WORKERS
            </span>
          </div>

          {/* Terminal Filters and Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-[#F4F7FC] dark:bg-[#18181B] p-0.5 rounded-xl border border-[#E1E9F2] dark:border-[#27272A] text-[10px]">
              {['ALL', 'HTTP', 'DUCKDB', 'CRYPTO', 'AUDIT'].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setActiveLogFilter(flt)}
                  className={`px-2.5 py-1 rounded-lg transition font-bold cursor-pointer ${
                    activeLogFilter === flt
                      ? 'bg-[#1D63ED] dark:bg-white text-white dark:text-black shadow-xs'
                      : 'text-[#64748B] dark:text-[#8E8E93] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] text-slate-700 dark:text-[#E4E4E7] hover:bg-slate-50 dark:hover:bg-[#222225] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title={isStreaming ? 'Pause live log stream' : 'Resume live log stream'}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3 text-[#1D63ED] dark:text-white" /> Pause Stream
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#047857] dark:text-[#34D399]" /> Resume Stream
                </>
              )}
            </button>
          </div>
        </div>

        {/* High-Contrast Interactive Terminal Window */}
        <div className="bg-[#050507] text-[#E2E8F0] p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto space-y-1.5 border border-[#1E2638] dark:border-[#222225] shadow-inner select-text">
          <div className="text-[#64748B] dark:text-[#71717A] pb-1 border-b border-[#1E2638] dark:border-[#222225] text-[10px] flex items-center justify-between">
            <span>POSTERN-ENTERPRISE-SERVER // LOG BUFFER (TAIL 40 EVENTS)</span>
            <span className="text-[#38BDF8] dark:text-white font-bold">STREAM: {isStreaming ? 'LIVE (3s POLL)' : 'PAUSED'}</span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-[#64748B] dark:text-[#71717A] py-6 text-center">
              No log events matching filter '{activeLogFilter}' in buffer.
            </div>
          ) : (
            filteredLogs.map((log: any, idx: number) => {
              let levelColor = 'text-[#38BDF8] dark:text-white'
              if (log.level === 'WARN') levelColor = 'text-[#F59E0B] dark:text-[#FBBF24]'
              if (log.level === 'ERROR') levelColor = 'text-[#EF4444] dark:text-[#F87171]'
              if (log.level === 'AUDIT') levelColor = 'text-[#A855F7] dark:text-[#E4E4E7]'

              let subColor = 'bg-[#1E293B] dark:bg-[#18181B] text-[#94A3B8] dark:text-[#A1A1AA] border border-transparent dark:border-[#27272A]'
              if (log.subsystem === 'HTTP') subColor = 'bg-[#1E3A8A] dark:bg-[#18181B] text-[#93C5FD] dark:text-white border border-[#27272A]'
              if (log.subsystem === 'DUCKDB') subColor = 'bg-[#064E3B] dark:bg-[#121915] text-[#6EE7B7] dark:text-[#34D399] border border-[#1E3A2F]'
              if (log.subsystem === 'CRYPTO') subColor = 'bg-[#4C1D95] dark:bg-[#18181B] text-[#D8B4FE] dark:text-[#E4E4E7] border border-[#27272A]'
              if (log.subsystem === 'AUDIT') subColor = 'bg-[#701A75] dark:bg-[#18181B] text-[#F0ABFC] dark:text-[#A1A1AA] border border-[#27272A]'

              return (
                <div key={idx} className="flex items-start gap-2 hover:bg-[#18181B] px-1 py-0.5 rounded transition">
                  <span className="text-[#64748B] dark:text-[#71717A] shrink-0 text-[10px]">
                    {log.timestamp ? log.timestamp.slice(11, 23) : '00:00:00.000'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 uppercase ${subColor}`}>
                    {log.subsystem}
                  </span>
                  <span className={`font-bold shrink-0 text-[10px] ${levelColor}`}>
                    [{log.level}]
                  </span>
                  <span className="text-[#F1F5F9] dark:text-slate-200 break-all">
                    {log.message}
                  </span>
                  {log.correlation_id && (
                    <span className="text-[#475569] dark:text-[#71717A] text-[9px] ml-auto shrink-0 hidden md:inline">
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
        <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] space-y-3 font-mono text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">
                Cryptographic Hardware Standards &amp; Regulatory Compliance
              </h3>
            </div>
            <a
              href="http://localhost:8008/metrics"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-[#1D63ED] dark:text-white hover:underline flex items-center gap-1 font-bold"
            >
              <Activity className="w-3 h-3" /> View Prometheus /metrics
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {serverData.security_compliance?.compliance_frameworks?.map((fw: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-[#F4F7FC] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-[#0F172A] dark:text-white">{fw.name}</strong>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] font-bold">
                    {fw.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-[#8E8E93] font-sans">
                  {fw.controls}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E1E9F2] dark:border-[#222225] text-[10px] text-[#64748B] dark:text-[#8E8E93] flex items-center justify-between flex-wrap gap-2">
            <span>HSM Notary: <strong className="text-[#0F172A] dark:text-white">{serverData.security_compliance?.hsm_status}</strong></span>
            <span>Canonical Encoding: <strong className="text-[#1D63ED] dark:text-white">{serverData.security_compliance?.canonical_json_standard}</strong></span>
            <span>Audit Trail: <strong className="text-[#047857] dark:text-[#34D399]">{serverData.security_compliance?.audit_ledger_status}</strong></span>
            <span>Boundary: <strong className="text-[#047857] dark:text-[#34D399]">{serverData.security_compliance?.air_gap_boundary}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerConsoleView
