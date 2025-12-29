import { useState } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(`Davet kodu geçersiz. (${data?.reason || "UNKNOWN"})`);
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Sunucu hatası.");
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
        <div className="small" style={{ marginTop: 10 }}>
          Davet kodu olmadan giriş yapılamaz.
        </div>
      </div>
    </div>
  );
}
