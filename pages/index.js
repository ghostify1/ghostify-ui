// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import MatrixBackground from "../components/MatrixBackground";
import "../styles/invite.css";

export default function InvitePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inviteCode.trim()) {
      setError("Lütfen davet kodunuzu girin.");
      return;
    }

    // Burada ileride gerçek davet kodu doğrulama API'sine bağlanacağız.
    // Şimdilik kod dolu ise login sayfasına geçiyoruz.
    setLoading(true);

    try {
      // küçük bir “core loading” hissi için kısa bekleme
      await new Promise((r) => setTimeout(r, 600));
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = () => {
    // Şimdilik sadece bilgi verelim; ileride “kod talep” için ayrı sayfa / modal açabiliriz.
    alert("Kod talep sistemi yakında aktif olacak.");
  };

  return (
    <div className="invite-root">
      <MatrixBackground />

      <div className="invite-overlay-gradient" />

      <main className="invite-content">
        <section className="invite-card">
          {/* Logo + halo */}
          <div className="invite-logo-halo">
            <div className="invite-logo-circle">
              <span className="ghost-icon">👻</span>
            </div>
          </div>

          <h1 className="invite-title">GHOSTIFY</h1>
          <p className="invite-subtitle">GHOSTIFY CORE LOADING</p>

          <div className="invite-core-divider">
            <div className="invite-core-line" />
            <div className="invite-core-icons">
              <span className="core-icon">🔒</span>
              <span className="core-icon">🧬</span>
              <span className="core-icon">🕵️‍♂️</span>
              <span className="core-icon">🌀</span>
            </div>
          </div>

          <h2 className="invite-headline">DAVET KODUNUZU GİRİN</h2>

          <form className="invite-form" onSubmit={handleSubmit}>
            <div className="invite-input-wrapper">
              <input
                type="text"
                className="invite-input"
                placeholder="DAVET KODUNUZU YAZIN"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                autoComplete="off"
              />
              <div className="invite-input-glow" />
            </div>

            {error && <p className="invite-error">{error}</p>}

            <button
              type="submit"
              className={`invite-button ${loading ? "invite-button-loading" : ""}`}
              disabled={loading}
            >
              <span>{loading ? "CORE DOĞRULANIYOR..." : "DEVAM ET"}</span>
              <span className="invite-button-glow" />
            </button>
          </form>

          <div className="invite-footer">
            <span className="invite-footer-text">
              DAVET KODUNUZ YOK MU?
            </span>
            <button
              type="button"
              className="invite-footer-link"
              onClick={handleRequestCode}
            >
              KOD TALEP ET
              <span className="underline-animate" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
