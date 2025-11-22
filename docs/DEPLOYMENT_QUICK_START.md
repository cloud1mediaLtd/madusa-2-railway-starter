# ⚡ Quick Start Deployment

## 🚂 Railway Backend (5 minutes)

1. **Create Project**
   - Go to https://railway.app/new
   - Connect GitHub repo
   - Select `kms-backend` as root directory

2. **Add Databases**
   - Add PostgreSQL (automatic)
   - Add Redis (recommended)

3. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=$(openssl rand -hex 32)
   COOKIE_SECRET=$(openssl rand -hex 32)
   BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
   STORE_CORS=https://your-site.pages.dev
   STRIPE_API_KEY=sk_xxx
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

4. **Deploy** ✅

---

## ☁️ Cloudflare Pages Frontend (5 minutes)

1. **Create Project**
   - Go to https://dash.cloudflare.com
   - Workers & Pages > Create > Connect Git

2. **Build Settings**
   ```
   Build command: cd kms-storefront && yarn install && yarn build
   Build output: kms-storefront/.next
   ```

3. **Environment Variables**
   ```bash
   MEDUSA_BACKEND_URL=https://your-backend.railway.app
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxx
   NEXT_PUBLIC_BASE_URL=https://your-site.pages.dev
   NEXT_PUBLIC_STRIPE_KEY=pk_xxx
   REVALIDATE_SECRET=$(openssl rand -hex 16)
   ```

4. **Deploy** ✅

---

## ✅ Post-Deployment

1. **Update CORS** on Railway:
   ```bash
   STORE_CORS=https://your-actual-site.pages.dev
   ```

2. **Setup Stripe Webhook**:
   - URL: `https://your-backend.railway.app/webhooks/stripe`
   - Events: `payment_intent.*`, `checkout.session.*`
   - Copy webhook secret to Railway: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

3. **Test**:
   - Backend: https://your-backend.railway.app/health
   - Frontend: https://your-site.pages.dev
   - Admin: https://your-backend.railway.app/app

---

## 📁 Files Created

- `kms-backend/Dockerfile` - Docker configuration
- `kms-backend/.dockerignore` - Docker ignore rules
- `docker-compose.yml` - Local testing
- `kms-storefront/wrangler.toml` - Cloudflare config
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `ENV_VARIABLES.md` - Complete env var reference
- `DEPLOYMENT.md` - Detailed deployment guide (you're here!)

---

## 🆘 Need Help?

- See `DEPLOYMENT.md` for detailed instructions
- See `ENV_VARIABLES.md` for all environment variables
- Check Railway logs for backend issues
- Check Cloudflare build logs for frontend issues

---

**Deployment time**: ~10 minutes total
**Cost**: Free tier available on both platforms
