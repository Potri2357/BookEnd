import React from 'react'
import {
  Layers, ShieldAlert, Calendar, Terminal, Hash,
  CheckCircle2, FileText, ExternalLink, Code
} from 'lucide-react'
import { Advisory } from '../types'

interface AdvisoryDetailViewProps {
  advisory: Advisory
}

export const AdvisoryDetailView: React.FC<AdvisoryDetailViewProps> = ({ advisory }) => {
  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
            {advisory.exploitation_status.toUpperCase()}
          </span>
          <span className="text-xs font-mono text-slate-400">ID: {advisory.id}</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
          {advisory.title}
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Vendor: <strong className="text-slate-200">{advisory.vendor}</strong> · Product: <strong className="text-cyan-300">{advisory.product}</strong>
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[10px]">AFFECTED VERSIONS:</span>
          <div className="font-bold text-rose-300 mt-0.5">
            {advisory.affected_versions.join(' and ')}
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[10px]">VULNERABILITY CLASS:</span>
          <div className="font-bold text-slate-200 mt-0.5 truncate" title={advisory.vuln_class}>
            {advisory.vuln_class}
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[10px]">FIRST KNOWN EXPLOITATION:</span>
          <div className="font-bold text-amber-300 mt-0.5">
            {advisory.first_known_exploitation_date.slice(0, 10)} (5d Pre-Disclosure)
          </div>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[10px]">PUBLIC DISCLOSURE DATE:</span>
          <div className="font-bold text-cyan-300 mt-0.5">
            {advisory.disclosure_date.slice(0, 10)}
          </div>
        </div>
      </div>

      {/* Sentence-Level Citation Linking (F1 PRD Acceptance Criteria) */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Advisory Sentence Citations (F1 Ingestion Contract)
          </h3>
          <span className="text-[11px] text-slate-400">Untrusted Input Screened</span>
        </div>
        <p className="text-slate-400 text-[11px] font-sans">
          Each extracted hypothesis and indicator is strictly linked to a verified source sentence ID.
        </p>

        <div className="space-y-2">
          {advisory.source_sentences.map((sent) => (
            <div
              key={sent.id}
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition"
            >
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold shrink-0">
                {sent.id}
              </span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {sent.sentence}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted IOCs and Mitigations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-cyan-400" /> Extracted Indicators of Compromise:
          </h4>
          <div className="space-y-1">
            {advisory.indicators.map((ioc, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 select-all">
                <code>{ioc}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Required Post-Patch Cleanup Notes (F9):
          </h4>
          <ul className="space-y-1.5 list-disc list-inside text-slate-300 font-sans text-xs">
            {advisory.cleanup_notes.map((note, idx) => (
              <li key={idx} className="leading-relaxed">{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
