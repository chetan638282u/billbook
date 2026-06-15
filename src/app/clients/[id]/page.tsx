'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react'
import { INDIAN_STATES } from '@/types'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '', gstin: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  })

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data } = await supabase.from('clients').select('*').eq('id', id).single()
      if (data) setForm({
        name: data.name || '', gstin: data.gstin || '',
        email: data.email || '', phone: data.phone || '',
        address: data.address || '', city: data.city || '',
        state: data.state || '', pincode: data.pincode || '',
      })
    }
    load()
  }, [id])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    // ✅ SECURITY: verify session before update
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) { setLoading(false); return }
    await supabase.from('clients').update({
        name: form.name.trim().slice(0, 200),
        gstin: form.gstin.trim().toUpperCase().slice(0, 15) || null,
        email: form.email.trim().toLowerCase().slice(0, 254),
        phone: form.phone.trim().slice(0, 20),
        address: form.address.trim().slice(0, 500),
        city: form.city.trim().slice(0, 100),
        state: form.state.trim().slice(0, 100),
        pincode: form.pincode.trim().slice(0, 6),
      }).eq('id', id).eq('user_id', u.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this client? Their invoices will not be deleted.')) return
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user: du } } = await supabase.auth.getUser()
    if (!du) return
    await supabase.from('clients').delete().eq('id', id).eq('user_id', du.id)
    router.push('/clients')
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/clients" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="page-title">Edit Client</h1>
          </div>
          <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card p-6 space-y-5">
            <div>
              <label className="label">Client / Company Name *</label>
              <input className="input" value={form.name} onChange={set('name')} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">GSTIN</label>
                <input className="input" placeholder="27AAAAA0000A1Z5" value={form.gstin} onChange={set('gstin')} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={set('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input className="input" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input className="input" value={form.pincode} onChange={set('pincode')} />
              </div>
            </div>
            <div>
              <label className="label">State</label>
              <select className="input" value={form.state} onChange={set('state')}>
                <option value="">— Select State —</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && <span className="text-sm text-green-600">✓ Saved successfully</span>}
              <div className="ml-auto">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
