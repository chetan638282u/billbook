-- BillBook public invoice security fix
-- Run this once in Supabase SQL Editor for the live project.
-- It removes broad anonymous invoice reads. Public invoice pages will still work
-- through the Next.js server route, which uses the service role key server-side.

DROP POLICY IF EXISTS "invoices_public_read" ON invoices;
DROP POLICY IF EXISTS "items_public_read" ON invoice_items;

-- Optional verification: both of these should return zero rows after running.
SELECT policyname, tablename
FROM pg_policies
WHERE tablename IN ('invoices', 'invoice_items')
  AND policyname IN ('invoices_public_read', 'items_public_read');
