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
        return <Server className="w-5 h-5 text-purple-600" />
      case 'database':
        return <Database className="w-5 h-5 text-amber-600" />
      case 'credential':
        return <Key className="w-5 h-5 text-rose-600" />
      case 'service':
        return <Lock className="w-5 h-5 text-[#0d9488]" />
      default:
        return <Network className="w-5 h-5 text-[#143e4c]" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Blast Radius Score HUD */}
      <div className={`p-5 rounded-2xl soc-card border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
        isHighRisk ? 'border-rose-300 bg-rose-50/20' : 'border-[#d2e8e5]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isHighRisk ? (
              <AlertOctagon className="w-5 h-5 text-rose-600 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#0d9488]" />
            )}
            <h3 className="text-base font-black text-[#113644] font-mono tracking-tight">
              Lateral Attack Surface & Blast Radius Engine
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase tracking-wider ${
              isHighRisk ? 'bg-rose-100 text-rose-800' : 'bg-[#e0f2f1] text-[#0d766e]'
            }`}>
              {isHighRisk ? 'Critical Pivot Risk' : 'Isolated Pivot'}
            </span>
          </div>
          <p className="text-xs text-[#4f717f] font-sans leading-relaxed max-w-2xl">
            {graph.summary}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-[#f0f7f6] p-3 rounded-xl border border-[#d2e8e5]">
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-[#557784] uppercase tracking-wider">
              Blast Radius Score
            </div>
            <div className={`text-2xl font-black font-mono ${
              isHighRisk ? 'text-rose-600' : 'text-[#0d9488]'
            }`}>
              {graph.blast_radius_score} <span className="text-xs text-[#7395a3] font-normal">/ 100</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-[#bfe0dc] flex items-center justify-center font-mono font-black text-xs">
            <span className={isHighRisk ? 'text-rose-600' : 'text-[#0d9488]'}>
              {isHighRisk ? 'CRIT' : 'LOW'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Topology Graph Visualizer */}
      <div className="soc-card p-5 rounded-2xl border border-[#d2e8e5] space-y-4 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e2efee] pb-3">
          <h4 className="font-bold text-[#113644] flex items-center gap-2 text-xs">
            <Zap className="w-4 h-4 text-[#0d9488]" />
            REACHABLE CROWN JEWELS & CREDENTIAL TRUST PATHS:
          </h4>
          <span className="text-[11px] text-[#557784]">Click any node to inspect risk parameters</span>
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
                className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                  isFocal
                    ? 'border-[#0d9488] bg-[#e0f2f1] shadow-xs'
                    : node.compromised
                    ? 'border-rose-300 bg-rose-50/40'
                    : isSelected
                    ? 'border-teal-400 bg-teal-50/30'
                    : 'bg-white border-[#d2e8e5] hover:border-[#99d5cf]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 font-bold text-[#113644]">
                    <div className="p-1.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5]">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-xs truncate">{node.label}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-black tracking-wider ${
                    node.criticality === 'critical'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-[#eaf4f3] text-[#3d6574]'
                  }`}>
                    {node.criticality}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#557784] flex items-center justify-between pt-2 border-t border-[#eaf4f3]">
                  <span>Type: <strong className="text-[#143e4c] uppercase">{node.type}</strong></span>
                  <span className={`font-bold ${
                    isFocal ? 'text-[#0d766e]' : node.compromised ? 'text-rose-600' : 'text-[#0d9488]'
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
          <div className="p-4 rounded-xl bg-[#f0f7f6] border border-[#bfe0dc] text-[#143e4c] space-y-2">
            <div className="flex items-center justify-between border-b border-[#d8ecea] pb-2 text-xs">
              <span className="font-bold text-[#143e4c] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0d9488]" />
                NODE INSPECTOR: {selectedNode.label} ({selectedNode.id})
              </span>
              <span className="text-[10px] text-[#557784]">Target Criticality: {selectedNode.criticality.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              <div>Resource Type: <strong className="text-[#143e4c] uppercase">{selectedNode.type}</strong></div>
              <div>Lateral Reachability: <strong className="text-amber-800">1 Direct Hop</strong></div>
              <div>Compromise Status: <strong className={selectedNode.compromised ? 'text-rose-600' : 'text-[#0d9488]'}>
                {selectedNode.compromised ? 'Active Exposure' : 'Protected'}
              </strong></div>
              <div>Recommended Action: <strong className="text-[#0d766e]">Quarantine Subnet Route</strong></div>
            </div>
          </div>
        )}

        {/* Identified Lateral Pivot Links */}
        <div className="pt-2">
          <h5 className="text-[11px] font-mono text-[#557784] uppercase tracking-wider mb-2 font-bold">
            Correlated Downstream Pivot Trajectories:
          </h5>
          <div className="space-y-1.5 font-mono text-xs">
            {graph.links.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#f0f7f6] border border-[#d2e8e5] text-[#143e4c]">
                <span className="text-[#0d766e] font-bold">{link.source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7397a6]" />
                <span className="text-[#143e4c] font-bold">{link.target}</span>
                <span className="text-[#c1dedb]">|</span>
                <span className="text-amber-800 font-medium text-[11px]">Relationship: {link.relationship}</span>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider" style={{
                  color: link.risk_level === 'high' ? '#be123c' : '#0d766e',
                  backgroundColor: link.risk_level === 'high' ? '#fee2e2' : '#e0f2f1',
                  border: link.risk_level === 'high' ? '1px solid #fecdd3' : '1px solid #a7f3d0'
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
