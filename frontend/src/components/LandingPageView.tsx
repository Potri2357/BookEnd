import React from 'react'
import {
  Shield, CheckCircle2, AlertTriangle, ArrowRight, Lock,
  Cpu, Database, FileCheck, Terminal, Layers, ExternalLink,
  Sparkles, Radio, KeyRound, Server
} from 'lucide-react'

interface LandingPageViewProps {
  onEnterConsole: () => void
  onOpenVerify: () => void
  onSelectScenario?: (scenarioId: string) => void
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterConsole,
  onOpenVerify,
  onSelectScenario
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans dark:bg-[#000000] dark:text-[#FFFFFF] transition-colors duration-200">
      {/* Top Banner */}
      <div className="bg-[#1D63ED] dark:bg-[#121214] dark:border-b dark:border-[#222225] text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-200 dark:text-white animate-pulse" />
        <span>Postern 2.0 Enterprise Hardening Live — Software Ed25519 Notary &amp; DuckDB Columnar Forensics</span>
        <button
          onClick={onEnterConsole}
          className="underline ml-2 font-bold hover:text-blue-100 dark:hover:text-slate-300 cursor-pointer"
        >
          Explore Console &rarr;
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-10 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[#1D63ED]/40 to-[#047857]/30 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-[#18181B] border border-blue-200 dark:border-[#27272A] text-[#1D63ED] dark:text-white text-xs font-mono font-bold tracking-wide">
            <Shield className="w-3.5 h-3.5 text-[#1D63ED] dark:text-white" />
            <span>POSTERN AIR-GAP ASSURANCE ENGINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] dark:text-white leading-[1.1]">
            Patch with Proof. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#1D63ED] via-[#2563EB] to-[#047857] dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              Never Compromise.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#8E8E93] leading-relaxed max-w-2xl mx-auto">
            The world's first cryptographic patch-gate engine. We prove the pre-advisory absence of exploitation before releasing security patches into critical infrastructure.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono text-xs">
            <button
              onClick={onEnterConsole}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1D63ED] hover:bg-[#154EC2] text-white dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#E4E4E7] font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Launch Incident Lead Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVerify}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-[#222225] text-slate-800 dark:text-[#E4E4E7] font-bold border border-slate-200 dark:border-[#27272A] shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" />
              <span>Verify Proof Pack</span>
            </button>
          </div>

          {/* Live Trust Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121214] border border-slate-200/80 dark:border-[#222225] backdrop-blur">
              <div className="text-xs font-mono text-slate-500 dark:text-[#8E8E93]">Benchmark Recall</div>
              <div className="text-xl font-black text-emerald-600 dark:text-[#34D399] font-mono">100%</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8E8E93]">Scenarios S1 → S6</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121214] border border-slate-200/80 dark:border-[#222225] backdrop-blur">
              <div className="text-xs font-mono text-slate-500 dark:text-[#8E8E93]">Forensics Query</div>
              <div className="text-xl font-black text-[#1D63ED] dark:text-white font-mono">&lt; 15ms</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8E8E93]">DuckDB Columnar</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121214] border border-slate-200/80 dark:border-[#222225] backdrop-blur">
              <div className="text-xs font-mono text-slate-500 dark:text-[#8E8E93]">Notary Signing</div>
              <div className="text-xl font-black text-purple-600 dark:text-white font-mono">Ed25519</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8E8E93]">RFC 8785 Canonical</div>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#121214] border border-slate-200/80 dark:border-[#222225] backdrop-blur">
              <div className="text-xs font-mono text-slate-500 dark:text-[#8E8E93]">Cloud Leaks</div>
              <div className="text-xl font-black text-emerald-600 dark:text-[#34D399] font-mono">0 Bytes</div>
              <div className="text-[11px] text-slate-500 dark:text-[#8E8E93]">Air-Gapped Ingress</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-[#222225]">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white">
            Enterprise Security Hardening Built-In
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#8E8E93] mt-2 max-w-xl mx-auto">
            From SIEM ingestion to zero-trust public cryptographic verification, every layer is audited and production-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#18181B] text-[#1D63ED] dark:text-white border border-blue-200 dark:border-[#27272A] flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
              Ingestion &amp; Live CVE Feeds
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E8E93] leading-relaxed mb-4">
              Real-time connectors for Wazuh and Elastic, CSV/JSON log ingestion, plus live hourly CISA KEV and FIRST.org EPSS exploit prediction scoring.
            </p>
            <ul className="text-xs space-y-1.5 font-mono text-slate-500 dark:text-[#8E8E93]">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Wazuh &amp; Elastic probe test</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> CISA KEV daily sync</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> DuckDB columnar storage</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#18181B] text-purple-600 dark:text-white border border-purple-200 dark:border-[#27272A] flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
              Multi-Tenancy &amp; RBAC
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E8E93] leading-relaxed mb-4">
              True organization isolation with per-tenant API keys (<code className="font-mono text-purple-600 dark:text-white">pg_&lt;tenant&gt;_...</code>) and granular roles for Analysts, Approvers, Auditors, and Admins.
            </p>
            <ul className="text-xs space-y-1.5 font-mono text-slate-500 dark:text-[#8E8E93]">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Enforced route authorization</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Non-repudiation user audit log</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Sliding window rate limiting</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#18181B] text-emerald-600 dark:text-[#34D399] border border-emerald-200 dark:border-[#27272A] flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">
              Public Verifiable Proof Packs
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#8E8E93] leading-relaxed mb-4">
              Independent auditability without trusting the vendor. Anyone can verify evidence bundles offline via the zero-dependency Python CLI or public web verifier.
            </p>
            <ul className="text-xs space-y-1.5 font-mono text-slate-500 dark:text-[#8E8E93]">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> <code className="text-xs">verify_proofpack.py</code> CLI</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Published public key registry</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399]" /> Signed key rotation delegation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Range Benchmarks Section */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 dark:bg-[#121214] rounded-3xl border border-slate-200 dark:border-[#222225] my-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-mono font-bold text-[#1D63ED] dark:text-white uppercase tracking-wider">
              Empirical Evaluation Range
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] dark:text-white mt-1">
              Deterministic Test Harness (Scenarios S1 → S6)
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#8E8E93] mt-1">
              Click any scenario to jump straight into the forensic asset analysis.
            </p>
          </div>
          <button
            onClick={onEnterConsole}
            className="px-4 py-2 bg-[#1D63ED] dark:bg-[#FFFFFF] dark:text-[#000000] dark:hover:bg-[#E4E4E7] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Launch All Scenarios &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
          {[
            { id: 'S1', title: 'Compromised Pre-Advisory', verdict: 'Likely Compromised', dot: 'bg-rose-400' },
            { id: 'S2', title: 'Clean & Well Covered', verdict: 'No Evidence Found', dot: 'bg-emerald-400' },
            { id: 'S3', title: 'Benign Look-Alike Noise', verdict: 'Benign Noise', dot: 'bg-amber-400' },
            { id: 'S4', title: 'Retention Gap Blind Spot', verdict: 'Cannot Verify', dot: 'bg-blue-400' },
            { id: 'S5', title: 'Patch Then Persist (Web Shell)', verdict: 'Reopen Trigger', dot: 'bg-purple-400' },
            { id: 'S6', title: 'Air-Gapped OT Controller', verdict: 'No Evidence Found', dot: 'bg-teal-400' },
          ].map((sc) => (
            <div
              key={sc.id}
              onClick={() => {
                if (onSelectScenario) onSelectScenario(sc.id)
                onEnterConsole()
              }}
              className="p-4 rounded-xl border border-slate-200 dark:border-[#27272A] bg-white dark:bg-[#18181B] hover:dark:bg-[#222225] cursor-pointer hover:shadow-md transition flex items-center justify-between text-slate-800 dark:text-white"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                <span className="text-xs font-mono font-bold mr-1">{sc.id}</span>
                <span className="text-xs font-bold">{sc.title}</span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-slate-200 dark:border-[#27272A] text-slate-600 dark:text-[#A1A1AA]">
                {sc.verdict}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#222225] py-8 px-4 text-center text-xs text-slate-500 dark:text-[#8E8E93] font-mono space-y-2">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="font-bold text-[#0F172A] dark:text-white">Postern / PatchGuard</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-[#34D399]">Apache 2.0 Open Source</span>
          <span>•</span>
          <button onClick={onOpenVerify} className="underline hover:text-blue-500 dark:hover:text-white cursor-pointer">Public Verifier</button>
          <span>•</span>
          <button onClick={onEnterConsole} className="underline hover:text-blue-500 dark:hover:text-white cursor-pointer">Incident Console</button>
        </div>
        <p>Ed25519 Software Notary (PKCS#11 HSM Architecture) · Sub-15ms Columnar Forensics</p>
      </footer>
    </div>
  )
}

export default LandingPageView
