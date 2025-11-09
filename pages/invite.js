// pages/invite.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function InvitePage() {
  const router = useRouter();
  const [codes, setCodes] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Debug: tarayıcı konsolunda env'in görünürlüğünü kontrol et
    console.log("NEXT_PUBLIC_INVITE_CODES:", process.env.NEXT_PUBLIC_INVITE_CODES);
    const raw = process.env.NEXT_PUBLIC_INVITE_CODES || "";
    const arr = raw.split(",").map(s => s.trim()).filter(Boolean);
    setCodes(arr.map(c => c.toLowerCase())); // case-insensitive karşılaştırma
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const candidate = (input || "").trim().toLowerCase();
    if (!candidate) {
      setError("Lütfen davet kodunu gir.");
      return;
    }
    if (codes.includes(candidate)) {
      // Geçerli - oturum veya redirect işlemini yap
      // Örnek: localStorage veya cookie ile işaretle, sonra /login veya /register'e yönlendir
      localStorage.setItem("ghostify_invite", candidate);
      router.push("/login"); // veya register
    } else {
      setError("Geçersiz davet kodu.");
    }
  };

  return (
    <div style={{display:'grid', placeItems:'center', height:'100vh', background:'#000'}}>
      <form onSubmit={handleSubmit} style={{textAlign:'center'}}>
        <h2 style={{color:'#80E6FF'}}>Davet Kodu</h2>
        <input
          value={input}
          onChange={(e)=>{ setInput(e.target.value); setError(""); }}
          placeholder="Davet kodunu giriniz"
          style={{padding:10, fontSize:16}}
        />
        <div style={{marginTop:12}}>
          <button type="submit" style={{padding:'10px 20px'}}>Onayla</button>
        </div>
        {error && <p style={{color:'tomato', marginTop:8}}>{error}</p>}
      </form>
    </div>
  );
}
