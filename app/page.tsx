import { getCategories, getAllProducts } from "@/lib/medusa"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()])

  // Get first product for hero
  const heroProduct = products[0]

  // Get featured products
  const featuredProducts = products.slice(1, 4)

  return (
    <main className="w-full">
      {heroProduct && (
        <section className="relative w-full bg-black text-white py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-semibold mb-4 tracking-tight">{heroProduct.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              {heroProduct.subtitle || heroProduct.description?.substring(0, 60) || "Innovation at its finest"}
            </p>
            <div className="flex gap-6 justify-center mb-12 flex-wrap">
              <Link
                href={`/products/${heroProduct.id}`}
                className="text-lg text-blue-400 hover:underline flex items-center gap-1"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/products/${heroProduct.id}`} className="text-lg text-blue-400 hover:underline">
                Buy
              </Link>
            </div>
            <div className="w-full max-w-5xl mx-auto">
              <img
                src={heroProduct.thumbnail || "/placeholder.svg?height=600&width=1200&query=hero product"}
                alt={heroProduct.title}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length >= 2 && (
        <section className="grid md:grid-cols-2 gap-0">
          {featuredProducts.slice(0, 2).map((product, idx) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group relative bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="py-16 px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-semibold mb-3 tracking-tight">{product.title}</h2>
                <p className="text-lg md:text-xl mb-6 text-muted-foreground">
                  {product.subtitle || product.description?.substring(0, 50) || "Discover more"}
                </p>
                <div className="flex gap-6 justify-center mb-8">
                  <span className="text-blue-600 hover:underline flex items-center gap-1">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </span>
                  <span className="text-blue-600 hover:underline">Buy</span>
                </div>
                <div className="w-full max-w-md mx-auto">
                  <img
                    src={product.thumbnail || "/placeholder.svg?height=400&width=600&query=featured product"}
                    alt={product.title}
                    className="w-full h-auto rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 tracking-tight">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.handle}`}
                className="group relative bg-muted/30 hover:bg-muted rounded-2xl p-8 md:p-12 text-center transition-all"
              >
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-semibold group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm text-blue-600 group-hover:underline">Shop now</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredProducts[2] && (
        <section className="py-16 bg-muted/30">
          <Link href={`/products/${featuredProducts[2].id}`} className="group block container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight">{featuredProducts[2].title}</h2>
            <p className="text-lg md:text-xl mb-6 text-muted-foreground">
              {featuredProducts[2].description?.substring(0, 80) || "Explore the latest innovation"}
            </p>
            <div className="flex gap-6 justify-center mb-10">
              <span className="text-blue-600 hover:underline flex items-center gap-1">
                Learn more <ArrowRight className="w-4 h-4" />
              </span>
            </div>
            <div className="w-full max-w-4xl mx-auto">
              <img
                src={featuredProducts[2].thumbnail || "/placeholder.svg?height=500&width=1000&query=promotion"}
                alt={featuredProducts[2].title}
                className="w-full h-auto rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </Link>
        </section>
      )}
    </main>
  )
}
