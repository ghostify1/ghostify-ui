import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Register(){
  if (typeof window === "undefined") return null;
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [err,setErr] = useState("");
  const auth = getAuth(app);

  useEffect(() => {
    if (sessionStorage.getItem("invited") !== "true") window.location.replace("/");
    const unsub = onAuthStateChanged(auth, (u)=>{ if(u) window.location.replace("/dashboard"); });
    return () => unsub();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try{ await createUserWithEmailAndPassword(auth, email, pass); }
    catch(e){ setErr(e.message); }
  };

  return (
    <div className="g-center">
      <MatrixBackground/>
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{textAlign:"center"}}>Kayıt Ol</h2>
        <form onSubmit={submit}>
          <input type="email" placeholder="E-posta" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Şifre" value={pass} onChange={e=>setPass(e.target.value)} style={{marginTop:10}}/>
          <button type="submit">Hesap Oluştur</button>
        </form>
        {err && <p className="small" style={{color:"#ffb4b4"}}>{err}</p>}
        <a className="small" href="/login">Zaten hesabın var mı? Giriş yap</a>
      </div>
    </div>
  );
}
