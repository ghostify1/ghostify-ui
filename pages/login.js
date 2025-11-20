// pages/login.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.invite) {
      setInvite(String(router.query.invite));
    }
  }, [router.query.invite]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
    });
    return () => unsub();
  }, [auth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Giriş başarısız. Bilgileri kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell login-page">
      {/* Matrix arka plan için canvas zaten _app.js’de, bu div sadece ek efekt */}
      <div className="matrix-layer" />

      <div className="glass-panel login-panel center">
        <div className="logo-halo">
          <div className="logo-glow">
            <img src="/ghost-logo.png" alt="ghost" />
          </div>
        </div>

        <div className="ghostify-wordmark">GHOSTIFY</div>
        <div className="subheading">GHOSTIFY CORE ACCESS</div>

        <div className="light-divider" />

        <h2 className="primary-title">CORE&apos;A GİRİŞ YAP</h2>

        <p className="helper-text">
          Hesabınıza güvenli erişim için e-posta ve şifrenizi girin.
        </p>

        {invite && (
          <p className="invite-active">
            Aktif davet kodu: <strong>{invite}</strong>
          </p>
        )}

        {error && <p className="error-box">{error}</p>}

        <form onSubmit={handleSubmit} className="form-shell">
          <div className="field neon-field">
            <label>E-POSTA</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field neon-field">
            <label>ŞİFRE</label>
            <input
              type="password"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-button neon-button" disabled={loading}>
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </form>

        <div className="auth-links">
          <a href="#">Şifremi unuttum</a> ·{" "}
          <a href="/register">Yeni hesap oluştur</a>
        </div>

        <div className="secondary-link">
          <a href="/">← Davet ekranına dön</a>
        </div>
      </div>
    </div>
  );
}
