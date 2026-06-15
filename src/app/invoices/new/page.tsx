'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { Plus, Trash2, Loader2, ArrowLeft, Save } from 'lucide-react'
import { Client, INDIAN_STATES } from '@/types'
import { calculateTotals, formatCurrency, generateInvoiceNumber } from '@/lib/utils'

const EMPTY_ITEM = { description: '', hsn_sac: '', quantity: 1, rate: 0, gst_rate: 18, amount: 0 }

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [businessState, setBusinessState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    client_id: '', invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '', notes: '',
  })
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get the highest existing invoice number to avoid duplicates after deletions
      const [{ data: clientData }, { data: biz }, { data: lastInv }] = await Promise.all([
        supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
        supabase.from('businesses').select('state').eq('user_id', user.id).single(),
        supabase.from('invoices')
          .select('invoice_number')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1),
      ])

      // Parse last invoice number and increment
      let nextSeq = 1
      if (lastInv && lastInv.length > 0) {
        const lastNum = lastInv[0].invoice_number
        const parts = lastNum.split('-')
        const lastSeq = parseInt(parts[parts.length - 1], 10)
        if (!isNaN(lastSeq)) nextSeq = lastSeq + 1
      }

      setClients(clientData || [])
      setBusinessState(biz?.state || '')
      setForm(f => ({ ...f, invoice_number: generateInvoiceNumber(nextSeq) }))
    }
    load()
  }, [])

  const updateItem = (index: number, field: string, value: string | number) => {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      const qty = Number(field === 'quantity' ? value : updated[index].quantity)
      const rate = Number(field === 'rate' ? value : updated[index].rate)
      updated[index].amount = qty * rate
      return updated
    })
  }

  const selectedClient = clients.find(c => c.id === form.client_id)
  const isSameState = !selectedClient?.state || !businessState || selectedClient.state === businessState
  const totals = calculateTotals(items, isSameState)

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'sent' = 'draft') => {
    e.preventDefault()
    if (items.some(i => !i.description || i.rate <= 0)) {
      setError('Please add at least one item with description and rate.')
      return
    }
    setLoading(true)
    setError('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // ✅ SECURITY: Server-side validation of all numeric fields
    const VALID_GST_RATES = new Set([0, 5, 12, 18, 28])
    for (const item of items) {
      if (!VALID_GST_RATES.has(item.gst_rate)) { setError('Invalid GST rate detected.'); setLoading(false); return }
      if (item.quantity <= 0 || item.quantity > 100000) { setError('Invalid quantity.'); setLoading(false); return }
      if (item.rate < 0 || item.rate > 10000000) { setError('Invalid rate value.'); setLoading(false); return }
    }

    const { data: invoice, error: invErr } = await supabase
      .from('invoices')
      .insert({ user_id: user.id, client_id: form.client_id || null,
        invoice_number: form.invoice_number.trim().slice(0, 50),
        invoice_date: form.invoice_date,
        due_date: form.due_date || null, status,
        notes: form.notes?.trim().slice(0, 2000) || null,
        ...totals })
      .select().single()

    if (invErr || !invoice) {
      setError('Failed to save invoice. Please try again.')
      setLoading(false)
      return
    }

    await supabase.from('invoice_items').insert(
      items.map(item => ({ ...item, invoice_id: invoice.id }))
    )
    router.push(`/invoices/${invoice.id}`)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/invoices" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="page-title">New Invoice</h1>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'draft')}>
          <div className="space-y-5">
            {/* Invoice meta */}
            <div className="card p-6">
              <h2 className="section-title mb-5">Invoice Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Invoice Number *</label>
                  <input className="input" value={form.invoice_number}
                    onChange={e => setForm({ ...form, invoice_number: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Invoice Date *</label>
                  <input type="date" className="input" value={form.invoice_date}
                    onChange={e => setForm({ ...form, invoice_date: e.target.value })} required />
                </div>
                <div>
                  <label className="label">Due Date</label>
                  <input type="date" className="input" value={form.due_date}
                    onChange={e => setForm({ ...form, due_date: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Client */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title">Bill To</h2>
                <Link href="/clients/new" className="text-sm text-blue-600 hover:underline">+ Add new client</Link>
              </div>
              <select className="input" value={form.client_id}
                onChange={e => setForm({ ...form, client_id: e.target.value })}>
                <option value="">— Select a client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {selectedClient && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="font-medium text-gray-800">{selectedClient.name}</p>
                  {selectedClient.gstin && <p>GSTIN: {selectedClient.gstin}</p>}
                  {selectedClient.address && <p>{selectedClient.address}, {selectedClient.city}, {selectedClient.state}</p>}
                </div>
              )}
            </div>

            {/* Line items */}
            <div className="card p-6">
              <h2 className="section-title mb-5">Items / Services</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase min-w-48">Description *</th>
                      <th className="text-left pb-3 px-3 text-xs font-semibold text-gray-500 uppercase w-24">HSN/SAC</th>
                      <th className="text-right pb-3 px-3 text-xs font-semibold text-gray-500 uppercase w-20">Qty</th>
                      <th className="text-right pb-3 px-3 text-xs font-semibold text-gray-500 uppercase w-28">Rate (₹)</th>
                      <th className="text-right pb-3 px-3 text-xs font-semibold text-gray-500 uppercase w-20">GST%</th>
                      <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase w-28">Amount</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-3">
                          <input className="input text-sm" placeholder="Web Design Services"
                            value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} required />
                        </td>
                        <td className="py-2 px-3">
                          <input className="input text-sm" placeholder="998314"
                            value={item.hsn_sac} onChange={e => updateItem(i, 'hsn_sac', e.target.value)} />
                        </td>
                        <td className="py-2 px-3">
                          <input type="number" className="input text-sm text-right" min="0.01" step="0.01"
                            value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)} />
                        </td>
                        <td className="py-2 px-3">
                          <input type="number" className="input text-sm text-right" min="0" step="0.01"
                            value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} />
                        </td>
                        <td className="py-2 px-3">
                          <select className="input text-sm" value={item.gst_rate}
                            onChange={e => updateItem(i, 'gst_rate', parseFloat(e.target.value))}>
                            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                        <td className="py-2 pl-2">
                          {items.length > 1 && (
                            <button type="button" onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-gray-300 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={() => setItems(prev => [...prev, { ...EMPTY_ITEM }])}
                className="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add item
              </button>

              <div className="mt-6 flex justify-end">
                <div className="w-72 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                  {isSameState ? (
                    <>
                      <div className="flex justify-between text-gray-600"><span>CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600"><span>IGST</span><span>{formatCurrency(totals.igst)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2">
                    <span>Total</span><span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <label className="label">Notes (optional)</label>
              <textarea className="input resize-none" rows={3}
                placeholder="Payment terms, bank details, thank you note..."
                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

            <div className="flex gap-3 justify-end pb-6">
              <Link href="/invoices" className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-secondary">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save as Draft
              </button>
              <button type="button" disabled={loading}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'sent')}
                className="btn-primary">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save & Mark Sent
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
