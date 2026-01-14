"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getCustomerAddresses, deleteAddress, type CustomerAddress } from "@/lib/medusa/customer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Package, Heart, LogOut, Trash2, Plus } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, customer, idToken, signOut, getIdToken } = useAuth()
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    async function loadAddresses() {
      const token = idToken || (await getIdToken())
      if (token) {
        const data = await getCustomerAddresses(token)
        setAddresses(data)
      }
      setLoadingAddresses(false)
    }

    if (isAuthenticated) {
      loadAddresses()
    }
  }, [isAuthenticated, idToken, getIdToken])

  const handleDeleteAddress = async (addressId: string) => {
    const token = idToken || (await getIdToken())
    if (token) {
      const success = await deleteAddress(token, addressId)
      if (success) {
        setAddresses(addresses.filter((a) => a.id !== addressId))
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-semibold mb-8">Mi Cuenta</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Nombre:</span> {customer?.first_name} {customer?.last_name}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {customer?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/orders">
              <Card className="hover:bg-muted/50 transition cursor-pointer h-full">
                <CardContent className="flex items-center gap-3 p-6">
                  <Package className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Mis Pedidos</p>
                    <p className="text-sm text-muted-foreground">Ver historial de compras</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/favorites">
              <Card className="hover:bg-muted/50 transition cursor-pointer h-full">
                <CardContent className="flex items-center gap-3 p-6">
                  <Heart className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Favoritos</p>
                    <p className="text-sm text-muted-foreground">Productos guardados</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:bg-muted/50 transition cursor-pointer h-full" onClick={handleSignOut}>
              <CardContent className="flex items-center gap-3 p-6">
                <LogOut className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cerrar Sesión</p>
                  <p className="text-sm text-muted-foreground">Salir de tu cuenta</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Addresses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Direcciones Guardadas
              </CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </CardHeader>
            <CardContent>
              {loadingAddresses ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground" />
                </div>
              ) : addresses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tienes direcciones guardadas</p>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {address.first_name} {address.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.address_1}
                          {address.address_2 && `, ${address.address_2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.province} {address.postal_code}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.country_code}</p>
                        {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
