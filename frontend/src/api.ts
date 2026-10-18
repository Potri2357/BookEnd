import {
  Advisory, Asset, AssetStory, BlastRadiusGraph,
  ProofPack, QueueItem, Tenant
} from './types'

function normalizeApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')

  const isBrowser = typeof window !== 'undefined'
  const isLocalhost = isBrowser &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const isVercel = isBrowser && window.location.hostname.endsWith('vercel.app')

  // In development, on localhost, or on Vercel: use relative '/v1'
  // - Localhost routes via Vite proxy to localhost:8008
  // - Vercel routes via vercel.json rewrites directly to the Render backend
  // This bypasses ISP TLS resets to onrender.com and eliminates cross-origin CORS overhead.
  if (import.meta.env.DEV || isLocalhost || isVercel) {
    return '/v1'
  }

  let url = envUrl || '/v1'
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

import { FALLBACK_TENANTS, FALLBACK_QUEUE, FALLBACK_STORIES } from './mockFallback'

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    return await apiRequest<Tenant[]>('/tenants')
  } catch (e) {
    console.warn('Backend unavailable, using deterministic tenants:', e)
    return FALLBACK_TENANTS
  }
}

export async function fetchQueue(tenantId?: string): Promise<QueueItem[]> {
  const query = tenantId && tenantId !== 'all' ? `?tenant_id=${encodeURIComponent(tenantId)}` : ''
  try {
    return await apiRequest<QueueItem[]>(`/queue${query}`)
  } catch (e) {
    console.warn('Backend unavailable during cold-start, using air-gapped queue:', e)
    let q = FALLBACK_QUEUE
    if (tenantId && tenantId !== 'all') {
      q = q.filter((item: any) => item.tenant_id === tenantId)
    }
    return q
  }
}

export async function fetchAssetStory(assetId: string): Promise<AssetStory> {
  try {
    return await apiRequest<AssetStory>(`/assets/${encodeURIComponent(assetId)}/story`)
  } catch (e) {
    console.warn(`Backend unavailable, using air-gapped story for ${assetId}:`, e)
    if (FALLBACK_STORIES[assetId]) {
      return FALLBACK_STORIES[assetId]
    }
    const match = Object.values(FALLBACK_STORIES).find(
      (s: any) => s.asset?.host_name === assetId || s.asset?.id === assetId
    )
    if (match) return match as AssetStory
    throw e
  }
}

export async function fetchAdvisory(advisoryId: string): Promise<Advisory> {
  try {
    return await apiRequest<Advisory>(`/advisories/${encodeURIComponent(advisoryId)}`)
  } catch (e) {
    console.warn(`Backend unavailable, using air-gapped advisory for ${advisoryId}:`, e)
    const firstStory = Object.values(FALLBACK_STORIES)[0]
    if (firstStory && firstStory.advisory) {
      return firstStory.advisory as Advisory
    }
    throw e
  }
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

export async function createApprovalRequest(payload: {
  asset_id: string
  action_type: string
  requested_by: string
  required_role?: string
  evidence_data?: any
}) {
  return apiRequest<any>('/approvals/request', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function respondApprovalRequest(
  requestId: string,
  payload: {
    action: 'approve' | 'reject'
    approver: string
    role?: string
    notes: string
    second_approver?: string
  }
) {
  return apiRequest<any>(`/approvals/${encodeURIComponent(requestId)}/respond`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function fetchApprovalRequests(assetId: string) {
  return apiRequest<any[]>(`/approvals/${encodeURIComponent(assetId)}/requests`)
}

export async function fetchAssetMessages(assetId: string) {
  return apiRequest<any[]>(`/approvals/${encodeURIComponent(assetId)}/messages`)
}

export async function postAssetMessage(
  assetId: string,
  payload: { sender: string; role: string; content: string }
) {
  return apiRequest<any>(`/approvals/${encodeURIComponent(assetId)}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

