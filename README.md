# SMB Commerce Platform

Tienda online para pequeños negocios con catálogo de productos, carrito de compras y procesamiento de pagos con Stripe.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Base de datos:** Neon PostgreSQL + Prisma ORM
- **Pagos:** Stripe Checkout
- **Estilos:** Tailwind CSS
- **Despliegue:** Vercel

## Comenzar

```bash
npm install
cp .env.example .env.local
# Configurar variables de entorno
npx prisma db push
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Neon PostgreSQL |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secreto del webhook de Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe |
| `NEXT_PUBLIC_APP_URL` | URL base de la app |
