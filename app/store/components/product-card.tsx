'use client'

import * as React from 'react'
import Image from 'next/image'
import { Star, Clock, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category: string
  duration: string | null
  is_popular: boolean
}

interface ProductCardProps {
  product: Product
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <article className="product-card" onClick={onClick}>
      {/* Image */}
      <div className="product-image">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="product-image-overlay" />
        
        {/* Badges */}
        {product.is_popular && (
          <Badge className="product-badge product-badge-popular">
            <Star className="h-3 w-3" />
            Popular
          </Badge>
        )}
        
        {product.duration && (
          <Badge variant="outline" className="product-badge product-badge-duration">
            <Clock className="h-3 w-3" />
            {product.duration}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="product-content">
        <Badge variant="outline" className="product-category">
          {product.category}
        </Badge>
        
        <h3 className="product-title">{product.name}</h3>
        
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-footer">
          <div className="product-price">
            <span className="product-price-current">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="product-price-original">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className="product-cta bg-gradient-to-r from-primary to-accent"
          >
            Ver más
          </Button>
        </div>
        
        {discount > 0 && (
          <div className="mt-2 text-xs font-medium text-green-500">
            ¡Ahorra {discount}%!
          </div>
        )}
      </div>
    </article>
  )
}
