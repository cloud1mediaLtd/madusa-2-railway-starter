# 🚂 Railway Deployment Guide

Quick guide to deploy both backend and frontend to Railway.

---

## Setup Steps

### 1. Create Railway Project

1. Go to https://railway.app/new
2. Click **Deploy from GitHub repo**
3. Select your `kms` repository
4. Railway will create a project

### 2. Deploy Backend

#### Create Backend Service

1. In your Railway project, click **New**
2. Select **GitHub Repo** > Choose your repo again
3. Name it: `kms-backend`
4. Railway will detect the Dockerfile

#### Configure Backend

**Settings:**
- **Root Directory**: `kms-backend` ✅ IMPORTANT
- **Builder**: Dockerfile (auto-detected)
- **Health Check Path**: `/health`

**Environment Variables:**

```bash
# Required
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-linked from PostgreSQL service
JWT_SECRET=<openssl rand -hex 32>
COOKIE_SECRET=<openssl rand -hex 32>
BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# CORS (update after deploying frontend)
ADMIN_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}
STORE_CORS=https://your-frontend.up.railway.app
AUTH_CORS=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Optional but recommended
REDIS_URL=${{Redis.REDIS_URL}}  # Auto-linked from Redis service
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Optional - MinIO
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
MINIO_BUCKET=medusa-media
```

#### Add Databases

1. Click **New** > **Database** > **PostgreSQL**
2. Click **New** > **Database** > **Redis** (recommended)
3. Link them to your backend service (Railway does this automatically)

### 3. Deploy Frontend

#### Create Frontend Service

1. Click **New** > **GitHub Repo** > Select your repo
2. Name it: `kms-storefront`
3. Railway will detect the Dockerfile

#### Configure Frontend

**Settings:**
- **Root Directory**: `kms-storefront` ✅ IMPORTANT
- **Builder**: Dockerfile (auto-detected)
- **Health Check Path**: `/`

**Environment Variables:**

```bash
# Required - Backend URL
MEDUSA_BACKEND_URL=https://your-backend.up.railway.app

# Required - Get from Medusa Admin
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx

# Required - Frontend URL (will be auto-generated)
NEXT_PUBLIC_BASE_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Required - Default settings
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=<openssl rand -hex 16>

# Optional - Stripe
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx

# Optional - MinIO (for image optimization)
NEXT_PUBLIC_MINIO_ENDPOINT=your-minio-endpoint.com
```

### 4. Update CORS Settings

After both services are deployed:

1. Get your frontend URL (e.g., `https://kms-storefront-production.up.railway.app`)
2. Update backend `STORE_CORS` environment variable:
   ```bash
   STORE_CORS=https://your-frontend-url.up.railway.app
   ```
3. Redeploy backend (or it will auto-redeploy)

### 5. Get Publishable Key

1. Open your backend admin: `https://your-backend.up.railway.app/app`
2. Login (if first time, create admin account)
3. Go to **Settings** > **Publishable API Keys**
4. Copy the key
5. Add to frontend env: `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx`
6. Redeploy frontend

### 6. Setup Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. URL: `https://your-backend.up.railway.app/webhooks/stripe`
4. Events: `payment_intent.*`, `checkout.session.*`
5. Copy **Signing secret**
6. Add to backend: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

---

## Quick Reference

### Generate Secrets

```bash
# JWT and COOKIE secrets
openssl rand -hex 32

# Revalidate secret
openssl rand -hex 16
```

### Service Structure

```
Railway Project
├── kms-backend (Dockerfile)
│   ├── PostgreSQL (auto-linked)
│   └── Redis (auto-linked)
└── kms-storefront (Dockerfile)
```

### URLs

- Backend: `https://your-backend.up.railway.app`
- Admin: `https://your-backend.up.railway.app/app`
- Frontend: `https://your-frontend.up.railway.app`
- API Docs: `https://your-backend.up.railway.app/docs`

---

## Troubleshooting

### Backend Build Fails

**Issue**: "Could not determine how to build"
- **Fix**: Set **Root Directory** to `kms-backend` in service settings

**Issue**: "DATABASE_URL not set"
- **Fix**: Make sure PostgreSQL is linked, or set `DATABASE_URL` manually

### Frontend Build Fails

**Issue**: Missing environment variables
- **Fix**: Ensure all required vars are set (see above)

**Issue**: "Module not found" errors
- **Fix**: Check that `output: 'standalone'` is in `next.config.js`

### CORS Errors

**Issue**: Frontend can't connect to backend
- **Fix**: Update `STORE_CORS` in backend with exact frontend URL

### Images Not Loading

**Issue**: Product images not displaying
- **Fix**: Configure MinIO or use local storage (default)

---

## Cost Estimate

Railway Pricing (as of 2024):

- **Hobby Plan**: $5/month
  - Includes $5 usage credit
  - ~500 hours of service uptime
  - Perfect for development/staging

- **Pro Plan**: $20/month
  - Includes $20 usage credit
  - Unlimited services
  - Production-ready

**Estimated Monthly Cost:**
- Backend + Frontend + Postgres + Redis
- Hobby: ~$5-10/month
- Pro: ~$20-30/month

---

## Next Steps

1. ✅ Deploy backend with PostgreSQL
2. ✅ Deploy frontend
3. ✅ Update CORS
4. ✅ Get publishable key
5. ✅ Setup Stripe webhooks
6. 🎉 Test your store!

---

**Need help?** Check Railway docs: https://docs.railway.app
