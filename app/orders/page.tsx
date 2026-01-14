"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getCustomerOrders, formatOrderStatus, formatFulfillmentStatus, type Order } from "@/lib/medusa/orders"
import { formatPrice } from "@/lib/medusa"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronRight } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, idToken, getIdToken } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    async function loadOrders() {
      const token = idToken || (await getIdToken())
      if (token) {
        const data = await getCustomerOrders(token)
        setOrders(data)
      }
      setLoadingOrders(false)
    }

    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated, idToken, getIdToken])

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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">Mis Pedidos</h1>

        {loadingOrders ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No tienes pedidos</h2>
              <p className="text-muted-foreground mb-6">Cuando realices una compra, aparecerá aquí</p>
              <Link href="/" className="text-primary hover:underline">
                Explorar productos
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="hover:bg-muted/50 transition cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">Pedido #{order.display_id}</p>
                          <Badge variant="outline">{formatOrderStatus(order.status)}</Badge>
                          <Badge variant="secondary">{formatFulfillmentStatus(order.fulfillment_status)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm">
                          {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-lg">{formatPrice(order.total, order.currency_code)}</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
