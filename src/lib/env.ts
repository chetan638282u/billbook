export const PRODUCTION_APP_URL = 'https://billbook-ten.vercel.app'

const PLACEHOLDER_VALUES = new Set([
  'your_service_role_key',
  'your_razorpay_secret',
  'your_razorpay_key_id',
])

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_APP_URL
}

export function requireServerEnv(name: string) {
  const value = process.env[name]

  if (!value || PLACEHOLDER_VALUES.has(value)) {
    throw new Error(`Missing required server environment variable: ${name}`)
  }

  return value
}
