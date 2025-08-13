/**
 * Ghostify Tarama - Local/Render Node server
 * Serves static UI and exposes POST /api/scan-email
 */
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function scanEmailLogic(email) {
  const headers = {
    'User-Agent': 'GhostifyTarama/1.0 (contact: support@ghostifyhq.com)',
    'hibp-api-key': process.env.HIBP_API_KEY
  };

  // HIBP
  let hibpCount = 0;
  let hibpBreaches = [];
  try {
    const hibpRes = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`, {
      headers
    });
    if (hibpRes.status === 200) {
      const data = await hibpRes.json();
      hibpCount = Array.isArray(data) ? data.length : 0;
      hibpBreaches = (Array.isArray(data) ? data : []).map(b => b.Name || b.name).slice(0, 50);
    } else if (hibpRes.status === 404) {
      hibpCount = 0;
    } else {
      const txt = await hibpRes.text();
      throw new Error(`HIBP upstream {status:${hibpRes.status}} ${txt.slice(0,200)}`);
    }
  } catch (e) {
    // soft-fail
  }

  // LeakCheck
  let lcTotal = 0;
  try {
    const url = new URL('https://leakcheck.io/api');
    url.searchParams.set('key', process.env.LEAKCHECK_API_KEY);
    url.searchParams.set('check', 'mail');
    url.searchParams.set('value', email);
    const lcRes = await fetch(url, { method: 'GET' });
    const lcJson = await lcRes.json().catch(() => ({}));
    if (lcJson && typeof lcJson.total === 'number') lcTotal = lcJson.total;
  } catch (e) {
    // soft-fail
  }

  return {
    email,
    hibp: { count: hibpCount, breaches: hibpBreaches },
    leakcheck: { total: lcTotal },
    scannedAt: new Date().toISOString()
  };
}

app.post('/api/scan-email', async (req, res) => {
  try {
    const email = (req.body && req.body.email || '').toString().trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Geçersiz e‑posta' });
    const result = await scanEmailLogic(email);
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: 'Upstream', detail: String(e.message||e) });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Ghostify Tarama lokal ayakta:', port));