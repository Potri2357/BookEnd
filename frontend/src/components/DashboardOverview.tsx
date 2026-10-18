import React, { useState } from 'react'
import {
  ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Plus,
  Filter, MoreHorizontal, ChevronLeft, ChevronRight, Server,
  Clock, Shield, Activity, TrendingUp, BarChart3
} from 'lucide-react'
import { QueueItem } from '../types'

interface DashboardOverviewProps {
  queue: QueueItem[]
  onSelectAsset: (assetId: string) => void
  onNavigateToQueue: () => void
  onNavigateToAdvisory: () => void
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  queue,
  onSelectAsset,
  onNavigateToQueue,
  onNavigateToAdvisory
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'in_progress' | 'awaiting' | 'closed'>('all')

  const cases = [
    {
      id: 'INV-001',
      cve: 'CVE-2024-3094',
      cveTitle: 'XZ Utils Backdoor (SSH Ingress)',
      severity: 'Critical',
      affectedAssets: 12,
      exploitationStatus: 'Actively exploited',
      dueDate: 'Oct 28, 2026',
      status: 'In Progress',
      assetId: 'ast-001-vpn-gw'
    },
    {
      id: 'INV-002',
      cve: 'CVE-2024-6387',
      cveTitle: 'regreSSHion Signal Handler RCE',
      severity: 'High',
      affectedAssets: 8,
      exploitationStatus: 'Exploit available',
      dueDate: 'Oct 31, 2026',
      status: 'Awaiting Action',
      assetId: 'ast-002-app-srv'
    },
    {
      id: 'INV-003',
      cve: 'CVE-2024-27198',
      cveTitle: 'JetBrains TeamCity Auth Bypass',
      severity: 'High',
      affectedAssets: 15,
      exploitationStatus: 'Unknown',
      dueDate: 'Oct 29, 2026',
      status: 'In Progress',
      assetId: 'ast-003-db-lead'
    },
    {
      id: 'INV-004',
      cve: 'CVE-2024-12345',
      cveTitle: 'SSL VPN Heap Buffer Overflow',
      severity: 'Medium',
      affectedAssets: 6,
      exploitationStatus: 'Possible exploitation',
      dueDate: 'Nov 2, 2026',
      status: 'Open',
      assetId: 'ast-004-dmz-api'
    },
    {
      id: 'INV-005',
      cve: 'CVE-2024-56789',
      cveTitle: 'PostgreSQL Privilege Escalation',
      severity: 'Medium',
      affectedAssets: 4,
      exploitationStatus: 'Unknown',
      dueDate: 'Nov 5, 2026',
      status: 'Open',
      assetId: 'ast-005-jump-host'
    },
    {
      id: 'INV-006',
      cve: 'CVE-2024-98736',
      cveTitle: 'OpenSSL Remote Buffer Overflow',
      severity: 'High',
      affectedAssets: 3,
      exploitationStatus: 'Exploit available',
      dueDate: 'Oct 27, 2026',
      status: 'In Progress',
      assetId: 'ast-006-win-dc'
    }
  ]

  const affectedAssets = [
    { name: 'web-server-01', ip: '10.0.1.15', pct: 90, assetId: 'ast-001-vpn-gw' },
    { name: 'web-server-02', ip: '10.0.1.16', pct: 80, assetId: 'ast-002-app-srv' },
    { name: 'app-server-03', ip: '10.0.2.27', pct: 60, assetId: 'ast-003-db-lead' },
    { name: 'dev-server-01', ip: '10.0.3.44', pct: 30, assetId: 'ast-004-dmz-api' }
  ]

  const topVulnerableAssets = [
    { name: 'web-server-01', vulns: 12, severity: 'Critical', assetId: 'ast-001-vpn-gw' },
    { name: 'web-server-02', vulns: 9, severity: 'High', assetId: 'ast-002-app-srv' },
    { name: 'app-server-03', vulns: 8, severity: 'High', assetId: 'ast-003-db-lead' },
    { name: 'dev-server-01', vulns: 5, severity: 'Medium', assetId: 'ast-004-dmz-api' },
    { name: 'db-server-01', vulns: 4, severity: 'Medium', assetId: 'ast-005-jump-host' }
  ]

