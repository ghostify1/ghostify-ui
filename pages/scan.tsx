import { useEffect, useState } from 'react'; import { useRouter } from 'next/router';
import NavLogo from '@/components/NavLogo'; import { useScanStore, type ScanData } from '@/lib/state';
const order = ['Apple','Google','Spotify','Instagram','TikTok','Amazon'] as const;
export default function Scan(){ const r=useRouter(); const email= typeof r.query.email==='string'? r.query.email : ''; const saveScan=useScanStore(s=>s.saveScan);
const [idx,setIdx]=useState(0); const [status,setStatus]=useState('Aranıyor...');
useEffect(()=>{ if(!email){ r.replace('/'); return; } let cancelled=false;
(async()=>{
  const start=Date.now(); const timer=setInterval(()=>setIdx(i=>(i+1)%order.length),600);
  setTimeout(()=>setStatus('Sonuçlar hazırlanıyor...'), 2800);
  let data:ScanData|undefined; try{ const res=await fetch(`/api/scan?email=${encodeURIComponent(email)}`); if(res.ok) data=await res.json(); }catch{}
  if(!data){ data={email,mode:'demo',source:'mock',breaches:[],score:0,counts:{email:0,social:0,dark:0}}; }
  const elapsed=Date.now()-start; const min=5000; if(elapsed<min) await new Promise(res=>setTimeout(res,min-elapsed));
  if(cancelled) return; clearInterval(timer); saveScan(data); r.replace('/result');
})(); return()=>{ cancelled=true; }; },[email,r,saveScan]);
return(<main className='min-h-screen grid place-items-center px-6 text-center'>
<NavLogo/>
<div className='space-y-6'>
  <div className='text-3xl font-bold text-cyan-200'>Dijital izlerin taranıyor</div>
  <div className='text-lg opacity-80'>{status}</div>
  <div className='text-2xl font-semibold'>{order[idx]}</div>
</div>
</main>);}
