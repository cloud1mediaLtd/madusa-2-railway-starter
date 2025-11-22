# 🚀 Deployment Guide

Complete guide for deploying your Medusa application with **Railway (Backend)** and **Cloudflare Pages (Frontend)**.

---

## 📋 Prerequisites

- [x] Railway account (https://railway.app)
- [x] Cloudflare account (https://cloudflare.com)
- [x] GitHub repository with your code
- [x] Stripe account (for payments)
- [x] Email provider account (Resend or SendGrid)

---

## Part 1: Deploy Backend to Railway 🚂

### Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Railway will detect it's a monorepo

### Step 2: Configure Build Settings

1. In your Railway service settings, go to **Settings**
2. Set **Root Directory**: `kms-backend`
3. Railway will automatically detect the Dockerfile
4. If not, set **Builder**: Docker

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **New**
2. Select **Database** > **PostgreSQL**
3. Railway will automatically add `DATABASE_URL` to your backend service

### Step 4: Add Redis (Optional but Recommended)

1. Click **New** > **Database** > **Redis**
2. Railway will automatically add `REDIS_URL` to your backend service

### Step 5: Configure Environment Variables

1. Go to your backend service
2. Click **Variables** tab
3. Add all required variables (see ENV_VARIABLES.md)

**Essential Variables:**
```bash
NODE_ENV=production
JWT_SECRET=<generate-with-openssl-rand-hex-32>
COOKIE_SECRET=<generate-with-openssl-rand-hex-32>
BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
ADMIN_CORS=https://your-admin.com,https://your-storefront.pages.dev
STORE_CORS=https://your-storefront.pages.dev
AUTH_CORS=https://your-admin.com
```

**Note**: `${{RAILWAY_PUBLIC_DOMAIN}}` is a Railway variable that auto-updates with your domain.

### Step 6: Add Stripe & Email Variables

```bash
# Stripe
STRIPE_API_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Resend Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Step 7: Deploy

1. Click **Deploy**
2. Wait for build to complete (5-10 minutes)
3. Your backend will be available at: `https://your-service.railway.app`

### Step 8: Run Database Migrations

After first deployment:

1. Go to your service
2. Click **Settings** > **Deploy Triggers**
3. Or use Railway CLI:
   ```bash
   railway run yarn seed
   ```

---

## Part 2: Deploy Frontend to Cloudflare Pages ☁️

### Step 1: Install Wrangler CLI (Optional)

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Deploy via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages**
3. Click **Create application** > **Pages** > **Connect to Git**
4. Select your GitHub repository

### Step 3: Configure Build Settings

Set the following in Cloudflare Pages:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `cd kms-storefront && yarn install && yarn build` |
| **Build output directory** | `kms-storefront/.next` |
| **Root directory** | `/` (leave empty for monorepo) |

**Important for Monorepo:**
- Build command must include `cd kms-storefront`
- Output directory must include the path: `kms-storefront/.next`

### Step 4: Add Environment Variables

Go to **Settings** > **Environment variables** and add:

**Production Environment:**
```bash
NODE_ENV=production
MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
NEXT_PUBLIC_BASE_URL=https://your-site.pages.dev
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
REVALIDATE_SECRET=<generate-random-string>
```

**Preview Environment:**
Same as production, but you can use different values for testing.

### Step 5: Deploy

1. Click **Save and Deploy**
2. Build will start automatically (3-5 minutes)
3. Your frontend will be available at: `https://your-site.pages.dev`

### Step 6: Custom Domain (Optional)

1. Go to **Custom domains**
2. Click **Set up a custom domain**
3. Follow instructions to add DNS records
4. Update `NEXT_PUBLIC_BASE_URL` with your custom domain

---

## Part 3: Configure Webhooks & CORS 🔗

### Update Backend CORS

After deploying frontend, update your Railway backend variables:

```bash
STORE_CORS=https://your-actual-site.pages.dev,https://your-custom-domain.com
ADMIN_CORS=https://your-actual-site.pages.dev,https://your-custom-domain.com
```

### Setup Stripe Webhooks

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://your-backend.railway.app/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
5. Copy the **Signing secret**
6. Add to Railway: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

---

## Part 4: Verify Deployment ✅

### Test Backend

```bash
# Health check
curl https://your-backend.railway.app/health

# Admin login
# Go to: https://your-backend.railway.app/app
```

### Test Frontend

1. Visit: `https://your-site.pages.dev`
2. Browse products
3. Test checkout flow
4. Verify payments work

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `STORE_CORS` with exact frontend URL |
| Images not loading | Check `MINIO_*` variables or use local storage |
| Payments failing | Verify `STRIPE_API_KEY` and webhook secret |
| Build fails | Check Node.js version (requires 20+) |

---

## Part 5: CI/CD with GitHub Actions (Optional) 🤖

The included `.github/workflows/deploy.yml` will:
- Auto-deploy backend via Railway GitHub integration
- Build and deploy frontend to Cloudflare Pages on push to `main`

### Setup GitHub Secrets

Go to your repo **Settings** > **Secrets and variables** > **Actions**

Add these secrets:
```bash
CLOUDFLARE_API_TOKEN=<from cloudflare dashboard>
CLOUDFLARE_ACCOUNT_ID=<from cloudflare dashboard>
MEDUSA_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
NEXT_PUBLIC_BASE_URL=https://your-site.pages.dev
NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
```

---

## Part 6: Monitoring & Maintenance 📊

### Railway Monitoring

1. **Logs**: Check service logs in Railway dashboard
2. **Metrics**: View CPU, memory, and network usage
3. **Health checks**: Railway automatically monitors `/health`

### Cloudflare Analytics

1. Go to **Workers & Pages** > Your project
2. View **Analytics** tab for:
   - Page views
   - Unique visitors
   - Bandwidth usage
   - Build history

### Database Backups

1. Railway PostgreSQL includes automatic backups
2. Or set up manual backups:
   ```bash
   railway run pg_dump $DATABASE_URL > backup.sql
   ```

---

## Part 7: Scaling 📈

### Backend Scaling (Railway)

**Vertical Scaling:**
1. Go to service **Settings**
2. Increase resources (RAM/CPU)

**Horizontal Scaling:**
1. Add worker instances
2. Set `MEDUSA_WORKER_MODE=worker` on worker instances
3. Set `MEDUSA_WORKER_MODE=server` on main instance

### Frontend Scaling (Cloudflare)

Cloudflare Pages automatically scales globally:
- Unlimited bandwidth
- Global CDN
- DDoS protection included

---

## 🎯 Quick Reference

### Railway Commands

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run migrations
railway run yarn seed

# Open service URL
railway open
```

### Cloudflare Commands

```bash
# Deploy manually
wrangler pages deploy kms-storefront/.next

# View deployments
wrangler pages deployments list

# Tail logs
wrangler pages deployment tail
```

---

## 🆘 Troubleshooting

### Backend Issues

**Build fails:**
```bash
# Check Dockerfile is valid
docker build -t test ./kms-backend

# Check yarn lock file
rm yarn.lock
yarn install
```

**Database connection fails:**
```bash
# Verify DATABASE_URL
railway run echo $DATABASE_URL

# Test connection
railway run yarn dev
```

### Frontend Issues

**Build fails:**
```bash
# Test build locally
cd kms-storefront
yarn build

# Check environment variables
yarn next info
```

**API connection fails:**
```bash
# Verify backend URL
curl https://your-backend.railway.app/health

# Check CORS settings
```

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Medusa Deployment Docs](https://docs.medusajs.com/deployment)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

---

## 🎉 Success!

Your application is now live:
- **Backend**: https://your-backend.railway.app
- **Frontend**: https://your-site.pages.dev
- **Admin**: https://your-backend.railway.app/app

Need help? Check the troubleshooting section or open an issue!
