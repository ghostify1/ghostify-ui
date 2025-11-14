import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {
  if (typeof window === "undefined") return null;

  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState(null);
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
    setScanResult(null);
    try {
      const res = await fetch("/api/scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: user.email,
    phone: phoneValue,
    username: usernameValue,
    password: passwordValue,
    domain: domainValue
  }),
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

  const generatePDF = async () => {
    if (!scanResult) return;
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
  };

  const sendDeleteRequest = async () => {
    if (!scanResult || !scanResult.email) return;
    setDeleteResponse("Silme talebi gönderiliyor...");
    try {
      const res = await fetch("/api/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: scanResult.email,
          breaches: scanResult.hibp || [],
        }),
      });
      const data = await res.json();
      setDeleteResponse(data.message || "Silme talebi başarıyla gönderildi.");
    } catch (err) {
      setDeleteResponse("Bir hata oluştu: " + err.message);
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

        <p className="small">
          Core aktif. Verilerini tara, rapor indir veya silme talebi oluştur.
        </p>

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

                <button style={{ marginTop: 10 }} onClick={generatePDF}>
                  Raporu İndir (PDF)
                </button>

                <button
                  style={{ marginTop: 10 }}
                  onClick={() => setShowDeleteForm(!showDeleteForm)}
                >
                  {showDeleteForm
                    ? "Silme Talebini Gizle"
                    : "Silme Talebi Oluştur"}
                </button>

                {showDeleteForm && (
                  <div style={{ marginTop: 12 }}>
                    <p className="small">
                      Bu e-posta ile ilişkili platformlara kişisel veri silme talebi gönderilecektir.
                    </p>
                    <button onClick={sendDeleteRequest}>Talebi Gönder</button>
                    {deleteResponse && (
                      <p style={{ marginTop: 10 }}>{deleteResponse}</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <button onClick={() => signOut(auth)} style={{ marginTop: 20 }}>
          Çıkış
        </button>
      </div>
    </div>
  );
}
