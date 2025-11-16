// pages/api/scan.js

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeResult(raw) {
  if (!raw) {
    return { success: false, found: 0, error: "No response", breaches: [] };
  }

  // LeakCheck v1 tipi: success + found + result[]
  if (raw.success && Array.isArray(raw.result)) {
    return {
      success: true,
      found: raw.found || raw.result.length,
      error: null,
      breaches: raw.result.map((item) => ({
        line: item.line || "",
        sources: item.sources || [],
        last_breach: item.last_breach || null,
        email_only: item.email_only || 0,
      })),
    };
  }

  // Başarısız durumlar
  return {
    success: false,
    found: 0,
    error: raw.error || "Unknown error",
    breaches: [],
  };
}

function calculateRiskScore(summary) {
  const {
    emailBreaches,
    phoneBreaches,
    usernameBreaches,
    addressBreaches,
  } = summary;

  // Basit ama anlaşılır bir scoring:
  // email: x15, phone: x20, username: x10, address: x5, +5 taban
  let score =
    emailBreaches * 15 +
    phoneBreaches * 20 +
    usernameBreaches * 10 +
    addressBreaches * 5 +
    5;

  if (score > 100) score = 100;
  return score;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Sadece POST istekleri kabul edilir." });
  }

  const { email, phone, username, address } = req.body || {};
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "LEAKCHECK_API_KEY tanımlı değil.",
    });
  }

  const runLeakCheck = async (type, query) => {
    if (!query) return null;

    const url = `https://leakcheck.io/api?key=${apiKey}&check=${encodeURIComponent(
      query
    )}&type=${type}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      return response.json();
    } catch (err) {
      console.error("LeakCheck bağlantı hatası:", err);
      return { success: false, error: "API bağlantı hatası" };
    }
  };

  try {
    // 1) EMAIL
    const emailRaw = await runLeakCheck("email", email);
    await sleep(450);

    // 2) PHONE
    const phoneRaw = await runLeakCheck("phone", phone);
    await sleep(450);

    // 3) USERNAME
    const usernameRaw = await runLeakCheck("login", username);
    await sleep(450);

    // 4) ADDRESS (keyword / mass search)
    const addressRaw = await runLeakCheck("mass", address);
    await sleep(450);

    const emailResult = normalizeResult(emailRaw);
    const phoneResult = normalizeResult(phoneRaw);
    const usernameResult = normalizeResult(usernameRaw);
    const addressResult = normalizeResult(addressRaw);

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
    summary.riskScore = calculateRiskScore(summary);

    return res.status(200).json({
      success: true,
      results: {
        email: emailResult,
        phone: phoneResult,
        username: usernameResult,
        address: addressResult,
      },
      summary,
    });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({
      error: "Sunucu hatası, tarama tamamlanamadı.",
    });
  }
}
