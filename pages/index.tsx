import { useState } from 'react'; import { useRouter } from 'next/router'; import Image from 'next/image'; import ModeBadge from '@/components/ModeBadge';
export default function Home(){ const r=useRouter(); const [email,setEmail]=useState('');
return(<main className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
<ModeBadge mode={process.env.NEXT_PUBLIC_MODE==='live'?'live':'demo'}/>
<div className='max-w-xl w-full space-y-6'>
  <div className='flex flex-col items-center gap-3'>
    <Image src='/ghostify-logo.png' alt='Ghostify' width={120} height={120}/>
    <h1 className='text-5xl font-extrabold text-cyan-300 drop-shadow'>GHOSTIFY</h1>
    <p className='text-lg opacity-80'>Dijital izlerini sil. Şimdi başla.</p>
  </div>
  <div className='flex gap-3 w-full'>
    <input className='input flex-1' placeholder='email@ornek.com' value={email} onChange={e=>setEmail(e.target.value)}/>
    <button className='btn-primary' onClick={()=>{ if(email) r.push(`/scan?email=${encodeURIComponent(email)}`); }}>Taramayı Başlat</button>
  </div>
</div>
</main>);}
