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

  try {
    const { email, summary, results } = req.body || {};

    if (!email || !summary || !results) {
      return res.status(400).json({
        error: "email, summary ve results alanları gereklidir.",
      });
    }

    // Dinamik import (Next.js uyumlu)
    const PDFDocument = (await import("pdfkit")).default;

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      info: {
        Title: "Ghostify Veri İhlal Raporu",
        Author: "Ghostify Core System",
      },
    });

    const chunks = [];
    const passThrough = new stream.PassThrough();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="ghostify-rapor.pdf"'
    );

    doc.pipe(passThrough);

    passThrough.on("data", (chunk) => chunks.push(chunk));
    passThrough.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.send(pdfBuffer);
    });

    passThrough.on("error", (err) => {
      console.error("PDF oluşturma hatası:", err);
      res.status(500).json({ error: "PDF oluşturulamadı." });
    });

    // -------------------------------------------------------------
    //                     TITLE & HEADER
    // -------------------------------------------------------------
    doc
      .fontSize(22)
      .fillColor("#052c3d")
      .text("GHOSTIFY VERİ İHLAL RAPORU", { align: "center" })
      .moveDown();

    doc
      .fontSize(12)
      .fillColor("#444")
      .text(`Kullanıcı: ${email}`)
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Toplam İhlal: ${summary.totalBreaches}`)
      .text(`Risk Skoru: ${summary.riskScore}`)
      .moveDown();

    doc
      .fontSize(14)
      .fillColor("#000")
      .text("Özet", { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor("#444")
      .text(`• E-posta ihlali: ${summary.emailBreaches}`)
      .text(`• Telefon ihlali: ${summary.phoneBreaches}`)
      .text(`• Kullanıcı adı ihlali: ${summary.usernameBreaches}`)
      .text(`• Adres/keyword ihlali: ${summary.addressBreaches}`)
      .moveDown();

    // -------------------------------------------------------------
    //                     SECTION HELPER
    // -------------------------------------------------------------
    const addSection = (title, data) => {
      doc.addPage();
      doc.fontSize(18).fillColor("#052c3d").text(title, { underline: true });
      doc.moveDown();

      if (!data.success || !data.breaches || !data.breaches.length) {
        doc.fontSize(12).fillColor("#777").text("Herhangi bir kayıt bulunamadı.");
        return;
      }

      data.breaches.forEach((b, idx) => {
        doc
          .fontSize(14)
          .fillColor("#000")
          .text(`#${idx + 1}  Satır: ${b.line}`);

        if (b.sources?.length) {
          doc
            .fontSize(12)
            .fillColor("#444")
            .text(`Kaynaklar: ${b.sources.join(", ")}`);
        }
        if (b.last_breach) {
          doc
            .fontSize(12)
            .fillColor("#444")
            .text(`Son ihlal tarihi: ${b.last_breach}`);
        }

        doc.moveDown();
      });
    };

    // -------------------------------------------------------------
    //                   DETAILED SECTIONS
    // -------------------------------------------------------------
    addSection("E-Posta İhlalleri", results.email);
    addSection("Telefon İhlalleri", results.phone);
    addSection("Kullanıcı Adı İhlalleri", results.username);
    addSection("Adres / Keyword İhlalleri", results.address);

    // -------------------------------------------------------------
    //                   FOOTER / NOTES
    // -------------------------------------------------------------
    doc.addPage();
    doc
      .fontSize(12)
      .fillColor("#444")
      .text(
        "Bu rapor Ghostify Core tarafından otomatik oluşturulmuştur.\n" +
          "Amaç, kullanıcı verilerinin olası sızıntılarda yer alıp almadığını analiz etmektir.\n" +
          "Ghostify, kullanıcı gizliliğini sağlamak için tüm süreçleri şeffaf şekilde raporlar.",
        { align: "left" }
      );

    doc.end();
  } catch (err) {
    console.error("GENEL PDF API HATASI:", err);
    return res.status(500).json({ error: "PDF oluşturulurken hata oluştu." });
  }
}
