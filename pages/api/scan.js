// pages/api/scan.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Sadece POST istekleri kabul edilir." });
  }

  const { email, phone, username, address } = req.body || {};
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "LEAKCHECK_API_KEY tanımlı değil." });
  }

  const runLeakCheck = async (type, query) => {
    if (!query) return null;

    const encodedQuery = encodeURIComponent(query);
    const url = `https://leakcheck.io/api?key=${apiKey}&check=${encodedQuery}&type=${type}`;

    const r = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    return r.json();
  };

  try {
    // LeakCheck dokümanına göre:
    // type=email, phone, login, mass vs.

    const [emailResult, phoneResult, usernameResult, addressResult] =
      await Promise.all([
        runLeakCheck("email", email),
        runLeakCheck("phone", phone),
        runLeakCheck("login", username),
        // Adres için direkt type yok; keyword/mass araması yapıyoruz
        runLeakCheck("mass", address),
      ]);

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
    console.error("LeakCheck tarama hatası:", err);
    return res
      .status(500)
      .json({ error: "Sunucu hatası, tarama tamamlanamadı." });
  }
}
