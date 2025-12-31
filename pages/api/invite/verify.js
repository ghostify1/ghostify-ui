import { verifyInviteCode, getInviteConfig } from "../../../lib/invite";

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

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, reason: "METHOD_NOT_ALLOWED" });
  }

  // Bu stamp bize "gerçekten bu dosya deploy oldu mu?" kanıtı sağlar
  const STAMP = "GHOSTIFY_INVITE_VERIFY_P1_FIXED_V1";

  try {
    const { code } = req.body || {};
    const result = verifyInviteCode(code);

    if (!result.ok) {
      // UI kör kalmasın diye minimal debug ekliyoruz (güvenli)
      const cfg = getInviteConfig();
      return res.status(401).json({
        ok: false,
        stamp: STAMP,
        reason: result.reason,
        mode: cfg.mode,
        required: cfg.required,
        codesCount: cfg.codes.length,
        rawLen: cfg.rawCodesLen
      });
    }

    setCookie(res, "invite_ok", "true", { httpOnly: true });
    return res.status(200).json({ ok: true, stamp: STAMP, reason: result.reason });
  } catch {
    return res.status(500).json({ ok: false, stamp: STAMP, reason: "SERVER_ERROR" });
  }
}
