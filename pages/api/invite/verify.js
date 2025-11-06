import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  try {
    const { code } = req.body || {};
    const mode = process.env.INVITE_MODE || 'env';

    let valid = false;

    if (mode === 'env') {
      const codes = (process.env.INVITE_CODES || '').split(',').map(c => c.trim().toUpperCase());
      valid = !!code && codes.includes(code.toUpperCase());
    } else {
      const snap = await getDoc(doc(db, 'invites', code));
      valid = snap.exists() && snap.data().isActive !== false;
      if (valid) await setDoc(doc(db, 'invites', code), { lastUsed: serverTimestamp() }, { merge: true });
    }

    if (!valid) return res.status(401).json({ ok: false, error: 'Geçersiz davet kodu.' });

    res.setHeader('Set-Cookie', serialize('ghostify_invite_ok', '1', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: true
    }));

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Sunucu hatası' });
  }
}
