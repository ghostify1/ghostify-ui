import { useState } from "react";
// ...mevcut importlar...

export default function Dashboard() {
  if (typeof window === "undefined") return null;
  const [user, setUser] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    if (sessionStorage.getItem("invited") !== "true") window.location.replace("/");
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const runScan = async () => {
    if (!user?.email) return;
    setLoading(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (e) {
      setScanResult({ error: "Tarama başarısız" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="g-center">
        <MatrixBackground />
        <div className="content"><p>Yükleniyor…</p></div>
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
          Core hazır. Şimdi verilerini tarayabilirsin.
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
                {scanResult.hibp?.length > 0 && (
                  <ul>
                    {scanResult.hibp.map((b, i) => (
                      <li key={i}>{b.Name} – {b.Domain}</li>
                    ))}
                  </ul>
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
