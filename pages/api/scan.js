// pages/api/scan.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Yalnızca POST isteği kabul edilir" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "E-posta gerekli" });
  }

  try {
    // HIBP API
    const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;
    const hibpRes = await fetch(hibpUrl, {
      headers: {
        "hibp-api-key": process.env.HIBP_API_KEY,
        "User-Agent": "GhostifyCore",
      },
    });

    let hibpData = [];
    if (hibpRes.status === 200) {
      hibpData = await hibpRes.json();
    }

    // LeakCheck API (alternatif kaynak)
    const leakUrl = `https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`;
    const leakRes = await fetch(leakUrl);
    const leakData = leakRes.ok ? await leakRes.json() : null;

    const totalBreaches = (hibpData?.length || 0) + (leakData?.found ? 1 : 0);

    res.status(200).json({
      success: true,
      email,
      breaches: totalBreaches,
      hibp: hibpData || [],
      leakcheck: leakData || {},
    });
  } catch (err) {
    console.error("Scan API hatası:", err);
    res.status(500).json({ error: "Tarama hatası", details: err.message });
  }
}
