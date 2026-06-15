'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, MoreVertical, Check, Send, Clock, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

interface Props {
  invoiceId: string
  publicId: string
  currentStatus: string
}

export default function InvoiceActions({ invoiceId, publicId, currentStatus }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setLoading(true)
    setOpen(false)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // ✅ SECURITY: Get user from session and filter by user_id (defense-in-depth + RLS)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    await supabase
      .from('invoices')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
      .eq('user_id', user.id) // ✅ ensures only owner can update

    router.refresh()
    setLoading(false)
  }

  const deleteInvoice = async () => {
    if (!confirm('Delete this invoice? This cannot be undone.')) return

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // ✅ SECURITY: Get user from session and filter by user_id
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', user.id) // ✅ ensures only owner can delete

    router.push('/invoices')
  }

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={() => window.print()}
        className="btn-secondary text-sm py-2"
        title="Print or Save as PDF"
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print / PDF</span>
      </button>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="btn-secondary text-sm py-2 px-3"
          disabled={loading}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1.5 overflow-hidden">

              <Link
                href={`/invoices/${invoiceId}/edit`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Edit className="w-4 h-4" /> Edit invoice
              </Link>

              <div className="border-t border-gray-100 my-1" />

              {currentStatus !== 'sent' && (
                <button onClick={() => updateStatus('sent')}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                  <Send className="w-4 h-4" /> Mark as Sent
                </button>
              )}
              {currentStatus !== 'paid' && (
                <button onClick={() => updateStatus('paid')}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 w-full text-left transition-colors">
                  <Check className="w-4 h-4" /> Mark as Paid
                </button>
              )}
              {currentStatus !== 'overdue' && (
                <button onClick={() => updateStatus('overdue')}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-orange-700 hover:bg-orange-50 w-full text-left transition-colors">
                  <Clock className="w-4 h-4" /> Mark as Overdue
                </button>
              )}

              <div className="border-t border-gray-100 my-1" />

              <a
                href={`/invoice/${publicId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 w-full text-left transition-colors"
              >
                🔗 Share public link
              </a>

              <div className="border-t border-gray-100 my-1" />

              <button
                onClick={deleteInvoice}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                <Trash2 className="w-4 h-4" /> Delete invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
