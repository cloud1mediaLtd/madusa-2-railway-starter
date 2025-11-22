# Medusa E-commerce Starter Template

Production-ready Medusa v2 + Next.js template with Railway auto-deployment and comprehensive integrations.

## 🚀 Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-code)

**One-click deployment** includes:
- ✅ Medusa Backend with admin UI
- ✅ Next.js Storefront
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ MinIO storage
- ✅ Meilisearch
- ✅ Auto-seeded regions and publishable keys
- ✅ Auto-created admin user

**After deployment**: Just visit your backend URL and start selling!

## 📚 Documentation

For detailed Railway deployment instructions, see:
- **[docs/RAILWAY_TEMPLATE.md](docs/RAILWAY_TEMPLATE.md)** - Complete Railway deployment guide
- **[docs/DEPLOYMENT_QUICK_START.md](docs/DEPLOYMENT_QUICK_START.md)** - Quick start guide
- **[backend/FEATURES.md](backend/FEATURES.md)** - All features and integrations

## 🏗️ Project Structure

```
medusa-template/
├── backend/              # Medusa backend with integrations
├── storefront/           # Next.js 16 storefront
├── docs/                 # Comprehensive documentation
└── Makefile              # Development commands
```

## 🎯 Features

### Backend (Medusa v2.11.3)
- ✅ **Email**: Resend with React Email templates
- ✅ **Payments**: Stripe integration
- ✅ **Storage**: MinIO (S3-compatible) with local fallback
- ✅ **Search**: Meilisearch product search
- ✅ **Cache**: Redis support with in-memory fallback
- ✅ **Auto-seeding**: Regions, API keys, demo products on first deploy
- ✅ **Auto-admin**: Admin user creation from env vars

### Storefront (Next.js 16 + React 19)
- ✅ Modern App Router architecture
- ✅ Stripe payment UI
- ✅ Product search integration
- ✅ Responsive design
- ✅ Image optimization with MinIO
- ✅ Cart and checkout flow

## ⚡ Local Development

### 1. Install Dependencies
```bash
make install
```

### 2. Configure Environment
```bash
# Backend
cp backend/.env.template backend/.env
# Edit .env with your database credentials

# Storefront
cp storefront/.env.local.example storefront/.env.local
# Edit .env.local with backend URL
```

### 3. Start Development Servers
```bash
make dev
# Backend: http://localhost:9000
# Admin UI: http://localhost:9000/app
# Storefront: http://localhost:8000
```

### 4. Seed Database (Optional)
```bash
make seed
# Creates demo products, regions, and publishable keys
```

## 🛠️ Available Commands

```bash
make help              # Show all available commands
make install           # Install dependencies
make dev               # Start both backend and storefront
make dev-backend       # Start backend only
make dev-storefront    # Start storefront only
make build             # Build both projects
make seed              # Seed database with demo data
make clean             # Remove node_modules and build files
make kill-ports        # Kill processes on ports 8000 and 9000
```

## 🌍 Environment Variables

### Backend (Required)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
COOKIE_SECRET=your-secret
MEDUSA_ADMIN_EMAIL=admin@example.com
MEDUSA_ADMIN_PASSWORD=your-password
```

### Backend (Optional Integrations)
```bash
# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Payments (Stripe)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage (MinIO)
MINIO_ENDPOINT=your-endpoint
MINIO_ACCESS_KEY=your-key
MINIO_SECRET_KEY=your-secret

# Search (Meilisearch)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_ADMIN_KEY=your-key

# Cache (Redis)
REDIS_URL=redis://localhost:6379
```

### Storefront (Required)
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=gb
```

See `.env.template` files for complete configuration options.

## 🚢 Deployment

### Railway (Recommended)
See [docs/RAILWAY_TEMPLATE.md](docs/RAILWAY_TEMPLATE.md) for complete instructions.

**Features**:
- Auto-deployment from GitHub
- Auto-scaling
- Zero-downtime deployments
- Environment variable management
- Built-in PostgreSQL, Redis, MinIO, Meilisearch

### Other Platforms
- **Backend**: Any Node.js hosting (Heroku, DigitalOcean, etc.)
- **Storefront**: Vercel, Netlify, or any Next.js host

## 📖 Additional Resources

- [Medusa Documentation](https://docs.medusajs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Railway Documentation](https://docs.railway.app)
- [Stripe Integration](https://stripe.com/docs)
- [Resend Email](https://resend.com/docs)

## 🔄 Version Information

- **Medusa**: v2.11.3
- **Next.js**: 16.0.3
- **React**: 19.2.0
- **Node**: >=20
- **Package Manager**: Yarn

## 🎨 Customization

### Email Templates
```bash
cd backend
yarn email:dev
# Opens preview at http://localhost:3002
```

Edit templates in `backend/src/modules/email-notifications/templates/`

### Storefront Theme
Customize colors, fonts, and layout in:
- `storefront/tailwind.config.js`
- `storefront/src/app/globals.css`
- `storefront/src/components/`

## 🐛 Troubleshooting

### Backend won't start
1. Check PostgreSQL is running
2. Verify DATABASE_URL is correct
3. Run migrations: `cd backend && npx medusa db:migrate`

### Storefront errors
1. Verify NEXT_PUBLIC_MEDUSA_BACKEND_URL is correct
2. Check backend is running
3. Verify publishable key exists in admin

### Railway deployment issues
See [docs/RAILWAY_TEMPLATE.md](docs/RAILWAY_TEMPLATE.md) troubleshooting section

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Template Version**: 3.0 (with auto-seeding and Railway optimization)
**Last Updated**: 2025
**Based on**: Medusa v2.11.3 + Next.js 16

Made with ❤️ for the Medusa community
