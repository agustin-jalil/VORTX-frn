"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const error = searchParams.get("error")
      if (error) {
        console.error("[v0] OAuth error:", error)
        alert("Authentication failed. Please try again.")
        router.push("/")
        return
      }

      const token = searchParams.get("token")

      if (!token) {
        console.error("[v0] No token received from backend")
        alert("No authentication token received. Please try again.")
        router.push("/")
        return
      }

      try {
        console.log("[v0] Token received, logging in...")
        await login(token)
        console.log("[v0] Login successful, redirecting to home")
        router.push("/")
      } catch (error) {
        console.error("[v0] Failed to complete authentication:", error)
        alert("Failed to complete authentication. Please try again.")
        router.push("/")
      }
    }

    handleCallback()
  }, [searchParams, router, login])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing sign in...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait while we verify your account</p>
      </div>
    </div>
  )
}
