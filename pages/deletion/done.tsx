import Link from 'next/link';
export default function Done(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-xl card p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">Silme Talebi Oluşturuldu</h1>
        <p className="text-white/70 mb-6">Gelişmeleri e‑posta ve bildirimlerle ileteceğiz.</p>
        <Link href="/dashboard" className="btn w-full">Dashboard’a Dön</Link>
      </div>
    </div>
  )
}
