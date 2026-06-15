'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const name = form.name.trim().slice(0, 100)
    if (!name) { setError('Please enter your name.'); setLoading(false); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      // Show the real Supabase error so issues are visible
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user && !data.session) {
      // Email confirmation required
      setSuccess('Account created! Check your email for a confirmation link, then sign in.')
      setLoading(false)
      return
    }

    if (data.user && data.session) {
      // No email confirmation needed — go straight to dashboard
      // Init subscription via server API
      try {
        await fetch('/api/init-account', { method: 'POST' })
      } catch {
        // Non-fatal — DB trigger handles this as backup
      }
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (googleError) {
      setError(googleError.message)
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Start generating GST invoices for free</p>
        </div>

        <div className="card p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3 mb-4">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <input type="text" className="input" placeholder="Rahul Sharma"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                required maxLength={100} autoComplete="name" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="rahul@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                required maxLength={254} autoComplete="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                  placeholder="Minimum 8 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  required minLength={8} maxLength={128} autoComplete="new-password" />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                <strong>Error:</strong> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account...' : 'Create free account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button type="button" disabled={loading} onClick={handleGoogleSignIn}
            className="btn-secondary w-full justify-center py-3">
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
