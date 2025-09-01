import { useRouter } from 'next/router';
export default function BreachDetail(){
  const r = useRouter();
  const { id } = r.query;
  return (
    <div className="min-h-screen bg-matrix container py-10">
      <h1 className="text-3xl font-extrabold mb-4">İhlal Detayı</h1>
      <div className="card p-6 space-y-3">
        <div><span className="badge">ID</span> {id}</div>
        <div className="text-white/70">Kaynak sistem: Örnek {id}</div>
        <div className="text-white/70">Etkilenen veri tipleri: e‑posta, şifre özeti…</div>
        <button className="btn">Silme Talebi Oluştur</button>
      </div>
    </div>
  )
}
