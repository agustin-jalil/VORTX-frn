// Orders API functions for Medusa backend

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

export interface OrderItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  thumbnail?: string
  variant?: {
    id: string
    title: string
  }
}

export interface Order {
  id: string
  display_id: number
  status: string
  fulfillment_status: string
  payment_status: string
  created_at: string
  updated_at: string
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  currency_code: string
  items: OrderItem[]
  shipping_address?: {
    first_name: string
    last_name: string
    address_1: string
    address_2?: string
    city: string
    province?: string
    postal_code: string
    country_code: string
  }
}

export interface Shipment {
  id: string
  tracking_number?: string
  tracking_url?: string
  provider?: string
  status: string
  created_at: string
}

export async function getCustomerOrders(idToken: string): Promise<Order[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/orders`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.orders || []
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function getOrderById(idToken: string, orderId: string): Promise<Order | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/orders/${orderId}`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function getOrderShipments(idToken: string, orderId: string): Promise<Shipment[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/orders/${orderId}/shipments`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.shipments || []
  } catch (error) {
    console.error("Error fetching shipments:", error)
    return []
  }
}

export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pendiente",
    completed: "Completado",
    archived: "Archivado",
    canceled: "Cancelado",
    requires_action: "Requiere acción",
  }
  return statusMap[status] || status
}

export function formatFulfillmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    not_fulfilled: "No enviado",
    partially_fulfilled: "Parcialmente enviado",
    fulfilled: "Enviado",
    partially_shipped: "Parcialmente en camino",
    shipped: "En camino",
    partially_returned: "Parcialmente devuelto",
    returned: "Devuelto",
    canceled: "Cancelado",
  }
  return statusMap[status] || status
}
