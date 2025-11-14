import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Dashboard() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Kullanıcı verisini getir
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user)
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
          background: "#000",
          color: "#80E6FF",
        }}
      >
        <p>Yükleniyor...</p>
      </div>
    );

  // TARAYICI → /api/scan
  const startScan = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setScanResult(data);
        setMessage(
          `Toplam ihlal: ${data.total || 0}`
        );
      } else {
        setMessage("Tarama başarısız.");
      }
    } catch (err) {
      setMessage("Tarama başarısız.");
    }

    setLoading(false);
  };

  // Çıkış
  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: "420px",
          padding: "35px",
          background: "rgba(0,0,0,0.6)",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(128,230,255,0.45)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>GHOSTIFY</h2>
        <h3 style={{ marginBottom: "20px" }}>
          Hoş geldin, <br /> {user.email}
        </h3>

        <p style={{ marginBottom: "20px" }}>
          Core aktif. Verilerini tara, rapor indir veya silme talebi oluştur.
        </p>

        {/* TARAMA BUTONU */}
        <button
          onClick={startScan}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "18px",
            background: "#1EA7D7",
            borderRadius: "10px",
            border: "none",
            marginBottom: "20px",
          }}
        >
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        {message && (
          <p style={{ marginBottom: "20px", fontSize: "16px" }}>{message}</p>
        )}

        {/* ÇIKIŞ */}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px",
            background: "#444",
            color: "white",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
          }}
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}

