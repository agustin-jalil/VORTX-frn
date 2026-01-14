"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/medusa/wishlist"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  variantId?: string
  className?: string
}

export function WishlistButton({ productId, variantId, className }: WishlistButtonProps) {
  const { isAuthenticated, idToken, getIdToken } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkWishlist() {
      if (!isAuthenticated) return

      const token = idToken || (await getIdToken())
      if (token) {
        const wishlist = await getWishlist(token)
        const item = wishlist.find((i) => i.product_id === productId)
        if (item) {
          setIsInWishlist(true)
          setWishlistItemId(item.id)
        }
      }
    }

    checkWishlist()
  }, [isAuthenticated, idToken, getIdToken, productId])

  const handleToggle = async () => {
    if (!isAuthenticated) return

    setIsLoading(true)
    const token = idToken || (await getIdToken())

    if (token) {
      if (isInWishlist && wishlistItemId) {
        const success = await removeFromWishlist(token, wishlistItemId)
        if (success) {
          setIsInWishlist(false)
          setWishlistItemId(null)
        }
      } else {
        const item = await addToWishlist(token, productId, variantId)
        if (item) {
          setIsInWishlist(true)
          setWishlistItemId(item.id)
        }
      }
    }

    setIsLoading(false)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-full", className)}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground",
        )}
      />
    </Button>
  )
}
