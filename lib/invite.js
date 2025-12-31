export function getInviteConfig() {
  const mode = process.env.INVITE_MODE || "ENV"; // ENV | OFF
  const required = (process.env.INVITE_REQUIRED || "true").toLowerCase() === "true";
  const codesRaw = process.env.INVITE_CODES || "";
  const codes = codesRaw.split(",").map(s => s.trim()).filter(Boolean);
  return { mode, required, codes };
}

function clean(x) {
  return String(x || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ""); // harf/rakam dışını sil (boşluk, satır sonu, gizli karakter vs)
}

export function verifyInviteCode(code) {
  const mode = process.env.INVITE_MODE || "ENV";
  const required = (process.env.INVITE_REQUIRED || "true").toLowerCase() === "true";
  const raw = process.env.INVITE_CODES || "";

  if (mode === "OFF") return { ok: true, reason: "INVITE_OFF" };
  if (!required) return { ok: true, reason: "INVITE_NOT_REQUIRED" };

  const input = clean(code);
  if (!input) return { ok: false, reason: "EMPTY_CODE" };

  const codes = raw
    .split(",")
    .map((s) => clean(s))
    .filter(Boolean);

  const set = new Set(codes);

  return set.has(input) ? { ok: true, reason: "VALID" } : { ok: false, reason: "INVALID_CODE" };
}
