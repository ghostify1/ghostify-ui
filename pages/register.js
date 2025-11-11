// pages/register.js
import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Register(){
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
      await createUserWithEmailAndPassword(auth, email, pass);
    }catch(e){
      setErr(e.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="g-center">
      <MatrixBackground/>
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{textAlign:"center", marginBottom:12}}>Kayıt Ol</h2>
        <form onSubmit={submit} style={{marginTop:16}}>
          <input placeholder="E-posta" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Şifre" type="password" style={{marginTop:10}} value={pass} onChange={e=>setPass(e.target.value)} />
          <button type="submit">Hesap Oluştur</button>
        </form>
        {err && <p className="small" style={{color:"#ffb4b4"}}>{err}</p>}
        <a className="small" href="/login">Zaten hesabın var mı? Giriş</a>
      </div>
    </div>
  );
}
