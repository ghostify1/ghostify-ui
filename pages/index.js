// pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitInvite = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError("Geçersiz davet kodu.");
        setLoading(false);
        return;
      }

      // başarılı → login
      router.push("/login");
    } catch (e) {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* mevcut UI’n kalabilir */}
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Davet kodu"
      />
      <button onClick={submitInvite} disabled={loading}>
        {loading ? "Kontrol ediliyor..." : "Devam Et"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
