# Configuración de Medusa JS

Este proyecto está configurado para integrarse con Medusa JS como backend.

## Variables de Entorno

Agrega las siguientes variables de entorno en la sección **Vars** del sidebar de v0:

\`\`\`env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://tu-backend-medusa.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=tu_clave_publicable
\`\`\`

### Dónde obtener estos valores:

1. **NEXT_PUBLIC_MEDUSA_BACKEND_URL**: La URL de tu servidor Medusa (ejemplo: `https://api.tutienda.com`)
2. **NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY**: Tu clave API publicable de Medusa (opcional, pero recomendada)

## Endpoints utilizados:

- **Categorías**: `GET /store/product-categories`
- **Productos por categoría**: `GET /store/products?category_id[]=ID`

## Características implementadas:

1. El header ahora carga dinámicamente las categorías desde tu backend Medusa
2. Las páginas de categoría muestran productos reales desde Medusa
3. Los precios se formatean automáticamente según la moneda configurada en Medusa
4. Sistema de caché deshabilitado para siempre obtener datos frescos

## Personalización:

Puedes modificar los archivos:
- `lib/medusa.ts` - Funciones de API de Medusa
- `components/header.tsx` - Navegación con categorías
- `app/categoria/[categoria]/page.tsx` - Página de categoría con productos
