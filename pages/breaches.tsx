import Link from 'next/link';
import { breaches } from '@/lib/mock';

export default function Breaches(){
  return (
    <div className="min-h-screen bg-matrix container py-10">
      <h1 className="text-3xl font-extrabold mb-6">İhlal Kayıtları</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {breaches.map(b=>(
          <Link key={b.id} href={`/breach/${b.id}`} className="card p-4 hover:border-brand/50">
            <div className="text-lg font-semibold">{b.source}</div>
            <div className="text-sm text-white/60">{b.year} • {b.type}</div>
            <div className="mt-2 text-white/70">Kayıt: {b.records}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
