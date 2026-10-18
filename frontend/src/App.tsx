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
import {
  fetchTenants, fetchQueue, fetchAssetStory, fetchAdvisory,
  bulkApprovePatchNow, resetDemo, togglePersistence
} from './api'
import { Tenant, QueueItem, AssetStory, Advisory } from './types'

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

  // Initial load
  useEffect(() => {
    fetchTenants().then(setTenants)
    fetchAdvisory('SIM-2026-0001').then(setAdvisory)
    loadQueue()
  }, [])

  // Refetch queue when tenant changes
  useEffect(() => {
    loadQueue()
  }, [selectedTenant])

  // Setup Server-Sent Events (SSE) for real-time live clock updates
  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '/v1').replace(/\/+$/, '')
    const eventSource = new EventSource(`${apiBase}/events`)
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'CLOCK_TICK') {
          // Decrement remaining seconds on current queue items
          setQueue((prev) =>
            prev.map((item) => ({
              ...item,
              seconds_remaining: Math.max(0, item.seconds_remaining - 3),
              is_breached: item.seconds_remaining - 3 <= 0
            }))
          )
        }
      } catch (e) {
        // Ignore parse error
      }
    }
    return () => {
      eventSource.close()
    }
  }, [])

  const loadQueue = async () => {
    try {
      const q = await fetchQueue(selectedTenant)
      if (Array.isArray(q)) {
        setQueue(q)
      }
    } catch (e) {
      console.error('Failed to load queue:', e)
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
    try {
      await bulkApprovePatchNow('lead_approver@patchguard.local')
      await loadQueue()
    } finally {
      setIsBulkApproving(false)
    }
  }

  const handleTogglePersistence = async () => {
    try {
      const res = await togglePersistence()
      setPersistenceActive(res.s5_persistence_active)
    } catch (e) {
      console.error('Failed to toggle persistence:', e)
    }
  }

  // Setup global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      if (e.key === '1') setCurrentView('queue')
      if (e.key === '2') setCurrentView('advisory')
      if (e.key === '3') setCurrentView('fleet')
      if (e.key === '4') setCurrentView('connectors')
      if (e.key === '5') setCurrentView('evaluation')
      if (e.key === '6') setCurrentView('audit')
      if (e.key === '7') setCurrentView('server')
      if (e.key === 'Escape') {
        if (currentView === 'story' || currentView === 'server') {
          setCurrentView('queue')
          loadQueue()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentView])

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFD] text-[#111B36] selection:bg-[#C1D0E2] selection:text-[#111B36]">
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
      />

      <main className="flex-1 flex flex-col pb-8">
        {currentView === 'queue' && (
          <DecisionQueueView
            queue={queue}
            onSelectAsset={handleSelectAsset}
            onBulkApprove={handleBulkApprove}
            isBulkApproving={isBulkApproving}
            selectedTenant={selectedTenant}
          />
        )}

        {currentView === 'story' && (
          loadingStory || !assetStory ? (
            <div className="flex-1 flex items-center justify-center p-12 text-[#64748B] font-mono text-xs">
              <span className="flex h-3 w-3 rounded-full bg-[#7194B7] animate-ping mr-3" />
              Loading forensic asset story and telemetry...
            </div>
          ) : (
            <AssetStoryView
              story={assetStory}
              onBack={() => {
                setCurrentView('queue')
                loadQueue()
              }}
              onRefresh={handleRefreshStory}
            />
          )
        )}

        {currentView === 'advisory' && advisory && (
          <AdvisoryDetailView advisory={advisory} />
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

        {currentView === 'connectors' && <ConnectorsView />}

        {currentView === 'evaluation' && <EvaluationView />}

        {currentView === 'audit' && <AuditLedgerView />}

        {currentView === 'server' && (
          <ServerConsoleView />
        )}
      </main>

      {/* Enterprise Security Footer */}
      <footer className="mt-auto border-t border-[#E1E9F2] bg-white/70 backdrop-blur-md py-2.5 px-6 text-[11px] font-mono text-[#64748B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#047857] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-pulse" />
            BOOKEND AIR-GAP ASSURANCE ENGINE
          </span>
          <span className="text-[#CBD5E1]">|</span>
          <span className="text-[#1D63ED] font-semibold">DUCKDB COLUMNAR FORENSICS</span>
          <span className="text-[#CBD5E1]">|</span>
          <span>RFC 8785 JSON · ED25519 HSM NOTARY</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">1</kbd> Queue
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">2</kbd> Advisory
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">3</kbd> Fleet
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">4</kbd> Ingress
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">5</kbd> Eval
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">6</kbd> Ledger
          <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] font-bold">7</kbd> Server
        </div>
      </footer>
    </div>
  )
}
export default App
