import { useEffect } from 'react'; import { useRouter } from 'next/router'; import Script from 'next/script';
import ModeBadge from '@/components/ModeBadge'; import { useScanStore } from '@/lib/state';
export default function Result(){ const {data}=useScanStore(); const r=useRouter(); useEffect(()=>{ if(!data) r.replace('/'); },[data,r]);
function downloadPDF(){ const el=document.getElementById('report'); const w=window as any; if(!w.html2pdf || !el) return;
w.html2pdf().set({margin:10,filename:'ghostify-raporu.pdf',image:{type:'jpeg',quality:.98},html2canvas:{scale:2},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(el).save(); }
function copyDeletion(){ if(!data) return; const names=(data.breaches||[]).map(b=>b.name).join(', ');
const text=`Konu: Kişisel Verilerin Silinmesi Talebi — GDPR/KVKK

Merhaba,

Tarafınıza ait hizmetlerde hesabımla ilişkilendirilen kişisel verilerimin (e‑posta, kullanıcı adı vb.) ${names} gibi sızıntılarda görüldüğü tespit edilmiştir. GDPR md.17 ve KVKK md.11 uyarınca kişisel verilerimin silinmesini ve işlemenin durdurulmasını talep ediyorum.

Hesap e‑postam: ${data?.email}
Referans: Ghostify tarama raporu

Gereğini rica ederim.`; navigator.clipboard.writeText(text); alert('Silme talebi kopyalandı.'); }
if(!data) return null;
return(<main className='min-h-screen flex flex-col items-center px-6 py-10'>
<ModeBadge mode={data.mode==='live'?'live':'demo'}/>
<Script src='https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js' strategy='afterInteractive'/>
<div id='report' className='max-w-3xl w-full space-y-8'>
  <div className='flex items-center gap-4'>
    <div className='w-12 h-12 rounded-xl border border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center'>👻</div>
    <div><h1 className='text-2xl font-bold'>DİJİTAL İZ RAPORUNUZ HAZIR</h1><div className='text-sm opacity-80'>Ghostify • {data.mode==='live'?'CANLI':'DEMO'}</div></div>
  </div>
  <div className='card'><div className='text-sm opacity-80'>RİSK SKORU</div><div className='text-5xl font-extrabold text-cyan-300'>{data.score}</div></div>
  <div className='grid md:grid-cols-3 gap-5'>
    <div className='card'><div className='opacity-80'>E‑posta</div><div className='text-3xl font-bold'>{data.counts.email}</div></div>
    <div className='card'><div className='opacity-80'>Sosyal Medya</div><div className='text-3xl font-bold'>{data.counts.social}</div></div>
    <div className='card'><div className='opacity-80'>Dark Web</div><div className='text-3xl font-bold'>{data.counts.dark}</div></div>
  </div>
  <div className='card'><div className='text-lg font-semibold mb-3'>Bulunan İhlaller</div>
    <ul className='space-y-2'>{data.breaches.map((b,i)=>(<li key={i} className='flex justify-between border-b border-white/10 py-2'><span>{b.name}</span><span className='opacity-70'>{b.date||''}</span></li>))}</ul>
  </div>
</div>
<div className='mt-8 flex gap-4'><button className='btn-primary' onClick={downloadPDF}>PDF İndir</button><button className='btn-primary' onClick={copyDeletion}>Silme Talebini Kopyala</button></div>
</main>);}
