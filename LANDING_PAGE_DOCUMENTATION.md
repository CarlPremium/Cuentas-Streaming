# Cuentas Streaming Landing Page - Complete Code Documentation

## Project Structure

```
src/
├── components/
│   └── landing/
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── ParticleField.tsx
│       ├── BenefitsSection.tsx
│       ├── HowItWorksSection.tsx
│       ├── StatsSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── FAQSection.tsx
│       ├── CTASection.tsx
│       └── Footer.tsx
├── pages/
│   └── Index.tsx
├── index.css
└── tailwind.config.ts
```

---

## 1. Main Page (src/pages/Index.tsx)

```tsx
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
```

---

## 2. Navbar Component (src/components/landing/Navbar.tsx)

```tsx
import { Send, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center">
              <span className="text-background font-bold text-lg">CS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-heading font-bold text-lg text-foreground">Cuentas Streaming</h1>
              <p className="text-xs text-muted-foreground">Premium Accounts & Giveaways</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Send className="w-4 h-4" />
              Canal de Telegram
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver Blog
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ver Sorteos
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <User className="w-4 h-4" />
              Perfil
            </Button>
            <Button size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-4">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## 3. Particle Field Effect (src/components/landing/ParticleField.tsx)

```tsx
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize particles
    const particleCount = Math.min(80, Math.floor(dimensions.width / 15));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 280 : 180, // Purple or Cyan
    }));

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.x -= dx * force * 0.02;
          particle.y -= dy * force * 0.02;
        }

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 85%, 65%, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(${particle.hue}, 85%, 65%, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleField;
```

---

## 4. Hero Section (src/components/landing/HeroSection.tsx)

```tsx
import { useEffect, useRef, useState } from "react";
import { Send, Gift, Users, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParticleField from "./ParticleField";

const platforms = [
  { name: "Netflix", color: "bg-red-500", glow: "shadow-red-500/50" },
  { name: "Spotify", color: "bg-green-500", glow: "shadow-green-500/50" },
  { name: "Disney+", color: "bg-blue-500", glow: "shadow-blue-500/50" },
  { name: "YouTube", color: "bg-red-600", glow: "shadow-red-600/50" },
  { name: "HBO Max", color: "bg-purple-500", glow: "shadow-purple-500/50" },
  { name: "Amazon Prime", color: "bg-cyan-500", glow: "shadow-cyan-500/50" },
];

const FloatingCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
      style={{ 
        animation: isVisible ? `float3D 8s ease-in-out infinite ${delay}ms` : 'none',
      }}
    >
      {children}
    </div>
  );
};

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic">
      {/* Particle Field */}
      <ParticleField />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Morphing Blobs */}
      <div 
        className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x * 30}px), calc(-50% + ${mousePosition.y * 30}px))`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-full blur-3xl animate-morph" />
      </div>

      {/* Floating Orbs with 3D effect */}
      <div 
        className="absolute top-20 left-[10%] w-32 h-32 md:w-48 md:h-48"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-pink rounded-full blur-2xl opacity-40 animate-float" />
      </div>
      
      <div 
        className="absolute bottom-32 right-[10%] w-40 h-40 md:w-64 md:h-64"
        style={{
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-green rounded-full blur-2xl opacity-30 animate-float-delayed" />
      </div>

      {/* Glowing Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-purple/30 to-transparent animate-pulse-slow" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* 3D Logo with Glow Ring */}
        <FloatingCard delay={0} className="mb-6 sm:mb-8">
          <div className="relative inline-flex flex-col items-center">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-neon-green/20 text-neon-green border border-neon-green/30 mb-4 animate-bounce-gentle">
              NUEVO
            </span>
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple animate-spin-slow opacity-50 blur-md" />
              {/* Logo container */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-background via-secondary to-background border border-border/50 flex items-center justify-center shadow-2xl backdrop-blur-xl perspective-card">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-neon-cyan/20 via-neon-purple/30 to-neon-pink/20 flex items-center justify-center border border-border/30">
                  <span className="text-4xl sm:text-5xl font-heading font-bold text-gradient">CS</span>
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* Main Heading with Glitch Effect */}
        <FloatingCard delay={100}>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 relative">
            <span className="text-gradient-pink relative inline-block hover-glitch">
              Sorteos Premium
            </span>
          </h1>
        </FloatingCard>
        
        <FloatingCard delay={200}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 tracking-tight">
            Cuentas Streaming
          </h2>
        </FloatingCard>

        {/* Description */}
        <FloatingCard delay={300}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
            El canal de <span className="text-neon-cyan font-semibold glow-text-cyan">Telegram #1</span> para{" "}
            <span className="text-neon-pink font-semibold glow-text-pink">sorteos de cuentas premium</span> de streaming, gaming
            y software ¡100% GRATIS!
          </p>
        </FloatingCard>

        {/* Badges */}
        <FloatingCard delay={400}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="badge-live group cursor-pointer hover:scale-105 transition-transform">
              <span className="w-2 h-2 rounded-full bg-background animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-background relative" />
              En Vivo
            </span>
            <span className="badge-stats hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/20 transition-all cursor-pointer">
              <Users className="w-4 h-4 text-neon-cyan" />
              +64,000 miembros
            </span>
            <span className="badge-stats hover:border-neon-pink/50 hover:shadow-lg hover:shadow-neon-pink/20 transition-all cursor-pointer">
              <Gift className="w-4 h-4 text-neon-pink" />
              100% Gratis
            </span>
          </div>
        </FloatingCard>

        {/* CTA Buttons */}
        <FloatingCard delay={500}>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
            <Button className="btn-primary group relative overflow-hidden w-full sm:w-auto">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Send className="w-4 h-4 mr-2" />
              Únete GRATIS Ahora
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="btn-secondary group w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Ver Sorteos
            </Button>
          </div>
        </FloatingCard>

        {/* Sorteos Info Card with 3D tilt */}
        <FloatingCard delay={600}>
          <div className="glass-card p-4 sm:p-6 max-w-md mx-auto mb-8 sm:mb-10 hover:shadow-2xl hover:shadow-neon-purple/20 transition-all duration-500 group perspective-card-hover cursor-pointer mx-4 sm:mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-cyan/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-neon-cyan" />
              </div>
              <div className="text-left">
                <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base">Sorteos Diarios</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Netflix, Spotify, Disney+ y más</p>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* Platforms with hover effects */}
        <FloatingCard delay={700}>
          <div className="text-center px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Plataformas disponibles en nuestros sorteos:</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {platforms.map((platform, index) => (
                <span 
                  key={platform.name} 
                  className={`platform-pill hover:shadow-lg ${platform.glow} group`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className={`w-2 h-2 rounded-full ${platform.color} group-hover:animate-ping`} />
                  <span className="text-xs sm:text-sm">{platform.name}</span>
                </span>
              ))}
            </div>
          </div>
        </FloatingCard>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
```

