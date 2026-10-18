import React, { useState } from 'react'
import {
  Network, Key, Database, Server,
  Lock, ArrowRight, ShieldCheck, AlertOctagon,
  Eye, Zap, ShieldAlert, Cpu
} from 'lucide-react'
import { BlastRadiusGraph, BlastRadiusNode } from '../types'

interface BlastRadiusViewProps {
  graph: BlastRadiusGraph
  hostName: string
}

export const BlastRadiusView: React.FC<BlastRadiusViewProps> = ({ graph, hostName }) => {
  const [selectedNode, setSelectedNode] = useState<BlastRadiusNode | null>(graph.nodes[0] || null)
  const isHighRisk = graph.blast_radius_score >= 50

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'dc':
        return <Server className="w-5 h-5 text-purple-400" />
      case 'database':
        return <Database className="w-5 h-5 text-amber-400" />
      case 'credential':
        return <Key className="w-5 h-5 text-rose-400" />
      case 'service':
        return <Lock className="w-5 h-5 text-cyan-400" />
      default:
        return <Network className="w-5 h-5 text-blue-400" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Blast Radius Score HUD */}
      <div className={`p-5 rounded-2xl soc-card-elevated border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isHighRisk ? 'border-rose-500/50 glow-crimson' : 'border-white/[0.08]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isHighRisk ? (
              <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
            <h3 className="text-base font-black text-white font-mono tracking-tight">
              Lateral Attack Surface & Blast Radius (V2 Engine)
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
              isHighRisk ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {isHighRisk ? 'Critical Pivot Risk' : 'Isolated Pivot'}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-2xl">
            {graph.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-black/40 p-3 rounded-xl border border-white/[0.08]">
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Blast Radius Score
            </div>
            <div className={`text-2xl font-black font-mono ${
              isHighRisk ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {graph.blast_radius_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center font-mono font-black text-xs">
            <span className={isHighRisk ? 'text-rose-400' : 'text-emerald-400'}>
              {isHighRisk ? 'CRIT' : 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer */}
      <div className="soc-card-elevated p-5 rounded-2xl border border-white/[0.08] space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <h4 className="font-bold text-slate-200 flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-cyan-400" />
            REACHABLE CROWN JEWELS & CREDENTIAL TRUST PATHS:
          </h4>
          <span className="text-[11px] text-slate-400">Click any node to inspect risk parameters</span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {graph.nodes.map((node) => {
            const isFocal = node.id === graph.root_node_id
            const isSelected = selectedNode?.id === node.id
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border transition cursor-pointer soc-card-interactive ${
                  isFocal
                    ? 'border-cyan-500/80 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                    : node.compromised
                    ? 'border-rose-500/60 bg-rose-950/20 glow-crimson'
                    : isSelected
                    ? 'border-purple-500/60 bg-purple-950/20'
                    : 'soc-card border-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 font-bold text-slate-100">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/[0.08]">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-xs truncate">{node.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-black tracking-wider ${
                    node.criticality === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {node.criticality}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span>Type: <strong className="text-slate-300 uppercase">{node.type}</strong></span>
                  <span className={`font-bold ${
                    isFocal ? 'text-cyan-300' : node.compromised ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {isFocal ? 'Focal Asset' : node.compromised ? 'Compromised' : 'Shielded Target'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="p-4 rounded-xl soc-card border border-cyan-500/30 text-slate-300 space-y-2">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-xs">
              <span className="font-bold text-cyan-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                NODE INSPECTOR: {selectedNode.label} ({selectedNode.id})
              </span>
              <span className="text-[10px] text-slate-400">Target Criticality: {selectedNode.criticality.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div>Resource Type: <strong className="text-slate-200 uppercase">{selectedNode.type}</strong></div>
              <div>Lateral Reachability: <strong className="text-amber-300">1 Direct Hop</strong></div>
              <div>Compromise Status: <strong className={selectedNode.compromised ? 'text-rose-400' : 'text-emerald-400'}>
                {selectedNode.compromised ? 'Active Exposure' : 'Protected'}
              </strong></div>
              <div>Recommended Action: <strong className="text-cyan-300">Quarantine Subnet Route</strong></div>
            </div>
          </div>
        )}

        {/* Identified Lateral Pivot Links */}
        <div className="pt-2">
          <h5 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
            Correlated Downstream Pivot Trajectories:
          </h5>
          <div className="space-y-1.5 font-mono text-xs">
            {graph.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-slate-300">
                <span className="text-cyan-400 font-bold">{link.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-purple-300 font-bold">{link.target}</span>
                <span className="text-slate-600">|</span>
                <span className="text-amber-300 font-medium text-[11px]">Relationship: {link.relationship}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider" style={{
                  color: link.risk_level === 'high' ? '#f87171' : '#67e8f9',
                  backgroundColor: link.risk_level === 'high' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                  border: link.risk_level === 'high' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(6, 182, 212, 0.3)'
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
