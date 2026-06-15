export type Plan = 'free' | 'starter' | 'pro'

export interface Business {
  id: string
  user_id: string
  name: string
  gstin?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  phone?: string
  email?: string
  logo_url?: string
  created_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  gstin?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  created_at: string
}

export interface InvoiceItem {
  id?: string
  invoice_id?: string
  description: string
  hsn_sac?: string
  quantity: number
  rate: number
  gst_rate: number
  amount: number
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

export interface Invoice {
  id: string
  public_id: string
  user_id: string
  client_id?: string
  invoice_number: string
  invoice_date: string
  due_date?: string
  status: InvoiceStatus
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  total: number
  notes?: string
  created_at: string
  updated_at: string
  clients?: Client
  invoice_items?: InvoiceItem[]
}

export interface Subscription {
  id: string
  user_id: string
  plan: Plan
  razorpay_payment_id?: string
  razorpay_order_id?: string
  valid_until?: string
  created_at: string
  updated_at: string
}

export const PLAN_LIMITS = {
  free: { invoices: 5, clients: 3 },
  starter: { invoices: Infinity, clients: 10 },
  pro: { invoices: Infinity, clients: Infinity },
}

export const PLANS = [
  {
    id: 'free' as Plan,
    name: 'Free',
    price: 0,
    features: [
      '5 invoices per month',
      '3 clients',
      'PDF download',
      'Basic dashboard',
    ],
  },
  {
    id: 'starter' as Plan,
    name: 'Starter',
    price: 149,
    features: [
      'Unlimited invoices',
      '10 clients',
      'Custom logo on invoices',
      'Invoice status tracking',
      'Email invoice to client',
    ],
  },
  {
    id: 'pro' as Plan,
    name: 'Pro',
    price: 349,
    features: [
      'Everything in Starter',
      'Unlimited clients',
      'Recurring invoices',
      'CSV export',
      'Priority support',
    ],
  },
]

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]
