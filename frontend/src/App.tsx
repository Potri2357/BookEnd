import React, { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { DecisionQueueView } from './components/DecisionQueueView'
import { AssetStoryView } from './components/AssetStoryView'
import { AdvisoryDetailView } from './components/AdvisoryDetailView'
import { FleetView } from './components/FleetView'
import { ConnectorsView } from './components/ConnectorsView'
import { EvaluationView } from './components/EvaluationView'
import { AuditLedgerView } from './components/AuditLedgerView'
import { ServerConsoleView } from './components/ServerConsoleView'
import { VerifyView } from './components/VerifyView'
import { LandingPageView } from './components/LandingPageView'
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal'
import { GuidedTourModal } from './components/GuidedTourModal'
import {
  fetchTenants, fetchQueue, fetchAssetStory, fetchAdvisory,
  bulkApprovePatchNow, approveSingleAsset, containSingleAsset,
  auditSingleAsset, reviewSingleAsset, resetDemo, togglePersistence,
  setActiveRole as setApiActiveRole, BASE_URL
} from './api'
import { Tenant, QueueItem, AssetStory, Advisory, UserRole } from './types'
import { Loader2, RefreshCw, Server, AlertCircle } from 'lucide-react'

export function App() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>('all')
  const [currentView, setCurrentView] = useState<string>('queue')
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [assetStory, setAssetStory] = useState<AssetStory | null>(null)
  const [advisory, setAdvisory] = useState<Advisory | null>(null)
  const [loadingStory, setLoadingStory] = useState(false)
  const [isBulkApproving, setIsBulkApproving] = useState(false)
  const [persistenceActive, setPersistenceActive] = useState(true)
  const [isLoadingQueue, setIsLoadingQueue] = useState(true)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [isWakingServer, setIsWakingServer] = useState(false)

  // Modals & User Identity (Enforced 5-role hierarchy)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<UserRole>('admin')
  
  // Theme state: Strictly default to Light Mode per user requirement
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('postern_theme_mode')
      if (savedTheme === 'dark') return true
      if (savedTheme === 'light') return false
      // Default to Light Mode (do not auto-toggle to dark from OS prefers-color-scheme)
      return false
    }
    return false
  })

  // Synchronize Dark Mode with DOM, Body & Meta Theme Color
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (isDarkMode) {
      root.classList.add('dark')
      body.classList.add('dark')
      if (metaTheme) metaTheme.setAttribute('content', '#000000')
      localStorage.setItem('postern_theme_mode', 'dark')
      localStorage.setItem('postern_dark_mode', 'true')
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
      if (metaTheme) metaTheme.setAttribute('content', '#F4F7FC')
      localStorage.setItem('postern_theme_mode', 'light')
      localStorage.setItem('postern_dark_mode', 'false')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role)
    setApiActiveRole(role)
  }

  const loadInitialData = async () => {
    setIsLoadingQueue(true)
    try {
      const [tList, adv, q] = await Promise.all([
        fetchTenants().catch((err) => { throw err }),
        fetchAdvisory('SIM-2026-0001').catch(() => null),
        fetchQueue(selectedTenant).catch((err) => { throw err })
      ])
      if (Array.isArray(tList)) setTenants(tList)
      if (adv) setAdvisory(adv)
      if (Array.isArray(q)) setQueue(q)
      setBackendError(null)
      setIsWakingServer(false)
    } catch (e: any) {
      console.error('Failed to connect to backend:', e)
      setBackendError(e.message || 'Unable to connect to backend server')
      setIsWakingServer(true)
    } finally {
      setIsLoadingQueue(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadInitialData()
  }, [])

  // Refetch queue when tenant changes
  useEffect(() => {
    loadQueue()
  }, [selectedTenant])

  // Setup Server-Sent Events (SSE) for real-time live clock updates
  useEffect(() => {
    let tickCount = 0
    let eventSource: EventSource | null = null
    try {
      eventSource = new EventSource(`${BASE_URL}/events`)
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'CLOCK_TICK') {
            tickCount++
            setQueue((prev) =>
              prev.map((item) => {
                const remaining = Math.max(0, item.seconds_remaining - 3)
                return {
                  ...item,
                  seconds_remaining: remaining,
                  is_breached: remaining <= 0
                }
              })
            )
            if (tickCount % 10 === 0) {
              loadQueue()
            }
          }
        } catch {
          // Ignore parse error
        }
      }
      eventSource.onerror = () => {
        // Suppress noisy reconnection logs
      }
    } catch (e) {
      console.warn('SSE connection could not be established:', e)
    }
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [selectedTenant])

  const loadQueue = async () => {
    try {
      const q = await fetchQueue(selectedTenant)
      if (Array.isArray(q)) {
        setQueue(q)
        setBackendError(null)
      }
    } catch (e: any) {
      console.error('Failed to load queue:', e)
      if (queue.length === 0) {
        setBackendError(e.message || 'Unable to connect to backend server')
      }
    } finally {
      setIsLoadingQueue(false)
    }
  }

  const handleSelectAsset = async (assetId: string) => {
    setSelectedAssetId(assetId)
    setLoadingStory(true)
    setCurrentView('story')
    try {
      const story = await fetchAssetStory(assetId)
      setAssetStory(story)
    } catch (e) {
      console.error('Failed to load asset story:', e)
    } finally {
      setLoadingStory(false)
    }
  }

  const handleRefreshStory = async () => {
    if (selectedAssetId) {
      try {
        const story = await fetchAssetStory(selectedAssetId)
        setAssetStory(story)
      } catch (e) {
        console.error('Failed to refresh asset story:', e)
      }
    }
    loadQueue()
  }

  const handleBulkApprove = async () => {
    setIsBulkApproving(true)
    setQueue((prev) =>
      prev.map((item) =>
        item.verdict_state === 'No evidence found' && (item.coverage_score >= 0.85 || !item.gate_locked)
          ? { ...item, gate_outcome: 'Approved & Released', gate_locked: false, is_approved: true }
          : item
      )
    )
    try {
      await bulkApprovePatchNow('security_lead@postern.enterprise')
      await loadQueue()
    } catch (e) {
      console.warn('Backend sync deferred:', e)
    } finally {
      setIsBulkApproving(false)
    }
  }

  const handleApproveSingleAsset = async (item: QueueItem) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.asset_id === item.asset_id || q.host_name === item.host_name
          ? { ...q, is_approved: true, status: 'approved', gate_locked: false, gate_outcome: 'Approved & Released' }
          : q
      )
    )
    try {
      await approveSingleAsset(item.asset_id)
      await loadQueue()
    } catch (e) {
      console.warn('Backend sync deferred for single asset approval:', e)
    }
  }

  const handleContainAsset = async (item: QueueItem) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.asset_id === item.asset_id || q.host_name === item.host_name
          ? { ...q, is_contained: true, status: 'contained', gate_outcome: 'Contained & Isolated' }
          : q
      )
    )
    try {
      await containSingleAsset(item.asset_id)
      await loadQueue()
    } catch (e) {
      console.warn('Backend sync deferred for containment:', e)
    }
  }

  const handleAuditAsset = async (item: QueueItem) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.asset_id === item.asset_id || q.host_name === item.host_name
          ? { ...q, is_audited: true }
          : q
      )
    )
    await auditSingleAsset(item.asset_id)
  }

  const handleReviewAsset = async (item: QueueItem) => {
    setQueue((prevQueue) =>
      prevQueue.map((q) =>
        q.asset_id === item.asset_id || q.host_name === item.host_name
          ? { ...q, is_reviewed: true }
          : q
      )
    )
    await reviewSingleAsset(item.asset_id)
  }

  const handleTogglePersistence = async () => {
    try {
      const res = await togglePersistence()
      setPersistenceActive(res.s5_persistence_active)
    } catch (e) {
      console.error('Failed to toggle persistence:', e)
    }
  }

  // Setup global keyboard shortcuts with input element protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CRITICAL FIX: Never intercept keyboard shortcuts when typing in inputs, textareas, selects, or contenteditable
      const target = e.target as HTMLElement
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable ||
        target?.closest?.('input, textarea, select, [contenteditable="true"]')
      ) {
        return
      }

      if (e.key === '?') {
        setIsShortcutsOpen((prev) => !prev)
        return
      }

      if (e.key === '1') setCurrentView('queue')
      if (e.key === '2') setCurrentView('advisory')
      if (e.key === '3') setCurrentView('fleet')
      if (e.key === '4') setCurrentView('connectors')
      if (e.key === '5') setCurrentView('evaluation')
      if (e.key === '6') setCurrentView('audit')
      if (e.key === '7') setCurrentView('server')
      if (e.key === '8') setCurrentView('verify')
      if (e.key === 't' || e.key === 'T') {
        toggleDarkMode()
        return
      }

      if (e.key === 'Escape') {
        setIsShortcutsOpen(false)
        setIsTourOpen(false)
        if (currentView === 'story' || currentView === 'server' || currentView === 'verify') {
          setCurrentView('queue')
          loadQueue()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentView, isDarkMode])

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FC] dark:bg-[#000000] text-[#0F172A] dark:text-[#FFFFFF] selection:bg-[#C1D0E2] selection:text-[#0F172A] transition-colors duration-200">
      <Navbar
        tenants={tenants}
        selectedTenant={selectedTenant}
        onSelectTenant={setSelectedTenant}
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v)
          if (v !== 'story') setSelectedAssetId(null)
        }}
        onSelectScenarioAsset={handleSelectAsset}
        onTogglePersistence={handleTogglePersistence}
        persistenceActive={persistenceActive}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
      />

      {/* Render Free Tier Cold-Start Waking Server Banner */}
      {backendError && (
        <div className="bg-[#FEF2F2] dark:bg-rose-950/50 border-b border-[#FCA5A5] dark:border-rose-900 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-xs text-[#991B1B] dark:text-rose-200 shadow-sm gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider bg-[#DC2626] text-white px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
              <Server className="w-3 h-3 animate-pulse" />
              {isWakingServer ? 'Waking Server...' : 'Server Offline'}
            </span>
            <span>
              Backend is currently offline or spinning up ({backendError}).{' '}
              {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'Ensure backend server is running on port 8008 (python -m uvicorn app.main:app --port 8008).'
                : 'Free-tier instances sleep when inactive (~30-50s spin-up). Click Retry.'}
            </span>
          </div>
          <button
            onClick={() => loadInitialData()}
            className="px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col pb-8">
        {currentView === 'landing' && (
          <LandingPageView
            onEnterConsole={() => setCurrentView('queue')}
            onOpenVerify={() => setCurrentView('verify')}
            onSelectScenario={(scId) => {
              const scenarioAssetMap: Record<string, string> = {
                S1: 'meridian-vpn-gw-01',
                S2: 'harbor-vpn-gw-01',
                S3: 'lotus-app-server-01',
                S4: 'meridian-web-portal-01',
                S5: 'meridian-vpn-gw-01',
                S6: 'meridian-vpn-gw-01'
              }
              const assetId = scenarioAssetMap[scId] || 'meridian-vpn-gw-01'
              handleSelectAsset(assetId)
            }}
          />
        )}

        {currentView === 'queue' && (
          <DecisionQueueView
            queue={queue}
            onSelectAsset={handleSelectAsset}
            onBulkApprove={handleBulkApprove}
            onApproveSingleAsset={handleApproveSingleAsset}
            onContainAsset={handleContainAsset}
            onAuditAsset={handleAuditAsset}
            onReviewAsset={handleReviewAsset}
            isBulkApproving={isBulkApproving}
            selectedTenant={selectedTenant}
            isLoading={isLoadingQueue}
            currentRole={currentRole}
          />
        )}

        {currentView === 'story' && (
          loadingStory || !assetStory ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#64748B] dark:text-slate-400 font-mono text-xs">
              <Loader2 className="w-8 h-8 text-[#1D63ED] animate-spin mb-3" />
              <span>Loading forensic asset story and telemetry...</span>
            </div>
          ) : (
            <AssetStoryView
              story={assetStory}
              onBack={() => {
                setCurrentView('queue')
                loadQueue()
              }}
              onRefresh={handleRefreshStory}
              currentRole={currentRole}
            />
          )
        )}

        {currentView === 'advisory' && (
          advisory ? (
            <AdvisoryDetailView advisory={advisory} />
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border border-[#E1E9F2] dark:border-slate-800 my-6">
              <div className="w-8 h-8 mx-auto mb-3 border-2 border-[#1D63ED] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-[#64748B] dark:text-slate-400">Loading Threat Intelligence...</p>
            </div>
          )
        )}

        {currentView === 'fleet' && (
          <FleetView
            tenants={tenants}
            onSelectTenant={(tId) => {
              setSelectedTenant(tId)
              setCurrentView('queue')
            }}
            onSelectView={setCurrentView}
          />
        )}

        {currentView === 'connectors' && <ConnectorsView currentRole={currentRole} />}

        {currentView === 'evaluation' && <EvaluationView />}

        {currentView === 'audit' && <AuditLedgerView />}

        {currentView === 'server' && <ServerConsoleView currentRole={currentRole} />}

        {currentView === 'verify' && (
          <VerifyView onBackToConsole={() => setCurrentView('queue')} />
        )}
      </main>

      {/* Enterprise Security Footer */}
      <footer className="mt-auto border-t border-[#E1E9F2] dark:border-[#222225] bg-white/70 dark:bg-[#000000]/95 backdrop-blur-md py-2.5 px-4 sm:px-6 text-[11px] font-mono text-[#64748B] dark:text-[#8E8E93] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 text-[#047857] dark:text-[#E4E4E7] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400 animate-pulse" />
            POSTERN AIR-GAP ASSURANCE ENGINE
          </span>
          <span className="text-[#CBD5E1] dark:text-[#27272A] hidden sm:inline">|</span>
          <span className="text-[#1D63ED] dark:text-[#A1A1AA] font-semibold hidden sm:inline">DUCKDB COLUMNAR FORENSICS</span>
          <span className="text-[#CBD5E1] dark:text-[#27272A] hidden sm:inline">|</span>
          <span className="hidden md:inline">RFC 8785 JSON · ED25519 NOTARY</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#18181B] border border-[#CBD5E1] dark:border-[#27272A] text-[#334155] dark:text-[#E4E4E7] font-bold">1-8</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#18181B] border border-[#CBD5E1] dark:border-[#27272A] text-[#334155] dark:text-[#E4E4E7] font-bold">?</kbd> Help
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Guided Tour Modal */}
      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectScenario={(assetId: string) => {
          handleSelectAsset(assetId)
        }}
      />
    </div>
  )
}
export default App