---

## 5. Benefits Section (src/components/landing/BenefitsSection.tsx)

```tsx
import { Crown, Gift, ShieldCheck, Sparkles, Zap, Clock } from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Cuentas Premium",
    description: "Netflix, Spotify, Disney+, YouTube Premium, HBO Max y muchas más plataformas completamente gratis",
    gradient: "from-neon-purple/30 to-neon-pink/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(280_85%_65%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-neon-purple to-neon-pink",
  },
  {
    icon: Gift,
    title: "Sorteos Diarios",
    description: "Participa en sorteos exclusivos y gana cuentas premium, tarjetas de regalo y premios increíbles",
    gradient: "from-neon-cyan/30 to-neon-green/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(180_100%_50%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-neon-cyan to-neon-green",
  },
  {
    icon: ShieldCheck,
    title: "100% Garantizado",
    description: "Todas las cuentas están verificadas y garantizadas. Soporte 24/7 para cualquier inconveniente",
    gradient: "from-neon-blue/30 to-neon-cyan/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(220_100%_60%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-neon-blue to-neon-cyan",
  },
  {
    icon: Zap,
    title: "Entrega Instantánea",
    description: "Recibe tus cuentas al instante después de ganar. Sin esperas, sin complicaciones",
    gradient: "from-yellow-500/30 to-orange-500/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(45_100%_50%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Contenido Exclusivo",
    description: "Accede a ofertas especiales, códigos de descuento y promociones solo para miembros",
    gradient: "from-neon-pink/30 to-neon-purple/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(330_100%_65%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-neon-pink to-neon-purple",
  },
  {
    icon: Clock,
    title: "Actualizaciones 24/7",
    description: "Nuevos sorteos y cuentas cada día. Nunca te quedarás sin oportunidades de ganar",
    gradient: "from-emerald-500/30 to-teal-500/20",
    borderGlow: "hover:shadow-[0_0_40px_hsl(160_100%_50%_/_0.3)]",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20 mb-4">
            BENEFICIOS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Qué obtienes al <span className="text-gradient">unirte</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Beneficios exclusivos que no encontrarás en ningún otro lugar
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className={`glass-card-hover p-6 sm:p-8 group ${benefit.borderGlow}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`feature-icon ${benefit.iconBg} text-background mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <benefit.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
                {benefit.description}
              </p>

              {/* Badge */}
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-neon-green/20 text-neon-green border border-neon-green/30">
                Incluido GRATIS
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
```

