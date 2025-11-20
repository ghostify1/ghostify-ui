// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Lütfen davet kodu girin.");
      return;
    }
    router.push(`/login?invite=${encodeURIComponent(code.trim())}`);
  };

  return (
    <div className="ghostify-page">
      <div className="ghostify-card">
        {/* LOGO */}
        <div className="logo-ring">
          <div className="logo-ring-inner">
            <img src="/ghost-logo.png" alt="Ghostify" />
          </div>
        </div>

        {/* WORDMARK */}
        <div className="ghostify-logo-text">GHOSTIFY</div>
        <div className="ghostify-subtitle">GHOSTIFY CORE LOADING</div>

        <div className="divider-glow" />

        {/* ICON ROW */}
        <div className="icon-row-cyan">
          <span>🔒</span>
          <span>🛡️</span>
          <span>🌀</span>
        </div>

        {/* TITLE */}
        <h2 className="ghostify-title">
          DAVET KODUNUZU
          <br />
          GİRİN
        </h2>

        <p className="ghostify-muted">
          Ghostify Core&apos;a erişmek için size özel davet kodunu girin.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="ghostify-form">
          <div className="ghostify-field">
            <input
              className="ghostify-input"
              placeholder="DAVET KODUNUZU YAZIN"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button className="ghostify-button" type="submit">
            DEVAM ET
          </button>
        </form>

        <div className="ghostify-link">
          DAVET KODUNUZ YOK MU? <span>KOD TALEP ET</span>
        </div>
      </div>
    </div>
  );
}
