'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/AppShell'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { INDIAN_STATES } from '@/types'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: '', gstin: '', address: '', city: '',
    state: '', pincode: '', phone: '', email: '',
  })

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single()
      if (data) setForm({
        name: data.name || '', gstin: data.gstin || '',
        address: data.address || '', city: data.city || '',
        state: data.state || '', pincode: data.pincode || '',
        phone: data.phone || '', email: data.email || '',
      })
    }
    load()
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: existing } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
    if (existing) {
      await supabase.from('businesses').update({
        name: form.name.trim().slice(0, 200),
        gstin: form.gstin.trim().toUpperCase().slice(0, 15) || null,
        address: form.address.trim().slice(0, 500),
        city: form.city.trim().slice(0, 100),
        state: form.state.trim().slice(0, 100),
        pincode: form.pincode.trim().slice(0, 6),
        phone: form.phone.trim().slice(0, 20),
        email: form.email.trim().toLowerCase().slice(0, 254),
      }).eq('user_id', user.id)
    } else {
      await supabase.from('businesses').insert({
        user_id: user.id,
        name: form.name.trim().slice(0, 200),
        gstin: form.gstin.trim().toUpperCase().slice(0, 15) || null,
        address: form.address.trim().slice(0, 500),
        city: form.city.trim().slice(0, 100),
        state: form.state.trim().slice(0, 100),
        pincode: form.pincode.trim().slice(0, 6),
        phone: form.phone.trim().slice(0, 20),
        email: form.email.trim().toLowerCase().slice(0, 254),
      })
    }

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title">Business Profile</h1>
          <p className="text-sm text-gray-500 mt-1">This information appears on all your invoices.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card p-6 space-y-5">
            <div>
              <label className="label">Business / Freelancer Name *</label>
              <input className="input" placeholder="Rahul Sharma Design Studio" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="label">GSTIN</label>
              <input className="input" placeholder="07AABCU9603R1ZX" value={form.gstin} onChange={set('gstin')} maxLength={15} />
              <p className="text-xs text-gray-400 mt-1">15-digit GST Identification Number. Leave blank if not registered.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="9800000000" value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="you@yourbusiness.com" value={form.email} onChange={set('email')} />
              </div>
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="Flat 4, Sunrise Apartments, MG Road" value={form.address} onChange={set('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input className="input" placeholder="New Delhi" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input className="input" placeholder="110001" value={form.pincode} onChange={set('pincode')} maxLength={6} />
              </div>
            </div>
            <div>
              <label className="label">State</label>
              <select className="input" value={form.state} onChange={set('state')}>
                <option value="">— Select State —</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="text-xs text-gray-400 mt-1">Used to auto-calculate CGST/SGST vs IGST.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saved && (
                <span className="text-sm text-green-600 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Profile saved successfully
                </span>
              )}
              <div className="ml-auto">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
