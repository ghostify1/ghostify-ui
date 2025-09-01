import Link from 'next/link';

export default function Dashboard(){
  return (
    <div className="min-h-screen bg-matrix container py-10">
      <h1 className="text-3xl font-extrabold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link className="card p-6" href="/results">Dijital İz Raporu</Link>
        <Link className="card p-6" href="/breaches">İhlaller</Link>
        <Link className="card p-6" href="/deletion/start">Silme Talep Sihirbazı</Link>
      </div>
    </div>
  )
}
