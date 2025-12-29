import { verifyInviteCode } from "../../../lib/invite";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, reason: "METHOD_NOT_ALLOWED" });
  }

  try {
    const { code } = req.body || {};
    const result = verifyInviteCode(code);

    if (!result.ok) {
      return res.status(401).json({ ok: false, reason: result.reason });
    }

    setCookie(res, "invite_ok", "true", { httpOnly: true });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, reason: "SERVER_ERROR" });
  }
}
