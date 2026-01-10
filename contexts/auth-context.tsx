"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getCurrentCustomer, loginWithGoogle, logout as authLogout, saveAuthToken } from "@/lib/medusa/auth"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  has_account: boolean
}

interface AuthContextType {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  signInWithGoogle: () => void
  signOut: () => void
  login: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthStatus = async () => {
    try {
      const customerData = await getCurrentCustomer()
      if (customerData) {
        setCustomer(customerData)
      }
    } catch (error) {
      console.error("[v0] Failed to check auth status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const login = async (token: string) => {
    try {
      setIsLoading(true)
      saveAuthToken(token)
      await checkAuthStatus()
    } catch (error) {
      console.error("[v0] Login failed:", error)
      setIsLoading(false)
    }
  }

  const signInWithGoogle = () => {
    try {
      loginWithGoogle()
    } catch (error) {
      console.error("[v0] Failed to initiate Google login:", error)
      alert("Failed to start Google login. Please try again.")
    }
  }

  const signOut = () => {
    authLogout()
    setCustomer(null)
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        signInWithGoogle,
        signOut,
        login,
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
