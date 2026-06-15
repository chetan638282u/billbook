# Contributing to BillBook.in

## Local Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/billbook.git`
3. Install dependencies: `npm install`
4. Copy env file: `cp .env.local.example .env.local`
5. Fill in your Supabase and Razorpay keys
6. Run the database schema: paste `supabase-schema.sql` into Supabase SQL Editor
7. Start dev server: `npm run dev`

## Branch Naming

- `feature/your-feature-name`
- `fix/bug-description`
- `chore/task-description`

## Commit Style

Use clear commit messages:
- `feat: add recurring invoice support`
- `fix: correct IGST calculation for interstate`
- `chore: update dependencies`
