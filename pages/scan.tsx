import { useEffect, useState } from 'react'; import { useRouter } from 'next/router';
import ProviderCard from '@/components/ProviderCard'; import ModeBadge from '@/components/ModeBadge'; import { useScanStore, makeDemoData, ScanData } from '@/lib/state';
export default function Scan(){ const r=useRouter(); const email= typeof r.query.email==='string'? r.query.email : ''; const saveScan=useScanStore(s=>s.saveScan);
const [statuses,setStatuses]=useState<Record<string, any>>({Apple:'active',Google:'searching',Spotify:'breach',Instagram:'secure',TikTok:'secure',Amazon:'secure'});
useEffect(()=>{ if(!email){ r.replace('/'); return; } let cancelled=false; const timers:any[]=[];
timers.push(setTimeout(()=>setStatuses(s=>({...s,Google:'secure'})),1200)); timers.push(setTimeout(()=>setStatuses(s=>({...s,Spotify:'breach'})),1600));
(async()=>{ try{ const res=await fetch(`/api/scan?email=${encodeURIComponent(email)}`);
if(res.ok){ const data:ScanData=await res.json(); if(!cancelled){ saveScan(data); r.replace('/result'); } }
else{ if(!cancelled){ saveScan(makeDemoData(email)); r.replace('/result'); } } }catch(e){ if(!cancelled){ saveScan(makeDemoData(email)); r.replace('/result'); } } })();
return()=>{ cancelled=true; timers.forEach(clearTimeout); }; },[email,r,saveScan]);
return(<main className='min-h-screen flex flex-col items-center justify-center px-6'>
<ModeBadge mode={process.env.NEXT_PUBLIC_MODE==='live'?'live':'demo'}/>
<div className='max-w-3xl w-full'>
  <div className='flex flex-col items-center gap-8 mb-8'>
    <div className='rounded-full w-36 h-36 flex items-center justify-center border border-cyan-400/50 bg-cyan-400/10 shadow-neon'><span className='text-5xl'>👻</span></div>
    <h2 className='text-3xl font-bold text-cyan-200'>Dijital izlerin taranıyor...</h2>
  </div>
  <div className='grid md:grid-cols-2 gap-5'>
    <ProviderCard name='Apple' status={statuses.Apple}/>
    <ProviderCard name='Google' status={statuses.Google}/>
    <ProviderCard name='Spotify' status={statuses.Spotify}/>
    <ProviderCard name='Instagram' status={statuses.Instagram}/>
    <ProviderCard name='TikTok' status={statuses.TikTok}/>
    <ProviderCard name='Amazon' status={statuses.Amazon}/>
  </div>
</div>
</main>);}