---

## 6. How It Works Section (src/components/landing/HowItWorksSection.tsx)

```tsx
import { Send, UserPlus, Gift, PartyPopper } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Send,
    title: "Únete al Canal",
    description: "Haz clic en el botón y únete a nuestro canal de Telegram completamente gratis",
    gradient: "from-neon-cyan to-neon-green",
  },
  {
    step: 2,
    icon: UserPlus,
    title: "Activa Notificaciones",
    description: "Activa las notificaciones para no perderte ningún sorteo exclusivo",
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    step: 3,
    icon: Gift,
    title: "Participa en Sorteos",
    description: "Participa en los sorteos diarios siguiendo las instrucciones de cada publicación",
    gradient: "from-neon-blue to-neon-cyan",
  },
  {
    step: 4,
    icon: PartyPopper,
    title: "¡Gana Premios!",
    description: "Recibe tus cuentas premium verificadas directamente en tu bandeja de entrada",
    gradient: "from-neon-pink to-neon-purple",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 mb-4">
            FÁCIL Y RÁPIDO
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Cómo <span className="text-gradient">funciona</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            En solo 4 simples pasos puedes empezar a ganar cuentas premium gratis
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="glass-card-hover p-6 sm:p-8 text-center h-full">
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">{item.step}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <item.icon className="w-8 h-8 sm:w-10 sm:h-10 text-background" />
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
```

---

## 7. Stats Section (src/components/landing/StatsSection.tsx)

```tsx
import { Users, Gift, ShieldCheck, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "+64,000",
    label: "Miembros Activos",
    gradient: "from-neon-purple to-neon-pink",
  },
  {
    icon: Gift,
    value: "Diarios",
    label: "Sorteos Activos",
    gradient: "from-neon-cyan to-neon-green",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Garantizado",
    gradient: "from-neon-blue to-neon-cyan",
  },
  {
    icon: Zap,
    value: "24/7",
    label: "Soporte",
    gradient: "from-neon-green to-neon-cyan",
  },
];

const StatsSection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Estadísticas en <span className="text-gradient">Tiempo Real</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Números que hablan por sí solos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7 text-background" />
              </div>

              {/* Value */}
              <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
```

---

## 8. Testimonials Section (src/components/landing/TestimonialsSection.tsx)

