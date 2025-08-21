import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import ModeBadge from "@/components/ModeBadge";

export default function Home(){
  const r=useRouter(); const [email,setEmail]=useState("");
  return (<main className="min-h-full flex flex-col items-center justify-center px-5">
    <ModeBadge mode="demo"/><div className="flex flex-col items-center gap-6 text-center">
      <Image src="/ghostify-logo.png" alt="Ghostify" width={128} height={128} priority/>
      <h1 className="font-orbitron text-5xl tracking-widest text-cyan-300 drop-shadow">GHOSTIFY</h1>
      <p className="text-cyan-100/90">Dijital izlerini sil. Şimdi başla.</p>
      <div className="w-full max-w-md">
        <div className="input">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="ornek@eposta.com"
                 className="flex-1 bg-transparent outline-none placeholder:text-cyan-200/50"/>
          <span className="text-cyan-300">✉️</span>
        </div>
        <button onClick={()=> email && r.push(`/scan?email=${encodeURIComponent(email)}`)} className="btn w-full mt-4">
          Taramayı Başlat
        </button>
      </div>
    </div></main>)
}
