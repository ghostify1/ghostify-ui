export default function handler(req, res) {
  return res.status(200).json({
    ok: true,
    stamp: "GHOSTIFY-P1-VERIFY-V3",
    mode: process.env.INVITE_MODE || "MISSING",
    required: process.env.INVITE_REQUIRED || "MISSING",
    codes: process.env.INVITE_CODES || "MISSING"
  });
}
