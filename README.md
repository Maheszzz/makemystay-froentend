<div align="center">
  <h1>MakeMyStay.ai Frontend</h1>
  <p>Next.js App Router + React 19 frontend for MakeMyStay.ai (with optional Vite SPA mode).</p>
</div>

---

## Tech Stack & Requirements

- **Node.js**: `20.x` (LTS)
- **npm**: `10.x+`
- **Frameworks**: Next.js 15 (App Router, `output: 'standalone'`), React 19, TypeScript 5.7, TailwindCSS v4, Vite 7

---

## Local Developer Setup

1. **Clone the repository**
   ```bash
   git clone <frontend-repository-url>
   cd make-my-stay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your local values:
   ```env
   NEXT_PUBLIC_API_BASE_URL=/api/v1
   VITE_API_BASE_URL=/api/v1
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   FRONTEND_REVALIDATE_SECRET=your_local_revalidate_secret
   ```
   > **Security note:** Never put private API secrets, database passwords, or SSH keys in `NEXT_PUBLIC_*` or `VITE_*` variables—they are inlined into browser bundles at build time.

4. **Start the backend first**
   Ensure `makemystay-backend` is running on `http://127.0.0.1:8000` with `ENV=development` (see `../makemystay-backend/README.md`).

5. **Start the frontend development server**
   - **Next.js (primary, port `3000`)**:
     ```bash
     npm run dev
     ```
     Requests to `/api/v1/*` are proxied to `http://127.0.0.1:8000/api/v1/*` via `next.config.ts`.
   - **Vite SPA (optional, port `5173`)**:
     ```bash
     npm run dev:vite
     ```
     Requests to `/api/*` are proxied to `http://127.0.0.1:8000/api/*` via `vite.config.ts`.

6. **Verify local API & database wiring**
   ```bash
   npm run check:local
   ```

---

## Environment Variables Reference

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | Client + SSR (build-time) | API base path (`/api/v1` for local proxy & production same-origin) |
| `VITE_API_BASE_URL` | Vite client (build-time) | API base path when running Vite (`dev:vite` / `build:vite`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client (build-time) | Publishable Razorpay Key ID (must match backend `RAZORPAY_KEY_ID`) |
| `VITE_RAZORPAY_KEY_ID` | Vite client (build-time) | Publishable Razorpay Key ID for Vite mode |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Client (build-time, optional) | Digits-only WhatsApp number with country code |
| `FRONTEND_REVALIDATE_SECRET` | Server-only (runtime) | Secret verified by `POST /api/revalidate` |
| `SERVER_API_BASE_URL` | Server-only (runtime, optional) | Explicit backend URL for Next.js SSR fetches |
| `BING_SITE_AUTH_USER` | Server-only (runtime, optional) | Bing Webmaster verification code if `public/BingSiteAuth.xml` is absent |

### Deployment Variables (`.deploy.env`, gitignored)
Manual EC2 helper scripts (`deploy.sh`, `scripts/install-next-remote.sh`, `scripts/nginx-next-remote.sh`) read deployment target settings from `.deploy.env` instead of `.env`:
```env
DEPLOY_HOST=your-ec2-ip
DEPLOY_USER=ubuntu
DEPLOY_PATH=/var/www/react-app
PEM_KEY=/path/to/your-key.pem
```

---

## Build & Verification Commands

```bash
# Production Next.js build + standalone dist/ assembly
npm run build

# Preview standalone server locally
npm run preview
```

## License

Proprietary software. All rights reserved. © 2026 MakeMyStay.ai
