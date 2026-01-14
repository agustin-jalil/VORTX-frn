// Customer API functions for Medusa backend

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

export interface CustomerProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, any>
}

export interface CustomerAddress {
  id: string
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  province?: string
  postal_code: string
  country_code: string
  phone?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
}

export async function getCustomerProfile(idToken: string): Promise<CustomerProfile | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.customer
  } catch (error) {
    console.error("Error fetching customer profile:", error)
    return null
  }
}

export async function updateCustomerProfile(
  idToken: string,
  data: Partial<CustomerProfile>,
): Promise<CustomerProfile | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me`, {
      method: "POST",
      headers: getHeaders(idToken),
      body: JSON.stringify(data),
    })

    if (!response.ok) return null

    const result = await response.json()
    return result.customer
  } catch (error) {
    console.error("Error updating customer profile:", error)
    return null
  }
}

export async function getCustomerAddresses(idToken: string): Promise<CustomerAddress[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/addresses`, {
      method: "GET",
      headers: getHeaders(idToken),
    })

    if (!response.ok) return []

    const data = await response.json()
    return data.addresses || []
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return []
  }
}

export async function createAddress(
  idToken: string,
  address: Omit<CustomerAddress, "id">,
): Promise<CustomerAddress | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/addresses`, {
      method: "POST",
      headers: getHeaders(idToken),
      body: JSON.stringify(address),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.address
  } catch (error) {
    console.error("Error creating address:", error)
    return null
  }
}

export async function updateAddress(
  idToken: string,
  addressId: string,
  data: Partial<CustomerAddress>,
): Promise<CustomerAddress | null> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/addresses/${addressId}`, {
      method: "PUT",
      headers: getHeaders(idToken),
      body: JSON.stringify(data),
    })

    if (!response.ok) return null

    const result = await response.json()
    return result.address
  } catch (error) {
    console.error("Error updating address:", error)
    return null
  }
}

export async function deleteAddress(idToken: string, addressId: string): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
      headers: getHeaders(idToken),
    })

    return response.ok
  } catch (error) {
    console.error("Error deleting address:", error)
    return false
  }
}
