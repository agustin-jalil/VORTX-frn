import { medusaFetch } from "./client"
import type { MedusaProduct, MedusaProductsResponse } from "@/types/medusa"

/**
 * Fetch products by category ID from Medusa
 */
export async function getProductsByCategory(categoryId: string): Promise<MedusaProduct[]> {
  const data = await medusaFetch<MedusaProductsResponse>(`/store/products?category_id[]=${categoryId}`)
  return data?.products || []
}

/**
 * Fetch a single product by ID or handle from Medusa
 */
export async function getProductById(idOrHandle: string): Promise<MedusaProduct | null> {
  const data = await medusaFetch<{ product: MedusaProduct }>(`/store/products/${idOrHandle}`)
  return data?.product || null
}

/**
 * Fetch all products from Medusa
 */
export async function getAllProducts(): Promise<MedusaProduct[]> {
  const data = await medusaFetch<MedusaProductsResponse>("/store/products?limit=100")
  return data?.products || []
}
