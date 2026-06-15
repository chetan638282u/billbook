# BillBook.in — GST Invoice Generator for Indian Businesses

A professional SaaS app for creating GST-compliant invoices, managing clients, and tracking payments. Built for Indian freelancers and small businesses.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

---

## Features

- GST-compliant invoice generation (CGST / SGST / IGST auto-calculated)
- Client management with GSTIN support
- Invoice status tracking (Draft, Sent, Paid, Overdue)
- PDF download via browser print
- Public shareable invoice links
- Free and paid subscription plans
- Razorpay payment integration
- Row Level Security — each user sees only their own data
- Rate limiting on all API routes
- Mobile responsive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Razorpay |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/billbook.git
cd billbook
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values in `.env.local` (see below).

### 4. Set up Supabase database

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** — you will see "Success. No rows returned"
5. Go to **Table Editor** — you should see 5 tables

### 5. Configure Supabase Auth

- Go to **Authentication → Providers → Email**
- For development: turn **OFF** "Confirm email"
- For production: turn it back **ON**
- Go to **Authentication → URL Configuration**
- Set Site URL to your production domain

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file with these values:

```env
# Supabase — get from supabase.com → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay — get from razorpay.com → Settings → API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add all environment variables in Vercel dashboard
4. Change `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Click Deploy

---

## Database Schema

Five tables are created by `supabase-schema.sql`:

| Table | Purpose |
|---|---|
| `businesses` | User's business profile (name, GSTIN, address) |
| `clients` | Client directory per user |
| `invoices` | Invoice records with GST breakdown |
| `invoice_items` | Line items for each invoice |
| `subscriptions` | User plan (free / starter / pro) |

All tables have Row Level Security enabled.

---

## Pricing Plans

| Plan | Price | Invoices | Clients |
|---|---|---|---|
| Free | ₹0/month | 5/month | 3 |
| Starter | ₹149/month | Unlimited | 10 |
| Pro | ₹349/month | Unlimited | Unlimited |

---

## Project Structure

```
billbook/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── create-order/   # Razorpay order creation
│   │   │   ├── verify-payment/ # Razorpay payment verification
│   │   │   ├── init-account/   # New user account setup
│   │   │   ├── invoice-pdf/    # Invoice data for PDF
│   │   │   └── signout/        # Sign out handler
│   │   ├── auth/               # Authentication pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── callback/       # Email confirmation handler
│   │   ├── dashboard/          # Main dashboard
│   │   ├── invoices/           # Invoice list, create, edit, view
│   │   ├── invoice/[publicId]/ # Public shareable invoice
│   │   ├── clients/            # Client management
│   │   ├── settings/           # Business profile
│   │   ├── billing/            # Subscription & payment
│   │   └── pricing/            # Public pricing page
│   ├── components/
│   │   ├── AppShell.tsx        # Sidebar layout
│   │   ├── invoices/           # Invoice-specific components
│   │   └── ui/                 # Shared UI components
│   ├── lib/
│   │   ├── supabase/           # Supabase client (browser + server)
│   │   ├── ratelimit.ts        # API rate limiting
│   │   └── utils.ts            # Utility functions
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── middleware.ts           # Auth protection for routes
├── supabase-schema.sql         # Complete database schema
├── .env.local.example          # Environment variable template
└── next.config.ts              # Next.js + security headers config
```

---

## Security

- Row Level Security on all Supabase tables
- Rate limiting on all API routes (IP + user based)
- Razorpay signature verified server-side with timing-safe compare
- Payment amounts derived server-side — client cannot tamper
- HTTP security headers: CSP, HSTS, X-Frame-Options, etc.
- User ID from session only — never trusted from client body
- Input validation and field length limits on all writes

---

## License

MIT License — free to use and modify.
