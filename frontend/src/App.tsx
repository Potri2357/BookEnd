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

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
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

      <main className="flex-1 flex flex-col">
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
            <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-mono text-xs">
              <span className="flex h-3 w-3 rounded-full bg-cyan-400 animate-ping mr-3" />
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
    </div>
  )
}
export default App
