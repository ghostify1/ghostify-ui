// lib/invite.js
export function getInviteConfig() {
  const mode = process.env.INVITE_MODE || "ENV"; // ENV | OFF
  const required = (process.env.INVITE_REQUIRED || "true").toLowerCase() === "true";
  const codesRaw = process.env.INVITE_CODES || "";
  const codes = codesRaw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  return { mode, required, codes };
}

export function verifyInviteCode(code) {
  const { mode, required, codes } = getInviteConfig();

  if (mode === "OFF") return { ok: true, reason: "INVITE_OFF" };
  if (!required) return { ok: true, reason: "INVITE_NOT_REQUIRED" };

  const normalized = String(code || "").trim();
  if (!normalized) return { ok: false, reason: "EMPTY_CODE" };

  const normalizedUpper = normalized.toUpperCase();

  const codeSet = new Set(codes.map(c => String(c).trim().toUpperCase()));
  const isValid = codeSet.has(normalizedUpper);

  return isValid ? { ok: true, reason: "VALID" } : { ok: false, reason: "INVALID_CODE" };
}
