const { z } = require('zod');

async function scan(email) {
  // HIBP
  let hibpCount = 0;
  let hibpBreaches = [];
  try {
    const r = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`, {
      headers: {
        'User-Agent': 'GhostifyTarama/1.0 (contact: support@ghostifyhq.com)',
        'hibp-api-key': process.env.HIBP_API_KEY
      }
    });
    if (r.status === 200) {
      const arr = await r.json();
      hibpCount = Array.isArray(arr) ? arr.length : 0;
      hibpBreaches = (Array.isArray(arr) ? arr : []).map(b => b.Name || b.name).slice(0,50);
    } else if (r.status === 404) {
      hibpCount = 0;
    } else {
      await r.text(); // consume
    }
  } catch(e) { /* soft-fail */ }

  // LeakCheck
  let leakTotal = 0;
  try {
    const url = new URL('https://leakcheck.io/api');
    url.searchParams.set('key', process.env.LEAKCHECK_API_KEY);
    url.searchParams.set('check', 'mail');
    url.searchParams.set('value', email);
    const lr = await fetch(url, { method: 'GET' });
    const ljson = await lr.json().catch(() => ({}));
    if (ljson && typeof ljson.total === 'number') leakTotal = ljson.total;
  } catch(e) { /* soft-fail */ }

  return {
    email,
    hibp: { count: hibpCount, breaches: hibpBreaches },
    leakcheck: { total: leakTotal },
    scannedAt: new Date().toISOString()
  };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST' }); return;
  }
  try {
    let body = {}
    try { body = req.body || {}; } catch(_) {}
    const Schema = z.object({ email: z.string().email() });
    const parsed = Schema.safeParse(body);
    if (!parsed.success) { res.status(400).json({ error: 'Geçersiz e‑posta' }); return; }
    const out = await scan(parsed.data.email);
    res.json(out);
  } catch (e) {
    res.status(502).json({ error: 'Upstream', detail: String(e.message||e) });
  }
};