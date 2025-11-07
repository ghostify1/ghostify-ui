// pages/invite.js
import { useState } from "react";

export default function InvitePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        throw new Error(data?.error || "Geçersiz davet kodu");
      }

      // Davet geçerli
      setSuccess(true);
      localStorage.setItem("ghostify_invite_ok", "true");

      // 1.5 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh",background:"#000",color:"#80E6FF"}}>
      <h2>Ghostify Daveti</h2>
      <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"12px",width:"280px"}}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Davet Kodunuzu Girin"
          style={{
            padding:"10px",
            borderRadius:"6px",
            border:"1px solid #80E6FF",
            background:"transparent",
            color:"#80E6FF",
            textAlign:"center"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding:"10px",
            borderRadius:"6px",
            border:"none",
            background:"#80E6FF",
            color:"#000",
            fontWeight:"bold",
            cursor:"pointer"
          }}
        >
          {loading ? "Doğrulanıyor..." : "Devam Et"}
        </button>
      </form>

      {error && <p style={{color:"red",marginTop:"10px"}}>{error}</p>}
      {success && <p style={{color:"#00ff9f",marginTop:"10px"}}>Davet onaylandı, yönlendiriliyor...</p>}
    </div>
  );
}
