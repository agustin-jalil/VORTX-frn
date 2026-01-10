import { Suspense } from "react"
import AuthCallbackHandler from "./auth-callback-handler"

export const dynamic = "force-dynamic"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Completing sign in...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  )
}
