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

      console.log("ESTE ES EL TOKEN AUTH DE GOOGLE", token)

      const result = await syncFirebaseCustomer(token)
      if (result.success && result.customer) {
        setCustomer(result.customer)
      } else {
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
    if (!auth) {
      setIsLoading(false)
      return
    }

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
    if (!isFirebaseConfigured()) {
      throw new Error("Firebase is not configured. Please add Firebase environment variables.")
    }

    const auth = getFirebaseAuth()
    const provider = getGoogleProvider()

    if (!auth || !provider) {
      throw new Error("Firebase Auth is not initialized. Please check your configuration.")
    }

    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)

      if (result.user) {
        await syncWithMedusa(result.user)
      }
    } catch (error) {
      console.error("Firebase sign in error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return

    try {
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
      const token = await user.getIdToken(true)
      setIdToken(token)
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
