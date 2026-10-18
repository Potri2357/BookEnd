import {
  Advisory, Asset, AssetStory, BlastRadiusGraph,
  ProofPack, QueueItem, Tenant
} from './types'

function normalizeApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_BASE_URL || '/v1').trim().replace(/\/+$/, '')
  if (url.startsWith('http') && !url.endsWith('/v1')) {
    url = `${url}/v1`
  }
  return url
}

export const BASE_URL = normalizeApiBaseUrl()

/**
 * Robust enterprise API client helper with standardized error handling and status code validation.
 */
async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers = new Headers(options?.headers || {})
  if (!headers.has('Content-Type') && (!options?.method || options.method !== 'GET')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...options,
    headers
  })

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`
    try {
      const errJson = await res.json()
      if (errJson && errJson.detail) {
        errorMessage = errJson.detail
      }
    } catch {
      // Body not JSON
    }
    throw new Error(errorMessage)
  }

  return res.json() as Promise<T>
}

export async function fetchTenants(): Promise<Tenant[]> {
  return apiRequest<Tenant[]>('/tenants')
}

export async function fetchQueue(tenantId?: string): Promise<QueueItem[]> {
  const query = tenantId && tenantId !== 'all' ? `?tenant_id=${encodeURIComponent(tenantId)}` : ''
  return apiRequest<QueueItem[]>(`/queue${query}`)
}

export async function fetchAssetStory(assetId: string): Promise<AssetStory> {
  return apiRequest<AssetStory>(`/assets/${encodeURIComponent(assetId)}/story`)
}

export async function fetchAdvisory(advisoryId: string): Promise<Advisory> {
  return apiRequest<Advisory>(`/advisories/${encodeURIComponent(advisoryId)}`)
}

export async function overrideGate(assetId: string, approver: string, reason: string) {
  return apiRequest<any>('/decisions/override', {
    method: 'POST',
    body: JSON.stringify({ asset_id: assetId, approver, reason })
  })
}

export async function bulkApprovePatchNow(approver: string) {
  return apiRequest<any>('/decisions/bulk-approve', {
    method: 'POST',
    body: JSON.stringify({ approver })
  })
}

export async function triggerRecheck(assetId: string, simulateS5: boolean = false) {
  return apiRequest<any>(`/assets/${encodeURIComponent(assetId)}/recheck`, {
    method: 'POST',
    body: JSON.stringify({ simulate_s5_persistence: simulateS5 })
  })
}

export async function updatePlaybookStep(assetId: string, stepId: string, status: string, verifiedBy: string) {
  return apiRequest<any>(`/assets/${encodeURIComponent(assetId)}/playbook/step`, {
    method: 'POST',
    body: JSON.stringify({ step_id: stepId, status, verified_by: verifiedBy })
  })
}

export async function fetchProofPack(assetId: string): Promise<ProofPack> {
  return apiRequest<ProofPack>(`/proof-packs/${encodeURIComponent(assetId)}`)
}

export async function verifyProofPack(pack: ProofPack) {
  return apiRequest<any>('/proof-packs/verify', {
    method: 'POST',
    body: JSON.stringify(pack)
  })
}

export async function askAssistant(assetId: string, question: string) {
  return apiRequest<any>('/assistant/ask', {
    method: 'POST',
    body: JSON.stringify({ asset_id: assetId, question })
  })
}

export async function fetchIncidentDraft(assetId: string) {
  return apiRequest<any>(`/incident/${encodeURIComponent(assetId)}`)
}

export async function fetchBlastRadius(assetId: string): Promise<BlastRadiusGraph> {
  return apiRequest<BlastRadiusGraph>(`/blast-radius/${encodeURIComponent(assetId)}`)
}

export async function fetchAuditLedger() {
  return apiRequest<any>('/audit/ledger')
}

export async function fetchConnectors() {
  return apiRequest<any>('/connectors')
}

export async function resetDemo() {
  return apiRequest<any>('/demo/reset', { method: 'POST' })
}

export async function togglePersistence() {
  return apiRequest<any>('/demo/toggle-persistence', { method: 'POST' })
}

export async function runEvaluationHarness() {
  return apiRequest<any>('/evaluation/run')
}

export async function fetchServerStatus() {
  return apiRequest<any>('/system/server-status')
}

export async function flushServerCache() {
  return apiRequest<any>('/system/flush-cache', { method: 'POST' })
}

export async function rotateServerKeys() {
  return apiRequest<any>('/system/rotate-keys', { method: 'POST' })
}
