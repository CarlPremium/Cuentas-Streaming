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
        {/* Hero Section - REDESIGNED */}
        <section className="store-hero">
          <div className="container relative z-10 py-20 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              {/* Animated Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 backdrop-blur-sm border border-primary/20">
                <ShoppingBag className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  {t('store.badge', 'Tienda Oficial')}
                </span>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </div>

              {/* Main Title */}
              <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-foreground">
                  {t('store.title.accounts', 'Cuentas')}
                </span>
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  {t('store.title.premium', 'Premium')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {t('store.subtitle', 'Accede a los mejores servicios de streaming y gaming a precios increíbles. Cuentas 100% legítimas con garantía.')}
              </p>

              {/* Stats Row */}
              <div className="mb-10 grid grid-cols-3 gap-4 sm:gap-6">
                <div className="rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 p-4">
                  <div className="text-2xl font-bold text-primary sm:text-3xl">50+</div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Productos</div>
                </div>
                <div className="rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 p-4">
                  <div className="text-2xl font-bold text-accent sm:text-3xl">24/7</div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Soporte</div>
                </div>
                <div className="rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 p-4">
                  <div className="text-2xl font-bold text-primary sm:text-3xl">100%</div>
                  <div className="text-xs text-muted-foreground sm:text-sm">Garantía</div>
                </div>
              </div>

              {/* Payment Methods - REDESIGNED */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Métodos de pago seguros
                </p>
                <div className="payment-methods">
                  <div className="payment-badge group hover:scale-105 transition-transform">
                    {/* Binance Logo SVG */}
                    <svg className="binance-logo" viewBox="0 0 126.61 126.61" fill="currentColor">
                      <path d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.43 38.9l14.3 14.3zM0 63.31l14.3-14.3 14.3 14.3-14.3 14.3zM38.73 73.41l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.9-38.88 14.3-14.31zM98.28 63.31l14.3-14.3 14.3 14.3-14.3 14.3z"/>
                      <path d="M77.83 63.3L63.32 48.78 52.59 59.51l-1.26 1.26-2.54 2.54 14.53 14.53 14.51-14.53z"/>
                    </svg>
                    <span className="font-semibold">{t('store.payment.binance', 'Binance Pay')}</span>
                  </div>
                  <div className="payment-badge group hover:scale-105 transition-transform">
                    {/* PayPal Logo SVG */}
                    <svg className="paypal-logo" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.793.679l-.733 4.653a.395.395 0 0 1-.391.333H8.24a.398.398 0 0 1-.392-.466l1.988-12.585a.8.8 0 0 1 .79-.672h2.195c2.993 0 5.03.6 6.048 1.78.375.434.645.946.797 1.53.058.22.1.447.125.683.021.23.028.48.02.745a6.22 6.22 0 0 1-.07.893c-.047.33-.12.65-.223.961-.1.308-.233.606-.395.89z"/>
                      <path d="M7.448 3.331a.8.8 0 0 1 .79-.672h5.42c3.18 0 5.33.663 6.398 1.98.895 1.103 1.118 2.777.677 4.964-.687 3.414-2.5 4.78-5.432 5.036a12.468 12.468 0 0 1-1.364.064h-1.634a.803.803 0 0 0-.792.68l-.735 4.664a.395.395 0 0 1-.39.333H6.19a.398.398 0 0 1-.393-.466L7.448 3.33z" fill="#0070E0"/>
                    </svg>
                    <span className="font-semibold">{t('store.payment.paypal', 'PayPal')}</span>
                  </div>
                </div>
              </div>
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
