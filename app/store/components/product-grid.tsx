'use client'

import * as React from 'react'
import { Film } from 'lucide-react'
import { ProductCard } from './product-card'
import { ProductModal } from './product-modal'

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category: string
  duration: string | null
  features: any
  is_popular: boolean
}

interface ProductGridProps {
  products: Product[]
  telegramHandle: string
}

export function ProductGrid({ products, telegramHandle }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  if (products.length === 0) {
    return (
      <div className="store-empty">
        <div className="store-empty-icon">
          <Film className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-xl font-bold">No se encontraron productos</h3>
        <p className="text-muted-foreground">
          Intenta con otra búsqueda o categoría
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="store-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        telegramHandle={telegramHandle}
      />
    </>
  )
}
