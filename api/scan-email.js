// Vercel Serverless (Edge) - E-posta taraması
// Env: HIBP_API_KEY, LEAKCHECK_API_KEY

export const config = { runtime: 'edge' };

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
    },
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return jsonResponse(200, { ok: true });
  if (req.method !== 'POST') return jsonResponse(405, { error: 'Only POST' });

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: 'Body JSON olmalı' });
  }

  const email = (body?.email || '').toString().trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return jsonResponse(400, { error: 'Geçersiz e‑posta' });
  }

  const HIBP = process.env.HIBP_API_KEY;
  const LEAK = process.env.LEAKCHECK_API_KEY;

  try {
    // HIBP (demo amaçlı skeleton – gerçek istek için kendi key’ine göre endpointini ekleyeceğiz)
    const hibp = { count: 0, breaches: [] };

    // LeakCheck (örnek istek; gerçek endpoint için kendi planına göre güncellenecek)
    const leak = { total: 0 };

    return jsonResponse(200, {
      email,
      hibp,
      leakcheck: leak,
      scannedAt: new Date().toISOString(),
    });
  } catch (e) {
    return jsonResponse(502, { error: 'Upstream', detail: String(e) });
  }
}
