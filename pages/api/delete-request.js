import { Resend } from "resend";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Yalnızca POST isteği kabul edilir" });
  }

  try {
    const { email, breaches } = req.body;

    const companyList = breaches && breaches.length > 0
      ? breaches.map(b => b.Domain || b.Name || "Bilinmeyen site").join(", ")
      : "Belirli ihlal kaydı bulunamadı.";

    const message = `
📨 GHOSTIFY - Kişisel Veri Silme Talebi
--------------------------------------
Kullanıcı e-posta: ${email}

Silme talebi gönderilen platformlar:
${companyList}

Bu mesaj sistem tarafından otomatik oluşturulmuştur.
`;

    console.log("Silme talebi oluşturuldu:", message);

    return res.status(200).json({
      success: true,
      message: "Silme talebi başarıyla oluşturuldu.",
      details: message,
    });
  } catch (err) {
    return res.status(500).json({ error: "Talep gönderilemedi", details: err.message });
  }
}
