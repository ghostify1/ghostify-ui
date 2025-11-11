// pages/api/pdf.js
import PDFDocument from "pdfkit";
import { Buffer } from "node:buffer";

export const config = {
  api: { bodyParser: { sizeLimit: "2mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Yalnızca POST isteği kabul edilir" });
  }

  try {
    const { email, breaches } = req.body;

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const pdf = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="ghostify_report.pdf"`);
      res.status(200).send(pdf);
    });

    doc.fontSize(20).fillColor("#00D1FF").text("GHOSTIFY - Veri İhlal Raporu", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(12).fillColor("#FFFFFF").text(`Kullanıcı: ${email}`);
    doc.moveDown(0.5);
    doc.text(`Toplam ihlal: ${breaches?.length || 0}`);
    doc.moveDown(1);

    if (breaches && breaches.length > 0) {
      breaches.forEach((b, i) => {
        doc.fillColor("#80E6FF").text(`${i + 1}. ${b.Name} (${b.Domain})`, { indent: 20 });
      });
    } else {
      doc.text("Bu e-posta adresiyle ilişkilendirilmiş bilinen bir ihlal bulunamadı.", { indent: 20 });
    }

    doc.end();
  } catch (e) {
    console.error("PDF oluşturma hatası:", e);
    res.status(500).json({ error: "PDF oluşturulamadı", details: e.message });
  }
}
