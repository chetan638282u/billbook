-- ============================================================
-- BillBook.in — Supabase Database Schema
-- STEP 1: Run this ENTIRE block in Supabase SQL Editor
-- Go to: supabase.com → Your Project → SQL Editor → New Query
-- Paste everything below → Click RUN
-- ============================================================

-- Drop existing trigger first (prevents conflict on re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- ── TABLE 1: businesses ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  gstin TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE 2: clients ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  gstin TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE 3: invoices ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id TEXT UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  cgst NUMERIC(12,2) NOT NULL DEFAULT 0,
  sgst NUMERIC(12,2) NOT NULL DEFAULT 0,
  igst NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABLE 4: invoice_items ───────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  hsn_sac TEXT,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 18,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- ── TABLE 5: subscriptions ───────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'starter', 'pro')),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ENABLE ROW LEVEL SECURITY ────────────────────────────────
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ── DROP OLD POLICIES (safe re-run) ─────────────────────────
DO $$ DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename FROM pg_policies
    WHERE tablename IN ('businesses','clients','invoices','invoice_items','subscriptions')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ── RLS POLICIES ─────────────────────────────────────────────

-- businesses
CREATE POLICY "businesses_select" ON businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "businesses_insert" ON businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "businesses_update" ON businesses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "businesses_delete" ON businesses FOR DELETE USING (auth.uid() = user_id);

-- clients
CREATE POLICY "clients_select" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_insert" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update" ON clients FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_delete" ON clients FOR DELETE USING (auth.uid() = user_id);

-- invoices (owner)
CREATE POLICY "invoices_owner_select" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "invoices_owner_insert" ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_owner_update" ON invoices FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_owner_delete" ON invoices FOR DELETE USING (auth.uid() = user_id);

-- Public shared links are served by the Next.js server with the service role key.
-- Do not add anonymous invoice SELECT policies here; they can expose invoice data.

-- invoice_items (owner via invoice)
CREATE POLICY "items_select" ON invoice_items FOR SELECT
  USING (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));
CREATE POLICY "items_insert" ON invoice_items FOR INSERT
  WITH CHECK (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));
CREATE POLICY "items_update" ON invoice_items FOR UPDATE
  USING (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));
CREATE POLICY "items_delete" ON invoice_items FOR DELETE
  USING (invoice_id IN (SELECT id FROM invoices WHERE user_id = auth.uid()));

-- Public invoice items are served by the Next.js server with the service role key.
-- Do not add anonymous invoice_items SELECT policies here.

-- subscriptions (users read their own only, writes via service role)
CREATE POLICY "subscriptions_select" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_public_id ON invoices(public_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_subs_user_id ON subscriptions(user_id);

-- ── AUTO SUBSCRIPTION TRIGGER ────────────────────────────────
-- Creates a free subscription row automatically when any user signs up
-- This MUST be created AFTER the subscriptions table above

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ── VERIFY ───────────────────────────────────────────────────
-- After running, you should see "Success. No rows returned"
-- Then go to Table Editor — you should see all 5 tables
-- ============================================================
