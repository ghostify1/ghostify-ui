// sections/LoginClient.jsx
import { useEffect, useState } from "react";

export default function LoginClient() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return null;

  // Firebase'i sadece client'ta import ediyoruz:
  const { auth, provider } = require("../lib/firebaseClient");
  const { signInWithPopup } = require("firebase/auth");

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Giriş başarılı!"); // Şimdilik test uyarısı
      window.location.href = "/dashboard"; // Sonraki adımda dashboard yönlendirmesi
    } catch (error) {
      console.error(error);
      alert("Giriş hatası: " + (error.message || error));
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh",gap:16,background:"#000"}}>
      <h2 style={{color:"#80E6FF"}}>Ghostify Giriş</h2>
      <button
        onClick={handleGoogle}
        style={{padding:"10px 18px",borderRadius:8,border:"1px solid #80E6FF",background:"transparent",color:"#80E6FF"}}
      >
        Google ile Giriş Yap
      </button>
    </div>
  );
}
