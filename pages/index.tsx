import Link from 'next/link';

export default function Invite(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-xl card p-10 text-center">
        <img src="/ghostify-logo.png" className="w-16 h-16 mx-auto mb-4" alt="Ghostify"/>
        <h1 className="text-4xl font-extrabold text-brand mb-2">GHOSTIFY’A DAVETLİSİNİZ</h1>
        <p className="text-white/70 mb-8">Yalnızca davetiye ile giriş mümkündür.</p>
        <input className="input mb-4" placeholder="Davet Kodu"/>
        <Link href="/auth" className="btn w-full">Giriş Yap</Link>
        <p className="mt-6 text-white/60">Kodun yok mu? <a className="link" href="#">Bekleme listesine katıl</a></p>
      </div>
    </div>
  )
}
