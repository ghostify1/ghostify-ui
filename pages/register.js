import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST isteği kabul edilir." });
  }

  try {
    const { email, breaches } = req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const companyList = breaches?.length
      ? breaches.map(b => b.Domain || b.Name || "Bilinmeyen Servis").join(", ")
      : "İhlal kaydı bulunamadı.";

    const message = `
📨 GHOSTIFY - Silme Talebi

Kullanıcı: ${email}

İhlal bulunan platformlar:
${companyList}

Bu talep Ghostify tarafından otomatik oluşturulmuştur.
`;

    const data = await resend.emails.send({
      from: "Ghostify <noreply@ghostifyhq.com>",
      to: ["privacy@ghostifyhq.com"],
      subject: "Yeni Silme Talebi",
      text: message
    });

    return res.status(200).json({
      success: true,
      message: "Silme talebi başarıyla e-posta olarak gönderildi.",
      id: data?.id || null
    });

  } catch (err) {
    return res.status(500).json({
      error: "E-posta gönderilemedi.",
      details: err.message
    });
  }
}
