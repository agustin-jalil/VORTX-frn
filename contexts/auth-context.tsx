"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from "firebase/auth"
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from "@/lib/firebase"
import { syncFirebaseCustomer } from "@/lib/medusa/auth"

interface Customer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  firebase_uid?: string
}

interface AuthContextType {
  user: User | null
  customer: Customer | null
  idToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const syncWithMedusa = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()
      setIdToken(token)

      // Sync with Medusa backend
      const result = await syncFirebaseCustomer(token)
      if (result.success && result.customer) {
        setCustomer(result.customer)
      } else {
        // Fallback to Firebase user data if sync fails
        setCustomer({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          first_name: firebaseUser.displayName?.split(" ")[0],
          last_name: firebaseUser.displayName?.split(" ").slice(1).join(" "),
          firebase_uid: firebaseUser.uid,
        })
      }
    } catch (error) {
      console.error("Failed to sync with Medusa:", error)
      // Fallback to Firebase user data
      setCustomer({
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        first_name: firebaseUser.displayName?.split(" ")[0],
        last_name: firebaseUser.displayName?.split(" ").slice(1).join(" "),
        firebase_uid: firebaseUser.uid,
      })
    }
  }

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setIsLoading(false)
      return
    }

    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        await syncWithMedusa(firebaseUser)
      } else {
        setCustomer(null)
        setIdToken(null)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    console.log("[v0] Starting Firebase Google sign in")

    if (!isFirebaseConfigured()) {
      console.error("[v0] Firebase not configured")
      throw new Error("Firebase is not configured. Please add Firebase environment variables.")
    }

    try {
      setIsLoading(true)
      console.log("[v0] Getting Firebase auth instance")
      const auth = getFirebaseAuth()
      const googleProvider = getGoogleProvider()

      console.log("[v0] Opening Google popup...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("[v0] Google sign in successful, user:", result.user.email)

      if (result.user) {
        console.log("[v0] Syncing with Medusa...")
        await syncWithMedusa(result.user)
        console.log("[v0] Sync complete")
      }
    } catch (error) {
      console.error("[v0] Firebase sign in error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    if (!isFirebaseConfigured()) {
      return
    }

    try {
      const auth = getFirebaseAuth()
      await firebaseSignOut(auth)
      setCustomer(null)
      setIdToken(null)
    } catch (error) {
      console.error("Failed to sign out:", error)
      throw error
    }
  }

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null
    try {
      const token = await user.getIdToken(true) // Force refresh
      setIdToken(token)
      console.log("EL TOKEN DE LOGUEO",token)
      return token
    } catch (error) {
      console.error("Failed to get ID token:", error)
      return null
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        idToken,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