```tsx
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "María García",
    username: "@mariag_2024",
    avatar: "MG",
    content: "Increíble comunidad! Gané mi cuenta de Netflix en el primer sorteo. 100% recomendado para todos.",
    rating: 5,
    platform: "Netflix",
    gradient: "from-red-500 to-red-600",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    username: "@carlos_rod",
    avatar: "CR",
    content: "Llevaba meses buscando algo así. Los sorteos son reales y el soporte es excelente. Ya gané Spotify Premium!",
    rating: 5,
    platform: "Spotify",
    gradient: "from-green-500 to-green-600",
  },
  {
    id: 3,
    name: "Ana Martínez",
    username: "@anamtz_",
    avatar: "AM",
    content: "No podía creerlo cuando gané Disney+. El proceso fue super fácil y la cuenta funciona perfectamente.",
    rating: 5,
    platform: "Disney+",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    username: "@pedro_sanchez",
    avatar: "PS",
    content: "La mejor comunidad de Telegram! Ya gané HBO Max y YouTube Premium. Los sorteos son diarios y muy justos.",
    rating: 5,
    platform: "HBO Max",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: 5,
    name: "Laura Fernández",
    username: "@lauraf",
    avatar: "LF",
    content: "Excelente atención y sorteos verificados. Gané Amazon Prime y la cuenta llegó en minutos. Súper recomendado!",
    rating: 5,
    platform: "Amazon Prime",
    gradient: "from-cyan-500 to-cyan-600",
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-pink/10 text-neon-pink border border-neon-pink/20 mb-4">
            TESTIMONIOS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lo que dicen nuestros <span className="text-gradient-pink">ganadores</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Miles de usuarios ya han ganado sus cuentas premium favoritas
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`glass-card-hover p-5 sm:p-6 relative ${index === activeIndex % 3 ? 'ring-1 ring-primary/30' : ''}`}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-6 h-6 text-muted-foreground/20" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.username}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              {/* Platform Badge */}
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.gradient} text-white`}>
                Ganó {testimonial.platform}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom row - 2 more testimonials */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3, 5).map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass-card-hover p-5 sm:p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-muted-foreground/20" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.username}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${testimonial.gradient} text-white`}>
                Ganó {testimonial.platform}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
```

---

## 9. FAQ Section (src/components/landing/FAQSection.tsx)

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Es realmente gratis participar?",
    answer: "¡Sí! Participar en todos nuestros sorteos es 100% gratis. Solo necesitas unirte a nuestro canal de Telegram y seguir las instrucciones de cada sorteo. No hay costos ocultos ni suscripciones de pago obligatorias.",
  },
  {
    question: "¿Cómo sé que los sorteos son reales?",
    answer: "Todos nuestros sorteos son transparentes y verificables. Publicamos los ganadores en el canal con capturas de pantalla de la entrega de premios. Además, contamos con más de 64,000 miembros que pueden confirmar la legitimidad de nuestros sorteos.",
  },
  {
    question: "¿Cuánto tiempo duran las cuentas premium?",
    answer: "La duración de las cuentas varía según el sorteo. Generalmente ofrecemos cuentas con duración de 1 mes, 3 meses, 6 meses o incluso 1 año completo. La duración específica se indica en cada publicación del sorteo.",
  },
  {
    question: "¿Qué plataformas están disponibles?",
    answer: "Realizamos sorteos de las principales plataformas de streaming: Netflix, Spotify Premium, Disney+, YouTube Premium, HBO Max, Amazon Prime Video, Crunchyroll, y muchas más. También incluimos cuentas de gaming y software.",
  },
  {
    question: "¿Cómo recibo mi cuenta si gano?",
    answer: "Una vez que ganas un sorteo, te contactamos directamente por Telegram para entregarte los datos de acceso de forma segura. El proceso es rápido y normalmente recibes tu cuenta en menos de 24 horas después de ser seleccionado como ganador.",
  },
  {
    question: "¿Puedo participar desde cualquier país?",
    answer: "¡Sí! Nuestros sorteos están abiertos a participantes de todo el mundo hispanohablante. No importa desde qué país te unas, tienes las mismas oportunidades de ganar que todos los demás miembros.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-neon-purple/10 text-neon-purple border border-neon-purple/20 mb-4">
            FAQ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preguntas <span className="text-gradient">Frecuentes</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Resolvemos todas tus dudas sobre nuestra comunidad
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card border-none px-4 sm:px-6 py-1 data-[state=open]:ring-1 data-[state=open]:ring-primary/30 transition-all"
            >
              <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:no-underline py-4 sm:py-5 text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 sm:pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
```

