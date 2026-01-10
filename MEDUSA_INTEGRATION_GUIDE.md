# Medusa Integration Guide

This project is fully integrated with Medusa v2 backend. Follow these steps to complete the setup:

## Environment Variables Setup

You need to configure two environment variables in the v0 **Vars** section (left sidebar):

### 1. NEXT_PUBLIC_MEDUSA_BACKEND_URL
Your Medusa backend URL. Examples:
- Development with ngrok: `https://your-subdomain.ngrok-free.app`
- Production: `https://api.yourstore.com`
- Local (won't work in v0 preview): `http://localhost:9000`

**Current value needed:** `https://tsaristic-unmobilised-kaye.ngrok-free.dev`

### 2. NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
Your Medusa publishable API key from the Medusa admin dashboard.

**Current value needed:** `pk_f86e5d5df58537596a20795e704786780a208e1e4ea3d3731789c693e988b7eb`

## How to Add Environment Variables in v0

1. Click **"Vars"** in the left sidebar of your v0 chat
2. You should see both variables listed (they were already added to the project)
3. Click on each variable and paste the value
4. Click "Save" or press Enter

## Features Included

### API Routes (Server-side proxy to avoid CORS)
- `/api/medusa/categories` - Fetch product categories
- `/api/medusa/products` - Fetch products with optional category filtering

### Components Using Medusa
- **Header** (`components/header.tsx`) - Displays navigation with categories
- **Mayorista Module** (`app/mayorista/page.tsx`) - Wholesale admin dashboard

### Client Functions
- `getCategories()` - Fetch all product categories
- `getProducts(categoryId?)` - Fetch products, optionally filtered by category

## Ngrok Configuration

The project includes proper ngrok headers to bypass browser warnings:
- `ngrok-skip-browser-warning: 69420`
- All requests are proxied through Next.js API routes

Your Medusa backend should have CORS configured to accept requests from v0 preview domains.

## Testing the Integration

Once environment variables are set:
1. Navigate to `/` - Categories should appear in the header
2. Navigate to `/mayorista` - Products should load in the wholesale dashboard
3. Check browser console for `[v0]` prefixed logs showing fetch status

## Troubleshooting

**"MEDUSA_BACKEND_URL not configured" error:**
- Environment variables are not set in the Vars section
- Add the values as described above

**Categories not loading:**
- Verify ngrok URL is active (ngrok tunnels expire)
- Check Medusa backend is running
- Verify the publishable key is correct

**CORS errors:**
- Make sure your Medusa backend CORS configuration includes the v0 preview domain
- The API routes handle most CORS issues automatically
