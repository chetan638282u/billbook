export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function generateInvoiceNumber(nextSeq: number): string {
  const year = new Date().getFullYear()
  const num = String(nextSeq).padStart(4, '0')
  return `INV-${year}-${num}`
}

export function calculateTotals(
  items: { quantity: number; rate: number; gst_rate: number }[],
  isSameState: boolean
) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const totalGst = items.reduce(
    (sum, item) => sum + (item.quantity * item.rate * item.gst_rate) / 100,
    0
  )
  return {
    subtotal,
    cgst: isSameState ? totalGst / 2 : 0,
    sgst: isSameState ? totalGst / 2 : 0,
    igst: !isSameState ? totalGst : 0,
    total: subtotal + totalGst,
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'sent': return 'bg-blue-100 text-blue-800'
    case 'overdue': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'paid': return 'Paid'
    case 'sent': return 'Sent'
    case 'overdue': return 'Overdue'
    default: return 'Draft'
  }
}
