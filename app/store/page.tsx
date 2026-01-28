import * as React from 'react'
import type { Metadata } from 'next'
import { ShoppingBag, Sparkles, Wallet, CreditCard } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { StoreFilters } from './components/store-filters'
import { ProductGrid } from './components/product-grid'

import { generateSEOMetadata } from '@/lib/seo/metadata'
import { getTranslation } from '@/hooks/i18next'
import { createClient } from '@/supabase/server'

import './store.css'

export const revalidate = 3600 // 1 hour

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Tienda - Cuentas Premium',
    description: 'Compra cuentas premium de streaming, música y gaming a los mejores precios. Netflix, Spotify, Disney+ y más.',
    keywords: 'cuentas premium, netflix, spotify, disney plus, hbo max, gaming, streaming',
    type: 'website',
  })
}

export default async function StorePage({
  searchParams,
}: {
  searchParams?: Promise<{
    category?: string
    search?: string
  }>
}) {
  const params = await searchParams
  const category = params?.category || 'all'
  const search = params?.search || ''

  const supabase = await createClient()
  const { t } = await getTranslation()

  // Fetch categories
  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  // Fetch products
  let query = supabase
    .from('products')
    .select('*')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('sort_order')
    .order('created_at', { ascending: false })

  if (category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data: products } = await query

  // Fetch store settings
  const { data: settings } = await supabase
    .from('store_settings')
    .select('*')
    .single()

  return (
    <>
      <Header />
      <main className="store-page">
        {/* Hero Section - COMPLETELY REDESIGNED */}
        <section className="store-hero-redesigned">
          {/* Animated Background Elements */}
          <div className="hero-bg-orb hero-bg-orb-1" />
          <div className="hero-bg-orb hero-bg-orb-2" />
          <div className="hero-bg-orb hero-bg-orb-3" />

          <div className="container relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-20">
            {/* Floating Badge */}
            <div className="hero-badge animate-float">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="hero-badge-text">
                {t('store.badge', '🔥 Tienda Oficial')}
              </span>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>

            {/* Main Title with Glitch Effect */}
            <h1 className="hero-title-wrapper">
              <span className="hero-title-line-1">
                {t('store.title.your', 'Tu')}
              </span>
              <span className="hero-title-main">
                <span className="hero-title-gradient" data-text="Streaming">
                  Streaming
                </span>
              </span>
              <span className="hero-title-line-3">
                {t('store.title.starts_here', 'Comienza Aquí')}
              </span>
            </h1>

            {/* Animated Subtitle */}
            <p className="hero-subtitle">
              {t('store.subtitle', 'Accede a Netflix, Spotify, Disney+ y más. Cuentas premium verificadas con garantía instantánea.')}
            </p>

            {/* Feature Pills */}
            <div className="hero-features">
              <div className="hero-feature-pill">
                <div className="hero-feature-icon">⚡</div>
                <span>Entrega Instantánea</span>
              </div>
              <div className="hero-feature-pill">
                <div className="hero-feature-icon">🛡️</div>
                <span>100% Garantía</span>
              </div>
              <div className="hero-feature-pill">
                <div className="hero-feature-icon">💎</div>
                <span>Precios Increíbles</span>
              </div>
            </div>

            {/* Payment Methods Redesigned */}
            <div className="hero-payment-section">
              <p className="hero-payment-label">
                <Wallet className="h-4 w-4" />
                Pago 100% Seguro
              </p>
              <div className="hero-payment-badges">
                <div className="hero-payment-badge hero-payment-binance">
                  <svg className="h-6 w-6" viewBox="0 0 126.61 126.61" fill="currentColor">
                    <path d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.9l14.3 14.3zM0 63.31l14.3-14.3 14.3 14.3-14.3 14.3zM38.73 73.41l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.9-38.88 14.3-14.31zM98.28 63.31l14.3-14.3 14.3 14.3-14.3 14.3z"/>
                    <path d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.26 1.26-2.54 2.54 14.53 14.53 14.51-14.53z"/>
                  </svg>
                  Binance Pay
                </div>
                <div className="hero-payment-badge hero-payment-paypal">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.448 3.331a.8.8 0 0 1 .79-.672h5.42c3.18 0 5.33.663 6.398 1.98.895 1.103 1.118 2.777.677 4.964-.687 3.414-2.5 4.78-5.432 5.036a12.468 12.468 0 0 1-1.364.064h-1.634a.803.803 0 0 0-.792.68l-.735 4.664a.395.395 0 0 1-.39.333H6.19a.398.398 0 0 1-.393-.466L7.448 3.33z" fill="#0070E0"/>
                  </svg>
                  PayPal
                </div>
                <div className="hero-payment-badge hero-payment-crypto">
                  <CreditCard className="h-5 w-5" />
                  Crypto
                </div>
              </div>
            </div>

            {/* Scroll Indicator - ANIMATED */}
            <div className="hero-scroll-indicator">
              <div className="hero-scroll-icon">
                <div className="hero-scroll-dot" />
              </div>
              <span className="hero-scroll-text">Ver Productos</span>
            </div>
          </div>
        </section>

        {/* Filters */}
        <StoreFilters 
          categories={categories || []} 
          currentCategory={category}
          currentSearch={search}
        />

        {/* Products Grid */}
        <section className="py-12">
          <div className="container">
            <ProductGrid 
              products={products || []} 
              telegramHandle={settings?.telegram_handle || '@tu_usuario'}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
