'use client'
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm text-blue-600 hover:underline"
    >
      🖨️ Print or save as PDF
    </button>
  )
}
