// pages/dashboard.js

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Dashboard() {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Kullanıcı login kontrolü
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) setEmail(u.email);
    });
    return () => unsub();
  }, []);

  if (!user) {
    return (
      <div style={{ color: "#80E6FF", background: "#000", height: "100vh", display: "grid", placeItems: "center" }}>
        Yükleniyor...
      </div>
    );
  }

  // TARAMA
  const handleScan = async () => {
    setLoading(true);
    setScanResult(null);

    try {
      const r = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, username, address }),
      });

      const data = await r.json();
      setScanResult(data);
    } catch (err) {
      setScanResult({ error: "Tarama hatası oluştu." });
    }

    setLoading(false);
  };

  // PDF İNDİRME
  const handlePDF = async () => {
    if (!scanResult || !scanResult.summary) {
      alert("Önce bir tarama yapmalısın.");
      return;
    }

    setPdfLoading(true);

    try {
      const r = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          summary: scanResult.summary,
          results: scanResult.results
        }),
      });

      const blob = await r.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ghostify-rapor.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("PDF indirilemedi.");
    }

    setPdfLoading(false);
  };

  // SİLME TALEBİ
  const handleDeleteRequest = async () => {
    if (!scanResult || !scanResult.summary) {
      alert("Önce bir tarama yapmalısın.");
      return;
    }

    setDeleteLoading(true);

    try {
      const r = await fetch("/api/delete-request.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          summary: scanResult.summary,
          results: scanResult.results,
        }),
      });

      const data = await r.json();

      if (data.success) {
        alert("Silme talebi başarıyla gönderildi.");
      } else {
        alert("Silme talebi gönderilemedi.");
      }
    } catch (err) {
      alert("Silme talebi sırasında hata oluştu.");
    }

    setDeleteLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          width: "480px",
          padding: "32px",
          borderRadius: "20px",
          background: "rgba(10,20,40,0.6)",
          boxShadow: "0 0 30px rgba(0,200,255,0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* BAŞLIK */}
        <h1 style={{ textAlign: "center", color: "#6EEBFF", marginBottom: "4px" }}>
          GHOSTIFY
        </h1>
        <p style={{ textAlign: "center", color: "#DDF" }}>
          Hoş geldin, <br /> {user.email}
        </p>

        <p style={{ textAlign: "center", marginBottom: "20px", color: "#89C" }}>
          Core aktif. Verilerini tara, rapor oluştur veya silme talebi üret.
        </p>

        {/* FORM ALANLARI */}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          style={inputStyle}
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon"
          style={inputStyle}
        />

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı Adı"
          style={inputStyle}
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adres / Anahtar Kelime"
          style={inputStyle}
        />

        {/* TARAMA */}
        <button onClick={handleScan} style={btnPrimary}>
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        {/* PDF */}
        <button onClick={handlePDF} style={btnSecondary}>
          {pdfLoading ? "PDF hazırlanıyor..." : "Raporu İndir (PDF)"}
        </button>

        {/* SİLME TALEBİ */}
        <button onClick={handleDeleteRequest} style={btnSecondary}>
          {deleteLoading ? "Gönderiliyor..." : "Silme Talebi Gönder"}
        </button>

        {/* SONUÇ BLOKU */}
        {scanResult && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "rgba(0,0,30,0.6)",
              borderRadius: "10px",
              color: "#AEE",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid rgba(0,150,255,0.3)",
            }}
          >
            <strong>Tarama Sonuçları</strong>
            <br />
            {JSON.stringify(scanResult, null, 2)}
          </div>
        )}

        {/* ÇIKIŞ */}
        <button
          onClick={() => signOut(auth)}
          style={{ ...btnSecondary, background: "#444", marginTop: "20px" }}
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}

/* Stil Ayarları */

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "6px 0",
  borderRadius: "10px",
  border: "1px solid #1C4",
  background: "rgba(0,0,20,0.4)",
  color: "#AEE",
  fontSize: "15px",
  outline: "none",
};

const btnPrimary = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  background: "linear-gradient(90deg, #00D2FF, #0066FF)",
  border: "none",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const btnSecondary = {
  width: "100%",
  padding: "14px",
  marginTop: "10px",
  background: "rgba(0,180,255,0.3)",
  border: "1px solid rgba(0,180,255,0.5)",
  borderRadius: "10px",
  color: "#AEE",
  cursor: "pointer",
  fontSize: "15px",
};
