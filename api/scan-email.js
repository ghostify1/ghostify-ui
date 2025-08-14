export const config = { runtime: 'edge' };

function json(status, data){
  return new Response(JSON.stringify(data,null,2), {
    status,
    headers:{
      'content-type':'application/json; charset=utf-8',
      'access-control-allow-origin':'*',
      'access-control-allow-methods':'POST, OPTIONS'
    }
  });
}

export default async function handler(req){
  if (req.method === 'OPTIONS') return json(200,{ok:true});
  if (req.method !== 'POST')  return json(405,{error:'Only POST'});

  let email='';
  try{
    const body = await req.json();
    email = String(body.email||'').trim();
    if(!email.includes('@')) throw new Error('invalid');
  }catch{
    return json(400,{error:'Body JSON olmalı ve email gerekli'});
  }

  const HIBP   = process.env.HIBP_API_KEY;
  const LCKEY  = process.env.LEAKCHECK_API_KEY;
  const UA     = 'ghostify-mvp/1.1 (+https://ghostifyhq.com)';

  async function hibp(){
    if(!HIBP) return {count:0,breaches:[],error:'NO_KEY'};
    const url = 'https://haveibeenpwned.com/api/v3/breachedaccount/'+encodeURIComponent(email)+'?truncateResponse=true';
    const r = await fetch(url,{headers:{'hibp-api-key':HIBP,'user-agent':UA}});
    if (r.status===404) return {count:0,breaches:[]};
    if (!r.ok)          return {count:0,breaches:[],error:'HIBP_'+r.status};
    const arr = await r.json();
    return {count:Array.isArray(arr)?arr.length:0,breaches:arr||[]};
  }

  async function leakcheck(){
    if(!LCKEY) return {total:0,error:'NO_KEY'};
    const url = 'https://leakcheck.io/api?key='+encodeURIComponent(LCKEY)+'&check='+encodeURIComponent(email)+'&type=email';
    const r = await fetch(url,{headers:{'user-agent':UA}});
    if (!r.ok) return {total:0,error:'LEAK_'+r.status};
    const data = await r.json().catch(()=>({}));
    return { total:Number(data.total ?? data.found ?? 0)||0, raw:data };
  }

  try{
    const [h,l] = await Promise.all([hibp(), leakcheck()]);
    return json(200,{ email, hibp:h, leakcheck:l, scannedAt:new Date().toISOString() });
  }catch(e){
    return json(502,{error:'Upstream', detail:String(e)});
  }
}