---

## 10. CTA Section (src/components/landing/CTASection.tsx)

```tsx
import { Send, Sparkles, Gift, Star, Headphones, Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Gift, label: "Códigos", sublabel: "Exclusivos" },
  { icon: Star, label: "Ofertas", sublabel: "Populares" },
  { icon: Sparkles, label: "Descuentos", sublabel: "VIP" },
  { icon: Headphones, label: "Soporte", sublabel: "Prioritario" },
];

const highlights = [
  "+64,000 miembros activos",
  "Sorteos 100% verificados",
  "Acceso instantáneo",
];

const CTASection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-neon-purple/5 to-background" />
      
      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-neon-cyan/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main CTA Card */}
        <div className="glass-card p-8 sm:p-12 text-center neon-border">
          {/* Header */}
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            ¿Listo para <span className="text-gradient">unirte</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            No te pierdas los sorteos más increíbles y únete a la comunidad más grande de Telegram
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Button className="btn-primary group text-base px-8 py-6">
              <Send className="w-5 h-5 mr-2" />
              Unirse al Canal Telegram
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="btn-secondary text-base px-8 py-6">
              <Sparkles className="w-5 h-5 mr-2" />
              Acceso Premium
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {features.map((feature) => (
              <div key={feature.label} className="flex flex-col items-center p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-neon-cyan/20 flex items-center justify-center mb-3">
                  <feature.icon className="w-6 h-6 text-neon-cyan" />
                </div>
                <span className="font-heading font-semibold text-foreground text-sm">{feature.label}</span>
                <span className="text-xs text-muted-foreground">{feature.sublabel}</span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-neon-green" />
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
```

---

## 11. Footer (src/components/landing/Footer.tsx)

```tsx
const Footer = () => {
  return (
    <footer className="py-8 px-4 sm:px-6 border-t border-border/50 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 Cuentas Streaming. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
```

---

## 12. Global Styles (src/index.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;

    --card: 222 47% 10%;
    --card-foreground: 210 40% 98%;

    --popover: 222 47% 10%;
    --popover-foreground: 210 40% 98%;

    --primary: 280 85% 65%;
    --primary-foreground: 0 0% 100%;

    --secondary: 222 47% 14%;
    --secondary-foreground: 210 40% 98%;

    --muted: 222 47% 18%;
    --muted-foreground: 215 20% 60%;

    --accent: 180 100% 50%;
    --accent-foreground: 222 47% 6%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;

    --border: 222 47% 20%;
    --input: 222 47% 20%;
    --ring: 280 85% 65%;

    --radius: 0.75rem;

    /* Custom tokens */
    --font-heading: 'Outfit', system-ui, sans-serif;
    --font-body: 'Space Grotesk', system-ui, sans-serif;
    
    --neon-purple: 280 85% 65%;
    --neon-cyan: 180 100% 50%;
    --neon-pink: 330 100% 65%;
    --neon-blue: 220 100% 60%;
    --neon-green: 150 100% 50%;

    --gradient-hero: linear-gradient(180deg, hsl(222 47% 6%) 0%, hsl(240 50% 12%) 50%, hsl(222 47% 6%) 100%);
    --gradient-card: linear-gradient(135deg, hsl(222 47% 12% / 0.8) 0%, hsl(222 47% 8% / 0.6) 100%);
    --gradient-border: linear-gradient(135deg, hsl(280 85% 65% / 0.5), hsl(180 100% 50% / 0.5));
    
    --glow-purple: 0 0 60px hsl(280 85% 65% / 0.4);
    --glow-cyan: 0 0 60px hsl(180 100% 50% / 0.3);
    --glow-pink: 0 0 40px hsl(330 100% 65% / 0.4);

    --sidebar-background: 222 47% 8%;
    --sidebar-foreground: 210 40% 98%;
    --sidebar-primary: 280 85% 65%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 222 47% 14%;
    --sidebar-accent-foreground: 210 40% 98%;
    --sidebar-border: 222 47% 20%;
    --sidebar-ring: 280 85% 65%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-body);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    @apply tracking-tight;
  }
}

