// pages/login.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invite, setInvite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL'den davet kodunu oku
  useEffect(() => {
    if (router.query.invite) {
      setInvite(String(router.query.invite));
    }
  }, [router.query.invite]);

  // Zaten login ise dashboard'a gönder
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
      <div className="matrix-layer" />

      <div className="glass-panel center">
        <div className="logo-ring">
          <div className="logo-ring-inner">
            <img src="/ghost-logo.png" alt="Ghostify" />
          </div>
        </div>

        <div className="ghostify-wordmark">GHOSTIFY</div>
        <div className="subheading">GHOSTIFY CORE ACCESS</div>

        <div className="light-divider" />

        <h2 className="primary-title">CORE&apos;A GİRİŞ YAP</h2>

        <p className="helper-text">
          Ghostify core paneline erişmek için kayıtlı e-posta ve şifrenizle giriş
          yapın.
        </p>

        {invite && (
          <p
            className="helper-text"
            style={{ fontSize: 11, opacity: 0.85, marginTop: -8 }}
          >
            Aktif davet kodu: <strong>{invite}</strong>
          </p>
        )}

        {error && (
          <p
            style={{
              marginTop: 10,
              marginBottom: 10,
              color: "#ffb3b3",
              fontSize: 12,
            }}
          >
            {error}
          </p>
        )}

        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <div className="field">
            <label>E-POSTA</label>
            <input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label>ŞİFRE</label>
            <input
              type="password"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>
        </form>

        <div className="auth-links">
          <a href="#">Şifremi unuttum</a> · <a href="#">Yeni hesap oluştur</a>
        </div>

        <div className="secondary-link" style={{ marginTop: 18 }}>
          DAVET EKRANINA DÖN ·{" "}
          <a href="/">DAVET KODU GİR</a>
        </div>
      </div>
    </div>
  );
}
