import { verifyInviteCode } from "../../../lib/invite";

/**
 * Basit cookie setter
 */
function setCookie(res, name, value, options = {}) {
  const {
    httpOnly = true,
    secure = process.env.NODE_ENV === "production",
    sameSite = "Lax",
    path = "/",
    maxAge = 60 * 60 * 6
  } = options;

  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (secure) parts.push("Secure");

  res.setHeader("Set-Cookie", parts.join("; "));
}

/**
 * DEBUG: Deploy/ENV kanıtlamak için
 * Vercel Env'e bunu eklersen debug aktif olur:
 * INVITE_DEBUG = "1"
 */
function isDebug() {
  return String(process.env.INVITE_DEBUG || "").trim() === "1";
}

export default function handler(req, res) {
  // --- 1) Sadece POST kabul
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, reason: "METHOD_NOT_ALLOWED" });
  }

  // --- 2) DEBUG/STAMP modu (hangi deploy / hangi env okunuyor?)
  if (isDebug()) {
    return res.status(200).json({
      ok: true,
      stamp: "GHOSTIFY-P1-VERIFY-V4",
      nodeEnv: process.env.NODE_ENV || "MISSING",
      inviteMode: process.env.INVITE_MODE ?? "MISSING",
      inviteRequired: process.env.INVITE_REQUIRED ?? "MISSING",
      inviteCodesLen: (process.env.INVITE_CODES || "").length,
      inviteCodesPreview: String(process.env.INVITE_CODES || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((c) => c.slice(0, 2) + "***" + c.slice(-2))
        .slice(0, 5)
    });
  }

  // --- 3) Normal invite doğrulama
  try {
    const { code } = req.body || {};
    const result = verifyInviteCode(code);

    // Mode OFF ise verifyInviteCode zaten ok=true döndürür (bizim lib mantığı)
    if (!result.ok) {
      return res.status(401).json({ ok: false, reason: result.reason });
    }

    // Başarılı -> cookie yaz
    setCookie(res, "invite_ok", "true", { httpOnly: true });

    return res.status(200).json({ ok: true, reason: "OK" });
  } catch (e) {
    return res.status(500).json({ ok: false, reason: "SERVER_ERROR" });
  }
}
