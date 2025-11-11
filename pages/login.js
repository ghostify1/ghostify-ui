// pages/login.js
import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function Login(){
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [err,setErr] = useState("");
  const auth = getAuth(app);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("invited") !== "true") window.location.replace("/");
    const unsub = onAuthStateChanged(auth, (u)=>{ if(u) window.location.replace("/dashboard"); });
    return () => unsub();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{
      await signInWithEmailAndPassword(auth, email, pass);
    }catch(e){
      setErr(e.message || "Giriş yapılamadı");
    }
  };

  const google = async () => {
    setErr("");
    try{
      await signInWithPopup(auth, new GoogleAuthProvider());
    }catch(e){
      setErr(e.message || "Google girişi başarısız");
    }
  };

  return (
    <div className="g-center">
      <MatrixBackground/>
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{textAlign:"center", marginBottom:12}}>Giriş Yap</h2>
        <form onSubmit={submit} style={{marginTop:16}}>
          <input placeholder="E-posta" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Şifre" type="password" style={{marginTop:10}} value={pass} onChange={e=>setPass(e.target.value)} />
          <button type="submit">Giriş</button>
        </form>
        <button onClick={google} style={{marginTop:10}}>Google ile devam et</button>
        {err && <p className="small" style={{color:"#ffb4b4"}}>{err}</p>}
        <a className="small" href="/register">Hesabın yok mu? Kayıt ol</a>
      </div>
    </div>
  );
}
