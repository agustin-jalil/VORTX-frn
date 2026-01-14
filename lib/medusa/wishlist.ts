// Wishlist API functions for Medusa backend

const getBackendUrl = () => process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
const getPublishableKey = () => process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function getHeaders(idToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${idToken}`,
    "x-publishable-api-key": getPublishableKey(),
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  }
}

export interface WishlistItem {
  id: string
  product_id: string
  variant_id?: string
  created_at: string
  product?: {
    id: string
    title: string
    thumbnail: string
    handle: string
    variants?: Array<{
      id: string
      title: string
      prices: Array<{
        amount: number
        currency_code: string
      }>
    }>
  }
}

export async function getWishlist(idToken: string): Promise<WishlistItem[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/wishlist`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.wishlist || data.items || []
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return []
  }
}

export async function addToWishlist(
  idToken: string,
  productId: string,
  variantId?: string,
): Promise<WishlistItem | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/wishlist`, {
      method: "POST",
      headers: getHeaders(idToken),
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.item || data.wishlist_item
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return null
  }
}

export async function removeFromWishlist(idToken: string, itemId: string): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/wishlist/${itemId}`, {
      method: "DELETE",
      headers: getHeaders(idToken),
    })

    return response.ok
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return false
  }
}

export async function clearWishlist(idToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/wishlist`, {
      method: "DELETE",
      headers: getHeaders(idToken),
    })

    return response.ok
  } catch (error) {
    console.error("Error clearing wishlist:", error)
    return false
  }
}

export async function isInWishlist(idToken: string, productId: string): Promise<boolean> {
  const wishlist = await getWishlist(idToken)
  return wishlist.some((item) => item.product_id === productId)
}
