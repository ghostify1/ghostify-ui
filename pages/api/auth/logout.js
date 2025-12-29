function clearCookie(res, name) {
  res.setHeader(
    "Set-Cookie",
    `${name}=; Path=/; Max-Age=0; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""} HttpOnly`
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  clearCookie(res, "invite_ok");
  // Not: Firebase client logout ayrı (UI tarafında signOut yapacağız)
  return res.status(200).json({ ok: true });
}
