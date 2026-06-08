# PlotLine

A modern SaaS PWA for generating vivid, dialogue-free visual action scripts for 3D animated kids' videos (ages 3–7). Built with Next.js, Google OAuth, Gemini AI, and Stripe.

**Zero hosting cost to start** — deploy free on Vercel. You only pay when you scale (Gemini API usage, Stripe transaction fees).

---

## Features

- **PWA** — Install on mobile, tablet, or desktop via "Install App"
- **AI Script Generator** — Unique 10–12 scene scripts via Google Gemini
- **Visual-only output** — No dialogue; focuses on expressions, physical comedy, camera notes
- **Positive values** — Every story weaves in moral lessons for children
- **Free tier** — 5 scripts per user; paywall after limit
- **Admin access** — `mrreddy7776969@gmail.com` gets unlimited scripts + Admin Dashboard
- **Dynamic pricing** — Admin controls Pro (₹50) and Pro Plus (₹150) plans
- **Download folder** — Pick once, save TXT/PDF exports without re-prompting
- **Dark/Light mode** — Premium "Old Money" aesthetic
- **Onboarding tour** — Skippable first-time walkthrough

---

## Quick Start (Local)

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in values (see setup guides below).

```bash
cp .env.example .env.local
```

### 3. Generate a NextAuth secret

```bash
openssl rand -base64 32
```

Paste the output as `NEXTAUTH_SECRET` in `.env.local`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Setup Guide: Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g. "PlotLine")
3. Navigate to **APIs & Services → OAuth consent screen**
   - Choose **External** user type
   - Fill in app name: `PlotLine`
   - Add your email as developer contact
   - Add scopes: `email`, `profile`, `openid`
   - Add your email as a **Test user** (required while app is in Testing mode)
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `PlotLine Web`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (local)
     - `https://your-app.vercel.app` (after Vercel deploy)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-app.vercel.app/api/auth/callback/google`
5. Copy **Client ID** → `GOOGLE_CLIENT_ID`
6. Copy **Client secret** → `GOOGLE_CLIENT_SECRET`

> **After Vercel deploy:** Add your `*.vercel.app` URL to both origin and redirect URI lists.

---

## Setup Guide: AI Provider (Groq — Recommended)

PlotLine uses a **multi-provider system**. If one AI fails, it automatically tries the next. This prevents quota and model errors forever.

### Primary: Groq (free, fast, reliable)

1. Go to [console.groq.com](https://console.groq.com) → sign up (free)
2. **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_`) → add to `.env.local`:

```env
GROQ_API_KEY=gsk_your_key_here
```

That's it. Groq is tried first. Gemini is only used as fallback.

### Optional fallback: Gemini

```env
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-2.5-flash-lite
```

### Optional: OpenRouter (extra free fallbacks)

1. [openrouter.ai/keys](https://openrouter.ai/keys) → create free key
2. Add `OPENROUTER_API_KEY=sk-or-...` to `.env.local`

### How the fallback chain works

```
Groq → OpenRouter (free models) → Gemini (auto-detects models)
```

Each provider retries 3–4 times with backoff on rate limits.

---

## Setup Guide: Stripe (INR Payments)

Stripe is **free to set up** — no monthly fee. You only pay per successful transaction (~2% + fees in India).

### Step 1: Create a Stripe account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Complete business verification (you can start in **Test mode** immediately)

### Step 2: Get API keys

1. In Stripe Dashboard → **Developers → API keys**
2. Copy **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`

### Step 3: Create products (recommended)

1. Go to **Product catalog → Add product**
2. Create **PlotLine Pro**:
   - Price: ₹50 / month, recurring
   - Copy the Price ID (starts with `price_`) → `STRIPE_PRO_PRICE_ID`
3. Create **PlotLine Pro Plus**:
   - Price: ₹150 / month, recurring
   - Copy Price ID → `STRIPE_PRO_PLUS_PRICE_ID`

> If you skip Price IDs, the app creates ad-hoc prices at checkout (works in test mode).

### Step 4: Test a payment

1. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC
2. Complete checkout from the Billing page
3. Check **Payments** in Stripe Dashboard

### Step 5: Go live (when ready)

1. Complete Stripe account activation
2. Switch to **Live mode** keys in Vercel env vars
3. Recreate products in Live mode

---

## Deploy to Vercel (Free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Add all environment variables from `.env.example`:
   - `NEXTAUTH_URL` = `https://your-app.vercel.app`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `GEMINI_API_KEY`
   - `STRIPE_SECRET_KEY` (and Price IDs if created)
   - `PRO_PRICE=50` / `PRO_PLUS_PRICE=150`
4. Deploy

5. **Update Google OAuth** redirect URIs with your Vercel URL (see Google OAuth guide above)

> No custom domain needed — `your-app.vercel.app` works fully.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_URL` | Yes | App URL (e.g. `https://plotline.vercel.app`) |
| `NEXTAUTH_SECRET` | Yes | Random secret (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `ADMIN_EMAIL` | No | Defaults to `mrreddy7776969@gmail.com` |
| `PRO_PRICE` | No | Default `50` (INR) |
| `PRO_PLUS_PRICE` | No | Default `150` (INR) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `STRIPE_PRO_PRICE_ID` | Optional | Pre-created Stripe price ID |
| `STRIPE_PRO_PLUS_PRICE_ID` | Optional | Pre-created Stripe price ID |

---

## Admin Access

Log in with **mrreddy7776969@gmail.com** to unlock:
- Unlimited script generation (no 5-script cap)
- **Admin Settings** in sidebar
- Dynamic pricing editor (updates Billing page + paywall instantly)

---

## Download Folder (File System Access)

On first login, PlotLine asks you to pick a download folder **once**. All TXT/PDF exports save there automatically.

- Supported in Chrome, Edge, and other Chromium browsers
- Manage in **Settings → Download Folder**
- Falls back to standard browser download if unsupported

---

## Project Structure

```
src/
├── app/           # Pages & API routes
├── components/    # UI components
├── lib/           # Auth, Gemini, storage, stores
└── types/         # TypeScript types
public/
├── manifest.json  # PWA manifest
├── sw.js          # Service worker
└── icons/         # App icons
```

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — Old Money premium aesthetic
- **NextAuth v5** — Google OAuth
- **Google Gemini** — Script generation
- **Stripe** — INR subscriptions
- **Zustand** — Client state
- **localStorage + IndexedDB** — Usage tracking, history, folder handle
- **driver.js** — Onboarding tour
- **jspdf** — PDF export

---

## License

Private — All rights reserved.
