import React from 'react'
import {
  Network, ShieldAlert, Key, Database, Server,
  Lock, ArrowRight, ShieldCheck, AlertOctagon
} from 'lucide-react'
import { BlastRadiusGraph } from '../types'

interface BlastRadiusViewProps {
  graph: BlastRadiusGraph
  hostName: string
}

export const BlastRadiusView: React.FC<BlastRadiusViewProps> = ({ graph, hostName }) => {
  const isHighRisk = graph.blast_radius_score >= 50

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'dc':
        return <Server className="w-4 h-4 text-purple-400" />
      case 'database':
        return <Database className="w-4 h-4 text-amber-400" />
      case 'credential':
        return <Key className="w-4 h-4 text-rose-400" />
      case 'service':
        return <Lock className="w-4 h-4 text-cyan-400" />
      default:
        return <Network className="w-4 h-4 text-blue-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Blast Radius Score HUD */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isHighRisk ? 'bg-rose-950/20 border-rose-500/40 glow-rose' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            {isHighRisk ? (
              <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="text-base font-bold text-white">Blast Radius & Lateral Pivot Graph (V2)</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {graph.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Lateral Risk Score</div>
            <div className={`text-2xl font-black font-mono ${
              isHighRisk ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {graph.blast_radius_score}/100
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-bold text-xs">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                isHighRisk ? 'bg-rose-500/20 text-rose-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isHighRisk ? 'HIGH' : 'LOW'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Topology Visualizer */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          DOWNSTREAM REACHABLE TARGETS & CREDENTIAL TRUSTS:
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {graph.nodes.map((node) => {
            const isFocal = node.id === graph.root_node_id
            return (
              <div
                key={node.id}
                className={`p-3.5 rounded-lg border transition ${
                  isFocal
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                    : node.compromised
                    ? 'border-rose-500/50 bg-rose-950/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-100">
                    {getNodeIcon(node.type)}
                    <span>{node.label}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                    node.criticality === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {node.criticality}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Type: <strong className="text-slate-300">{node.type}</strong></span>
                  <span className={node.compromised ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {isFocal ? 'Focal Asset' : node.compromised ? 'Exposed' : 'Shielded'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lateral Paths Table */}
        <div className="mt-5 border-t border-slate-800/80 pt-4">
          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Identified Pivot Paths:
          </h5>
          <div className="space-y-1.5 font-mono text-xs">
            {graph.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-950/60 border border-slate-800/60 text-slate-300">
                <span className="text-cyan-400 font-semibold">{link.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-purple-300 font-semibold">{link.target}</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-300 font-medium">Rel: {link.relationship}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider" style={{
                  color: link.risk_level === 'high' ? '#f87171' : '#67e8f9',
                  backgroundColor: link.risk_level === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(6, 182, 212, 0.1)'
                }}>
                  {link.risk_level} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
