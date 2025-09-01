import Link from 'next/link';
import { platforms } from '@/lib/mock';

export default function Scan(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-4xl card p-8">
        <div className="text-center mb-6">
          <div className="w-24 h-24 mx-auto rounded-full glow flex items-center justify-center">
            <span className="text-4xl">👻</span>
          </div>
          <h1 className="text-3xl font-bold mt-4">Dijital izlerin taranıyor…</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {platforms.map(p=>(
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className={`text-sm ${p.level==='danger'?'text-red-400':'text-white/60'}`}>{p.status}</div>
              </div>
              <div className="badge">⏳</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Link href="/results" className="btn">Sonuçlara Git</Link>
        </div>
      </div>
    </div>
  )
}
