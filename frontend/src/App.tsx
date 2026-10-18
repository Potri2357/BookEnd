import React, { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { DemoControlPanel } from './components/DemoControlPanel'
import { DecisionQueueView } from './components/DecisionQueueView'
import { AssetStoryView } from './components/AssetStoryView'
import { AdvisoryDetailView } from './components/AdvisoryDetailView'
import { FleetView } from './components/FleetView'
import { ConnectorsView } from './components/ConnectorsView'
import { EvaluationView } from './components/EvaluationView'
import { AuditLedgerView } from './components/AuditLedgerView'
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
  const [isResetting, setIsResetting] = useState(false)
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
    const eventSource = new EventSource('/v1/events')
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
    const q = await fetchQueue(selectedTenant)
    setQueue(q)
  }

  const handleSelectAsset = async (assetId: string) => {
    setSelectedAssetId(assetId)
    setLoadingStory(true)
    setCurrentView('story')
    try {
      const story = await fetchAssetStory(assetId)
      setAssetStory(story)
    } finally {
      setLoadingStory(false)
    }
  }

  const handleRefreshStory = async () => {
    if (selectedAssetId) {
      const story = await fetchAssetStory(selectedAssetId)
      setAssetStory(story)
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

  const handleReset = async () => {
    setIsResetting(true)
    try {
      await resetDemo()
      await loadQueue()
      if (selectedAssetId) {
        await handleSelectAsset(selectedAssetId)
      }
    } finally {
      setIsResetting(false)
    }
  }

  const handleTogglePersistence = async () => {
    const res = await togglePersistence()
    setPersistenceActive(res.s5_persistence_active)
  }

  // Setup global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }
      if (e.key === '1') setCurrentView('queue')
      if (e.key === '2') setCurrentView('advisory')
      if (e.key === '3') setCurrentView('fleet')
      if (e.key === '4') setCurrentView('connectors')
      if (e.key === '5') setCurrentView('evaluation')
      if (e.key === '6') setCurrentView('audit')
      if (e.key === 'Escape') {
        if (currentView === 'story') {
          setCurrentView('queue')
          loadQueue()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentView])

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f7f7] text-[#14323d] soc-canvas selection:bg-teal-500/20 selection:text-teal-900">
      <Navbar
        tenants={tenants}
        selectedTenant={selectedTenant}
        onSelectTenant={setSelectedTenant}
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v)
          if (v !== 'story') setSelectedAssetId(null)
        }}
        onResetDemo={handleReset}
        isResetting={isResetting}
      />

      <DemoControlPanel
        onSelectScenarioAsset={handleSelectAsset}
        onTogglePersistence={handleTogglePersistence}
        persistenceActive={persistenceActive}
        onReset={handleReset}
        isResetting={isResetting}
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
            <div className="flex-1 flex items-center justify-center p-12 text-[#4d7583] font-mono text-xs">
              <span className="flex h-3 w-3 rounded-full bg-[#0d9488] animate-ping mr-3" />
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
      </main>

      {/* Enterprise PatchGate Tactical Footer Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-[#cde5e3] px-4 py-1 text-[10px] font-mono text-[#4a6e7c] flex items-center justify-between backdrop-blur shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#0d9488] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
            DUCKDB 1.0 (COLUMNAR ENGINE)
          </span>
          <span className="text-[#c1dedb]">|</span>
          <span>AIR-GAPPED OPERATION READY</span>
          <span className="text-[#c1dedb]">|</span>
          <span className="text-[#0e5c6b] font-semibold">RFC 8785 JSON · ED25519 SIGNED</span>
          <span className="text-[#c1dedb]">|</span>
          <span className="text-[#3b616f]">SSE STREAM: ACTIVE (3s TICK)</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[#567a87]">
          <span>Shortcuts:</span>
          <span><kbd>1</kbd> Queue</span>
          <span><kbd>2</kbd> Intel</span>
          <span><kbd>3</kbd> Fleet</span>
          <span><kbd>4</kbd> Ingress</span>
          <span><kbd>5</kbd> Benchmark</span>
          <span><kbd>6</kbd> Audit</span>
          <span><kbd>Esc</kbd> Back</span>
        </div>
      </footer>
    </div>
  )
}
export default App

