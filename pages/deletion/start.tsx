import Link from 'next/link';

export default function Start(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-2xl card p-8">
        <h1 className="text-3xl font-bold mb-2">Silme Talebi Sihirbazı</h1>
        <p className="text-white/70 mb-6">Hangi platformlardan veri kaldıracağınızı seçin.</p>
        <div className="grid md:grid-cols-3 gap-4">
          {['LinkedIn','Instagram','Amazon','Spotify','Google','Apple'].map((n,i)=>(
            <label key={i} className="card p-4 flex items-center gap-3 cursor-pointer">
              <input type="checkbox"/><span>{n}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Link href="/results" className="badge">Geri</Link>
          <Link href="/deletion/preview" className="btn">Devam</Link>
        </div>
      </div>
    </div>
  )
}
