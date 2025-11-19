// pages/api/scan.js

// Küçük gecikme (rate-limit koruması için)
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// LeakCheck'ten gelen veri çok değişken.
// Bu fonksiyon tüm versiyonları normalize eder.
function normalize(raw) {
  if (!raw) {
    return { success: false, found: 0, breaches: [], error: "Boş yanıt" };
  }

  const breaches =
    raw.result ||
    raw.results ||
    raw.data ||
    raw.breaches ||
    [];

  const success =
    raw.success === true ||
    raw.success === 1 ||
    Array.isArray(breaches);

  const found =
    raw.found ??
    breaches.length ??
    0;

  return {
    success,
    found,
    error: raw.error || null,
    breaches: Array.isArray(breaches)
      ? breaches.map((b) => ({
          line: b.line || "",
          sources: b.sources || [],
          last_breach: b.last_breach || null,
          email_only: b.email_only || 0,
        }))
      : [],
  };
}

// Daha gerçekçi risk hesaplama
function riskScore(summary) {
  let score =
    summary.emailBreaches * 10 +
    summary.phoneBreaches * 25 +
    summary.usernameBreaches * 8 +
    summary.addressBreaches * 4 +
    5;

  if (score > 100) score = 100;
  return score;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST kabul edilir." });
  }

  const { email, phone, username, address } = req.body || {};
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "LEAKCHECK_API_KEY eksik." });
  }

  // Tek bir leakcheck isteği
  const leak = async (type, query) => {
    if (!query) return { success: false, found: 0, breaches: [] };

    const url = `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(
      query
    )}&type=${type}`;

    try {
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      return r.json();
    } catch (err) {
      console.error("LeakCheck HATASI:", err);
      return { success: false, error: "API erişim hatası", breaches: [] };
    }
  };

  try {
    // Tüm istekleri paralel başlatıyoruz
    const [emailRaw, phoneRaw, usernameRaw, addressRaw] = await Promise.all([
      leak("email", email),
      leak("phone", phone),
      leak("login", username),
      leak("mass", address),
    ]);

    // Normalize edilmiş sonuçlar
    const emailResult = normalize(emailRaw);
    const phoneResult = normalize(phoneRaw);
    const usernameResult = normalize(usernameRaw);
    const addressResult = normalize(addressRaw);

    // Özet
    const summary = {
      emailBreaches: emailResult.found,
      phoneBreaches: phoneResult.found,
      usernameBreaches: usernameResult.found,
      addressBreaches: addressResult.found,
    };

    summary.totalBreaches =
      summary.emailBreaches +
      summary.phoneBreaches +
      summary.usernameBreaches +
      summary.addressBreaches;

    summary.riskScore = riskScore(summary);

    // Yanıt
    return res.status(200).json({
      success: true,
      summary,
      results: {
        email: emailResult,
        phone: phoneResult,
        username: usernameResult,
        address: addressResult,
      },
    });
  } catch (err) {
    console.error("GENEL SCAN ERROR:", err);
    return res
      .status(500)
      .json({ error: "Tarama sırasında sunucu hatası oluştu." });
  }
}
