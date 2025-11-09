// pages/api/invite/verify.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Yalnızca POST isteğine izin verilir." });
    }

    const { code } = req.body || {};
    const mode = process.env.INVITE_MODE || "env";
    let valid = false;

    if (mode === "env") {
      const rawCodes = process.env.INVITE_CODES || "";
      const codes = rawCodes
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => c.length > 0);
      console.log("GHOSTIFY DAVET:", codes);
      valid = !!code && codes.includes(code.trim().toUpperCase());
    }

    if (!valid) {
      return res.status(401).json({ ok: false, error: "Geçersiz davet kodu." });
    }

    // 🔧 Cookie ayarı (geliştirilmiş)
    res.setHeader(
      "Set-Cookie",
      serialize("ghostify_invite_ok", "1", {
        path: "/",
        httpOnly: false, // client-side erişim
        maxAge: 60 * 60 * 24 * 7,
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
