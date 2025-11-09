// pages/invite.js
import { useState } from "react";

export default function InvitePage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Geçersiz davet kodu.");

      document.cookie = "ghostify_invite_ok=1; path=/; max-age=604800;";
      localStorage.setItem("ghostify_invite_ok", "1");

      setMessage("✅ Davet onaylandı, yönlendiriliyor...");
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "black",
        color: "white",
        height: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <h2 style={{ color: "#80E6FF" }}>Ghostify Daveti</h2>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Davet Kodunu Gir"
          style={{ padding: 10, textAlign: "center", borderRadius: 8, border: "1px solid #80E6FF" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            background: "#80E6FF",
            color: "black",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Doğrulanıyor..." : "Devam Et"}
        </button>
        {message && <p style={{ color: message.startsWith("✅") ? "#00ffb7" : "red" }}>{message}</p>}
      </form>
    </div>
  );
}
