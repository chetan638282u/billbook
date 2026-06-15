export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { ArrowLeft, Download, Edit, CheckCircle, Send, Clock, FileText } from 'lucide-react'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import InvoiceActions from '@/components/invoices/InvoiceActions'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(*), invoice_items(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!invoice) notFound()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isSameState =
    !invoice.clients?.state || !business?.state || invoice.clients.state === business.state

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/invoices" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="page-title">{invoice.invoice_number}</h1>
              <p className="text-sm text-gray-500 mt-0.5">Created {formatDate(invoice.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${getStatusColor(invoice.status)}`}>
              {getStatusLabel(invoice.status)}
            </span>
            <InvoiceActions invoiceId={id} publicId={invoice.public_id} currentStatus={invoice.status} />
          </div>
        </div>

        {/* Invoice preview */}
        <div className="card p-8 print:shadow-none" id="invoice-preview">
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
              {business?.address && (
                <p className="text-sm text-gray-500">{business.address}, {business.city}</p>
              )}
              {business?.state && <p className="text-sm text-gray-500">{business.state} {business.pincode}</p>}
              {business?.phone && <p className="text-sm text-gray-500">Ph: {business.phone}</p>}
              {business?.email && <p className="text-sm text-gray-500">{business.email}</p>}
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-extrabold text-blue-600 mb-1">INVOICE</h2>
              <p className="text-sm font-semibold text-gray-800">{invoice.invoice_number}</p>
              <p className="text-xs text-gray-500 mt-1">Date: {formatDate(invoice.invoice_date)}</p>
              {invoice.due_date && (
                <p className="text-xs text-gray-500">Due: {formatDate(invoice.due_date)}</p>
              )}
            </div>
          </div>

          {/* Bill to */}
          {invoice.clients && (
            <div className="bg-gray-50 rounded-xl p-5 mb-8">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-gray-900">{invoice.clients.name}</p>
              {invoice.clients.gstin && <p className="text-sm text-gray-600">GSTIN: {invoice.clients.gstin}</p>}
              {invoice.clients.address && (
                <p className="text-sm text-gray-600">
                  {invoice.clients.address}, {invoice.clients.city}, {invoice.clients.state} {invoice.clients.pincode}
                </p>
              )}
              {invoice.clients.phone && <p className="text-sm text-gray-600">Ph: {invoice.clients.phone}</p>}
              {invoice.clients.email && <p className="text-sm text-gray-600">{invoice.clients.email}</p>}
            </div>
          )}

          {/* Items table */}
          <table className="w-full text-sm mb-6">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-4 py-3 rounded-tl-lg">#</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">HSN/SAC</th>
                <th className="text-right px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Rate</th>
                <th className="text-right px-4 py-3">GST%</th>
                <th className="text-right px-4 py-3 rounded-tr-lg">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.invoice_items?.map((item: any, i: number) => (
                <tr key={item.id} className="text-gray-700">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{item.description}</td>
                  <td className="px-4 py-3 text-gray-500">{item.hsn_sac || '—'}</td>
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
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {isSameState ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST</span>
                    <span>{formatCurrency(invoice.cgst)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST</span>
                    <span>{formatCurrency(invoice.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-gray-600">
                  <span>IGST</span>
                  <span>{formatCurrency(invoice.igst)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-3 mt-2">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          <div className="border-t border-gray-100 mt-6 pt-4 text-center">
            <p className="text-xs text-gray-400">Generated by BillBook.in · GST-Compliant Invoice</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
