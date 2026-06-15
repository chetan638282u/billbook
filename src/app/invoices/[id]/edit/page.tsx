'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { Plus, Trash2, Loader2, ArrowLeft, Save } from 'lucide-react'
import { Client } from '@/types'
import { calculateTotals, formatCurrency } from '@/lib/utils'

export default function EditInvoicePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [clients, setClients] = useState<Client[]>([])
  const [businessState, setBusinessState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    client_id: '', invoice_number: '',
    invoice_date: '', due_date: '', notes: '',
  })
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: inv }, { data: clientData }, { data: biz }] = await Promise.all([
        supabase.from('invoices').select('*, invoice_items(*)').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('clients').select('*').eq('user_id', user.id).order('name'),
        supabase.from('businesses').select('state').eq('user_id', user.id).single(),
      ])

      if (inv) {
        setForm({
          client_id: inv.client_id || '',
          invoice_number: inv.invoice_number,
          invoice_date: inv.invoice_date,
          due_date: inv.due_date || '',
          notes: inv.notes || '',
        })
        setItems(inv.invoice_items || [])
      }
      setClients(clientData || [])
      setBusinessState(biz?.state || '')
    }
    load()
  }, [id])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    // ✅ SECURITY: Get user from session, add user_id filter to all writes
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Session expired. Please sign in again.'); setLoading(false); return }

    await supabase.from('invoices').update({
      ...form,
      client_id: form.client_id || null,
      due_date: form.due_date || null,
      ...totals,
      updated_at: new Date().toISOString(),
    }).eq('id', id).eq('user_id', user.id) // ✅ defense-in-depth: verify ownership

    await supabase.from('invoice_items').delete().eq('invoice_id', id)
    await supabase.from('invoice_items').insert(
      items.map(({ id: _id, invoice_id: _inv, ...item }) => ({ ...item, invoice_id: id }))
    )

    router.push(`/invoices/${id}`)
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/invoices/${id}`} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="page-title">Edit Invoice</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
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

            <div className="card p-6">
              <h2 className="section-title mb-4">Bill To</h2>
              <select className="input" value={form.client_id}
                onChange={e => setForm({ ...form, client_id: e.target.value })}>
                <option value="">— Select a client —</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="card p-6">
              <h2 className="section-title mb-5">Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
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
                          <input className="input text-sm" value={item.description}
                            onChange={e => updateItem(i, 'description', e.target.value)} required />
                        </td>
                        <td className="py-2 px-3">
                          <input type="number" className="input text-sm text-right" value={item.quantity}
                            onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)} />
                        </td>
                        <td className="py-2 px-3">
                          <input type="number" className="input text-sm text-right" value={item.rate}
                            onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)} />
                        </td>
                        <td className="py-2 px-3">
                          <select className="input text-sm" value={item.gst_rate}
                            onChange={e => updateItem(i, 'gst_rate', parseFloat(e.target.value))}>
                            {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                        <td className="py-2 pl-2">
                          {items.length > 1 && (
                            <button type="button"
                              onClick={() => setItems(prev => prev.filter((_, idx) => idx !== i))}
                              className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button"
                onClick={() => setItems(prev => [...prev, { description: '', hsn_sac: '', quantity: 1, rate: 0, gst_rate: 18, amount: 0 }])}
                className="mt-4 text-sm text-blue-600 hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add item
              </button>

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                  {isSameState ? (
                    <>
                      <div className="flex justify-between text-gray-600"><span>CGST</span><span>{formatCurrency(totals.cgst)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>SGST</span><span>{formatCurrency(totals.sgst)}</span></div>
                    </>
                  ) : (
                    <div className="flex justify-between text-gray-600"><span>IGST</span><span>{formatCurrency(totals.igst)}</span></div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span><span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <label className="label">Notes</label>
              <textarea className="input resize-none" rows={3} value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3 justify-end pb-6">
              <Link href={`/invoices/${id}`} className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
