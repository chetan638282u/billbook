import Link from 'next/link'
import { FileText } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/dashboard" className="btn-primary">Go to Dashboard</Link>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </div>
  )
}
