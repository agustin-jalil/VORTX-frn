"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MedusaProduct } from "@/lib/medusa"
import { useState } from "react"

interface ProductEditPanelProps {
  product: MedusaProduct | null
}

export default function ProductEditPanel({ product }: ProductEditPanelProps) {
  const [productName, setProductName] = useState(product?.title || "")
  const [description, setDescription] = useState(product?.description || "")
  const [category, setCategory] = useState(product?.metadata?.category || "")

  if (!product) {
    return (
      <Card className="p-6 bg-white">
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Select a product to edit</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-white sticky top-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Products</h2>
        <Button variant="link" className="text-sm text-primary">
          See full view →
        </Button>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <div>
            <Label htmlFor="product-name" className="text-sm text-gray-600 mb-2 block">
              Product Name
            </Label>
            <Input
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={product.title}
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm text-gray-600 mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Here's the beginner between you and me. The key to a successful run is self-made sure you run right. A drop and weighed our ap"
              rows={6}
              className="bg-gray-50 resize-none"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm text-gray-600 mb-2 block">
              Category
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Product Category</span>
            </div>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Running"
              className="bg-gray-50 mt-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Stock Available</Label>
            <Input type="number" defaultValue={product.metadata?.stock || 0} className="bg-gray-50" />
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Items Sold</Label>
            <Input type="number" defaultValue={product.metadata?.sold || 0} className="bg-gray-50" disabled />
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">SKU</Label>
            <Input defaultValue={product.variants?.[0]?.id || ""} className="bg-gray-50" disabled />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Price</Label>
            <Input
              type="number"
              defaultValue={product.variants?.[0]?.prices?.[0]?.amount / 100 || 0}
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Currency</Label>
            <Input defaultValue={product.variants?.[0]?.prices?.[0]?.currency_code || "USD"} className="bg-gray-50" />
          </div>
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Discount %</Label>
            <Input type="number" defaultValue={0} className="bg-gray-50" />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1 bg-transparent">
          Discard
        </Button>
        <Button className="flex-1 bg-gray-900 hover:bg-gray-800">Update Product</Button>
      </div>
    </Card>
  )
}
