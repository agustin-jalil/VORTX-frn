export interface MedusaCategory {
  id: string
  name: string
  description: string
  handle: string
  rank: number
  parent_category_id: string | null
  created_at: string
  updated_at: string
  metadata: any
  parent_category: any
  category_children: any[]
}

export interface MedusaProduct {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
  images: Array<{ url: string }>
  variants: Array<{
    id: string
    title: string
    prices: Array<{
      amount: number
      currency_code: string
    }>
  }>
  metadata: any
}

export interface MedusaCategoriesResponse {
  product_categories: MedusaCategory[]
  count: number
  offset: number
  limit: number
}

export interface MedusaProductsResponse {
  products: MedusaProduct[]
  count: number
  offset: number
  limit: number
}