  const recentActivity = [
    { title: 'Suspicious activity detected', subtitle: 'web-server-01', time: '2 hours ago', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { title: 'Investigation started', subtitle: 'CVE-2024-3094', time: '6 hours ago', icon: Activity, color: 'text-blue-600 bg-blue-50' },
    { title: 'Asset scan completed', subtitle: 'app-server-03', time: '12 hours ago', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Patch applied', subtitle: 'web-server-02', time: '1 day ago', icon: ShieldCheck, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Verification pending', subtitle: 'dev-server-01', time: '1 day ago', icon: Clock, color: 'text-slate-600 bg-slate-100' }
  ]

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Top Greeting Bar matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">
            Good Morning, Sarah
          </h1>
          <p className="text-xs text-[#64748b] mt-0.5 font-medium">
            Monitor, investigate, and remediate vulnerabilities across your environment.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right text-[11px] font-mono text-[#64748b]">
            <div className="font-semibold text-[#334155]">Oct 20, 2026</div>
            <div>Tuesday, 14:25</div>
          </div>

          <button
            onClick={onNavigateToQueue}
            className="flex items-center gap-2 px-4 py-2 bg-[#3b6998] hover:bg-[#325a82] text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Row matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Cases */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#64748b]">Total Cases</div>
            <div className="text-2xl font-black text-[#0f172a]">24</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span>↑ 12% from last month</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#e8f1fb] text-[#2563eb] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            {/* Sparkline curve SVG */}
            <svg className="w-20 h-6 text-[#93c5fd]" viewBox="0 0 80 24" fill="none">
              <path d="M0 18 Q 20 22, 40 12 T 80 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Critical */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#64748b]">Critical</div>
            <div className="text-2xl font-black text-[#0f172a]">5</div>
            <div className="text-[10px] text-rose-600 font-semibold">Immediate triage required</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#eef2f8] text-[#5278a3] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <svg className="w-20 h-6 text-[#94a3b8]" viewBox="0 0 80 24" fill="none">
              <path d="M0 12 Q 25 8, 45 16 T 80 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: High */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#64748b]">High</div>
            <div className="text-2xl font-black text-[#0f172a]">8</div>
            <div className="text-[10px] text-amber-600 font-semibold">Under active monitoring</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#eef2f8] text-[#7ba4d5] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <svg className="w-20 h-6 text-[#94a3b8]" viewBox="0 0 80 24" fill="none">
              <path d="M0 16 Q 20 6, 50 18 T 80 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Completed */}
        <div className="bg-white rounded-2xl p-4 border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#64748b]">Completed</div>
            <div className="text-2xl font-black text-[#0f172a]">4</div>
            <div className="text-[10px] text-emerald-600 font-semibold">Verified with Proof Pack</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <svg className="w-20 h-6 text-[#a7f3d0]" viewBox="0 0 80 24" fill="none">
              <path d="M0 20 Q 30 18, 55 10 T 80 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Section: Investigations Table + Vulnerability Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Investigations Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden">
          {/* Card Header & Filter Pills */}
          <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#0f172a]">
              Investigations
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {[
                { id: 'all', label: 'All (24)' },
                { id: 'open', label: 'Open (12)' },
                { id: 'in_progress', label: 'In Progress (7)' },
                { id: 'awaiting', label: 'Awaiting Action (4)' },
                { id: 'closed', label: 'Closed (4)' }
              ].map((f) => {
                const isActive = activeFilter === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-[#4a729e] text-white shadow-xs'
                        : 'text-[#64748b] hover:bg-[#edf2f8] hover:text-[#0f172a]'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}

              <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:bg-[#edf2f8] transition ml-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Table matching screenshot */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-[#64748b] border-b border-[#e2e8f0] text-[11px] font-semibold">
                <tr>
                  <th className="p-3 w-8">
                    <input type="checkbox" className="rounded border-slate-300" />
                  </th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Advisory / CVE</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Affected Assets</th>
                  <th className="p-3">Exploitation Status</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectAsset(c.assetId)}
                    className="hover:bg-[#f8fafc] cursor-pointer transition"
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="p-3 font-mono font-bold text-[#334155]">{c.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-[#0f172a] hover:text-[#2563eb] transition">
                        {c.cve}
                      </div>
                      <div className="text-[10px] text-[#64748b] truncate max-w-xs">{c.cveTitle}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        c.severity === 'Critical'
                          ? 'bg-[#5278a3] text-white'
                          : c.severity === 'High'
                          ? 'bg-[#7ba4d5] text-white'
                          : 'bg-[#94a3b8] text-white'
                      }`}>
                        {c.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold text-[#334155]">{c.affectedAssets}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-medium ${
                        c.exploitationStatus === 'Actively exploited'
                          ? 'text-[#0284c7] font-semibold'
                          : 'text-[#475569]'
                      }`}>
                        {c.exploitationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-[#64748b] font-mono text-[11px]">{c.dueDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.status === 'In Progress'
                          ? 'bg-[#e0ecfb] text-[#1d4ed8]'
                          : c.status === 'Awaiting Action'
                          ? 'bg-[#fef3c7] text-[#92400e]'
                          : 'bg-[#f1f5f9] text-[#475569]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="text-[#94a3b8] hover:text-[#0f172a] p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#64748b]">
            <span>Showing 1–6 of 24 cases</span>
            <div className="flex items-center gap-1 font-semibold">
              <button className="p-1 rounded border border-[#e2e8f0] hover:bg-[#edf2f8]">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-6 h-6 rounded bg-[#4a729e] text-white flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-[#edf2f8] flex items-center justify-center text-xs">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-[#edf2f8] flex items-center justify-center text-xs">
                3
              </button>
              <button className="w-6 h-6 rounded hover:bg-[#edf2f8] flex items-center justify-center text-xs">
                4
              </button>
              <button className="p-1 rounded border border-[#e2e8f0] hover:bg-[#edf2f8]">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Rail: Vulnerability Overview & Affected Assets (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Vulnerability Overview Donut Card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Vulnerability Overview
            </h3>

            <div className="flex items-center justify-center gap-6 py-2">
              {/* Donut Chart representation */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  {/* Low (4) */}
                  <circle cx="50" cy="50" r="38" stroke="#cbd5e1" strokeWidth="12" strokeDasharray="40 200" strokeDashoffset="0" fill="none" />
                  {/* Medium (7) */}
                  <circle cx="50" cy="50" r="38" stroke="#94a3b8" strokeWidth="12" strokeDasharray="60 200" strokeDashoffset="-40" fill="none" />
                  {/* High (8) */}
                  <circle cx="50" cy="50" r="38" stroke="#7ba4d5" strokeWidth="12" strokeDasharray="70 200" strokeDashoffset="-100" fill="none" />
                  {/* Critical (5) */}
                  <circle cx="50" cy="50" r="38" stroke="#5278a3" strokeWidth="12" strokeDasharray="50 200" strokeDashoffset="-170" fill="none" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[#0f172a]">24</span>
                  <span className="text-[9px] font-bold uppercase text-[#64748b]">Total Cases</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5278a3]" />
                    <span className="text-[#475569]">Critical</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">5</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7ba4d5]" />
                    <span className="text-[#475569]">High</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">8</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                    <span className="text-[#475569]">Medium</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">7</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                    <span className="text-[#475569]">Low</span>
                  </div>
                  <span className="font-bold text-[#0f172a]">4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Affected Assets Card matching screenshot */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0f172a]">
                Affected Assets
              </h3>
              <button
                onClick={onNavigateToQueue}
                className="text-[11px] font-semibold text-[#3b6998] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {affectedAssets.map((asset) => (
                <div
                  key={asset.name}
                  onClick={() => onSelectAsset(asset.assetId)}
                  className="flex items-center justify-between gap-3 text-xs p-1.5 hover:bg-[#f8fafc] rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Server className="w-4 h-4 text-[#7ba4d5] shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-[#0f172a] truncate">{asset.name}</div>
                      <div className="text-[10px] text-[#64748b] font-mono">{asset.ip}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-2 rounded-full bg-[#edf2f8] overflow-hidden">
                      <div
                        className="h-full bg-[#5278a3] rounded-full"
                        style={{ width: `${asset.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#334155] w-7 text-right">
                      {asset.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: 3 Cards matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Vulnerability Trends */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Vulnerability Trends
            </h3>
            <select className="text-[11px] bg-[#edf2f8] border border-transparent rounded-lg px-2 py-1 text-[#475569] font-medium focus:outline-none">
              <option>Last 30 days</option>
              <option>Last 60 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          {/* Bar Chart representation */}
          <div className="pt-2">
            <div className="h-28 flex items-end justify-between gap-1.5 px-2 border-b border-[#e2e8f0] pb-1">
              {[7, 9, 5, 8, 12, 10, 11, 14, 17, 12, 13, 15, 9, 12].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                  <div
                    className={`w-full rounded-t-sm transition-all ${
                      idx % 3 === 0 ? 'bg-[#5278a3]' : idx % 2 === 0 ? 'bg-[#7ba4d5]' : 'bg-[#bfdbfe]'
                    }`}
                    style={{ height: `${val * 5}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] font-mono text-[#64748b] pt-1 px-1">
              <span>Sep 21</span>
              <span>Sep 28</span>
              <span>Oct 5</span>
              <span>Oct 12</span>
              <span>Oct 19</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-[#64748b] pt-1">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5278a3]" /> Critical</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7ba4d5]" /> High</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#94a3b8]" /> Medium</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#cbd5e1]" /> Low</span>
          </div>
        </div>

        {/* Card 2: Top Vulnerable Assets */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Top Vulnerable Assets
            </h3>
            <button
              onClick={onNavigateToQueue}
              className="text-[11px] font-semibold text-[#3b6998] hover:underline"
            >
              View All
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="text-[#64748b] border-b border-[#e2e8f0] text-[10px] uppercase font-semibold">
              <tr>
                <th className="pb-2">Asset Name</th>
                <th className="pb-2">Vulnerabilities</th>
                <th className="pb-2 text-right">Highest Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {topVulnerableAssets.map((asset) => (
                <tr
                  key={asset.name}
                  onClick={() => onSelectAsset(asset.assetId)}
                  className="hover:bg-[#f8fafc] cursor-pointer transition"
                >
                  <td className="py-2.5 flex items-center gap-2 font-bold text-[#0f172a]">
                    <Server className="w-3.5 h-3.5 text-[#7ba4d5]" />
                    <span>{asset.name}</span>
                  </td>
                  <td className="py-2.5 font-mono font-semibold text-[#334155]">
                    {asset.vulns}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      asset.severity === 'Critical'
                        ? 'bg-[#5278a3] text-white'
                        : asset.severity === 'High'
                        ? 'bg-[#7ba4d5] text-white'
                        : 'bg-[#94a3b8] text-white'
                    }`}>
                      {asset.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card 3: Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Recent Activity
            </h3>
            <button
              onClick={onNavigateToQueue}
              className="text-[11px] font-semibold text-[#3b6998] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="relative pl-6 space-y-4 pt-1 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#e2e8f0]">
            {recentActivity.map((act, i) => {
              const Icon = act.icon
              return (
                <div key={i} className="relative flex items-start justify-between gap-3 text-xs">
                  <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border border-white ${act.color} shadow-xs`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0f172a]">{act.title}</div>
                    <div className="text-[11px] text-[#64748b] font-mono">{act.subtitle}</div>
                  </div>
                  <span className="text-[10px] text-[#94a3b8] shrink-0 font-mono">
                    {act.time}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
