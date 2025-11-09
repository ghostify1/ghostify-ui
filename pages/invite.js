// pages/invite.js
import { useState } from "react";

export default function InvitePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/invite/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        // Cookie zaten API'de ayarlanıyor
        window.location.href = "/login";
      } else {
        setError(data.error || "Geçersiz davet kodu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh",background:"#000"}}>
      <form onSubmit={handleSubmit} style={{textAlign:"center"}}>
        <h2 style={{color:"#80E6FF"}}>Davet Kodu</h2>
        <input
          value={code}
          onChange={(e)=>setCode(e.target.value)}
          placeholder="Davet kodunu giriniz"
          style={{
            padding:"10px 14px",
            background:"#111",
            color:"#fff",
            border:"1px solid #80E6FF",
            borderRadius:6,
            outline:"none"
          }}
        />
        <div style={{marginTop:12}}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding:"10px 20px",
              borderRadius:6,
              border:"none",
              background:"#80E6FF",
              color:"#000",
              cursor:"pointer"
            }}
          >
            {loading ? "Doğrulanıyor..." : "Onayla"}
          </button>
        </div>
        {error && <p style={{color:"tomato",marginTop:8}}>{error}</p>}
      </form>
    </div>
  );
}
