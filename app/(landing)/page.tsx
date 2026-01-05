import * as React from 'react'
import type { Metadata } from 'next'

import { Header } from '@/components/header'
import { HeroSection } from '@/components/landing/hero-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { StatsSection } from '@/components/landing/stats-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { JsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Plataforma de contenido y sorteos. Comparte tus publicaciones, participa en sorteos y conecta con la comunidad.',
}

export default function RootPage() {
  return (
    <>
      <JsonLd type="website" />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Header />
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <StatsSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <LandingFooter />
      </div>
    </>
  )
}
