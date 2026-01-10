import { CatalogHeader } from "@/components/catalog/catalog-header"
import { CatalogLineup } from "@/components/catalog/catalog-lineup"
import { CatalogCloserLook } from "@/components/catalog/catalog-closer-look"
import { CatalogFeatures } from "@/components/catalog/catalog-features"
import { CatalogFooter } from "@/components/catalog/catalog-footer"
import { notFound } from "next/navigation"
import { getCategories, getProductsByCategory, formatPrice } from "@/lib/medusa"
import type { MedusaProduct } from "@/types/medusa"

interface PageProps {
  params: Promise<{
    categoria: string
  }>
}

export default async function CatalogPage({ params }: PageProps) {
  const { categoria } = await params

  const categories = await getCategories()
  const category = categories.find((cat) => cat.handle === categoria.toLowerCase())

  if (!category) {
    notFound()
  }

  const medusaProducts = await getProductsByCategory(category.id)

  const products = medusaProducts.map((product: MedusaProduct, index: number) => {
    const variant = product.variants?.[0]
    const price = variant?.prices?.[0]
    const priceFormatted = price ? formatPrice(price.amount, price.currency_code) : "Precio no disponible"

    // Generate gradient colors based on index
    const gradients = [
      "bg-gradient-to-br from-orange-400 to-orange-600",
      "bg-gradient-to-br from-blue-100 to-blue-200",
      "bg-gradient-to-br from-purple-200 to-pink-200",
      "bg-gradient-to-br from-blue-500 to-indigo-700",
      "bg-gradient-to-br from-slate-400 to-slate-600",
      "bg-gradient-to-br from-cyan-100 to-cyan-200",
    ]

    return {
      id: product.id,
      name: product.title,
      description: product.description || "",
      price: `Desde ${priceFormatted}`,
      specs: variant?.title || "Ver especificaciones",
      color: gradients[index % gradients.length],
      lightColor: index % 2 === 0,
      handle: product.handle,
    }
  })

  const models = medusaProducts.map((product) => ({
    name: product.title,
    shortName: product.title.split(" ").slice(-1)[0], // Take last word as short name
  }))

  // Default features (you can customize these per category if needed)
  const features = [
    {
      id: 1,
      title: "Especificaciones y duración",
      description: "Descubre los detalles técnicos",
      icon: "📋",
    },
    {
      id: 2,
      title: "Diseño premium",
      description: "Calidad y elegancia en cada detalle",
      icon: "✨",
    },
    {
      id: 3,
      title: "Rendimiento excepcional",
      description: "Potencia para todo lo que necesitas",
      icon: "⚡",
    },
    {
      id: 4,
      title: "Tecnología avanzada",
      description: "Lo último en innovación",
      icon: "🚀",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <CatalogHeader title={category.name} models={models} />
      <CatalogLineup products={products} />
      <CatalogCloserLook
        title={`Conoce ${category.name}`}
        description={category.description || `Descubre toda la línea de ${category.name}`}
      />
      <CatalogFeatures features={features} />
      <CatalogFooter />
    </main>
  )
}
