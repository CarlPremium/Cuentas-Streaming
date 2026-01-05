# Cuentas Streaming - Plataforma de Contenido

Plataforma de contenido y sorteos construida con [Next.js](https://nextjs.org) 16 y Supabase. Comparte publicaciones, participa en sorteos y conecta con la comunidad.

## Screenshots

![screenshot](./screenshot.png)

## Características

- ✨ Plataforma de contenido con sistema de publicaciones
- 🎁 Sistema de sorteos con protección anti-abuso
- 👥 Sistema de roles (guest, user, admin, superadmin)
- 🔐 Autenticación con Supabase (OAuth + Email)
- 📝 Editor de contenido con CKEditor 5
- 🌐 Internacionalización (i18n)
- 🎨 UI moderna con Shadcn UI
- 📱 PWA (Progressive Web App)
- 🔒 Rate limiting y protección DDoS
- 🎯 SEO optimizado para redes sociales

## Tecnologías

- Next.js 16 + TypeScript + Tailwind CSS
- Shadcn UI (Radix UI) + TimePicker + TagInput
- react-hook-form + zod
- react-i18next + zod-i18n-map
- Redux Toolkit + Redux Persist
- Supabase OAuth with PKCE flow (@supabase/ssr)
- Supabase Email Auth with PKCE flow (@supabase/ssr)
- Supabase Role-based Access Control (RBAC)
- CKEditor 5 + Supabase Upload Adapter
- PWA (Progressive Web Apps)

## Table of Contents

- [Cuentas Streaming - Plataforma de Contenido](#cuentas-streaming---plataforma-de-contenido)
  - [Screenshots](#screenshots)
  - [Características](#características)
  - [Tecnologías](#tecnologías)
  - [Table of Contents](#table-of-contents)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Comenzar](#comenzar)
  - [Generar Favicon](#generar-favicon)
  - [Documentación](#documentación)
  - [Configurar App URL](#configurar-app-url)
  - [Solución de Problemas](#solución-de-problemas)
  - [Licencia](#licencia)
  - [Referencias](#referencias)

## Estructura del Proyecto

The folder and file structure is based on nextjs app router [next.js project structure](https://nextjs.org/docs/getting-started/project-structure).

```txt
.
├── app/                        # App Router
│   ├── (landing)/              # Landing page
│   ├── api/
│   │   ├── auth/               # API pública para autenticación
│   │   └── v1/                 # APIs que requieren autenticación
│   ├── auth/                   # Páginas de autenticación
│   ├── dashboard/              # Panel de control
│   ├── [username]/             # Perfiles de usuario
│   └── layout.tsx              # Layout principal
├── components/                 # Componentes React
├── config/                     # Configuración del sitio
├── context/
│   └── app-provider.ts         # Registro de proveedores de contexto
├── hooks/                      # Custom hooks
├── docs/                       # Documentación
├── lib/                        # Funciones de utilidad
├── public/                     # Archivos estáticos
│   └── [locales]/              # Internacionalización
├── queries/                    # SWR para API
├── screenshots/                # Capturas de pantalla
├── store/                      # Redux reducers
├── supabase/                   # Supabase CLI
├── types/                      # Tipos TypeScript
├── components.json             # Shadcn UI
├── i18next.config.ts           # Internacionalización
└── package.json                # Dependencias y scripts
```

## Comenzar

Encuentra y reemplaza el siguiente texto en `supabase/seed.sql` y ejecuta el SQL.

- `YOUR_BUCKET_ID`
- `username@example.com`

Clona el repositorio en el directorio actual.

```shell
git clone https://github.com/w3labkr/nextjs14-supabase-blog.git .
```

Instala todos los módulos listados como dependencias.

```shell
npm install
```

Inicia el servidor de desarrollo.

```shell
npm run dev
```

## Generar Favicon

Add `favicon.ico` file to `/app` directory.

- [Favicon.ico & App Icon Generator](https://www.favicon-generator.org)

Genera el manifest y splash screen.

```shell
vim public/manifest.json
```

- [PWA Image Generator](https://www.pwabuilder.com/imageGenerator),
  [Maskable Icon Generator](https://progressier.com/maskable-icons-editor),
  [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html)
- [Custom Splash Screen on iOS](https://appsco.pe/developer/splash-screens)

## Documentación

### Resumen General
- [PROJECT_SUMMARY](./PROJECT_SUMMARY.md) - 📋 Resumen completo del proyecto

### Configuración y Despliegue
- [INSTALLATION](./docs/INSTALLATION.md) - Instalación del proyecto
- [CONFIGURATION](./docs/CONFIGURATION.md) - Configuración general
- [DEPLOYING](./docs/DEPLOYING.md) - Guía de despliegue
- [DEPLOYMENT_ENV_VARS](./DEPLOYMENT_ENV_VARS.md) - Variables de entorno para despliegue

### SEO y Marketing
- [SEO_DOCUMENTATION](./docs/SEO_DOCUMENTATION.md) - ⭐ Guía completa de SEO, tracking y social media

### Características y Permisos
- [ROLE_MANAGEMENT](./ROLE_MANAGEMENT.md) - Sistema de roles
- [POST_PERMISSIONS](./POST_PERMISSIONS.md) - Permisos de publicaciones
- [GIVEAWAYS_COMPLETE_GUIDE](./GIVEAWAYS_COMPLETE_GUIDE.md) - ⭐ Guía completa de sorteos (TODO EN UNO)
- [GIVEAWAYS_FEATURE_PLAN](./GIVEAWAYS_FEATURE_PLAN.md) - Plan técnico detallado (referencia)
- [IMPLEMENTATION_SUMMARY](./IMPLEMENTATION_SUMMARY.md) - Resumen de implementación

## Configurar App URL

- Environment: `NEXT_PUBLIC_APP_URL=`
- Supabase Auth: Authentication > URL Configuration > Redirect URLs
- Google cloud console: API > Credentials
- Google cloud console: API > OAuth

## Solución de Problemas

- Para eslint, verifica la [última versión](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin?activeTab=versions) de `@typescript-eslint/eslint-plugin` y actualiza.
- Para ckeditor5, verifica la versión descargable en el [online builder](https://ckeditor.com/ckeditor-5/online-builder/) y actualiza.
- Si ocurre un error en el `sitemap.xml` pre-renderizado, accede a la página en modo desarrollo y ejecuta una reconstrucción.
- Si obtienes error "Invalid URL" durante el build, asegúrate de configurar `NEXT_PUBLIC_APP_URL` en tu plataforma de despliegue.

## Licencia

This software license under the [MIT License](LICENSE).

## Referencias

- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)
- [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy)
- [nextjs-slack-clone](https://github.com/supabase/supabase/tree/master/examples/slack-clone/nextjs-slack-clone)
- [nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments)
