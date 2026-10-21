import React from 'react'
import { X, Keyboard, Shield, CornerDownLeft } from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null

  const shortcuts = [
    { key: '1', action: 'Decision Queue', desc: 'Prioritized SLA triage queue with search, filters, and pagination' },
    { key: '2', action: 'Threat Intelligence', desc: 'Live CISA KEV and FIRST.org EPSS threat catalog' },
    { key: '3', action: 'MSSP Fleet Posture', desc: 'Multi-tenant organization asset and vulnerability breakdown' },
    { key: '4', action: 'SIEM & EDR Ingress', desc: 'Wazuh, Elastic connectors and CSV/JSON log upload' },
    { key: '5', action: 'Validation Benchmark', desc: 'Automated empirical evaluation harness measuring recall and coverage' },
    { key: '6', action: 'Chain of Custody', desc: 'Append-only SHA-256 audit ledger and user action audit log' },
    { key: '7', action: 'Server Infrastructure', desc: 'Live server console, hardware telemetry, and cache controls' },
    { key: '8', action: 'Public Verification', desc: 'Standalone offline Ed25519 proof pack cryptographic verifier' },
    { key: 'T', action: 'Toggle Light / Dark Mode', desc: 'Instantly toggle between crisp Light theme and Pitch Black theme' },
    { key: '?', action: 'Shortcut Help', desc: 'Show this interactive keyboard shortcut overlay' },
    { key: 'Esc', action: 'Close Dialog / Back', desc: 'Dismiss active detail story, modals, or return to queue' }
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121214] border border-slate-200 dark:border-[#222225] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#222225] bg-slate-50 dark:bg-[#18181B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-[#222225] text-blue-600 dark:text-white border border-transparent dark:border-[#27272A]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-sm font-semibold text-slate-900 dark:text-white">
                Keyboard Shortcuts Navigation
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#8E8E93]">
                Postern is built for rapid SOC analyst keyboard-first operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222225] transition-colors cursor-pointer"
            aria-label="Close shortcuts modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 divide-y divide-slate-100 dark:divide-[#222225] max-h-[60vh] overflow-y-auto">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between text-xs">
              <div className="pr-4">
                <span className="font-medium text-slate-800 dark:text-white">{sc.action}</span>
                <p className="text-[11px] text-slate-500 dark:text-[#8E8E93]">{sc.desc}</p>
              </div>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-[#18181B] border border-slate-300 dark:border-[#27272A] rounded-lg shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-[#222225] bg-slate-50 dark:bg-[#18181B] flex items-center justify-between text-xs text-slate-500 dark:text-[#8E8E93]">
          <span>Shortcuts disabled while typing in text inputs</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsModal
