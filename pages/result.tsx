import { useEffect } from 'react'; import { useRouter } from 'next/router'; import Script from 'next/script';
import NavLogo from '@/components/NavLogo'; import Gauge from '@/components/Gauge'; import { useScanStore } from '@/lib/state';
export default function Result(){ const {data}=useScanStore(); const r=useRouter(); useEffect(()=>{ if(!data) r.replace('/'); },[data,r]);
function downloadPDF(){ const el=document.getElementById('report'); const w=window as any; if(!w.html2pdf || !el) return;
w.html2pdf().set({margin:10,filename:'ghostify-raporu.pdf',image:{type:'jpeg',quality:.98},html2canvas:{scale:3,background:'#0B1115'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(el).save(); }
if(!data) return null;
return(<main className='min-h-screen flex flex-col items-center px-6 py-10'>
<NavLogo/>
<Script src='https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js' strategy='afterInteractive'/>
<div id='report' className='max-w-3xl w-full space-y-8'>
  <div className='flex items-center gap-4'>
    <div className='w-12 h-12 rounded-xl border border-cyan-400/50 bg-cyan-400/10 grid place-items-center'>👻</div>
    <div><h1 className='text-3xl font-extrabold'>DİJİTAL İZ RAPORUNUZ HAZIR</h1></div>
  </div>
  <div className='grid md:grid-cols-2 gap-8 items-center'>
    <Gauge score={data.score}/>
    <div className='space-y-3'>
      <div className='card'><div className='opacity-80'>E‑posta</div><div className='text-4xl font-extrabold'>{data.counts.email}</div></div>
      <div className='card'><div className='opacity-80'>Sosyal Medya</div><div className='text-4xl font-extrabold'>{data.counts.social}</div></div>
      <div className='card'><div className='opacity-80'>Dark Web</div><div className='text-4xl font-extrabold'>{data.counts.dark}</div></div>
    </div>
  </div>
  <div className='card'><div className='text-lg font-semibold mb-3'>Bulunan İhlaller</div>
    <ul className='space-y-2'>{data.breaches.map((b,i)=>(<li key={i} className='flex justify-between border-b border-white/10 py-2'><span>{b.name}</span><span className='opacity-70'>{b.date||''}</span></li>))}</ul>
  </div>
</div>
<div className='mt-8 flex gap-4'><button className='btn-primary' onClick={downloadPDF}>PDF İndir</button></div>
</main>);}
