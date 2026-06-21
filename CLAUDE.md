# BillBook Project Context for Claude

Read this file before making changes to this repository.

This app is BillBook, a Next.js SaaS app for GST invoice generation for Indian businesses.

## Current Live Setup

- GitHub repository: https://github.com/chetan638282u/billbook
- Production app: https://billbook-ten.vercel.app
- Vercel project: `billbook` under `chetan638282us-projects`
- Production branch: `main`
- Latest redeploy trigger commit: `513ca5b Trigger Vercel redeploy`

The production deployment is working and Vercel shows it as Ready.

## Important Rule

Do not change the UI, app code, auth flow, or security behavior unless the user clearly asks for that specific change.

The user is not a coder, so explain problems and changes in simple language.

## Vercel Environment Variables

These variables are configured in Vercel. Do not remove or rename them.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

The Supabase URL uses the project base URL:

```text
https://olmffrrbmhtawbgxwnhf.supabase.co
```

Do not include `/rest/v1/` in `NEXT_PUBLIC_SUPABASE_URL`.

The production app URL is:

```text
https://billbook-ten.vercel.app
```

## Supabase Project

Supabase project ref:

```text
olmffrrbmhtawbgxwnhf
```

Supabase callback URL for OAuth:

```text
https://olmffrrbmhtawbgxwnhf.supabase.co/auth/v1/callback
```

Supabase Auth settings currently include:

- Email auth enabled
- Email confirmation enabled
- Google provider enabled
- Google Client ID and Client Secret are configured inside Supabase Auth Providers > Google

Do not expose or print Supabase service role keys, anon keys, Google client secrets, or other secrets in code or documentation.

## Google Login Setup

Google OAuth was created in Google Cloud for the BillBook app.

Authorized JavaScript origin:

```text
https://billbook-ten.vercel.app
```

Authorized redirect URI:

```text
https://olmffrrbmhtawbgxwnhf.supabase.co/auth/v1/callback
```

Testing result:

- Google login uses the official Google Identity button.
- Supabase signs in with the Google ID token through `signInWithIdToken`.
- The old `/auth/google` redirect route is locked and redirects to `/auth/signin` so it cannot start the older Supabase OAuth redirect flow.

If Google sign-in later shows a Google testing/consent warning, check the Google OAuth consent screen and test users before changing app code.

## Auth Code Notes

Google login was added to:

- `src/app/auth/signup/page.tsx`
- `src/app/auth/signin/page.tsx`

The current Google button flow uses:

```ts
supabase.auth.signInWithIdToken({
  provider: "google",
  token,
})
```

Email signup confirmation was updated so confirmation links return through:

```text
https://billbook-ten.vercel.app/auth/callback
```

The callback route is:

```text
src/app/auth/callback/route.ts
```

Preserve this callback flow unless the user specifically asks to change auth behavior.

## Deployment Notes

GitHub is connected to Vercel. Pushing to `main` triggers a production deployment.

If Vercel does not deploy after a code change, an empty commit can be used to trigger redeployment:

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

Only use that when a redeploy is actually needed.

## If Future Changes Are Made

After any important GitHub, Vercel, Supabase, or Google Cloud change, update this `CLAUDE.md` file so Claude can understand the current app state in future chats.

Recommended instruction to use in Claude:

```text
Read CLAUDE.md first, then help me with this app.
```
