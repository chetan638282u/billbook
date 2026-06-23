'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileText, Eye, EyeOff, Loader2 } from 'lucide-react'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import AuthVideoPanel from '@/components/auth/AuthVideoPanel'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialError = searchParams.get('error') === 'confirmation_failed'
    ? 'Email confirmation failed. Please try again or contact support.'
    : ''
  const initialInfo = searchParams.get('message') === 'check_email'
    ? 'Check your email and click the confirmation link to activate your account.'
    : searchParams.get('message') === 'account_created'
      ? 'Account created. Sign in with the same email and password.'
      : searchParams.get('message') === 'password_updated'
        ? 'Password updated. Sign in with your new password.'
    : ''
  const initialEmail = searchParams.get('email') ?? ''
  const [form, setForm] = useState({ email: initialEmail, password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialError)
  const [info] = useState(initialInfo)
  const [loadingNotice, setLoadingNotice] = useState('')

  useEffect(() => {
    if (!loading) {
      setLoadingNotice('')
      return
    }

    const timer = window.setTimeout(() => {
      setLoadingNotice('Still signing you in. If this takes too long, refresh the page and try again.')
    }, 12000)

    return () => window.clearTimeout(timer)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const email = form.email.trim().toLowerCase()
      const checkResponse = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const checkResult = await checkResponse.json()

      if (!checkResponse.ok) {
        setError(checkResult.error || 'Account check failed. Please try again.')
        setLoading(false)
        return
      }

      if (!checkResult.exists) {
        setError('No account found with this email. Please create an account first.')
        setLoading(false)
        return
      }

      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      })

      if (signInError) {
        setError('Incorrect password. Please enter the password you used while creating this account.')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Sign in could not be completed. Please check your connection and try again.')
      setLoading(false)
    }
  }

  const handleGoogleCredential = async (token: string) => {
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error: googleError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
      })

      if (googleError) {
        setError(googleError.message || 'Google sign in failed. Please try again.')
        setLoading(false)
        return
      }

      try {
        await fetch('/api/init-account', { method: 'POST' })
      } catch {}

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Google sign in could not be completed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_48%,#f8fbff_100%)] lg:grid lg:grid-cols-[minmax(0,0.88fr)_minmax(520px,1.12fr)]">
      <div className="flex min-h-screen flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900">BillBook<span className="text-blue-600">.in</span></span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your BillBook account</p>
        </div>

        <div className="rounded-2xl border border-white/75 bg-white/90 p-8 shadow-xl shadow-blue-950/5 backdrop-blur">
          {info && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-3 mb-4">{info}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="rahul@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required maxLength={254} autoComplete="email" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                  placeholder="Your password"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required autoComplete="current-password" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
            )}
            {loadingNotice && !error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3">{loadingNotice}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <GoogleSignInButton
            disabled={loading}
            onCredential={handleGoogleCredential}
            onError={(message) => {
              setError(message)
              setLoading(false)
            }}
          />

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
      </div>
      <AuthVideoPanel />
    </div>
  )
}
