'use client'

import { useEffect, useRef, useState } from 'react'
import { getGoogleClientId, loadGoogleIdentityScript } from '@/lib/googleIdentity'

type GoogleSignInButtonProps = {
  text?: 'signin_with' | 'signup_with' | 'continue_with'
  disabled?: boolean
  onCredential: (token: string) => void
  onError: (message: string) => void
}

export default function GoogleSignInButton({
  text = 'continue_with',
  disabled = false,
  onCredential,
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          client_id: getGoogleClientId(),
          callback: (response) => {
            if (response.credential) {
              onCredential(response.credential)
              return
            }

            onError('Google did not return a sign in token.')
          },
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          width: 335,
        })
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) onError('Google sign in could not load. Please try again.')
      })

    return () => {
      cancelled = true
    }
  }, [onCredential, onError, text])

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <div ref={buttonRef} className="flex justify-center min-h-11" />
      {!ready && (
        <button type="button" disabled className="btn-secondary w-full justify-center py-3">
          Loading Google...
        </button>
      )}
    </div>
  )
}
