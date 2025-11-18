// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../lib/firebaseClient";
import MatrixBackground from "../components/MatrixBackground";

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Lütfen e-posta ve şifrenizi girin.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Giriş başarılı → dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Giriş başarısız. E-posta veya şifre hatalı olabilir.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // İleride gerçek "şifre sıfırlama" ekranına bağlayacağız.
    alert("Şifre sıfırlama sistemi yakında aktif olacak.");
  };

  const handleGoRegister = () => {
    router.push("/register");
  };

  return (
    <div className="login-root">
      <MatrixBackground />
      <div className="login-overlay-gradient" />

      <main className="login-content">
        <section className="login-card">
          {/* Logo + halo */}
          <div className="login-logo-halo">
            <div className="login-logo-circle">
              <span className="login-ghost-icon">👻</span>
            </div>
          </div>

          {/* Üst başlıklar */}
          <div className="login-header">
            <p className="login-init-text">GHOSTIFY ACCESS INITIALIZING…</p>
            <h1 className="login-title">GHOSTIFY</h1>
            <p className="login-subtitle">ACCOUNT ACCESS</p>

            <div className="login-core-divider">
              <div className="login-core-line" />
              <div className="login-core-icons">
                <span className="login-core-icon">🔒</span>
                <span className="login-core-icon">🧬</span>
                <span className="login-core-icon">🕵️‍♂️</span>
                <span className="login-core-icon">🛰️</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <p className="login-headline">
              Hesabına güvenli erişim için giriş yap.
            </p>

            <div className="login-input-group">
              <label className="login-label">E-posta adresi</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">📧</span>
                <input
                  type="email"
                  className="login-input"
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <div className="login-input-glow" />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Şifre</label>
              <div className="login-input-wrapper">
                <input
                  type="password"
                  className="login-input"
                  placeholder="Şifrenizi yazın"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-button"
                  onClick={() =>
                    alert("Şifre göster/gizle özelliği yakında eklenecek.")
                  }
                >
                  👁
                </button>
                <div className="login-input-glow" />
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className={`login-button ${
                loading ? "login-button-loading" : ""
              }`}
              disabled={loading}
            >
              <span>
                {loading ? "GİRİŞ YAPILIYOR…" : "GİRİŞ YAP"}
              </span>
              <span className="login-button-glow" />
            </button>
          </form>

          {/* Alt linkler */}
          <div className="login-footer-links">
            <button
              type="button"
              className="login-link"
              onClick={handleForgotPassword}
            >
              Şifreni mi unuttun?
              <span className="login-underline-animate" />
            </button>

            <div className="login-register-row">
              <span className="login-footer-text">Hesabın yok mu?</span>
              <button
                type="button"
                className="login-link-strong"
                onClick={handleGoRegister}
              >
                Kayıt ol
                <span className="login-underline-animate" />
              </button>
            </div>
          </div>

          {/* Alt ikon şeridi */}
          <div className="login-footer-icons">
            <span>🔐</span>
            <span>🛰</span>
            <span>🧬</span>
            <span>🧠</span>
          </div>
        </section>
      </main>
    </div>
  );
}
