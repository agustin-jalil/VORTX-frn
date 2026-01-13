// Utility functions to interact with Medusa JS backend

import { MedusaCategoriesResponse, MedusaCategory, MedusaProduct, MedusaProductsResponse } from "@/types/medusa"

function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
  }
  return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
}

function getPublishableKey(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  }
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
}

/**
 * Fetch all product categories from Medusa
 */
export async function getCategories(): Promise<MedusaCategory[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("medusa_access_token") : null
    const publishableKey = getPublishableKey()
    const headers: HeadersInit = {
      "ngrok-skip-browser-warning": "69420",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${getBackendUrl()}/store/product-categories`, {
      method: "GET",
      cache: "no-store",
      headers,
    })

    if (!response.ok) return []

    const data: MedusaCategoriesResponse = await response.json()
    return data.product_categories || []
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

/**
 * Fetch products by category ID from Medusa
 */
export async function getProductsByCategory(categoryId: string): Promise<MedusaProduct[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("medusa_access_token") : null
    const publishableKey = getPublishableKey()
    const headers: HeadersInit = {
      "ngrok-skip-browser-warning": "69420",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${getBackendUrl()}/store/products?category_id[]=${categoryId}`, {
      method: "GET",
      cache: "no-store",
      headers,
    })

    if (!response.ok) return []

    const data: MedusaProductsResponse = await response.json()
    return data.products || []
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

/**
 * Fetch a single product by ID from Medusa
 */
export async function getProductById(id: string): Promise<MedusaProduct | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("medusa_access_token") : null
    const publishableKey = getPublishableKey()
    const headers: HeadersInit = {
      "ngrok-skip-browser-warning": "69420",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${getBackendUrl()}/store/products/${id}`, {
      method: "GET",
      cache: "no-store",
      headers,
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.product
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }
}

/**
 * Fetch all products from Medusa
 */
export async function getAllProducts(): Promise<MedusaProduct[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("medusa_access_token") : null
    const publishableKey = getPublishableKey()
    const headers: HeadersInit = {
      "ngrok-skip-browser-warning": "69420",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    if (publishableKey) {
      headers["x-publishable-api-key"] = publishableKey
    }

    const response = await fetch(`${getBackendUrl()}/store/products?limit=100`, {
      method: "GET",
      cache: "no-store",
      headers,
    })

    if (!response.ok) return []

    const data: MedusaProductsResponse = await response.json()
    return data.products || []
  } catch (error) {
    console.error("[v0] Error fetching all products:", error)
    return []
  }
}

/**
 * Format price from Medusa format (cents) to display format
 */
export function formatPrice(amount: number, currencyCode = "USD"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount / 100)
}

/**
 * Transform Medusa product to internal Product type
 */
export function transformMedusaProduct(medusaProduct: MedusaProduct): any {
  const variant = medusaProduct.variants?.[0]
  const price = variant?.prices?.[0]
  const priceAmount = price ? price.amount / 100 : 0

  return {
    id: medusaProduct.handle,
    name: medusaProduct.title,
    category: "productos",
    price: priceAmount,
    description: medusaProduct.description || "",
    images: medusaProduct.images?.map((img) => img.url) || [medusaProduct.thumbnail],
    specifications: [
      { label: "SKU", value: variant?.id || "N/A" },
      { label: "Variante", value: variant?.title || "Estándar" },
      ...(medusaProduct.metadata?.specifications || []),
    ],
    whatsInBox: medusaProduct.metadata?.whatsInBox || [],
    includedServices: medusaProduct.metadata?.includedServices || [],
    relatedProducts: medusaProduct.metadata?.relatedProducts || [],
    features: medusaProduct.metadata?.features || [],
    colors: medusaProduct.metadata?.colors || [],
  }
}
