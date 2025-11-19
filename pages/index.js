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
    <div className="page-shell invite-page">
      <div className="matrix-layer" />

      <div className="glass-panel center">
        {/* Logo */}
        <div className="logo-ring">
          <div className="logo-ring-inner">
            <img src="/ghost-logo.png" alt="Ghostify" />
          </div>
        </div>

        <div className="ghostify-wordmark">GHOSTIFY</div>
        <div className="subheading">GHOSTIFY CORE LOADING</div>

        <div className="light-divider" />

        <div className="icon-row">
          <span>🔒</span>
          <span>🛡️</span>
          <span>🌀</span>
        </div>

        <h2 className="primary-title">
          DAVET KODUNUZU
          <br />
          GİRİN
        </h2>

        <p className="helper-text">
          Ghostify core&apos;a erişmek için size özel davet kodunu girin.
        </p>

        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <div className="field">
            <label>DAVET KODUNUZ</label>
            <input
              type="text"
              placeholder="DAVET KODUNUZU YAZIN"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-button">
            DEVAM ET
          </button>
        </form>

        <div className="secondary-link">
          DAVET KODUNUZ YOK MU?{" "}
          <a href="#">KOD TALEP ET</a>
        </div>
      </div>
    </div>
  );
}
