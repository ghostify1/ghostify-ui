import Link from 'next/link';

export default function Preview(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-2xl card p-8">
        <h1 className="text-2xl font-bold mb-4">Talep Önizleme</h1>
        <div className="card p-4 mb-4">
          <div className="font-semibold mb-2">E-posta Metni</div>
          <pre className="whitespace-pre-wrap text-sm text-white/80">Konu: Kişisel Verilerin Silinmesi Talebi — GDPR/KVKK
Merhaba, aşağıda listelenen platformlarda bulunan kişisel verilerimin silinmesini talep ederim…</pre>
        </div>
        <div className="flex justify-end gap-3">
          <Link href="/deletion/start" className="badge">Geri</Link>
          <Link href="/deletion/send" className="btn">Gönder</Link>
        </div>
      </div>
    </div>
  )
}
