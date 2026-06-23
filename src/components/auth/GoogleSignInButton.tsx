'use client'

type GoogleSignInButtonProps = {
  text?: 'signin_with' | 'signup_with' | 'continue_with'
  disabled?: boolean
  onCredential: (token: string) => void
  onError: (message: string) => void
}

export default function GoogleSignInButton({
  text = 'continue_with',
  disabled = false,
}: GoogleSignInButtonProps) {
  const label = text === 'signup_with'
    ? 'Sign up with Google'
    : text === 'signin_with'
      ? 'Sign in with Google'
      : 'Continue with Google'

  const startGoogleRedirect = () => {
    window.location.assign('/auth/google?next=/dashboard')
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <button
        type="button"
        disabled={disabled}
        onClick={startGoogleRedirect}
        className="btn-secondary w-full justify-center gap-3 py-3"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-sm">
          G
        </span>
        {label}
      </button>
    </div>
  )
}
