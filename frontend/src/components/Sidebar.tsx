import React from 'react'
import {
  LayoutDashboard, ShieldAlert, Bug, Server,
  FileText, Wrench, Award, Settings, Shield
} from 'lucide-react'

interface SidebarProps {
  currentView: string
  onSelectView: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Investigations', icon: ShieldAlert },
    { id: 'advisory', label: 'Vulnerabilities', icon: Bug },
    { id: 'fleet', label: 'Assets', icon: Server },
    { id: 'story', label: 'Evidence', icon: FileText },
    { id: 'remediation', label: 'Remediation', icon: Wrench },
    { id: 'audit', label: 'Reports', icon: Award },
    { id: 'connectors', label: 'Settings', icon: Settings }
  ]

  return (
    <aside className="w-56 shrink-0 bg-[#ebf1f7] border-r border-[#e2e8f0] flex flex-col justify-between min-h-screen py-5 px-3 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <span className="text-lg font-black tracking-tight text-[#0f172a]">
            PatchGate
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#dce7f5] text-[#255285] shadow-xs'
                    : 'text-[#566e89] hover:bg-[#e2eaf5] hover:text-[#0f172a]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#255285]' : 'text-[#64748b]'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      <div className="pt-4 border-t border-[#dbe4ef] px-2 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#d6e2f0] border border-[#c5d5e7] flex items-center justify-center text-xs font-bold text-[#1e3a5f]">
          SK
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#0f172a] truncate">Sarah Khan</div>
          <div className="text-[10px] text-[#64748b] truncate">Security Analyst</div>
        </div>
      </div>
    </aside>
  )
}
