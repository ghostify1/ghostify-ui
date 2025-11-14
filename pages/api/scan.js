import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST istekleri kabul edilir." });
  }

  try {
    const { email, phone, username, password, domain } = req.body || {};

    const apiKey = process.env.LEAKCHECK_API_KEY;
    const headers = { "Accept": "application/json" };

    const runLeakCheck = async (query) => {
      if (!query) return null;

      const url = `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(query)}`;
      const r = await fetch(url, { headers });
      return r.json();
    };

    // 1) Email Tarama
    const emailResult = email ? await runLeakCheck(email.toLowerCase()) : null;

    // 2) Telefon Tarama
    const phoneResult = phone ? await runLeakCheck(phone) : null;

    // 3) Kullanıcı Adı Tarama
    const usernameResult = username ? await runLeakCheck(username) : null;

    // 4) Domain Tarama
    const domainResult = domain ? await runLeakCheck(domain.toLowerCase()) : null;

    // 5) Parola Güvenlik Tarama (Pwned Passwords - SHA1)
    let passwordResult = null;
    if (password) {
      const sha1 = sha1Hash(password);
      const prefix = sha1.substring(0, 5);
      const suffix = sha1.substring(5).toUpperCase();

      const pwdRes = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await pwdRes.text();

      const exposed = text.includes(suffix);
      passwordResult = { exposed };
    }

    // RISK SCORE HESAPLAMA
    const calculateRisk = () => {
      let score = 0;

      if (emailResult?.found) score += 30;
      if (phoneResult?.found) score += 20;
      if (usernameResult?.found) score += 10;
      if (passwordResult?.exposed) score += 30;
      if (domainResult?.found) score += 10;

      return Math.min(score, 100);
    };

    const riskScore = calculateRisk();

    return res.status(200).json({
      success: true,
      email: emailResult,
      phone: phoneResult,
      username: usernameResult,
      password: passwordResult,
      domain: domainResult,
      riskScore
    });

  } catch (error) {
    console.error("SCAN ERROR:", error);
    return res.status(500).json({
      error: "Scan hatası",
      details: error.message
    });
  }
}


// SHA-1 HASH (Node.js)
function sha1Hash(text) {
  return crypto.createHash("sha1").update(text).digest("hex").toUpperCase();
}