@layer components {
  .glass-card {
    @apply bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl;
    box-shadow: 
      0 4px 30px hsl(0 0% 0% / 0.2),
      inset 0 1px 0 hsl(0 0% 100% / 0.05);
  }

  .glass-card-hover {
    @apply glass-card transition-all duration-500 ease-out;
  }

  .glass-card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 20px 60px hsl(280 85% 65% / 0.15),
      0 8px 30px hsl(0 0% 0% / 0.3),
      inset 0 1px 0 hsl(0 0% 100% / 0.1);
    border-color: hsl(280 85% 65% / 0.3);
  }

  .neon-border {
    position: relative;
  }

  .neon-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    padding: 1px;
    border-radius: inherit;
    background: var(--gradient-border);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--neon-purple)) 0%, hsl(var(--neon-cyan)) 100%);
  }

  .text-gradient-pink {
    @apply bg-clip-text text-transparent;
    background-image: linear-gradient(135deg, hsl(var(--neon-pink)) 0%, hsl(var(--neon-purple)) 100%);
  }

  .btn-primary {
    @apply relative px-6 py-3 rounded-full font-semibold text-sm overflow-hidden transition-all duration-300;
    background: linear-gradient(135deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-green)) 100%);
    color: hsl(var(--background));
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-cyan);
  }

  .btn-secondary {
    @apply relative px-6 py-3 rounded-full font-semibold text-sm border border-border/50 bg-secondary/50 backdrop-blur-sm transition-all duration-300;
  }

  .btn-secondary:hover {
    @apply border-primary/50 bg-secondary;
    box-shadow: var(--glow-purple);
  }

  .badge-live {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium;
    background: linear-gradient(135deg, hsl(var(--neon-green)) 0%, hsl(150 80% 40%) 100%);
    color: hsl(var(--background));
  }

  .badge-stats {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary/80 border border-border/50 backdrop-blur-sm;
  }

  .platform-pill {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary/60 border border-border/40 backdrop-blur-sm transition-all duration-300 cursor-pointer;
  }

  .platform-pill:hover {
    @apply border-primary/50 bg-secondary;
    transform: translateY(-2px);
  }

  .feature-icon {
    @apply w-16 h-16 rounded-2xl flex items-center justify-center text-2xl;
  }

  .stat-card {
    @apply glass-card p-6 text-center transition-all duration-500;
  }

  .stat-card:hover {
    box-shadow: var(--glow-cyan);
    transform: translateY(-4px);
  }
}

