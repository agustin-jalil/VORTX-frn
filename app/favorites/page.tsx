"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/medusa/wishlist"
import { formatPrice } from "@/lib/medusa"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, ShoppingBag } from "lucide-react"

export default function FavoritesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, idToken, getIdToken } = useAuth()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loadingWishlist, setLoadingWishlist] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    async function loadWishlist() {
      const token = idToken || (await getIdToken())
      if (token) {
        const data = await getWishlist(token)
        setWishlist(data)
      }
      setLoadingWishlist(false)
    }

    if (isAuthenticated) {
      loadWishlist()
    }
  }, [isAuthenticated, idToken, getIdToken])

  const handleRemove = async (itemId: string) => {
    setRemovingId(itemId)
    const token = idToken || (await getIdToken())
    if (token) {
      const success = await removeFromWishlist(token, itemId)
      if (success) {
        setWishlist(wishlist.filter((item) => item.id !== itemId))
      }
    }
    setRemovingId(null)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-semibold mb-8">Mis Favoritos</h1>

        {loadingWishlist ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
          </div>
        ) : wishlist.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No tienes favoritos</h2>
              <p className="text-muted-foreground mb-6">Guarda productos que te gusten para verlos más tarde</p>
              <Link href="/" className="text-primary hover:underline">
                Explorar productos
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const product = item.product
              const variant = product?.variants?.[0]
              const price = variant?.prices?.[0]

              return (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="relative aspect-square bg-muted">
                    {product?.thumbnail && (
                      <Link href={`/products/${item.product_id}`}>
                        <img
                          src={product.thumbnail || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={() => handleRemove(item.id)}
                      disabled={removingId === item.id}
                    >
                      {removingId === item.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/products/${item.product_id}`}>
                      <h3 className="font-medium hover:text-primary transition truncate">
                        {product?.title || "Producto"}
                      </h3>
                    </Link>
                    {price && (
                      <p className="text-lg font-semibold mt-1">{formatPrice(price.amount, price.currency_code)}</p>
                    )}
                    <Button className="w-full mt-4" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Añadir al Carrito
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
