import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) window.location.href = "/login";
      setUser(u);
    });
    return () => unsub();
  }, []);

  const startScan = async () => {
    setLoading(true);
    setScanResult(null);

    const r = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        phone,
        username,
        address,
      }),
    });

    const data = await r.json();
    setScanResult(data.results || {});
    setLoading(false);
  };

  const logout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    window.location.href = "/login";
  };

  if (!user)
    return (
      <div style={loadingScreen}>
        <p>Yükleniyor...</p>
      </div>
    );

  return (
    <div style={background}>
      <div style={panel}>
        <h1 style={logo}>GHOSTIFY</h1>

        <h2 style={welcome}>
          Hoş geldin,<br /> {user.email}
        </h2>

        <p style={subtitle}>
          Core aktif. Verilerini tara, rapor oluştur veya silme talebi üret.
        </p>

        <div style={inputContainer}>
          <input
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={input}
          />

          <input
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={input}
          />

          <input
            placeholder="Adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={input}
          />
        </div>

        <button onClick={startScan} style={mainButton}>
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        {scanResult && (
          <div style={resultBox}>
            <h3 style={{ marginBottom: "10px" }}>Tarama Sonuçları</h3>
            <pre style={resultText}>
              {JSON.stringify(scanResult, null, 2)}
            </pre>
          </div>
        )}

        <button onClick={logout} style={logoutButton}>
          Çıkış
        </button>
      </div>
    </div>
  );
}

//
// ---------- STYLES ----------
//

const background = {
  height: "100vh",
  width: "100vw",
  background: "url('/matrix.gif') center/cover no-repeat",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const panel = {
  width: "420px",
  background: "rgba(0, 0, 20, 0.75)",
  padding: "35px",
  borderRadius: "20px",
  backdropFilter: "blur(18px)",
  boxShadow: "0 0 40px #00c8ff44",
  border: "1px solid rgba(0, 200, 255, 0.25)",
};

const logo = {
  textAlign: "center",
  color: "#80E6FF",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "3px",
  marginBottom: "10px",
};

const welcome = {
  textAlign: "center",
  color: "#fff",
  fontSize: "18px",
  marginBottom: "10px",
};

const subtitle = {
  textAlign: "center",
  color: "#ccc",
  marginBottom: "20px",
  fontSize: "13px",
};

const inputContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "15px",
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #0a3450",
  background: "#071520",
  color: "#fff",
  fontSize: "14px",
  transition: "0.25s",
};

const mainButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #00c8ff, #0077ff)",
  color: "#000",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
  fontWeight: "700",
  fontSize: "15px",
  boxShadow: "0 0 15px #00c8ff66",
  transition: "0.25s",
};

const resultBox = {
  background: "rgba(0,0,30,0.7)",
  padding: "15px",
  marginTop: "20px",
  borderRadius: "12px",
  border: "1px solid rgba(0,200,255,0.2)",
  color: "#fff",
  maxHeight: "200px",
  overflowY: "auto",
};

const resultText = {
  whiteSpace: "pre-wrap",
  fontSize: "12px",
  color: "#cceeff",
};

const logoutButton = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  background: "#333",
  color: "#eee",
  border: "1px solid #444",
  cursor: "pointer",
  marginTop: "15px",
  fontSize: "14px",
};

const loadingScreen = {
  display: "grid",
  placeItems: "center",
  height: "100vh",
  background: "#000",
  color: "#80E6FF",
};
