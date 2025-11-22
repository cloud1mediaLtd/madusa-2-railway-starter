# Environment Variables Configuration

This document outlines all environment variables needed for deploying to Railway (Backend) and Cloudflare Pages (Frontend).

---

## 🚂 Railway - Backend Environment Variables

### Required Variables

```bash
# Database (Railway provides PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Secrets (Generate strong random strings)
JWT_SECRET=your-secure-jwt-secret-min-32-chars
COOKIE_SECRET=your-secure-cookie-secret-min-32-chars

# Backend URL (Your Railway app URL)
BACKEND_URL=https://your-app.railway.app

# CORS Configuration (Update with your frontend URL)
ADMIN_CORS=https://your-admin-domain.com
STORE_CORS=https://your-storefront.pages.dev
AUTH_CORS=https://your-admin-domain.com

# Node Environment
NODE_ENV=production
```

### Optional Variables

```bash
# Redis (Recommended for production - Railway add-on available)
REDIS_URL=redis://default:password@host:port

# Stripe Payment
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email - Resend (Recommended)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Email - SendGrid (Alternative)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM=noreply@yourdomain.com

# MinIO Storage (S3-compatible)
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=medusa-media

# Meilisearch
MEILISEARCH_HOST=https://your-meilisearch.com
MEILISEARCH_ADMIN_KEY=your-admin-key

# Worker Mode (for multiple Railway instances)
MEDUSA_WORKER_MODE=shared
MEDUSA_DISABLE_ADMIN=false
```

---

## ☁️ Cloudflare Pages - Frontend Environment Variables

### Required Variables

```bash
# Backend URL (Your Railway backend URL)
MEDUSA_BACKEND_URL=https://your-app.railway.app

# Base URL (Your Cloudflare Pages URL)
NEXT_PUBLIC_BASE_URL=https://your-site.pages.dev

# Medusa Publishable Key (Get from Medusa Admin)
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx

# Default Region (ISO-2 format)
NEXT_PUBLIC_DEFAULT_REGION=us

# Revalidation Secret (Generate random string)
REVALIDATE_SECRET=your-revalidate-secret
```

### Optional Variables

```bash
# Stripe Public Key
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx

# Medusa Payments (if using Medusa Payments)
NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY=pk_xxx
NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID=acct_xxx

# MinIO for image optimization
NEXT_PUBLIC_MINIO_ENDPOINT=your-minio-endpoint.com
MEDUSA_CLOUD_S3_HOSTNAME=your-s3-hostname.com
MEDUSA_CLOUD_S3_PATHNAME=/path
```

---

## 🔐 How to Generate Secrets

### JWT_SECRET and COOKIE_SECRET

```bash
# Generate secure random strings (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

### REVALIDATE_SECRET

```bash
# Generate a random string
openssl rand -hex 16
```

---

## 🔗 Getting Service Keys

### Stripe
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (for backend)
3. Copy your **Publishable key** (for frontend)
4. For webhooks: https://dashboard.stripe.com/webhooks

### Resend
1. Go to https://resend.com/api-keys
2. Create a new API key
3. Verify your sending domain

### Medusa Publishable Key
1. Start your Medusa backend
2. Go to Settings > Publishable API Keys
3. Create a new key or copy existing one

---

## ⚙️ Setting Variables

### Railway
1. Go to your project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Add variables one by one or use **Raw Editor** for bulk add

### Cloudflare Pages
1. Go to Workers & Pages
2. Select your project
3. Go to **Settings** > **Environment variables**
4. Add variables for **Production** and **Preview** separately

---

## 🧪 Testing Locally

Create these files for local development:

### Backend: `kms-backend/.env`
```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
BACKEND_URL=http://localhost:9000
ADMIN_CORS=http://localhost:7000
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:7000
```

### Frontend: `kms-storefront/.env.local`
```bash
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-local-key
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=supersecret
```

---

## 📋 Checklist

### Before Deploying Backend
- [ ] Database URL configured (Railway PostgreSQL)
- [ ] JWT_SECRET and COOKIE_SECRET generated
- [ ] CORS settings include your frontend URL
- [ ] Stripe keys added (if using payments)
- [ ] Email provider configured (Resend or SendGrid)

### Before Deploying Frontend
- [ ] MEDUSA_BACKEND_URL points to Railway backend
- [ ] NEXT_PUBLIC_BASE_URL is your Cloudflare Pages URL
- [ ] Publishable key obtained from Medusa
- [ ] Stripe public key added (if using payments)
- [ ] Image optimization configured (if using S3/MinIO)

### After Deployment
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Verify image uploads work
- [ ] Check CORS is working
- [ ] Monitor error logs
