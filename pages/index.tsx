import { useState } from 'react'; import { useRouter } from 'next/router'; import Image from 'next/image'; 
import NavLogo from '@/components/NavLogo';
export default function Home(){ const r=useRouter(); const [email,setEmail]=useState('');
return(<main className='min-h-screen flex flex-col items-center justify-center px-6 text-center'>
<NavLogo/>
<div className='max-w-xl w-full space-y-7'>
  <div className='flex flex-col items-center gap-5'>
    <div className='w-28 h-28 relative'><Image src='/ghostify-logo.png' alt='Ghostify' fill priority sizes='112px' style={{objectFit:'contain'}}/></div>
    <h1 className='text-6xl font-extrabold text-cyan-300 hero-title'>GHOSTIFY</h1>
    <p className='text-lg opacity-85'>Dijital izlerini sil. Şimdi başla.</p>
  </div>
  <div className='flex gap-3 w-full'>
    <input className='input flex-1' placeholder='email@ornek.com' value={email} onChange={e=>setEmail(e.target.value)}/>
    <button className='btn-primary' onClick={()=>{ if(email) r.push(`/scan?email=${encodeURIComponent(email)}`); }}>Taramayı Başlat</button>
  </div>
</div>
</main>);}
