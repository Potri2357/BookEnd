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
        isHighRisk ? 'border-rose-400/60 bg-rose-50/50' : 'border-[#E1E9F2] bg-white'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isHighRisk ? (
              <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            )}
            <h3 className="text-base font-black text-[#111B36] font-mono tracking-tight">
              Lateral Attack Surface & Blast Radius (V2 Engine)
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
              isHighRisk ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              {isHighRisk ? 'Critical Pivot Risk' : 'Isolated Pivot'}
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-sans leading-relaxed max-w-2xl">
            {graph.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-[#F7FAFD] p-3 rounded-xl border border-[#E1E9F2]">
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Blast Radius Score
            </div>
            <div className={`text-2xl font-black font-mono ${
              isHighRisk ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {graph.blast_radius_score} <span className="text-xs text-[#64748B] font-normal">/ 100</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-[#E1E9F2] flex items-center justify-center font-mono font-black text-xs bg-white">
            <span className={isHighRisk ? 'text-rose-600' : 'text-emerald-600'}>
              {isHighRisk ? 'CRIT' : 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer */}
      <div className="soc-card-elevated p-5 rounded-2xl border border-[#E1E9F2] space-y-4 font-mono text-xs bg-white">
        <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-3">
          <h4 className="font-bold text-[#111B36] flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-[#7194B7]" />
            REACHABLE CROWN JEWELS & CREDENTIAL TRUST PATHS:
          </h4>
          <span className="text-[11px] text-[#64748B]">Click any node to inspect risk parameters</span>
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
                    ? 'border-[#7194B7] bg-[#E6EEF7] shadow-sm'
                    : node.compromised
                    ? 'border-rose-300 bg-rose-50/60'
                    : isSelected
                    ? 'border-[#84A3C4] bg-[#F7FAFD]'
                    : 'bg-white border-[#E1E9F2]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 font-bold text-[#111B36]">
                    <div className="p-1.5 rounded-lg bg-[#F7FAFD] border border-[#E1E9F2]">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-xs truncate">{node.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-black tracking-wider ${
                    node.criticality === 'critical'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-[#E6EEF7] text-[#64748B]'
                  }`}>
                    {node.criticality}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#64748B] flex items-center justify-between pt-2 border-t border-[#E1E9F2]">
                  <span>Type: <strong className="text-[#111B36] uppercase">{node.type}</strong></span>
                  <span className={`font-bold ${
                    isFocal ? 'text-[#7194B7]' : node.compromised ? 'text-rose-600' : 'text-emerald-600'
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
          <div className="p-4 rounded-xl bg-[#F7FAFD] border border-[#7194B7]/40 text-[#111B36] space-y-2">
            <div className="flex items-center justify-between border-b border-[#E1E9F2] pb-2 text-xs">
              <span className="font-bold text-[#7194B7] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#7194B7]" />
                NODE INSPECTOR: {selectedNode.label} ({selectedNode.id})
              </span>
              <span className="text-[10px] text-[#64748B]">Target Criticality: {selectedNode.criticality.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div>Resource Type: <strong className="text-[#111B36] uppercase">{selectedNode.type}</strong></div>
              <div>Lateral Reachability: <strong className="text-amber-700">1 Direct Hop</strong></div>
              <div>Compromise Status: <strong className={selectedNode.compromised ? 'text-rose-600' : 'text-emerald-600'}>
                {selectedNode.compromised ? 'Active Exposure' : 'Protected'}
              </strong></div>
              <div>Recommended Action: <strong className="text-[#7194B7]">Quarantine Subnet Route</strong></div>
            </div>
          </div>
        )}

        {/* Identified Lateral Pivot Links */}
        <div className="pt-2">
          <h5 className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-2 font-bold">
            Correlated Downstream Pivot Trajectories:
          </h5>
          <div className="space-y-1.5 font-mono text-xs">
            {graph.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#F7FAFD] border border-[#E1E9F2] text-[#111B36]">
                <span className="text-[#7194B7] font-bold">{link.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-purple-700 font-bold">{link.target}</span>
                <span className="text-[#C1D0E2]">|</span>
                <span className="text-amber-700 font-medium text-[11px]">Relationship: {link.relationship}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider" style={{
                  color: link.risk_level === 'high' ? '#b91c1c' : '#0e7490',
                  backgroundColor: link.risk_level === 'high' ? '#fee2e2' : '#cffafe',
                  border: link.risk_level === 'high' ? '1px solid #fca5a5' : '1px solid #a5f3fc'
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
