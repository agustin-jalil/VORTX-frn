/**
 * Medusa API helpers for authenticated requests
 * Firebase handles authentication, this file handles Medusa API calls
 */

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
}

function getPublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
}

/**
 * Get headers for Medusa API requests
 */
export function getMedusaHeaders(authToken?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  }

  const publishableKey = getPublishableKey()
  if (publishableKey) {
    headers["x-publishable-api-key"] = publishableKey
  }

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`
  }

  return headers
}

/**
 * Validates if Medusa configuration is available
 */
export function validateMedusaConfig(): boolean {
  return !!getBackendUrl()
}

export async function verifyFirebaseToken(idToken: string): Promise<{
  success: boolean
  user?: {
    uid: string
    email: string
    emailVerified: boolean
    displayName?: string
    photoURL?: string
  }
  error?: string
}> {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    throw new Error("Medusa backend URL is not configured")
  }

  const response = await fetch(`${backendUrl}/store/firebase-auth/verify`, {
    method: "POST",
    headers: getMedusaHeaders(),
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to verify token")
  }

  return response.json()
}

export async function syncFirebaseCustomer(idToken: string): Promise<{
  success: boolean
  customer?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    firebase_uid: string
  }
  error?: string
}> {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    throw new Error("Medusa backend URL is not configured")
  }

  const response = await fetch(`${backendUrl}/store/firebase-customer/sync`, {
    method: "POST",
    headers: getMedusaHeaders(),
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to sync customer")
  }

  return response.json()
}

export async function fetchProtectedRoute<T>(endpoint: string, idToken: string, options: RequestInit = {}): Promise<T> {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    throw new Error("Medusa backend URL is not configured")
  }

  const response = await fetch(`${backendUrl}${endpoint}`, {
    ...options,
    headers: {
      ...getMedusaHeaders(idToken),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}

export { getBackendUrl, getPublishableKey }
