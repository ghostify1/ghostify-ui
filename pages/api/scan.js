// pages/api/scan.js

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      return { success: false, error: "API bağlantı hatası" };
    }
  };

  try {
    // 1️⃣ EMAIL TARAMA
    const emailResult = await runLeakCheck("email", email);
    await sleep(450); // LeakCheck limit: 3 istek / saniye

    // 2️⃣ TELEFON TARAMA
    const phoneResult = await runLeakCheck("phone", phone);
    await sleep(450);

    // 3️⃣ USERNAME TARAMA
    const usernameResult = await runLeakCheck("login", username);
    await sleep(450);

    // 4️⃣ ADRES TARAMA (mass search)
    const addressResult = await runLeakCheck("mass", address);
    await sleep(450);

    return res.status(200).json({
      success: true,
      results: {
        email: emailResult,
        phone: phoneResult,
        username: usernameResult,
        address: addressResult,
      },
    });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    return res.status(500).json({
      error: "Sunucu hatası, tarama tamamlanamadı.",
    });
  }
}
