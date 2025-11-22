# Medusa Store Template - Feature Documentation

This template is production-ready with pre-configured integrations for email, payment, storage, and search.

## 🚀 Features

### ✉️ Email Notifications (Resend)
**Status**: ✅ Configured
**Optional**: Yes (graceful fallback)

Pre-configured email service using [Resend](https://resend.com) with React Email templates.

**Setup**:
```bash
# Add to .env
RESEND_API_KEY=your-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Included Templates**:
- Order confirmation emails
- User invite emails

**Development**:
```bash
yarn email:dev
# Opens at http://localhost:3002
```

**Location**: `src/modules/email-notifications/`

---

### 💳 Payment Processing (Stripe)
**Status**: ✅ Configured
**Optional**: Yes (loads only if configured)

Stripe payment integration for processing transactions.

**Setup**:
```bash
# Add to .env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Features**:
- Credit card payments
- Webhook support
- Automatic payment confirmation

---

### 📦 File Storage (MinIO)
**Status**: ✅ Configured
**Optional**: Yes (falls back to local storage)

S3-compatible object storage for product images and media.

**Setup**:
```bash
# Add to .env (optional)
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=medusa-media
```

**Fallback**: If not configured, uses local file storage in `./static` directory.

**Features**:
- Upload, delete, stream media
- Presigned URLs
- Public bucket with auto-configuration
- Full S3 compatibility

**Location**: `src/modules/minio-file/`

---

### 🔍 Search (Meilisearch)
**Status**: ✅ Configured
**Optional**: Yes (load only if configured)

Fast, typo-tolerant product search powered by [Meilisearch](https://www.meilisearch.com).

**Setup**:
```bash
# Add to .env (optional)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_ADMIN_KEY=your-admin-key
```

**Indexed Fields**:
- Product title, description
- Variant SKUs
- Product handles

**Location**: Configured in `medusa-config.ts` plugin section

---

### 📧 Alternative Email (SendGrid)
**Status**: ✅ Configured
**Optional**: Yes (alternative to Resend)

SendGrid email service as an alternative to Resend.

**Setup**:
```bash
# Add to .env (if not using Resend)
SENDGRID_API_KEY=your-api-key
SENDGRID_FROM=noreply@yourdomain.com
```

---

### 🔴 Redis Support
**Status**: ✅ Configured
**Optional**: Yes (falls back to in-memory)

Redis for event bus and workflow engine (better performance at scale).

**Setup**:
```bash
# Add to .env (optional)
REDIS_URL=redis://localhost:6379
```

**Benefits**:
- Faster event processing
- Distributed workflow engine
- Better for production deployments

**Fallback**: Simulated Redis if not configured

---

## 🛠️ Environment Variables

### Required Variables
```bash
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/medusa

# Secrets
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret

# Backend URL
BACKEND_URL=http://localhost:9000

# CORS
ADMIN_CORS=http://localhost:7000,http://localhost:7001
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:7000,http://localhost:7001
```

### Optional Variables
All integrations (email, payment, storage, search, Redis) are **optional** and load only when configured.

See `.env.template` for complete list of optional variables.

---

## 📋 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Configure Environment
```bash
cp .env.template .env
# Edit .env with your values
```

### 3. Setup Database
```bash
# Ensure PostgreSQL is running
# Database will be created automatically on first run
```

### 4. Seed Database (Optional)
```bash
yarn seed
# Creates demo products and admin user
```

### 5. Start Development Server
```bash
yarn dev
# Backend runs at http://localhost:9000
# Admin at http://localhost:9000/app
```

---

## 🏗️ Architecture

### Modular Design
All integrations use **conditional loading** - they only activate when environment variables are present.

### Graceful Fallbacks
- **MinIO not configured?** → Uses local file storage
- **Redis not configured?** → Uses in-memory event bus
- **Email not configured?** → Module doesn't load (safe)
- **Stripe not configured?** → No payment providers loaded

### Production Ready
- Environment validation with `assertValue()` utility
- Centralized config management in `src/lib/constants.ts`
- Comprehensive error handling
- Worker mode support for Railway/Vercel

---

## 📂 Project Structure

```
my-medusa-store/
├── src/
│   ├── modules/
│   │   ├── email-notifications/   # Resend email with React templates
│   │   └── minio-file/            # MinIO storage provider
│   ├── subscribers/
│   │   ├── order-placed.ts        # Email on order completion
│   │   └── invite-created.ts      # Email on user invite
│   ├── lib/
│   │   └── constants.ts           # Environment variable management
│   ├── utils/
│   │   └── assert-value.ts        # Environment validation
│   └── scripts/
│       └── seed.ts                # Database seeding
├── medusa-config.ts               # Main configuration
├── .env.template                  # Environment template
└── package.json
```

---

## 🚢 Deployment

### Railway Deployment
This template is optimized for Railway with:
- Auto-detection of `RAILWAY_PUBLIC_DOMAIN_VALUE`
- Worker mode support (`MEDUSA_WORKER_MODE`)
- Admin disable capability for workers
- Conditional module loading

### Environment Variables for Production
```bash
# Required
DATABASE_URL=<railway-postgres-url>
JWT_SECRET=<generate-strong-secret>
COOKIE_SECRET=<generate-strong-secret>
BACKEND_URL=<your-railway-domain>

# Recommended
REDIS_URL=<railway-redis-url>
RESEND_API_KEY=<your-resend-key>
RESEND_FROM_EMAIL=noreply@yourdomain.com
STRIPE_API_KEY=<your-stripe-key>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>

# Optional
MINIO_ENDPOINT=<your-minio-endpoint>
MINIO_ACCESS_KEY=<your-access-key>
MINIO_SECRET_KEY=<your-secret-key>
MEILISEARCH_HOST=<your-meilisearch-host>
MEILISEARCH_ADMIN_KEY=<your-admin-key>
```

---

## 🧪 Testing

### Email Templates
```bash
yarn email:dev
```
Opens React Email preview server at `http://localhost:3002`

### Backend Startup
```bash
yarn dev
```
Check console for module loading confirmations

---

## 📖 Additional Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Resend Documentation](https://resend.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [MinIO Documentation](https://min.io/docs)
- [Meilisearch Documentation](https://www.meilisearch.com/docs)

---

## 🔄 Version Information

- **Medusa**: v2.11.3
- **Node**: >=20
- **Package Manager**: Yarn 1.22.22

---

## 💡 Next Steps

1. **Configure Email**: Add Resend API key for transactional emails
2. **Setup Stripe**: Add Stripe keys for payment processing
3. **Add Redis**: For better performance in production
4. **Setup MinIO**: For scalable media storage
5. **Configure Search**: Add Meilisearch for product search
6. **Customize Templates**: Edit email templates in `src/modules/email-notifications/templates/`
7. **Seed Database**: Run `yarn seed` to add demo products
8. **Deploy**: Push to Railway or your preferred platform

---

**Template Version**: 2.0
**Last Updated**: 2025
**Based on**: Medusa v2 + Railway Boilerplate Features
