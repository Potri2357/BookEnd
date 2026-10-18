import {
  Advisory, Asset, AssetStory, BlastRadiusGraph,
  ProofPack, QueueItem, Tenant
} from './types'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/v1').replace(/\/+$/, '')

export async function fetchTenants(): Promise<Tenant[]> {
  const res = await fetch(`${BASE_URL}/tenants`)
  return res.json()
}

export async function fetchQueue(tenantId?: string): Promise<QueueItem[]> {
  const url = tenantId && tenantId !== 'all' ? `${BASE_URL}/queue?tenant_id=${tenantId}` : `${BASE_URL}/queue`
  const res = await fetch(url)
  return res.json()
}

export async function fetchAssetStory(assetId: string): Promise<AssetStory> {
  const res = await fetch(`${BASE_URL}/assets/${assetId}/story`)
  if (!res.ok) throw new Error('Failed to load asset story')
  return res.json()
}

export async function fetchAdvisory(advisoryId: string): Promise<Advisory> {
  const res = await fetch(`${BASE_URL}/advisories/${advisoryId}`)
  return res.json()
}

export async function overrideGate(assetId: string, approver: string, reason: string) {
  const res = await fetch(`${BASE_URL}/decisions/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset_id: assetId, approver, reason })
  })
  return res.json()
}

export async function bulkApprovePatchNow(approver: string) {
  const res = await fetch(`${BASE_URL}/decisions/bulk-approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approver })
  })
  return res.json()
}

export async function triggerRecheck(assetId: string, simulateS5: boolean = false) {
  const res = await fetch(`${BASE_URL}/assets/${assetId}/recheck`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ simulate_s5_persistence: simulateS5 })
  })
  return res.json()
}

export async function updatePlaybookStep(assetId: string, stepId: string, status: string, verifiedBy: string) {
  const res = await fetch(`${BASE_URL}/assets/${assetId}/playbook/step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step_id: stepId, status, verified_by: verifiedBy })
  })
  return res.json()
}

export async function fetchProofPack(assetId: string): Promise<ProofPack> {
  const res = await fetch(`${BASE_URL}/proof-packs/${assetId}`)
  return res.json()
}

export async function verifyProofPack(pack: ProofPack) {
  const res = await fetch(`${BASE_URL}/proof-packs/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pack)
  })
  return res.json()
}

export async function askAssistant(assetId: string, question: string) {
  const res = await fetch(`${BASE_URL}/assistant/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset_id: assetId, question })
  })
  return res.json()
}

export async function fetchIncidentDraft(assetId: string) {
  const res = await fetch(`${BASE_URL}/incident/${assetId}`)
  return res.json()
}

export async function fetchBlastRadius(assetId: string): Promise<BlastRadiusGraph> {
  const res = await fetch(`${BASE_URL}/blast-radius/${assetId}`)
  return res.json()
}

export async function fetchAuditLedger() {
  const res = await fetch(`${BASE_URL}/audit/ledger`)
  return res.json()
}

export async function fetchConnectors() {
  const res = await fetch(`${BASE_URL}/connectors`)
  return res.json()
}

export async function resetDemo() {
  const res = await fetch(`${BASE_URL}/demo/reset`, { method: 'POST' })
  return res.json()
}

export async function togglePersistence() {
  const res = await fetch(`${BASE_URL}/demo/toggle-persistence`, { method: 'POST' })
  return res.json()
}

export async function runEvaluationHarness() {
  const res = await fetch(`${BASE_URL}/evaluation/run`)
  return res.json()
}

export async function fetchServerStatus() {
  const res = await fetch(`${BASE_URL}/system/server-status`)
  return res.json()
}

export async function flushServerCache() {
  const res = await fetch(`${BASE_URL}/system/flush-cache`, { method: 'POST' })
  return res.json()
}

export async function rotateServerKeys() {
  const res = await fetch(`${BASE_URL}/system/rotate-keys`, { method: 'POST' })
  return res.json()
}
