// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import MatrixBackground from "@/components/MatrixBackground";
import { motion } from "framer-motion";

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
    <div className="ghostify-root">
      {/* MATRIX BG */}
      <MatrixBackground />

      {/* MAIN CARD */}
      <motion.div
        className="ghostify-card hover-lift"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        {/* LOGO */}
        <motion.div
          className="logo-ring"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="logo-ring-inner">
            <img src="/ghost-logo.png" alt="Ghostify" />
          </div>
        </motion.div>

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
        <h2 className="ghostify-title" style={{ marginTop: 18 }}>
          DAVET KODUNUZU
          <br />
          GİRİN
        </h2>

        <p className="ghostify-muted" style={{ marginTop: 4 }}>
          Ghostify Core&apos;a erişmek için size özel davet kodunu girin.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

        <div className="ghostify-link" style={{ marginTop: 22 }}>
          DAVET KODUNUZ YOK MU? <span>KOD TALEP ET</span>
        </div>
      </motion.div>
    </div>
  );
}
