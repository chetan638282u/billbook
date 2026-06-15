import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Invoice PDF API
 * Returns invoice data as JSON for client-side PDF generation.
 * The actual PDF is rendered by the browser using @react-pdf/renderer
 * or via the browser's built-in Print → Save as PDF.
 * 
 * GET /api/invoice-pdf?id=<invoice_id>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      id, invoice_number, invoice_date, due_date, status,
      subtotal, cgst, sgst, igst, total, notes,
      clients ( name, gstin, address, city, state, pincode, phone, email ),
      invoice_items ( description, hsn_sac, quantity, rate, gst_rate, amount )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  const { data: business } = await supabase
    .from('businesses')
    .select('name, gstin, address, city, state, pincode, phone, email')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ invoice, business })
}
