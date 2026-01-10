"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type MedusaProduct, formatPrice } from "@/lib/medusa"
import Image from "next/image"

interface ProductCardProps {
  product: MedusaProduct
  isSelected?: boolean
  onClick?: () => void
}

export default function ProductCard({ product, isSelected, onClick }: ProductCardProps) {
  const variant = product.variants?.[0]
  const price = variant?.prices?.[0]
  const stock = product.metadata?.stock || 0
  const sold = product.metadata?.sold || 0

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={onClick}
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
        <Image
          src={product.thumbnail || "/placeholder.svg?height=200&width=200"}
          alt={product.title}
          fill
          className="object-contain p-4"
        />
      </div>
      <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
      <p className="text-lg font-semibold text-gray-900 mb-2">
        {price ? formatPrice(price.amount, price.currency_code) : "N/A"}
      </p>
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="secondary" className="text-xs">
          Stock: {stock}
        </Badge>
        <Badge variant="outline" className="text-xs">
          Sold: {sold}
        </Badge>
      </div>
    </Card>
  )
}
