import { medusaFetch } from "./client"
import type { MedusaCategory, MedusaCategoriesResponse } from "@/types/medusa"

/**
 * Fetch all product categories from Medusa
 */
export async function getCategories(): Promise<MedusaCategory[]> {
  const data = await medusaFetch<MedusaCategoriesResponse>("/store/product-categories")
  return data?.product_categories || []
}

/**
 * Fetch a single category by ID or handle
 */
export async function getCategoryByHandle(handle: string): Promise<MedusaCategory | null> {
  const categories = await getCategories()
  return categories.find((cat) => cat.handle === handle.toLowerCase()) || null
}
