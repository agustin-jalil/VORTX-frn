/**
 * Medusa v2 Authentication Library - Simplified Token-Based Flow
 * Backend handles OAuth and redirects with token in URL
 */

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
}

function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
}

// ============================================
// GOOGLE OAUTH (Simplified Flow)
// ============================================

/**
 * Initiates Google OAuth flow by fetching the authorization URL from backend
 * Backend returns JSON with location, then we redirect to Google
 */
export async function loginWithGoogle(): Promise<void> {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    throw new Error("MEDUSA_BACKEND_URL is not configured")
  }

  // Store the origin to return after OAuth
  if (typeof window !== "undefined") {
    sessionStorage.setItem("oauth_origin", window.location.origin)
  }

  try {
    const response = await fetch(`${backendUrl}/auth/customer/google`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to initiate Google login: ${response.status}`)
    }

    const data = await response.json()

    // Backend returns {"location": "https://accounts.google.com/..."}
    if (data.location) {
      window.location.href = data.location
    } else {
      throw new Error("No location received from backend")
    }
  } catch (error) {
    console.error("[v0] Google login error:", error)
    throw error
  }
}

// ============================================
// TOKEN MANAGEMENT
// ============================================

const AUTH_TOKEN_KEY = "auth_token"

export function saveAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// ============================================
// CUSTOMER API
// ============================================

/**
 * Fetches the current authenticated customer using the token
 */
export async function getCurrentCustomer() {
  const backendUrl = getBackendUrl()
  const token = getAuthToken()
  const publishableKey = getPublishableKey()

  if (!backendUrl) {
    throw new Error("MEDUSA_BACKEND_URL is not configured")
  }

  if (!token) {
    return null
  }

  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${backendUrl}/store/customers/me`, {
      headers,
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
