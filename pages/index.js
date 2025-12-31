import { useState } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    setDebug("");

    try {
      const url = "/api/invite/verify";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const text = await res.text(); // JSON değilse bile yakalar
      setDebug(`URL: ${url}\nSTATUS: ${res.status}\nBODY: ${text}`);

      // Eğer ok dönüyorsa login'e gönder
      if (res.ok) {
        router.push("/login");
        return;
      }

      setError("Davet kodu reddedildi. (debug aşağıda)");
    } catch (e) {
      setError("Fetch hatası (debug aşağıda).");
      setDebug(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="h1">GHOSTIFY • INVITE</div>

        <input
          className="input"
          placeholder="Davet kodu"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        <div style={{ height: 12 }} />
        <button className="btn" onClick={submit} disabled={loading}>
          {loading ? "Kontrol ediliyor..." : "Devam Et"}
        </button>

        {error && <div className="err">{error}</div>}

        {debug && (
          <pre style={{ marginTop: 12, whiteSpace: "pre-wrap", fontSize: 12, opacity: 0.9 }}>
            {debug}
          </pre>
        )}
      </div>
    </div>
  );
}
