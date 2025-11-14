import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Dashboard() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user)
    return (
      <div style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        background: "#000",
        color: "#80E6FF",
      }}>
        <p>Yükleniyor...</p>
      </div>
    );

  const startScan = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (data.success) {
        setScanResult(data);
        setMessage(`Toplam ihlal: ${data.total || 0}`);
      } else {
        setMessage("Tarama başarısız.");
      }
    } catch {
      setMessage("Tarama başarısız.");
    }
    setLoading(false);
  };

  const sendDeleteRequest = async () => {
    setMessage("Silme talebi hazırlanıyor...");
    try {
      const res = await fetch("/api/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          breaches: scanResult?.breaches || [],
        }),
      });

      const data = await res.json();
      if (data.success) setMessage("Silme talebi başarıyla gönderildi.");
    } catch {
      setMessage("Silme talebi gönderilemedi.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "#000",
        backgroundImage:
          "url('https://i.ibb.co/SrCwKH1/matrix-ghostify.gif')",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "520px",
          padding: "45px",
          background: "rgba(0,0,30,0.55)",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(0,150,255,0.45)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <h2 style={{ marginBottom: "12px", letterSpacing: "4px", fontSize: "28px" }}>
          GHOSTIFY
        </h2>

        <h3 style={{ marginBottom: "25px", fontWeight: "normal", fontSize: "20px" }}>
          Hoş geldin, <br />
          {user.email}
        </h3>

        <p style={{ marginBottom: "28px", opacity: 0.8, fontSize: "15px" }}>
          Core aktif. Verilerini tara, rapor indir veya silme talebi oluştur.
        </p>

        {/* Tarama */}
        <button
          onClick={startScan}
          disabled={loading}
          style={button("#1EA7D7")}
        >
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        <button onClick={() => window.location.href = "/api/pdf"} style={button("#29B8E6")}>
          Raporu İndir (PDF)
        </button>

        <button onClick={() => setMessage("Silme talebi hazırlanıyor...")} style={button("#1EA7D7")}>
          Silme Talebini Gizle
        </button>

        <button onClick={sendDeleteRequest} style={button("#37C3FF")}>
          Talebi Gönder
        </button>

        {/* Sonuçlar */}
        <p style={{ marginTop: "18px", fontSize: "16px" }}>
          ✉ E-posta: {user.email}
        </p>

        <p style={{ marginTop: "6px", fontSize: "16px" }}>
          💀 Toplam ihlal: {scanResult?.total || 0}
        </p>

        <p style={{ marginTop: "12px", fontSize: "15px", opacity: 0.85 }}>
          {message}
        </p>

        {/* Çıkış */}
        <button
          onClick={logout}
          style={{
            ...button("#333"),
            marginTop: "28px",
            background: "#2A2A2A",
          }}
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}

function button(color) {
  return {
    width: "100%",
    padding: "16px",
    fontSize: "18px",
    background: color,
    borderRadius: "12px",
    border: "none",
    marginBottom: "18px",
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(100,200,255,0.35)",
  };
}
