# Medusa 2.0 + Next.js Railway Template

This template automatically deploys a complete e-commerce stack with Medusa.js backend and Next.js storefront on Railway.

## 🚀 One-Click Deploy Features

### Automatic Setup
- ✅ **Auto-seeding**: Automatically creates regions, publishable API keys, and demo data on first deployment
- ✅ **Admin user creation**: Auto-creates admin user from environment variables
- ✅ **Database migrations**: Runs automatically on startup
- ✅ **Zero configuration**: Just set environment variables and deploy!

### What Gets Created Automatically

#### Regions
- **Europe Region**: EUR currency with GB, DE, DK, SE, FR, ES, IT
- **UK included**: Great Britain is part of the default Europe region

#### API Keys
- **Publishable API key**: Automatically created and linked to sales channels

#### Demo Data
- Products and categories
- Stock locations (European Warehouse in Copenhagen)
- Shipping profiles and options
- Sales channels

## 📋 Required Environment Variables

### Backend Service

```env
# Admin User (Required)
MEDUSA_ADMIN_EMAIL=your-email@example.com
MEDUSA_ADMIN_PASSWORD=your-secure-password

# Database (Auto-configured by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Auto-configured by Railway)
REDIS_URL=${{Redis.REDIS_URL}}

# Security (Generate secure random strings)
COOKIE_SECRET=your-random-32-char-string
JWT_SECRET=your-random-32-char-string

# CORS (Update with your domains)
STORE_CORS=https://your-storefront-domain.up.railway.app
ADMIN_CORS=https://your-backend-domain.up.railway.app
AUTH_CORS=https://your-backend-domain.up.railway.app

# MeiliSearch (Optional, auto-configured if service exists)
MEILISEARCH_HOST=${{MeiliSearch.RAILWAY_PUBLIC_DOMAIN}}
MEILISEARCH_MASTER_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}

# MinIO/Storage (Optional, auto-configured if service exists)
MINIO_ENDPOINT=${{Bucket.RAILWAY_PUBLIC_DOMAIN}}
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key

# Admin UI
MEDUSA_DISABLE_ADMIN=false
```

### Storefront Service

```env
# Backend Connection (Required)
MEDUSA_BACKEND_URL=https://your-backend-domain.up.railway.app
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-backend-domain.up.railway.app

# Publishable Key (Auto-created by backend seed)
# Note: This gets populated after first backend deployment
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-storefront-domain.up.railway.app

# Default Region
NEXT_PUBLIC_DEFAULT_REGION=gb

# Search (Optional)
NEXT_PUBLIC_SEARCH_ENDPOINT=${{MeiliSearch.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_INDEX_NAME=products
MEILISEARCH_API_KEY=${{MeiliSearch.MEILI_MASTER_KEY}}

# Storage (Optional)
NEXT_PUBLIC_MINIO_ENDPOINT=${{Bucket.RAILWAY_PUBLIC_DOMAIN}}
```

## 🎯 Deployment Steps

### 1. Fork/Copy This Repository
- Fork this repo to your GitHub account
- Or copy it to a new repository

### 2. Create Railway Project
- Go to Railway dashboard
- Click "New Project" → "Deploy from GitHub repo"
- Select your forked repository

### 3. Configure Services
Railway will auto-detect and create these services:
- **Backend**: Medusa.js API (from `/kms-backend`)
- **Storefront**: Next.js storefront (from `/kms-storefront`)
- **Postgres**: Database (add from Railway catalog)
- **Redis**: Cache (add from Railway catalog)
- **MeiliSearch**: Search (optional, add from Railway catalog)
- **Bucket/MinIO**: File storage (optional)

### 4. Set Environment Variables

**Backend Service**:
1. Set `MEDUSA_ADMIN_EMAIL` and `MEDUSA_ADMIN_PASSWORD`
2. Set `COOKIE_SECRET` and `JWT_SECRET` (random strings)
3. Set `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` (your domains)
4. Link database: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
5. Link Redis: `REDIS_URL=${{Redis.REDIS_URL}}`

**Storefront Service**:
1. Set `MEDUSA_BACKEND_URL` to your backend domain
2. Set `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to your backend domain
3. Leave `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` as placeholder initially

### 5. Deploy!
1. Deploy Backend service first
2. Wait for it to complete (it will auto-seed the database)
3. Check logs for the publishable API key or get it from Admin UI
4. Update Storefront's `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
5. Deploy Storefront service

## 🔐 Access Your Store

### Admin Dashboard
- URL: `https://your-backend-domain.up.railway.app/app`
- Login with your `MEDUSA_ADMIN_EMAIL` and `MEDUSA_ADMIN_PASSWORD`

### Storefront
- URL: `https://your-storefront-domain.up.railway.app`
- Customers can browse and purchase products

## 📝 Post-Deployment

### Get Publishable API Key
1. Log into Admin UI
2. Go to **Settings** → **Publishable API Keys**
3. Copy the auto-generated key
4. Update Storefront's `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` environment variable
5. Redeploy Storefront

### Customize Your Store
1. **Add/Edit Products**: Admin UI → Products
2. **Configure Shipping**: Admin UI → Settings → Shipping
3. **Add Payment Providers**: Admin UI → Settings → Payment Providers
4. **Customize Regions**: Admin UI → Settings → Regions
5. **Brand Your Storefront**: Edit files in `/kms-storefront/src`

## 🛠️ Development

### Local Development

**Backend**:
```bash
cd kms-backend
yarn install
yarn dev
```

**Storefront**:
```bash
cd kms-storefront
yarn install
yarn dev
```

## 📚 Documentation

- [Medusa Documentation](https://docs.medusajs.com)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Documentation](https://nextjs.org/docs)

## 🐛 Troubleshooting

### "No regions found" error
- Check Backend logs to ensure seeding completed
- Manually create a region in Admin UI if needed

### "Invalid publishable key" error
- Get the publishable key from Admin UI → Settings → Publishable API Keys
- Update Storefront's `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` variable

### Database connection errors
- Ensure `DATABASE_URL` is correctly linked to Postgres service
- Check Postgres service is running

## 📄 License

MIT

---

**Built with ❤️ using Medusa.js, Next.js, and Railway**
