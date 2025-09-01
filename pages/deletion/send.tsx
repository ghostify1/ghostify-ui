import Link from 'next/link';
export default function Send(){
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-xl card p-8 text-center">
        <div className="text-5xl mb-4">📤</div>
        <h1 className="text-3xl font-bold mb-2">Talepler Gönderildi</h1>
        <p className="text-white/70 mb-6">Yanıt süreleri platforma göre 7–30 gün değişebilir. İlerlemeyi “Silme Taleplerim” ekranından takip edebilirsiniz.</p>
        <Link href="/deletion/done" className="btn w-full">Tamam</Link>
      </div>
    </div>
  )
}
