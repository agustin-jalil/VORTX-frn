import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { WhatsInBox } from "@/components/product/whats-in-box"
import { IncludedServices } from "@/components/product/included-services"
import { RelatedProducts } from "@/components/product/related-products"
import { WishlistButton } from "@/components/product/wishlist-button"
import { getProductById, getAllProducts } from "@/lib/medusa"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const variant = product.variants?.[0]
  const price = variant?.prices?.[0]
  const images = product.images?.map((img) => img.url) || [product.thumbnail]

  return (
    <main className="min-h-screen">
      <div className="bg-muted py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Product ID:</span> {product.id}
          </p>
          <WishlistButton productId={product.id} variantId={variant?.id} />
        </div>
      </div>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductGallery images={images} productName={product.title} />
          <ProductInfo
            product={{
              id: product.id,
              name: product.title,
              category: "productos",
              price: price ? price.amount / 100 : 0,
              description: product.description || "",
              images,
              specifications: [
                { label: "SKU", value: variant?.id || "N/A" },
                { label: "Variante", value: variant?.title || "Estándar" },
              ],
              features: [],
              whatsInBox: [],
            }}
          />
        </div>
      </section>

      {product.metadata?.whatsInBox && (
        <section className="container mx-auto px-4">
          <WhatsInBox items={product.metadata.whatsInBox} />
        </section>
      )}

      {product.metadata?.includedServices && (
        <section className="container mx-auto px-4">
          <IncludedServices services={product.metadata.includedServices} />
        </section>
      )}

      {product.metadata?.relatedProducts && (
        <section className="container mx-auto px-4">
          <RelatedProducts products={product.metadata.relatedProducts} />
        </section>
      )}
    </main>
  )
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}
