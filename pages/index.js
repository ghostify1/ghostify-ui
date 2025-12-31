import { useState } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Kullanıcı mesajı
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Debug/kanıt (API ne döndürdü?)
  const [debug, setDebug] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    setOkMsg("");
    setDebug("");

    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      // JSON bekliyoruz ama bazen string dönebilir -> güvenli yakala
      let data = {};
      try {
        data = await res.json();
      } catch {
        const t = await res.text();
        data = { raw: t };
      }

      // Kanıt/debug: status + body
      setDebug(
        `STATUS: ${res.status}\n` +
        `STAMP: ${data?.stamp || "-"}\n` +
        `REASON: ${data?.reason || "-"}\n` +
        `MODE: ${data?.mode || "-"}\n` +
        `REQUIRED: ${String(data?.required ?? "-")}\n` +
        `CODES_COUNT: ${String(data?.codesCount ?? "-")}\n` +
        `RAW_LEN: ${String(data?.rawLen ?? "-")}`
      );

      if (!res.ok) {
        setError(`Davet reddedildi: ${data?.reason || "UNKNOWN"} • ${data?.stamp || ""}`);
        return;
      }

      // Başarılı
      setOkMsg(`OK: ${data?.reason || "OK"} • ${data?.stamp || ""}`);

      // küçük bir gecikme (UI hissi) — zorunlu değil
      setTimeout(() => router.push("/login"), 200);
    } catch (e) {
      setError("Sunucuya erişilemedi.");
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
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />

        <div style={{ height: 12 }} />
        <button className="btn" onClick={submit} disabled={loading}>
          {loading ? "Kontrol ediliyor..." : "Devam Et"}
        </button>

        {error && <div className="err">{error}</div>}
        {okMsg && <div className="ok">{okMsg}</div>}

        {/* Kanıt/debug alanı */}
        {debug && (
          <pre
            style={{
              marginTop: 12,
              whiteSpace: "pre-wrap",
              fontSize: 12,
              opacity: 0.9,
              padding: 10,
              borderRadius: 12,
              border: "1px solid rgba(120,180,255,0.18)",
              background: "rgba(0,0,0,0.25)"
            }}
          >
            {debug}
          </pre>
        )}

        <div className="small" style={{ marginTop: 10 }}>
          Davet kodu olmadan giriş yapılamaz.
        </div>
      </div>
    </div>
  );
}
