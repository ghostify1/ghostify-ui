// pages/api/pdf.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Yalnızca POST isteği kabul edilir" });
  }

  try {
    const { email, breaches } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const title = "GHOSTIFY - Veri İhlal Raporu";
    page.drawText(title, {
      x: 50,
      y: height - 70,
      size: 18,
      font,
      color: rgb(0, 0.82, 1),
    });

    page.drawText(`Kullanıcı: ${email}`, { x: 50, y: height - 100, size: 12, font });
    page.drawText(`Toplam ihlal: ${breaches?.length || 0}`, { x: 50, y: height - 120, size: 12, font });

    let y = height - 150;
    if (breaches && breaches.length > 0) {
      for (const b of breaches) {
        page.drawText(`- ${b.Name || "Bilinmeyen"} (${b.Domain || "-"})`, {
          x: 60,
          y,
          size: 10,
          font,
          color: rgb(0.5, 0.9, 1),
        });
        y -= 15;
      }
    } else {
      page.drawText("Bilinen bir ihlal bulunamadı.", { x: 60, y, size: 10, font });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=ghostify_report.pdf");
    res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("PDF hata:", err);
    res.status(500).json({ error: "PDF oluşturulamadı" });
  }
}
