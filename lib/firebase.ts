import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function initializeFirebaseApp(): FirebaseApp | null {
  // Check if Firebase is configured
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    return null
  }

  try {
    // Check if app already exists
    if (getApps().length > 0) {
      return getApp()
    }
    // Initialize new app
    return initializeApp(firebaseConfig)
  } catch (error) {
    console.error("Failed to initialize Firebase:", error)
    return null
  }
}

// Initialize app on module load (client-side only)
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null

if (typeof window !== "undefined") {
  firebaseApp = initializeFirebaseApp()
  if (firebaseApp) {
    firebaseAuth = getAuth(firebaseApp)
    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope("profile")
    googleProvider.addScope("email")
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  return firebaseApp
}

export function getFirebaseAuth(): Auth | null {
  return firebaseAuth
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  return googleProvider
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  )
}

export default getFirebaseApp
