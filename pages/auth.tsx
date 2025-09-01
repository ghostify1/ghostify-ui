import { useState } from 'react';
import Link from 'next/link';

export default function Auth(){
  const [tab,setTab]=useState<'login'|'register'>('login');
  return (
    <div className="min-h-screen bg-matrix flex items-center justify-center">
      <div className="w-full max-w-xl card p-8">
        <div className="text-center mb-6">
          <img src="/ghostify-logo.png" className="w-14 h-14 mx-auto" alt="Ghostify"/>
          <h1 className="text-3xl font-extrabold mt-2 tracking-wide">GHOSTIFY</h1>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setTab('login')} className={`tab ${tab==='login'?'tab-active':''}`}>Giriş Yap</button>
          <button onClick={()=>setTab('register')} className={`tab ${tab==='register'?'tab-active':''}`}>Kayıt Ol</button>
        </div>
        {tab==='login'?(
          <div className="space-y-3">
            <input className="input" placeholder="email@ornek.com"/>
            <input className="input" type="password" placeholder="••••••••"/>
            <div className="text-right"><a className="link" href="#">Şifremi unuttum</a></div>
            <button className="btn w-full">Giriş Yap</button>
            <div className="text-center text-white/50">— ya da —</div>
            <button className="w-full card py-3"> Apple ile Devam Et</button>
            <button className="w-full card py-3">G Google ile Devam Et</button>
          </div>
        ):(
          <div className="space-y-3">
            <input className="input" placeholder="Davet Kodu"/>
            <input className="input" placeholder="İsim"/>
            <input className="input" placeholder="E-posta"/>
            <input className="input" type="password" placeholder="Şifre"/>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox"/> KVKK ve Gizlilik Politikasını kabul ediyorum.
            </label>
            <button className="btn w-full">Kayıt Ol</button>
          </div>
        )}
        <div className="mt-6 text-center text-white/60">Zaten hesabın var mı? <Link className="link" href="#" onClick={()=>setTab('login')}>Giriş Yap</Link></div>
      </div>
    </div>
  )
}
