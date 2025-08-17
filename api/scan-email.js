// Vercel Edge - E-posta taraması (HIBP + LeakCheck)
export const config = { runtime: 'edge' };

function json(status, data){
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'access-control-allow-origin':'*',
      'access-control-allow-methods':'POST, OPTIONS'
    }
  });
}

async function hibpBreaches(email, key){
  if(!key) return { count: 0, breaches: [], error: 'HIBP key missing' };
  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`;
  const res = await fetch(url, {
    headers:{
      'hibp-api-key': key,
      'user-agent':'ghostify-mvp/1.0'
    }
  });
  if(res.status === 404) return { count: 0, breaches: [] }; // bulunamadı => ihlal yok
  if(!res.ok) return { count: 0, breaches: [], error: `hibp ${res.status}` };
  const arr = await res.json();
  return { count: Array.isArray(arr)? arr.length : 0, breaches: Array.isArray(arr)? arr : [] };
}

async function leakcheck(email, key){
  if(!key) return { total: 0, raw:{success:false, error:'LeakCheck key missing'} };
  const url = `https://leakcheck.io/api?key=${encodeURIComponent(key)}&check=${encodeURIComponent(email)}`;
  const res = await fetch(url, { headers:{ 'user-agent':'ghostify-mvp/1.0' }});
  if(!res.ok) return { total: 0, raw:{success:false, error:`leak ${res.status}`} };
  const j = await res.json().catch(()=>({success:false}));
  // API döndürdüyse success:false ise total yoktur
  const total = typeof j?.found === 'number' ? j.found
              : typeof j?.total === 'number' ? j.total
              : 0;
  return { total, raw: j || {success:false} };
}

export default async function handler(req){
  if(req.method === 'OPTIONS') return json(200, { ok:true });
  if(req.method !== 'POST')   return json(405, { error:'Only POST' });

  let body;
  try{
    body = await req.json();
  }catch(e){ return json(400, { error:'Body JSON olmalı' }); }

  const email = (body?.email || '').trim();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error:'Geçersiz e‑posta' });

  try{
    const [hibp, leak] = await Promise.all([
      hibpBreaches(email, process.env.HIBP_API_KEY),
      leakcheck(email, process.env.LEAKCHECK_API_KEY)
    ]);
    return json(200, { email, hibp, leakcheck: leak, scannedAt: new Date().toISOString() });
  }catch(e){
    return json(502, { error:'Upstream', detail: String(e) });
  }
}
