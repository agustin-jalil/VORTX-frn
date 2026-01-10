import type { MedusaProduct } from "@/types/medusa"
import type { Product } from "@/types/product"

/**
 * Format price from Medusa format (cents) to display format
 */
export function formatPrice(amount: number, currencyCode = "USD"): string {
  const price = amount / 100
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(price)
}

/**
 * Transform Medusa product to internal Product type
 */
export function transformMedusaProduct(medusaProduct: MedusaProduct): Product {
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
