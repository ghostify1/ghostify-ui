import Link from 'next/link';

export default function InputInfo(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-2xl card p-8">
        <h1 className="text-3xl font-bold mb-6">Tarama için bilgilerini gir</h1>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="E-posta adreslerin"/>
          <input className="input" placeholder="Kullanıcı adların"/>
          <input className="input" placeholder="Telefon"/>
          <input className="input" placeholder="IP / Adres"/>
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/scan" className="btn">Taramayı Başlat</Link>
          <a className="badge" href="#">Örnek .csv indir</a>
        </div>
      </div>
    </div>
  )
}
