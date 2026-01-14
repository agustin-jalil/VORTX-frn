"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  getOrderById,
  getOrderShipments,
  formatOrderStatus,
  formatFulfillmentStatus,
  type Order,
  type Shipment,
} from "@/lib/medusa/orders"
import { formatPrice } from "@/lib/medusa"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, MapPin } from "lucide-react"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { isAuthenticated, isLoading, idToken, getIdToken } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loadingOrder, setLoadingOrder] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    async function loadOrder() {
      const token = idToken || (await getIdToken())
      if (token) {
        const [orderData, shipmentsData] = await Promise.all([getOrderById(token, id), getOrderShipments(token, id)])
        setOrder(orderData)
        setShipments(shipmentsData)
      }
      setLoadingOrder(false)
    }

    if (isAuthenticated) {
      loadOrder()
    }
  }, [isAuthenticated, idToken, getIdToken, id])

  if (isLoading || loadingOrder) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </main>
    )
  }

  if (!isAuthenticated || !order) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a pedidos
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Pedido #{order.display_id}</h1>
            <p className="text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{formatOrderStatus(order.status)}</Badge>
            <Badge variant="secondary">{formatFulfillmentStatus(order.fulfillment_status)}</Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Artículos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      {item.variant && <p className="text-sm text-muted-foreground">{item.variant.title}</p>}
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.unit_price * item.quantity, order.currency_code)}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos</span>
                  <span>{formatPrice(order.tax_total, order.currency_code)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total, order.currency_code)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address.address_1}
                  {order.shipping_address.address_2 && `, ${order.shipping_address.address_2}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                </p>
                <p className="text-muted-foreground">{order.shipping_address.country_code}</p>
              </CardContent>
            </Card>
          )}

          {/* Shipments Tracking */}
          {shipments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Seguimiento de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipments.map((shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          {shipment.provider && <p className="font-medium">{shipment.provider}</p>}
                          {shipment.tracking_number && (
                            <p className="text-sm text-muted-foreground">Tracking: {shipment.tracking_number}</p>
                          )}
                          <p className="text-sm text-muted-foreground">Estado: {shipment.status}</p>
                        </div>
                        {shipment.tracking_url && (
                          <a
                            href={shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Ver tracking
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
