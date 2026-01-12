"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signInWithGoogle } = useAuth()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGoogle()
      onClose() // Close modal on successful login
    } catch (err) {
      console.error("Google sign in error:", err)
      setError("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[9999]" onClick={onClose}>
      {/* Backdrop with blur - full screen */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 backdrop-blur-md" />

      {/* Modal content - centered with absolute positioning */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-gray-900 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 text-center border-b border-gray-800">
          <svg className="w-10 h-10 text-white mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.02-1.62-.59-3.04-.59-1.42 0-1.77.59-3.05.59-1.3-.02-2.29-1.33-3.12-2.47C5.82 16.64 5 13.77 5 10.5c0-3.5 2.04-5.38 4.04-5.38 1.33 0 2.36.77 3.15.77.78 0 2.01-.8 3.39-.8 2.11 0 3.68 1.38 4.6 3.3-2.1 1.23-2.8 3.72-2.8 5.38 0 2.14.88 3.63 2.32 4.72M12 2c.78 0 1.58-.5 2.42-1.5.8-.9 1.48-2.16 1.48-2.5 0-.36-.12-1-.5-1-2.18 0-3.4 1.5-4.4 1.5-.4 0-1.5-.36-2.5 0-.5.12-.74.5-.74 1 0 1.36 1.48 2.4 2.5 3.5.9.8 1.5 1.5 2.5 1.5" />
          </svg>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
          <p className="text-sm text-gray-400">Access your account and saved items</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-8 mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Sign in options */}
        <div className="p-8 space-y-4">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-black font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Apple Sign In (Disabled) */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 text-gray-600 font-medium rounded-lg cursor-not-allowed opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.02-1.62-.59-3.04-.59-1.42 0-1.77.59-3.05.59-1.3-.02-2.29-1.33-3.12-2.47C5.82 16.64 5 13.77 5 10.5c0-3.5 2.04-5.38 4.04-5.38 1.33 0 2.36.77 3.15.77.78 0 2.01-.8 3.39-.8 2.11 0 3.68 1.38 4.6 3.3-2.1 1.23-2.8 3.72-2.8 5.38 0 2.14.88 3.63 2.32 4.72M12 2c.78 0 1.58-.5 2.42-1.5.8-.9 1.48-2.16 1.48-2.5 0-.36-.12-1-.5-1-2.18 0-3.4 1.5-4.4 1.5-.4 0-1.5-.36-2.5 0-.5.12-.74.5-.74 1 0 1.36 1.48 2.4 2.5 3.5.9.8 1.5 1.5 2.5 1.5" />
            </svg>
            Continue with Apple (Coming Soon)
          </button>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
