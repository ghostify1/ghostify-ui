import RiskGauge from '@/components/RiskGauge';
import Link from 'next/link';
import { breaches } from '@/lib/mock';

export default function Results(){
  return (
    <div className="min-h-screen bg-matrix">
      <div className="container py-10">
        <h1 className="text-4xl font-extrabold mb-2">Dijital İz Raporunuz</h1>
        <p className="text-white/60 mb-6">Ghostify • CANLI</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6"><RiskGauge score={72}/><div className="text-center font-bold">ORTA RİSK</div></div>
          <div className="card p-6">
            <div className="font-semibold mb-3">En çok sızıntı yaşanan platformlar</div>
            <ul className="space-y-2">
              {['Yahoo','Facebook','LinkedIn','Adobe'].map((n,i)=>(
                <li key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="badge">{n[0]}</span>{n}</div>
                  <div className="text-white/70">{[3.2,2.5,1.8,1.5][i]}M</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 grid grid-cols-2 gap-4">
            {[['E-posta',3],['Sosyal Medya',7],['Dark Web',5],['IP/Adres',1]].map((x,i)=>(
              <div key={i} className="card p-4 text-center">
                <div className="text-white/60 text-sm">{x[0]}</div>
                <div className="text-3xl font-extrabold">{x[1]}</div>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <div className="font-semibold mb-3">Güvenli Siteler (Onaylı)</div>
            <div className="flex flex-wrap gap-3">
              {['1Password','Proton Mail','NordVPN','Norda'].map((n,i)=>(<span key={i} className="badge">{n}</span>))}
            </div>
          </div>
          <div className="card p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Bulunan İhlaller</div>
              <Link href="/breaches" className="link">Tümünü Gör</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {breaches.map(b=>(
                <div key={b.id} className="card p-4">
                  <div className="text-white/80 font-semibold">{b.source}</div>
                  <div className="text-sm text-white/60">{b.year} • {b.type}</div>
                  <div className="mt-2"><span className="badge">Kayıt: {b.records}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <a className="card px-4 py-3" href="#">PDF indir</a>
          <Link className="btn" href="/deletion/start">Silme Talebini Başlat</Link>
        </div>
      </div>
    </div>
  )
}
