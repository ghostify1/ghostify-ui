import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {
  if (typeof window === "undefined") return null;

  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const invited = sessionStorage.getItem("invited");
    if (invited !== "true") window.location.replace("/");
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const runScan = async () => {
    if (!user || !user.email) {
      alert("Kullanıcı oturumu doğrulanamadı.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (e) {
      console.error(e);
      setScanResult({ error: "Tarama başarısız." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="g-center">
        <MatrixBackground />
        <div className="content">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="g-center">
      <MatrixBackground />
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{ textAlign: "center" }}>
          Hoş geldin, {user.displayName || user.email}
        </h2>

        <p className="small">Core aktif. Şimdi verilerini tarayabilirsin.</p>

        <button onClick={runScan} disabled={loading}>
          {loading ? "Taranıyor..." : "Veri Taraması Başlat"}
        </button>

        {scanResult && (
          <div style={{ marginTop: 20, textAlign: "left" }}>
            {scanResult.error ? (
              <p style={{ color: "#ffb4b4" }}>{scanResult.error}</p>
            ) : (
              <>
                <p>🔍 E-posta: <b>{scanResult.email}</b></p>
                <p>💀 Toplam İhlal: <b>{scanResult.breaches}</b></p>
                {scanResult.breaches > 0 && (
                  <button
                    style={{ marginTop: 10 }}
                    onClick={async () => {
                      const res = await fetch("/api/pdf", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: scanResult.email,
                          breaches: scanResult.hibp || [],
                        }),
                      });
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "ghostify_report.pdf";
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Raporu İndir (PDF)
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={() => signOut(auth)}
          style={{ marginTop: 20 }}
        >
          Çıkış
        </button>
      </div>
    </div>
  );
}
