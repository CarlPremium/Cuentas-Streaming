import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Cuentas Streaming. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link href="/policy/terms" className="hover:text-foreground hover:underline">
              Términos y Condiciones
            </Link>
            <Link href="/policy/privacy" className="hover:text-foreground hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-foreground hover:underline">
              Política de Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
