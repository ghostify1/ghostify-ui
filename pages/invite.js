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

      let data = {};
      try {
        data = await res.json();
      } catch {
        // JSON hatası olsa bile hata mesajı göster
        throw new Error("Sunucudan beklenmeyen yanıt alındı.");
      }

      if (!res.ok) throw new Error(data.error || "Davet kodu geçersiz.");
      setMessage("✅ Davet onaylandı, yönlendiriliyor...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h1 style={{ color: "#9efeff", marginBottom: "20px" }}>Ghostify Daveti</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Davet Kodunu Gir"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            textAlign: "center",
            border: "1px solid #9efeff",
            borderRadius: "5px",
            marginBottom: "10px",
            background: "black",
            color: "white",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#9efeff",
            color: "black",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Kontrol Ediliyor..." : "Devam Et"}
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "20px", color: message.startsWith("✅") ? "#00ffb7" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
