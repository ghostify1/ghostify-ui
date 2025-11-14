export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST istekleri kabul edilir." });
  }

  try {
    const { email, phone, username, address } = req.body || {};
    const apiKey = process.env.LEAKCHECK_API_KEY;

    const runLeakCheck = async (checkType, query) => {
      if (!query) return null;
      const encoded = encodeURIComponent(query);
      const url = `https://leakcheck.io/api?key=${apiKey}&check=${checkType}&query=${encoded}`;
      const r = await fetch(url, { headers: { "Accept": "application/json" } });
      return r.json();
    };

    // 1) Email tarama
    const emailResult = await runLeakCheck("email", email);

    // 2) Telefon tarama
    const phoneResult = await runLeakCheck("phone", phone);

    // 3) Username tarama
    const usernameResult = await runLeakCheck("username", username);

    // 4) Adres tarama
    const addressResult = await runLeakCheck("address", address);

    return res.status(200).json({
      success: true,
      results: {
        email: emailResult,
        phone: phoneResult,
        username: usernameResult,
        address: addressResult
      }
    });

  } catch (err) {
    console.error("Tarama hatası:", err);
    return res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
}
