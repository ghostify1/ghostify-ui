// pages/api/delete-request.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Yalnızca POST istekleri kabul edilir." });
  }

  const { email, summary, results } = req.body || {};

  if (!email || !summary || !results) {
    return res.status(400).json({
      error: "email, summary ve results alanları zorunludur.",
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "RESEND_API_KEY tanımlı değil.",
    });
  }

  const privacyEmail =
    process.env.PRIVACY_EMAIL || "privacy@ghostifyhq.com";

  const formatBreaches = (title, data) => {
    if (!data || !data.success || !data.breaches.length)
      return `${title}: Kayıt bulunamadı.\n`;

    let text = `${title}:\n`;
    data.breaches.forEach((b, idx) => {
      text += `  #${idx + 1}  Satır: ${b.line}\n`;
      if (b.sources && b.sources.length) {
        text += `     Kaynaklar: ${b.sources.join(", ")}\n`;
      }
      if (b.last_breach) {
        text += `     Son ihlal: ${b.last_breach}\n`;
      }
    });
    return text + "\n";
  };

  const bodyText = `
GHOSTIFY - Kişisel Veri Silme Talebi

Kullanıcı e-posta: ${email}

Toplam ihlal: ${summary.totalBreaches}
Risk skoru (0-100): ${summary.riskScore}

Özet:
- E-posta ihlali: ${summary.emailBreaches}
- Telefon ihlali: ${summary.phoneBreaches}
- Kullanıcı adı ihlali: ${summary.usernameBreaches}
- Adres/anahtar kelime ihlali: ${summary.addressBreaches}

Detaylı kırılım:

${formatBreaches("E-posta ihlalleri", results.email)}
${formatBreaches("Telefon ihlalleri", results.phone)}
${formatBreaches("Kullanıcı adı ihlalleri", results.username)}
${formatBreaches("Adres / anahtar kelime ihlalleri", results.address)}

Bu e-posta Ghostify otomasyon sistemi tarafından oluşturulmuştur.
Kullanıcı, ilgili platformlarda hesabının ve verilerinin silinmesini talep etmektedir.
`;

  try {
    await resend.emails.send({
      from: "Ghostify <no-reply@ghostifyhq.com>",
      to: [privacyEmail, email], // hem sana hem kullanıcıya gidebilir
      subject: "Ghostify - Kişisel Veri Silme Talebi",
      text: bodyText,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Silme talebi mail hatası:", err);
    return res.status(500).json({
      error: "Silme talebi e-postası gönderilemedi.",
    });
  }
}
