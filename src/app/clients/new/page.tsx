'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/AppShell'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { INDIAN_STATES } from '@/types'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', gstin: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { error: err } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: form.name.trim().slice(0, 200),
        gstin: form.gstin.trim().toUpperCase().slice(0, 15) || null,
        email: form.email.trim().toLowerCase().slice(0, 254),
        phone: form.phone.trim().slice(0, 20),
        address: form.address.trim().slice(0, 500),
        city: form.city.trim().slice(0, 100),
        state: form.state.trim().slice(0, 100),
        pincode: form.pincode.trim().slice(0, 6),
      })

    if (err) {
      setError('Failed to save client. Please try again.')
      setLoading(false)
      return
    }
    router.push('/clients')
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="page-title">Add New Client</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card p-6 space-y-5">
            <div>
              <label className="label">Client / Company Name *</label>
              <input className="input" placeholder="TechCorp Pvt. Ltd." value={form.name} onChange={set('name')} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">GSTIN</label>
                <input className="input" placeholder="27AAAAA0000A1Z5" value={form.gstin} onChange={set('gstin')} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="9800000000" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="accounts@techcorp.com" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="123, MG Road" value={form.address} onChange={set('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input className="input" placeholder="Mumbai" value={form.city} onChange={set('city')} />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input className="input" placeholder="400001" value={form.pincode} onChange={set('pincode')} />
              </div>
            </div>
            <div>
              <label className="label">State</label>
              <select className="input" value={form.state} onChange={set('state')}>
                <option value="">— Select State —</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Link href="/clients" className="btn-secondary">Cancel</Link>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
