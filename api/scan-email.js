// Vercel Edge Function - Email scan (HIBP + LeakCheck)
// Env: HIBP_API_KEY, LEAKCHECK_API_KEY
export const config = { runtime: 'edge' };

async function hibpLookup(email, key) {
  if (!key) return { count: 0, breaches: [], error: 'HIBP key missing' };
  try {
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`;
    const res = await fetch(url, {
      headers: {
        'hibp-api-key': key,
        'user-agent': 'Ghostify-MVP/1.2b (+https://ghostifyhq.com)',
    }});
    if (res.status === 404) return { count: 0, breaches: [] }; // not found == no breach
    if (!res.ok) {
      return { count: 0, breaches: [], error: `HIBP ${res.status}` };
    }
    const data = await res.json();
    return { count: Array.isArray(data) ? data.length : 0, breaches: Array.isArray(data) ? data : [] };
  } catch (e) {
    return { count: 0, breaches: [], error: String(e) };
  }
}

async function leakcheckLookup(email, key) {
  if (!key) return { total: 0, raw: { success: False, error: 'LeakCheck key missing' } };
  try {
    const url = `https://leakcheck.net/api?key=${encodeURIComponent(key)}&check=${encodeURIComponent(email)}&type=email&last=1`;
    const res = await fetch(url, { headers: { 'user-agent': 'Ghostify-MVP/1.2b' }});
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { total: 0, raw: data || { error: `LeakCheck ${res.status}` } };
    }
    // API returns { success: true, found: 0/1, sources: [...] } or similar
    let total = 0;
    if (typeof data.found === 'number') total = data.found;
    else if (Array.isArray(data.sources)) total = data.sources.length;
    return { total, raw: data };
  } catch (e) {
    return { total: 0, raw: { success: False, error: String(e) } };
  }
}

function jsonResponse(status, data){
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
    }
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return jsonResponse(200, { ok: true });
  if (req.method !== 'POST') return jsonResponse(405, { error: 'Only POST' });
  try {
    const body = await req.json();
    const email = (body && body.email || '').trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return jsonResponse(400, { error: 'Geçersiz e-posta' });
    }
    const [hibp, leak] = await Promise.all([
      hibpLookup(email, process.env.HIBP_API_KEY),
      leakcheckLookup(email, process.env.LEAKCHECK_API_KEY),
    ]);
    const risk = Math.min(100, (hibp.count * 15) + (leak.total * 10));
    return jsonResponse(200, {
      email,
      risk,
      hibp,
      leakcheck: leak,
      scannedAt: new Date().toISOString()
    });
  } catch (e) {
    return jsonResponse(500, { error: 'Upstream', detail: String(e) });
  }
}