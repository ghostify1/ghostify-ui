import { getInviteConfig } from "../../../lib/invite";

export default function handler(req, res) {
  const cfg = getInviteConfig();

  // Güvenli çıktı: kodları kısaltıp gösteriyoruz
  const previewCodes = (cfg.codes || []).map((c) => String(c).slice(0, 2) + "***" + String(c).slice(-2));

  res.status(200).json({
    ok: true,
    mode: cfg.mode,
    required: cfg.required,
    codesCount: cfg.codes.length,
    codesPreview: previewCodes,
    rawLength: (process.env.INVITE_CODES || "").length,
    nodeEnv: process.env.NODE_ENV
  });
}
