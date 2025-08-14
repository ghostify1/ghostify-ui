// Vercel Serverless API – E‑posta taraması (HIBP + LeakCheck)
export const config = { runtime: 'edge' };

function json(status, data) {
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
  if (req.method === 'OPTIONS') return json(200, { ok: true });
  if (req.method !== 'POST')   return json(405, { error: 'Only POST' });

  let email;
  try {
    const body = await req.json();
    email = String(body?.email || '').trim().toLowerCase();
  } catch {
    return json(400, { error: 'Body JSON olmalı' });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) return json(400, { error: 'Geçersiz e‑posta' });

  // Demo/Canlı modu: env varsa canlı, yoksa demo
  const HIBP_KEY = process.env.HIBP_API_KEY || '';
  const LEAK_KEY = process.env.LEAKCHECK_API_KEY || '';

  const timeout = (ms) => new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms));
  const withTimeout = (p) => Promise.race([p, timeout(10_000)]);

  let hibp = { count: 0, breaches: [], raw: null };
  let leak = { total: 0, raw: null };

  try {
    if (HIBP_KEY) {
      // HIBP: https://haveibeenpwned.com/API/v3#BreachesForAccount
      const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`;
      const res = await withTimeout(fetch(url, {
        headers: {
          'hibp-api-key': HIBP_KEY,
          'user-agent': 'GhostifyAI/1.0',
          'Add-Padding': 'true'
        }
      }));
      if (res.status === 404) {
        hibp = { count: 0, breaches: [], raw: [] };
      } else if (res.ok) {
        const data = await res.json();
        hibp = { count: Array.isArray(data) ? data.length : 0, breaches: Array.isArray(data) ? data : [], raw: data };
      } else {
        hibp = { count: 0, breaches: [], raw: { error: `HIBP ${res.status}` } };
      }
    } else {
      // DEMO
      hibp = { count: 0, breaches: [], raw: [] };
    }
  } catch (e) {
    hibp = { count: 0, breaches: [], raw: { error: 'hibp_fail', detail: String(e) } };
  }

  try {
    if (LEAK_KEY) {
      // LeakCheck docs: https://leakcheck.io (örnek GET)
      const url = `https://leakcheck.net/api?key=${encodeURIComponent(LEAK_KEY)}&check=${encodeURIComponent(email)}&type=email`;
      const res = await withTimeout(fetch(url));
      const data = await res.json().catch(() => ({}));
      // Bazı planlarda sadece toplam/başlık döner
      const total = Number(data?.found || data?.total || 0);
      leak = { total: isNaN(total) ? 0 : total, raw: data };
    } else {
      // DEMO
      leak = { total: 0, raw: { success: false, error: 'Not found' } };
    }
  } catch (e) {
    leak = { total: 0, raw: { error: 'leak_fail', detail: String(e) } };
  }

  // Basit risk skoru (0–99)
  const base = hibp.count * 25 + leak.total * 5;
  const risk = Math.max(0, Math.min(99, base));

  return json(200, {
    email,
    risk,
    hibp,
    leakcheck: leak,
    scannedAt: new Date().toISOString()
  });
}
