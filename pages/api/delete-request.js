// pages/api/delete-request.js

import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Yalnızca POST istekleri kabul edilir." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email, summary, results } = req.body || {};

  // ---- ZORUNLU ALAN KONTROLÜ ----
  if (
    !email ||
    !summary ||
    typeof summary.totalBreaches === "undefined" ||
    !results
  ) {
    return res.status(400).json({
      error: "Eksik veri: email, summary ve results zorunludur.",
    });
  }

  const privacyEmail =
    process.env.PRIVACY_EMAIL || "privacy@ghostifyhq.com";

  // ---- DATA FORMAT HELPERS ----
  const sanitize = (val) =>
    typeof val === "string" ? val.replace(/</g, "&lt;") : val;

  const formatList = (title, data) => {
    if (!data || !data.success || !Array.isArray(data.breaches)) {
      return `<h3>${title}</h3><p>Kayıt bulunamadı.</p>`;
    }

    let html = `<h3>${title}</h3>`;
    html += "<ul>";

    data.breaches.forEach((item, idx) => {
      html += `
        <li>
          <strong>#${idx + 1}</strong><br/>
          Satır: ${sanitize(item.line)}<br/>
          ${
            item.sources?.length
              ? "Kaynaklar: " + item.sources.join(", ")
              : ""
          }<br/>
          ${item.last_breach ? "Son ihlal: " + item.last_breach : ""}
        </li>
      `;
    });

    html += "</ul>";
    return html;
  };

  // ---- HTML MAIL BODY ----
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; padding:20px; color:#0f1d2e">
      <h2>GHOSTIFY - Kişisel Veri Silme Talebi</h2>

      <p><strong>Kullanıcı e-posta:</strong> ${sanitize(email)}</p>

      <p>
        <strong>Toplam ihlal:</strong> ${summary.totalBreaches}<br/>
        <strong>Risk skoru (0-100):</strong> ${summary.riskScore}
      </p>

      <h3>Özet</h3>
      <ul>
        <li>E-posta ihlali: ${summary.emailBreaches}</li>
        <li>Telefon ihlali: ${summary.phoneBreaches}</li>
        <li>Kullanıcı adı ihlali: ${summary.usernameBreaches}</li>
        <li>Adres ihlali: ${summary.addressBreaches}</li>
      </ul>

      ${formatList("E-posta İhlalleri", results.email)}
      ${formatList("Telefon İhlalleri", results.phone)}
      ${formatList("Kullanıcı Adı İhlalleri", results.username)}
      ${formatList("Adres / Keyword İhlalleri", results.address)}

      <p style="margin-top:20px; font-size:13px; color:#567">
        Bu e-posta Ghostify otomasyon sistemi tarafından oluşturulmuştur.<br/>
        Kullanıcı, ilgili platformlarda verilerinin silinmesini talep etmektedir.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Ghostify <no-reply@resend.dev>", // fallback
      to: [privacyEmail, email],
      subject: "Ghostify - Kişisel Veri Silme Talebi",
      html: htmlBody,
      text: htmlBody.replace(/<[^>]+>/g, ""), // HTML → Text fallback
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("✖ Silme talebi mail hatası:", err);
    return res.status(500).json({
      error: "Silme talebi e-postası gönderilemedi.",
    });
  }
}
