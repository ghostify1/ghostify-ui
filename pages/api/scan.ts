import type { NextApiRequest, NextApiResponse } from "next";
type Breach={Name?:string;Domain?:string;BreachDate?:string;IsSensitive?:boolean;Source?:string};

async function fetchJSON(url:string, options:any={}){
  const ctrl=new AbortController(); const id=setTimeout(()=>ctrl.abort(),8000);
  try{ const res=await fetch(url,{...options,signal:ctrl.signal} as any);
    const text=await res.text(); let data:any=null; try{ data=text?JSON.parse(text):null }catch{ data=text }
    return {status:res.status,data}; } catch(err:any){ return {status:0,data:String(err)} } finally{ clearTimeout(id); }
}

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const email=String(req.query.email||""); if(!email) return res.status(400).json({error:"email_required"});
  let breaches:Breach[]=[]; let mode:"demo"|"live"="demo"; const sources:string[]=[];

  if(process.env.HIBP_API_KEY){
    const url=`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    const hibp=await fetchJSON(url,{headers:{"hibp-api-key":process.env.HIBP_API_KEY,"user-agent":"ghostify-premium/1.0"}});
    if(hibp.status===200 && Array.isArray(hibp.data)){ breaches=breaches.concat(hibp.data.map((b:any)=>({Name:b.Name,Domain:b.Domain,BreachDate:b.BreachDate,IsSensitive:!!b.IsSensitive,Source:"HIBP"}))); mode="live"; sources.push("HIBP"); }
    else if(hibp.status===404){ mode="live"; sources.push("HIBP"); }
  }

  if(process.env.LEAKCHECK_API_KEY){
    const base=process.env.LEAKCHECK_ENDPOINT||"https://leakcheck.io/api";
    const lc=await fetchJSON(`${base}?key=${encodeURIComponent(process.env.LEAKCHECK_API_KEY)}&check=${encodeURIComponent(email)}`);
    if(lc.status===200 && lc.data){
      let list:any[]=[]; if(Array.isArray(lc.data)) list=lc.data; else if(Array.isArray(lc.data?.result)) list=lc.data.result; else if(Array.isArray(lc.data?.results)) list=lc.data.results;
      if(list.length){ breaches=breaches.concat(list.map((r:any,i:number)=>({Name:r.name||r.source||r.site||`LeakCheck#${i+1}`,Domain:r.domain||r.site||"",BreachDate:r.date||r.time||"",IsSensitive:!!(r.password||r.hash),Source:"LeakCheck"}))); mode="live"; sources.push("LeakCheck"); }
      else { sources.push("LeakCheck"); }
    }
  }

  const seen=new Set<string>();
  breaches=breaches.filter(b=>{ const key=`${b.Name||""}|${b.Domain||""}`; if(seen.has(key)) return false; seen.add(key); return true; });
  const baseScore=breaches.length*18; const sens=breaches.reduce((a,b)=> a+(b.IsSensitive?12:0),0);
  const risk_score=Math.max(0,Math.min(100,baseScore+sens));

  if(mode==="demo") return res.status(204).end();
  res.status(200).json({mode,source:sources.join(" + ")||"—",breaches,risk_score});
}
