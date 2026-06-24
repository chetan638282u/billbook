'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, FileText, Loader2 } from 'lucide-react'
import { createRecoveryClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recoveryReady, setRecoveryReady] = useState(false)

  useEffect(() => {
    async function verifyRecoveryLink() {
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      const searchParams = new URLSearchParams(window.location.search)
      const hasRecoveryHash = hashParams.get('type') === 'recovery'
      const hasRecoveryCode = Boolean(searchParams.get('code'))

      if (!hasRecoveryHash && !hasRecoveryCode) {
        await Promise.resolve()
        setError('This password reset link is invalid or expired. Please request a new reset email.')
        return
      }

      const supabase = createRecoveryClient()
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !data.session) {
        setError('This password reset link is invalid or expired. Please request a new reset email.')
        return
      }

      setRecoveryReady(true)
    }

    void verifyRecoveryLink()
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      setLoading(false)
      return
    }

    try {
      const supabase = createRecoveryClient()
      const { error: updateError } = await supabase.auth.updateUser({ password: form.password })

      if (updateError) {
        setError(updateError.message || 'Password could not be updated. Please request a new reset email.')
        setLoading(false)
        return
      }

      await supabase.auth.signOut()
      router.push('/auth/signin?message=password_updated')
      router.refresh()
    } catch {
      setError('Password could not be updated. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create new password</h1>
          <p className="mt-2 text-sm text-gray-500">Enter a new password for your BillBook account.</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">New password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm new password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Re-enter your new password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <button type="submit" disabled={loading || !recoveryReady} className="btn-primary w-full justify-center py-3">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Updating password...' : recoveryReady ? 'Update password' : 'Verifying reset link...'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
