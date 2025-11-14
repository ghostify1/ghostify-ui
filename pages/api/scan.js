export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST istekleri kabul edilir." });
  }

  try {
    const { email, phone, username, password, domain } = req.body || {};

    const apiKey = process.env.LEAKCHECK_API_KEY;
    const headers = { "Accept": "application/json" };

    const runLeakCheck = async (query) => {
      const url = `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(query)}`;
      const r = await fetch(url, { headers });
      return r.json();
    };

    // 1) Email Tarama (HIBP + LeakCheck)
    let emailResult = null;
    if (email) {
      emailResult = await runLeakCheck(email.toLowerCase());
    }

    // 2) Telefon Tarama
    let phoneResult = null;
    if (phone) {
      phoneResult = await runLeakCheck(phone);
    }

    // 3) Kullanıcı Adı Tarama
    let usernameResult = null;
    if (username) {
      usernameResult = await runLeakCheck(username);
    }

    // 4) Domain Tarama
    let domainResult = null;
    if (domain) {
      domainResult = await runLeakCheck(domain.toLowerCase());
    }

    // 5) Parola Güvenlik Tarama (SHA1)
    let passwordResult = null;
    if (password) {
      const sha1 = await sha1Hash(password);
      const prefix = sha1.substring(0, 5);
      const suffix = sha1.substring(5).toUpperCase();
      const pwdRes = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await pwdRes.text();

      const found = text.includes(suffix);
      passwordResult = { exposed: found };
    }

    // 🧠 RISK SCORE HESAPLAMA
    const calculateRisk = () => {
      let score = 0;

      if (emailResult?.found) score += 30;
      if (phoneResult?.found) score += 20;
      if (usernameResult?.found) score += 10;
      if (passwordResult?.exposed) score += 30;
      if (domainResult?.found) score += 10;

      if (score > 100) score = 100;
      return score;
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
    return res.status(500).json({
      error: "Scan hatası",
      details: error.message
    });
  }
}


// SHA1 HASH FONKSİYONU
async function sha1Hash(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
