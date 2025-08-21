import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ModeBadge from "@/components/ModeBadge";
import { saveScan } from "@/lib/state";

type Brand={name:string,status:"active"|"scanning"|"breach"|"safe"};
const initialBrands:Brand[]=[
  {name:"Apple",status:"scanning"},{name:"Google",status:"scanning"},{name:"Spotify",status:"scanning"},
  {name:"Instagram",status:"scanning"},{name:"TikTok",status:"scanning"},{name:"Amazon",status:"scanning"},
];

function demoData(email:string){
  const catalog=[
    {Name:"LinkedIn",Domain:"linkedin.com",BreachDate:"2012-06-01",IsSensitive:true,Source:"HIBP"},
    {Name:"Dropbox",Domain:"dropbox.com",BreachDate:"2012-07-01",IsSensitive:false,Source:"HIBP"},
    {Name:"Adobe",Domain:"adobe.com",BreachDate:"2013-10-01",IsSensitive:true,Source:"HIBP"}
  ];
  const items=catalog.slice(0,Math.floor(Math.random()*3)+1);
  const score=Math.min(100,20*items.length+Math.floor(Math.random()*30)+30);
  return {mode:"demo",source:"HIBP+LeakCheck",breaches:items,risk_score:score,email};
}

export default function Scan(){
  const r=useRouter();
  const email=useMemo(()=> String(r.query.email||""),[r.query.email]);
  const [mode,setMode]=useState<"demo"|"live">("demo");
  const [brands,setBrands]=useState<Brand[]>(initialBrands);

  useEffect(()=>{
    if(!email) return;
    let step=0; const id=setInterval(()=>{
      setBrands(prev=> prev.map((b,i)=> i<=step ? (i===2?{...b,status:"breach"}:{...b,status:"safe"}) : b));
      step++; if(step>5) clearInterval(id);
    },350); return ()=> clearInterval(id);
  },[email]);

  useEffect(()=>{
    if(!email) return;
    (async()=>{
      try{
        const res=await fetch(`/api/scan?email=${encodeURIComponent(email)}`);
        if(res.ok){ const data=await res.json(); setMode((data.mode||"demo")); saveScan({...data,email}); }
        else{ saveScan(demoData(email)); }
      }catch{ saveScan(demoData(email)); } finally{ setTimeout(()=> r.push("/result"),1500); }
    })();
  },[email,r]);

  return (<main className="min-h-full flex flex-col items-center justify-center px-6 text-center">
    <ModeBadge mode={mode}/>
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <Image src="/ghostify-logo.png" alt="Ghostify" width={120} height={120} priority/>
        <div className="absolute inset-0 rounded-full blur-2xl bg-cyan-400/20 animate-pulse"/>
      </div>
      <h2 className="text-cyan-200 text-2xl">Dijital izlerin taranıyor...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-2">
        {brands.map((b,idx)=>(
          <div key={idx} className="card px-5 py-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-lg">{b.name}</span>
              <span className={`badge ${b.status==="breach"?"bg-rose-400/30 border-rose-400/60 text-rose-100":b.status==="safe"?"bg-emerald-300/30 border-emerald-300 text-emerald-100":"bg-zinc-300/20 border-zinc-400/60 text-zinc-200"}`}>
                {b.status==="breach"?"Sızıntı tespit edildi":b.status==="safe"?"Güvenli":"Aranıyor"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </main>)
}
