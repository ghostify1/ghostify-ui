function clean(x) {
  // Gizli karakter, boşluk, satır sonu, tire vb. her şeyi temizler
  return String(x || "")
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]/g, "");
}

export function getInviteConfig() {
  const modeRaw = process.env.INVITE_MODE || "ENV";
  const mode = String(modeRaw).trim().toUpperCase(); // ENV / OFF

  const requiredRaw = process.env.INVITE_REQUIRED ?? "true";
  const required = String(requiredRaw).trim().toLowerCase() === "true";

  const rawCodes = process.env.INVITE_CODES || "";
  const codes = rawCodes
    .split(",")
    .map((s) => clean(s))
    .filter(Boolean);

  return { mode, required, codes, rawCodesLen: rawCodes.length };
}

export function verifyInviteCode(code) {
  const cfg = getInviteConfig();

  // OFF ise her zaman geç
  if (cfg.mode === "OFF") return { ok: true, reason: "INVITE_OFF" };

  // required değilse her zaman geç
  if (!cfg.required) return { ok: true, reason: "INVITE_NOT_REQUIRED" };

  const input = clean(code);
  if (!input) return { ok: false, reason: "EMPTY_CODE" };

  const set = new Set(cfg.codes);
  if (set.size === 0) return { ok: false, reason: "NO_CODES_IN_ENV" };

  return set.has(input)
    ? { ok: true, reason: "VALID" }
    : { ok: false, reason: "INVALID_CODE" };
}
