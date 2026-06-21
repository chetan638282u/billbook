const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '884153447591-si7k4ic8eioihrshm9jejbntouhvtbhp.apps.googleusercontent.com'

type GoogleCredentialResponse = {
  credential?: string
}

type GoogleAccounts = {
  id: {
    initialize: (options: {
      client_id: string
      callback: (response: GoogleCredentialResponse) => void
      cancel_on_tap_outside?: boolean
      ux_mode?: 'popup' | 'redirect'
    }) => void
    prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void
  }
}

declare global {
  interface Window {
    google?: {
      accounts: GoogleAccounts
    }
  }
}

let loadingScript: Promise<void> | null = null

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (loadingScript) return loadingScript

  loadingScript = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Google sign in script failed to load.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Google sign in script failed to load.'))
    document.head.appendChild(script)
  })

  return loadingScript
}

export async function getGoogleIdToken(): Promise<string> {
  await loadGoogleIdentityScript()

  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      reject(new Error('Google sign in is unavailable. Please try again.'))
      return
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: false,
      ux_mode: 'popup',
      callback: (response) => {
        if (response.credential) {
          resolve(response.credential)
          return
        }

        reject(new Error('Google did not return a sign in token.'))
      },
    })

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error('Google sign in popup was closed or blocked. Please try again.'))
      }
    })
  })
}
