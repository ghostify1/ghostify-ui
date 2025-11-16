// pages/api/pdf.js

import stream from "stream";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Sadece POST istekleri kabul edilir." });
  }

  const { email, summary, results } = req.body || {};

  if (!email || !summary || !results) {
    return res.status(400).json({
      error: "email, summary ve results alanları gereklidir.",
    });
  }

  // pdfkit'i dinamik import ediyoruz ki sadece server tarafında yüklensin
  const PDFDocument = (await import("pdfkit")).default;

  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];
  const passThrough = new stream.PassThrough();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="ghostify-rapor.pdf"`
  );

  doc.pipe(passThrough);

  passThrough.on("data", (chunk) => chunks.push(chunk));
  passThrough.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
     res.send(pdfBuffer);
  });

  // ---------- RAPOR İÇERİĞİ ----------

  doc.fontSize(20).fillColor("#000").text("GHOSTIFY Veri İhlal Raporu", {
    align: "center",
  });
  doc.moveDown();

  doc.fontSize(12).fillColor("#333");
  doc.text(`Kullanıcı e-posta: ${email}`);
  doc.text(`Toplam İhlal: ${summary.totalBreaches}`);
  doc.text(`Risk Skoru (0-100): ${summary.riskScore}`);
  doc.moveDown();

  doc.text("Özet:", { underline: true });
  doc.text(`- E-posta ihlali: ${summary.emailBreaches}`);
  doc.text(`- Telefon ihlali: ${summary.phoneBreaches}`);
  doc.text(`- Kullanıcı adı ihlali: ${summary.usernameBreaches}`);
  doc.text(`- Adres/anahtar kelime ihlali: ${summary.addressBreaches}`);
  doc.moveDown();

  const addSection = (title, data) => {
    doc.addPage();
    doc.fontSize(16).fillColor("#000").text(title, { underline: true });
    doc.moveDown();

    if (!data.success || !data.breaches.length) {
      doc.fontSize(12).fillColor("#555").text("Herhangi bir kayıt bulunamadı.");
      return;
    }

    data.breaches.forEach((b, idx) => {
      doc
        .fontSize(12)
        .fillColor("#000")
        .text(`#${idx + 1}  Satır: ${b.line}`);
      if (b.sources && b.sources.length) {
        doc
          .fontSize(11)
          .fillColor("#555")
          .text(`Kaynaklar: ${b.sources.join(", ")}`);
      }
      if (b.last_breach) {
        doc
          .fontSize(11)
          .fillColor("#555")
          .text(`Son ihlal tarihi: ${b.last_breach}`);
      }
      doc.moveDown();
    });
  };

  addSection("E-Posta İhlalleri", results.email);
  addSection("Telefon İhlalleri", results.phone);
  addSection("Kullanıcı Adı İhlalleri", results.username);
  addSection("Adres / Anahtar Kelime İhlalleri", results.address);

  doc.addPage();
  doc.fontSize(12).fillColor("#333");
  doc.text(
    "Bu rapor Ghostify otomatik sistemleri tarafından oluşturulmuştur. " +
      "Amaç, kişisel verilerinizin olası ihlallerini tespit etmek ve size özet sunmaktır.",
    { align: "left" }
  );

  doc.end();
}
