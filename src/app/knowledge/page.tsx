import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, ShieldCheck } from 'lucide-react'

const guides = [
  {
    title: 'GST invoice basics',
    description: 'Understand what details a GST invoice should include before you send it to a client.',
    icon: FileText,
  },
  {
    title: 'CGST, SGST, and IGST',
    description: 'Learn when same-state and different-state GST calculations apply.',
    icon: BookOpen,
  },
  {
    title: 'Safe invoice sharing',
    description: 'Simple tips for sharing invoice links and keeping client information private.',
    icon: ShieldCheck,
  },
]

export default function KnowledgePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 mb-10">
          <ArrowLeft className="w-4 h-4" />
          Back to BillBook.in
        </Link>

        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-5">
            <BookOpen className="w-4 h-4" />
            Knowledge Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Learn billing, GST, and invoice basics
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Short, simple guides for freelancers and small businesses using BillBook.in.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-5">
          {guides.map((guide) => (
            <article key={guide.title} className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <guide.icon className="w-5 h-5" />
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">{guide.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{guide.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
