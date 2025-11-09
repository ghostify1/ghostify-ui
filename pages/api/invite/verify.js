// pages/api/invite/verify.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Yalnızca POST isteğine izin verilir." });
    }

    const { code } = req.body || {};

    // 🔑 Env değişkenlerini oku (senin vercel ayarına uygun)
    const required = String(process.env.NEXT_PUBLIC_INVITE_REQUIRED || "false") === "true";
    const rawCodes = process.env.NEXT_PUBLIC_INVITE_CODES || "";
    const codes = rawCodes
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);

    console.log("🔹 Geçerli Kodlar:", codes);
    console.log("🔹 Girilen Kod:", code);

    if (required && (!code || !codes.includes(code.trim().toUpperCase()))) {
      return res.status(401).json({ ok: false, error: "Geçersiz davet kodu." });
    }

    // 🎯 Cookie ayarı (geliştirilmiş)
    res.setHeader(
      "Set-Cookie",
      serialize("ghostify_invite_ok", "1", {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24, // 1 gün
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );

    return res.status(200).json({ ok: true, message: "Davet kodu onaylandı." });
  } catch (error) {
    console.error("Invite API Hatası:", error);
    return res.status(500).json({
      ok: false,
      error: "Sunucu hatası veya geçersiz yanıt.",
      details: error.message,
    });
  }
}
