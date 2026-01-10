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

// ============================================
// GOOGLE OAUTH (Plugin Flow with returnAccessToken)
// ============================================

/**
 * Initiates Google OAuth flow using medusa-plugin-auth
 * Redirects to backend with returnAccessToken=true to receive JWT
 */
export async function loginWithGoogle(): Promise<void> {
  const backendUrl = getBackendUrl()
  const authPath = getGoogleAuthPath()

  if (!backendUrl) {
    throw new Error("MEDUSA_BACKEND_URL is not configured")
  }

  // Backend will handle OAuth and redirect back to /auth/callback with access_token
  window.location.href = `${backendUrl}/${authPath}?returnAccessToken=true`
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
