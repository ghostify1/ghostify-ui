// pages/api/invite/verify.js
import { db } from "../../../lib/firebaseClient";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { serialize } from "cookie";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Yalnızca POST isteği desteklenir." });
    }

    const { code } = req.body || {};
    const mode = process.env.INVITE_MODE || "env";

    let valid = false;

    if (mode === "env") {
      // .env dosyandaki INVITE_CODES değişkenini al
      const codes = (process.env.INVITE_CODES || "")
        .split(",")
        .map((c) => c.trim().toUpperCase());
      valid = !!code && codes.includes(code.toUpperCase());
    } else {
      // Firebase’ten kontrol et
      const snap = await getDoc(doc(db, "invites", code));
      valid = snap.exists() && snap.data().isActive !== false;

      if (valid) {
        await setDoc(
          doc(db, "invites", code),
          { lastUsed: serverTimestamp() },
          { merge: true }
        );
      }
    }

    if (!valid) {
      return res.status(401).json({ ok: false, error: "Geçersiz davet kodu." });
    }

    // Davet başarılı: cookie ayarla
    res.setHeader(
      "Set-Cookie",
      serialize("ghostify_invite_ok", "true", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 gün
        sameSite: "lax",
        secure: true,
      })
    );

    return res.status(200).json({ ok: true, message: "Davet onaylandı." });
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
