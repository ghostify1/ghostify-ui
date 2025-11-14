import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST istekleri kabul edilir." });
  }

  try {
    const { email, breaches } = req.body || {};

    const resend = new Resend(process.env.RESEND_API_KEY);

    const formattedList = breaches?.length
      ? breaches.map(b => `• ${b?.Name || "Bilinmeyen"} (${b?.Domain || "-"})`).join("\n")
      : "İhlal kaydı bulunamadı.";

    const message = `
📨 GHOSTIFY - Kişisel Veri Silme Talebi
--------------------------------------
Kullanıcı Email: ${email}

İhlal Kayıtları:
${formattedList}

Bu talep Ghostify otomasyon sistemi tarafından oluşturulmuş ve gönderilmiştir.
`;

    // E-posta gönder
    const response = await resend.emails.send({
      from: "Ghostify <noreply@ghostifyhq.com>",
      to: ["privacy@ghostifyhq.com"], // Sonra kullanıcı seçimine göre dinamik olabilir
      subject: "Yeni Silme Talebi - Ghostify",
      text: message
    });

    return res.status(200).json({
      success: true,
      message: "Silme talebi başarılı şekilde e-posta olarak gönderildi.",
      id: response?.id || null
    });

  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      error: "E-posta gönderimi başarısız.",
      details: error.message
    });
  }
}