@layer utilities {
  .font-heading {
    font-family: var(--font-heading);
  }
  
  .font-body {
    font-family: var(--font-body);
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delayed {
    animation: float 6s ease-in-out infinite 2s;
  }

  .animate-pulse-glow {
    animation: pulseGlow 3s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulseSlow 4s ease-in-out infinite;
  }

  .animate-gradient {
    animation: gradientShift 8s ease infinite;
    background-size: 200% 200%;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-fade-in-up-delay-1 {
    animation: fadeInUp 0.8s ease-out 0.1s forwards;
    opacity: 0;
  }

  .animate-fade-in-up-delay-2 {
    animation: fadeInUp 0.8s ease-out 0.2s forwards;
    opacity: 0;
  }

  .animate-fade-in-up-delay-3 {
    animation: fadeInUp 0.8s ease-out 0.3s forwards;
    opacity: 0;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }

  .animate-spin-slow {
    animation: spin 8s linear infinite;
  }

  .animate-morph {
    animation: morph 15s ease-in-out infinite;
  }

  .animate-bounce-gentle {
    animation: bounceGentle 2s ease-in-out infinite;
  }

  .animate-scroll-indicator {
    animation: scrollIndicator 2s ease-in-out infinite;
  }

  .bg-cosmic {
    background: 
      radial-gradient(ellipse at 20% 0%, hsl(280 85% 65% / 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 0%, hsl(180 100% 50% / 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 100%, hsl(220 100% 60% / 0.1) 0%, transparent 50%),
      hsl(var(--background));
  }

  .bg-stars {
    background-image: 
      radial-gradient(2px 2px at 20px 30px, hsl(0 0% 100% / 0.3), transparent),
      radial-gradient(2px 2px at 40px 70px, hsl(0 0% 100% / 0.2), transparent),
      radial-gradient(1px 1px at 90px 40px, hsl(0 0% 100% / 0.4), transparent),
      radial-gradient(2px 2px at 130px 80px, hsl(0 0% 100% / 0.2), transparent),
      radial-gradient(1px 1px at 160px 30px, hsl(0 0% 100% / 0.3), transparent);
    background-size: 200px 100px;
    animation: twinkle 4s ease-in-out infinite;
  }

  .bg-grid {
    background-image: 
      linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
      linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 20s linear infinite;
  }

  .perspective-card {
    transform-style: preserve-3d;
    perspective: 1000px;
  }

  .perspective-card-hover:hover {
    transform: rotateX(2deg) rotateY(-2deg) scale(1.02);
  }

  .glow-text-cyan {
    text-shadow: 0 0 20px hsl(180 100% 50% / 0.5);
  }

  .glow-text-pink {
    text-shadow: 0 0 20px hsl(330 100% 65% / 0.5);
  }

  .hover-glitch:hover {
    animation: glitch 0.3s ease-in-out;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float3D {
  0%, 100% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-10px) rotateX(2deg); }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; filter: blur(40px); }
  50% { opacity: 0.8; filter: blur(60px); }
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: rotate(90deg) scale(1.05);
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
    transform: rotate(180deg) scale(1);
  }
  75% {
    border-radius: 60% 40% 70% 30% / 60% 30% 40% 70%;
    transform: rotate(270deg) scale(1.05);
  }
}

@keyframes bounceGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes scrollIndicator {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.5; transform: translateY(4px); }
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
```

---

## 13. Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        neon: {
          purple: "hsl(var(--neon-purple))",
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
          blue: "hsl(var(--neon-blue))",
          green: "hsl(var(--neon-green))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## Key Features Used

### Visual Effects
- **Particle Field**: Interactive canvas-based particle system with mouse interaction
- **Morphing Blobs**: CSS animation for organic shape transitions
- **Glassmorphism**: Backdrop blur with transparency for modern card design
- **Neon Gradients**: Purple, cyan, pink, and green neon color palette
- **3D Transforms**: Perspective and rotation effects on hover
- **Floating Animations**: Smooth vertical movement animations

### Design System
- **Custom Fonts**: Outfit for headings, Space Grotesk for body
- **HSL Color Tokens**: All colors defined as HSL variables for consistency
- **Component Classes**: Reusable utility classes like `.glass-card`, `.btn-primary`, etc.
- **Responsive Design**: Mobile-first approach with sm/md/lg breakpoints

### Sections
1. **Navbar**: Fixed, glassmorphism navigation
2. **Hero**: Animated logo, particles, CTAs
3. **Benefits**: 6 feature cards with icons
4. **How It Works**: 4-step process guide
5. **Stats**: Real-time statistics display
6. **Testimonials**: User reviews with ratings
7. **FAQ**: Expandable accordion
8. **CTA**: Final call-to-action
9. **Footer**: Simple copyright

---

*Documentation generated for Cuentas Streaming Landing Page*
