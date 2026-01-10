/**
 * Medusa v2 Authentication Library - medusa-plugin-auth Google OAuth Flow
 * Uses returnAccessToken=true to get JWT directly from backend
 */

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
}

function getGoogleAuthPath(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_PATH || "store/auth/google"
}

function getPublishableKey(): string | undefined {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
}

// ============================================
// GOOGLE OAUTH (Plugin Flow with returnAccessToken)
// ============================================

/**
 * Initiates Google OAuth flow using medusa-plugin-auth
 * First fetches the Google OAuth URL with proper headers, then redirects
 */
export async function loginWithGoogle(): Promise<void> {
  const backendUrl = getBackendUrl()
  const authPath = getGoogleAuthPath()
  const publishableKey = getPublishableKey()

  if (!backendUrl) {
    throw new Error("MEDUSA_BACKEND_URL is not configured")
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${backendUrl}/${authPath}?returnAccessToken=true`, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to initiate Google login")
    }

    // If backend returns a location, redirect to it
    const data = await response.json()
    if (data.location) {
      window.location.href = data.location
    } else {
      // If no location in response, redirect to the auth endpoint directly
      window.location.href = `${backendUrl}/${authPath}?returnAccessToken=true`
    }
  } catch (error) {
    console.error("[v0] Failed to initiate Google OAuth:", error)
    throw error
  }
}

// ============================================
// TOKEN MANAGEMENT
// ============================================

const AUTH_TOKEN_KEY = "medusa_access_token"

export function saveAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

// ============================================
// CUSTOMER API
// ============================================

/**
 * Fetches the current authenticated customer using the JWT token
 */
export async function getCurrentCustomer() {
  const backendUrl = getBackendUrl()
  const token = getAuthToken()

  if (!backendUrl) {
    throw new Error("MEDUSA_BACKEND_URL is not configured")
  }

  if (!token) {
    return null
  }

  try {
    const response = await fetch(`${backendUrl}/store/customers/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthToken()
      }
      return null
    }

    const data = await response.json()
    return data.customer
  } catch (error) {
    console.error("[v0] Failed to fetch current customer:", error)
    return null
  }
}

/**
 * Validates if Medusa auth configuration is available
 */
export function validateAuthConfig(): boolean {
  return !!getBackendUrl()
}

/**
 * Logs out the current customer by clearing the token
 */
export function logout(): void {
  clearAuthToken()
}
