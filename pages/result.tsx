import { useEffect, useState } from "react";
import ModeBadge from "@/components/ModeBadge";
import Gauge from "@/components/Gauge";
import { loadScan } from "@/lib/state";
import Script from "next/script";

type Scan = ReturnType<typeof loadScan>;

export default function Result(){
  const [data,setData]=useState<Scan>(null);
  useEffect(()=>{ setData(loadScan()); },[]);

  function copyDeletion(){
    if(!data) return;
    const names=(data.breaches||[]).map(b=>b.Name).join(", ")||"—";
    const text=`Konu: Kişisel Verilerin Silinmesi Talebi – GDPR/KVKK\n\nMerhaba,\n\n${data.email} adresimle ilişkilendirilmiş kişisel verilerimin ilgili mevzuat kapsamında silinmesini talep ediyorum.\nİhlal görülen kaynak(lar): ${names}\n\nİyi çalışmalar,\n${data.email}`;
    navigator.clipboard.writeText(text); alert("Silme talebi kopyalandı.");
  }
  function downloadPDF(){
  const el = document.getElementById("report");
  // TypeScript'e "bunu any kabul et" diyerek uyarıyı kaldırıyoruz
  const w = window as any;
  if (!w.html2pdf || !el) return;
  w.html2pdf()
    .set({
      margin: 10,
      filename: "ghostify-raporu.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(el)
    .save();
  }

  if(!data){ return <main className="min-h-full flex items-center justify-center"><p className="text-cyan-100">Veri bulunamadı. Yeniden deneyin.</p></main> }

  const categories=[
    {label:"E-posta",count:(data.breaches||[]).length>=1?2:0},
    {label:"Sosyal Medya",count:(data.breaches||[]).length>=2?1:0},
    {label:"Dark Web",count:Math.max(0,(data.breaches||[]).length-1)},
  ];

  return (<main className="min-h-full flex flex-col items-center justify-center px-6">
    <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="afterInteractive"/>
    <ModeBadge mode={data.mode}/>
    <section id="report" className="card p-8 max-w-3xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <img src="/ghostify-logo.png" alt="Ghostify" className="w-10 h-10"/>
        <div><div className="font-orbitron tracking-widest text-cyan-300">GHOSTIFY</div><div className="text-sm text-cyan-100/70">DİJİTAL İZ RAPORU</div></div>
      </div>
      <h1 className="text-3xl text-cyan-200 mb-4">Dijital İz Raporunuz Hazır</h1>
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <Gauge value={data.risk_score||0}/>
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {categories.map((c,i)=>(<div key={i} className="card p-4 text-center">
            <div className="text-cyan-200">{c.label}</div>
            <div className="text-3xl font-orbitron">{c.count}</div>
          </div>))}
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-cyan-400/30 mb-6">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-cyan-200"><tr><th className="text-left p-3">Platform</th><th className="text-left p-3">Alan</th><th className="text-left p-3">Tarih</th><th className="text-left p-3">Tür</th></tr></thead>
          <tbody>
            {(data.breaches||[]).map((b,idx)=>(<tr key={idx} className="border-t border-white/10">
              <td className="p-3">{b.Name||"—"}</td><td className="p-3">{b.Domain||"—"}</td><td className="p-3">{b.BreachDate||"—"}</td><td className="p-3">{b.IsSensitive?"Hassas":"Genel"}</td>
            </tr>))}
            {(data.breaches||[]).length===0 && (<tr><td className="p-3" colSpan={4}>İhlal bulunamadı.</td></tr>)}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button onClick={downloadPDF} className="badge bg-emerald-300/30 border-emerald-400/60 text-emerald-100 px-4 py-2">PDF İndir</button>
        <button onClick={copyDeletion} className="badge bg-cyan-300/30 border-cyan-400/60 text-cyan-100 px-4 py-2">Hemen Silme Talebi Başlat</button>
      </div>
    </section>
  </main>)
}
