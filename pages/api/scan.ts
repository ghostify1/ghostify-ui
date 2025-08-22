import type { NextApiRequest, NextApiResponse } from 'next'; import type { ScanData, BreachItem } from '@/lib/state';
async function hibp(email:string):Promise<BreachItem[]>{ const key=process.env.HIBP_API_KEY; if(!key) return [];
  const url=`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
  const res=await fetch(url,{headers:{'hibp-api-key':key,'user-agent':'ghostify-mvp/1.0 (+github.com/ghostify)'}});
  if(res.status===404) return []; if(!res.ok) throw new Error(`HIBP ${res.status}`); const arr=await res.json();
  return (arr||[]).map((b:any)=>({name:`${b.Name} (${b.BreachDate?.slice(0,4)||''})`,domain:b.Domain,date:b.BreachDate,source:'hibp',category:'email'}));
}
async function leakcheck(email:string):Promise<BreachItem[]>{ const key=process.env.LEAKCHECK_API_KEY; const endpoint=process.env.LEAKCHECK_ENDPOINT||'https://leakcheck.io/api/search'; if(!key) return [];
  const url=`${endpoint}?key=${encodeURIComponent(key)}&type=email&query=${encodeURIComponent(email)}&limit=50`; const res=await fetch(url);
  if(!res.ok) throw new Error(`LeakCheck ${res.status}`); const json=await res.json(); if(!json || json.success===false) return [];
  const raw=json.result||json.results||json.data||[]; return (raw||[]).map((r:any)=>({name:r.source||r.database||'Leak',domain:r.domain||r.site||'',date:r.date||r.updated||'',source:'leakcheck',category:'dark'}));
}
const dedupe=(items:BreachItem[])=>{ const seen=new Set<string>(); const out:BreachItem[]=[]; for(const b of items){ const k=`${b.name}|${b.domain}|${b.date}`; if(!seen.has(k)){ seen.add(k); out.push(b); } } return out; };
const scoreFrom=(breaches:BreachItem[])=> Math.min(100, breaches.length*12 + (breaches.some(b=>b.category==='dark')?20:0));
export default async function handler(req:NextApiRequest,res:NextApiResponse<ScanData|any>){ const email=(req.query.email||'').toString().trim().toLowerCase(); if(!email || !email.includes('@')) return res.status(400).json({error:'invalid_email'});
  if(!process.env.HIBP_API_KEY){ const { makeDemoData } = await import('@/lib/state'); return res.status(200).json(makeDemoData(email)); }
  try{ const [a,b]=await Promise.allSettled([hibp(email),leakcheck(email)]); const hibpList=a.status==='fulfilled'?a.value:[]; const leakList=b.status==='fulfilled'?b.value:[];
    const merged=dedupe([...hibpList,...leakList]); const counts={email:merged.filter(b=>b.category==='email').length,social:merged.filter(b=>b.category==='social').length,dark:merged.filter(b=>b.category==='dark').length};
    const payload:ScanData={email,mode:'live',source:(hibpList.length&&leakList.length)?'combined':(hibpList.length?'hibp':(leakList.length?'leakcheck':'mock')),breaches:merged,counts,score:scoreFrom(merged)};
    return res.status(200).json(payload);
  }catch{ const { makeDemoData } = await import('@/lib/state'); return res.status(200).json(makeDemoData(email)); }
}
