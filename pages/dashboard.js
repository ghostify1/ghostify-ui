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
    setMessage("Silme talebi gönderiliyor...");
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
      if (data.success) setMessage("Silme talebi başarıyla oluşturuldu.");
    } catch {
      setMessage("Silme talebi gönderilemedi.");
    }
  };

  const downloadReport = async () => {
    window.location.href = "/api/pdf"; // PDF endpoint'in varsa
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
          "url('https://ghostifyhq.com/matrix-bg.gif')",
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          background: "rgba(0,0,30,0.6)",
          borderRadius: "18px",
          boxShadow: "0 0 30px rgba(0,150,255,0.4)",
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <h2 style={{ marginBottom: "12px", letterSpacing: "3px" }}>GHOSTIFY</h2>

        <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>
          Hoş geldin, <br />
          {user.email}
        </h3>

        <p style={{ marginBottom: "25px", opacity: 0.8 }}>
          Core aktif: Verilerini tara, rapor indir veya silme talebi oluştur.
        </p>

        <button
          onClick={startScan}
          disabled={loading}
          style={buttonStyle("#1EA7D7")}
        >
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        <button
          onClick={downloadReport}
          style={buttonStyle("#1EA7D7")}
        >
          Raporu İndir (PDF)
        </button>

        <button
          onClick={() => setMessage("Silme talebi hazırlanıyor...")}
          style={buttonStyle("#1EA7D7")}
        >
          Silme Talebini Gizle
        </button>

        <button
          onClick={sendDeleteRequest}
          style={{
            ...buttonStyle("#1EA7D7"),
            background: "#37C3FF",
          }}
        >
          Talebi Gönder
        </button>

        <p style={{ marginTop: "15px", fontSize: "16px" }}>
          🔎 E-posta: {user.email}
        </p>

        <p style={{ marginTop: "5px", fontSize: "16px" }}>
          💀 Toplam ihlal: {scanResult?.total || 0}
        </p>

        {message && (
          <p style={{ marginTop: "15px", fontSize: "16px" }}>{message}</p>
        )}

        <button
          onClick={logout}
          style={{
            ...buttonStyle("#333"),
            marginTop: "25px",
          }}
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}

function buttonStyle(color) {
  return {
    width: "100%",
    padding: "14px",
    fontSize: "17px",
    background: color,
    borderRadius: "10px",
    border: "none",
    marginBottom: "15px",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(100,200,255,0.3)",
  };
}
