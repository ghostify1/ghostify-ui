// sections/LoginClient.jsx
import { useEffect, useState } from "react";

export default function LoginClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Next.js SSR güvenliği
    if (typeof window !== "undefined") setReady(true);
  }, []);

  if (!ready) return null;

  // Firebase'i sadece client'ta import et
  const { auth, provider } = require("../lib/firebaseClient");
  const { signInWithPopup } = require("firebase/auth");

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Başarılı girişten sonra dashboard'a yönlendir
      alert("Giriş başarılı!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Firebase Login Hatası:", error);
      alert("Giriş hatası: " + (error.message || "Bilinmeyen hata"));
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh",gap:16,background:"#000"}}>
      <h2 style={{color:"#80E6FF"}}>Ghostify Giriş</h2>
      <button
        onClick={handleGoogle}
        style={{
          padding:"10px 18px",
          borderRadius:8,
          border:"1px solid #80E6FF",
          background:"transparent",
          color:"#80E6FF",
          cursor:"pointer"
        }}
      >
        Google ile Giriş Yap
      </button>
    </div>
  );
}
