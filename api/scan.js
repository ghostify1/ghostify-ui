// Vercel Serverless Function – REAL HIBP integration when HIBP_API_KEY is set.
export default async function handler(req, res){
  const { email } = req.query;
  if(!email) return res.status(400).json({ error:'email_required' });

  const HIBP_KEY = process.env.HIBP_API_KEY;
  if(!HIBP_KEY){
    // No key -> front-end will fall back to DEMO
    return res.status(204).end();
  }

  try {
    const endpoint = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    const resp = await fetch(endpoint, {
      headers: {
        'hibp-api-key': HIBP_KEY,
        'user-agent': 'ghostify-mvp/1.0'
      }
    });

    let breaches = [];
    if (resp.status === 200) {
      breaches = await resp.json();
    } else if (resp.status === 404) {
      breaches = [];
    } else {
      const text = await resp.text();
      return res.status(resp.status).json({ error: 'upstream_error', detail: text });
    }

    const base = breaches.length * 20;
    const severityBoost = breaches.reduce((acc,b)=> acc + (b.IsSensitive ? 10 : 0), 0);
    const risk_score = Math.min(100, base + severityBoost);

    res.status(200).json({ mode:'live', source:'HIBP', breaches, risk_score });
  } catch (err) {
    res.status(500).json({ error:'server_error', detail: String(err) });
  }
}