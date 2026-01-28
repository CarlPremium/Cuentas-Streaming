'use client'

import * as React from 'react'
import Image from 'next/image'
import { Send, Clock, Shield, Star, Check, Wallet, CreditCard } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Product {
  id: number
  name: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category: string
  duration: string | null
  features: any
  is_popular: boolean
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  telegramHandle: string
}

export function ProductModal({ isOpen, onClose, product, telegramHandle }: ProductModalProps) {
  if (!product) return null

  const features = Array.isArray(product.features) 
    ? product.features 
    : typeof product.features === 'string'
    ? JSON.parse(product.features)
    : []

  const handleBuyClick = () => {
    const message = encodeURIComponent(
      `🛍️ Hola! Quiero comprar:\n\n` +
      `📦 ${product.name}\n` +
      `💰 $${product.price.toFixed(2)}\n` +
      `⏱️ ${product.duration || 'N/A'}\n\n` +
      `Por favor, envíame los detalles de pago.`
    )
    const telegramLink = `https://t.me/${telegramHandle.replace('@', '')}?text=${message}`
    window.open(telegramLink, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[80vh] overflow-y-auto p-0">
        {/* Product Image - Very Compact */}
        {product.image_url && (
          <div className="product-modal-image">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain"
              sizes="480px"
              priority
            />
            <div className="product-modal-overlay" />
            {product.is_popular && (
              <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground border-0 text-xs py-0.5 px-2">
                <Star className="mr-1 h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>
        )}

        <div className="p-4 space-y-3">

        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Badge variant="outline" className="mb-1.5 text-primary border-primary/30 text-[10px] py-0 px-2">
                {product.category}
              </Badge>
              <DialogTitle className="text-lg font-bold leading-tight">
                {product.name}
              </DialogTitle>
            </div>
            <div className="text-right flex-shrink-0">
              {product.original_price && (
                <p className="text-[10px] text-muted-foreground line-through">
                  ${product.original_price.toFixed(2)}
                </p>
              )}
              <p className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>
          {product.description && (
            <DialogDescription className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Duration */}
        {product.duration && (
          <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>
              Duración: <strong className="text-foreground">{product.duration}</strong>
            </span>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-foreground">Incluye:</h4>
            <div className="product-features">
              {features.map((feature: string, index: number) => (
                <div key={index} className="product-feature">
                  <Shield className="product-feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="modal-payment-section">
          <div className="modal-payment-title">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>Métodos de Pago</span>
          </div>

          <div className="modal-payment-methods">
            {/* Binance Pay with Real Logo */}
            <div className="modal-payment-item modal-payment-binance">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 126.61 126.61" fill="#F0B90B">
                <path d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.9l14.3 14.3zM0 63.31l14.3-14.3 14.3 14.3-14.3 14.3zM38.73 73.41l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.9-38.88 14.3-14.31zM98.28 63.31l14.3-14.3 14.3 14.3-14.3 14.3z"/>
                <path d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.26 1.26-2.54 2.54 14.53 14.53 14.51-14.53z"/>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="text-[#F0B90B] text-[10px] font-bold">Binance</span>
                <span className="text-[#F0B90B]/80 text-[9px]">Pay</span>
              </div>
            </div>

            {/* PayPal with Real Logo */}
            <div className="modal-payment-item modal-payment-paypal">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#003087" d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.793.679l-.733 4.653a.395.395 0 0 1-.391.333H8.24a.398.398 0 0 1-.392-.466l1.988-12.585a.8.8 0 0 1 .79-.672h2.195c2.993 0 5.03.6 6.048 1.78.375.434.645.946.797 1.53.058.22.1.447.125.683.021.23.028.48.02.745a6.22 6.22 0 0 1-.07.893c-.047.33-.12.65-.223.961-.1.308-.233.606-.395.89z"/>
                <path fill="#0070E0" d="M7.448 3.331a.8.8 0 0 1 .79-.672h5.42c3.18 0 5.33.663 6.398 1.98.895 1.103 1.118 2.777.677 4.964-.687 3.414-2.5 4.78-5.432 5.036a12.468 12.468 0 0 1-1.364.064h-1.634a.803.803 0 0 0-.792.68l-.735 4.664a.395.395 0 0 1-.39.333H6.19a.398.398 0 0 1-.393-.466L7.448 3.33z"/>
              </svg>
              <span className="text-[#003087] text-[10px] font-bold leading-none">PayPal</span>
            </div>
          </div>

          <div className="modal-payment-check">
            <Check className="h-3 w-3 text-primary" />
            <span>Transacciones seguras</span>
          </div>
        </div>

        {/* CTA Button - Compact */}
        <Button
          onClick={handleBuyClick}
          className="w-full bg-gradient-to-r from-primary to-accent py-4 text-sm font-semibold"
        >
          <Send className="mr-2 h-3.5 w-3.5" />
          Comprar por Telegram
        </Button>

        <p className="text-center text-[10px] text-muted-foreground -mt-1">
          Serás redirigido a Telegram para completar tu compra
        </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
