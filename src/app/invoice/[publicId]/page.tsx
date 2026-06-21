export const dynamic = 'force-dynamic'
import PrintButton from '@/components/ui/PrintButton'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { FileText } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'

export default async function PublicInvoicePage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId: rawPublicId } = await params
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) return notFound()

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

  // ✅ SECURITY: Sanitize publicId — only allow alphanumeric chars
  const publicId = rawPublicId.replace(/[^a-zA-Z0-9]/g, '')
  if (!publicId || publicId.length < 8 || publicId.length > 32) return notFound()

  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      id, user_id, public_id, invoice_number, invoice_date, due_date,
      status, subtotal, cgst, sgst, igst, total, notes,
      clients ( name, gstin, address, city, state, pincode ),
      invoice_items ( description, hsn_sac, quantity, rate, gst_rate, amount )
    `)
    .eq('public_id', publicId)
    .single()

  if (!invoice) return notFound()
  const inv = invoice as any

  // ✅ SECURITY: Only fetch business fields needed for invoice display — not logo_url, internal fields
  const { data: business } = await supabase
    .from('businesses')
    .select('name, gstin, address, city, state, pincode, phone, email')
    .eq('user_id', (invoice as any).user_id)
    .single()

  const isSameState =
    !inv.clients?.state || !business?.state || inv.clients?.state === business?.state

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            Invoice from {business?.name || 'BillBook.in'}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(inv.status)}`}>
            {getStatusLabel(inv.status)}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">{business?.name || 'Your Business'}</span>
              </div>
              {business?.gstin && <p className="text-sm text-gray-500">GSTIN: {business.gstin}</p>}
              {business?.address && <p className="text-sm text-gray-500">{business.address}, {business.city}</p>}
              {business?.state && <p className="text-sm text-gray-500">{business.state} {business.pincode}</p>}
              {business?.phone && <p className="text-sm text-gray-500">Ph: {business.phone}</p>}
              {business?.email && <p className="text-sm text-gray-500">{business.email}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-extrabold text-blue-600 mb-1">INVOICE</h2>
              <p className="text-sm font-semibold text-gray-800">{inv.invoice_number}</p>
              <p className="text-xs text-gray-500 mt-1">Date: {formatDate(invoice.invoice_date)}</p>
              {invoice.due_date && <p className="text-xs text-gray-500">Due: {formatDate(invoice.due_date)}</p>}
            </div>
          </div>

          {/* Bill To — ✅ Only shows address/GSTIN, NOT phone/email of client */}
          {inv.clients && (
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-gray-900">{inv.clients.name}</p>
              {inv.clients.gstin && <p className="text-sm text-gray-600">GSTIN: {inv.clients.gstin}</p>}
              {inv.clients.address && (
                <p className="text-sm text-gray-600">
                  {inv.clients.address}, {inv.clients.city}, {inv.clients.state} {inv.clients.pincode}
                </p>
              )}
            </div>
          )}

          {/* Items table */}
          <table className="w-full text-sm mb-6">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-4 py-3 rounded-tl-lg">#</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-right px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Rate</th>
                <th className="text-right px-4 py-3">GST%</th>
                <th className="text-right px-4 py-3 rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inv.invoice_items?.map((item: any, i: number) => (
                <tr key={i} className="text-gray-700">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.description}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.rate)}</td>
                  <td className="px-4 py-3 text-right">{item.gst_rate}%</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span></div>
              {isSameState ? (
                <>
                  <div className="flex justify-between text-gray-600"><span>CGST</span><span>{formatCurrency(inv.cgst)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>SGST</span><span>{formatCurrency(inv.sgst)}</span></div>
                </>
              ) : (
                <div className="flex justify-between text-gray-600"><span>IGST</span><span>{formatCurrency(inv.igst)}</span></div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-3">
                <span>Total</span><span>{formatCurrency(inv.total)}</span>
              </div>
            </div>
          </div>

          {inv.notes && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{inv.notes}</p>
            </div>
          )}

          <div className="border-t border-gray-100 mt-6 pt-4 text-center">
            <p className="text-xs text-gray-400">Generated by BillBook.in · GST-Compliant Invoice</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <PrintButton />
        </div>
      </div>
    </div>
  )
}
