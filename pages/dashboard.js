import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";
import { app } from "../lib/firebaseClient";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard(){
  if (typeof window === "undefined") return null;
  const [user,setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    if (sessionStorage.getItem("invited") !== "true") window.location.replace("/");
    const unsub = onAuthStateChanged(auth, (u)=> setUser(u));
    return () => unsub();
  }, []);

  if(!user){
    return (
      <div className="g-center">
        <MatrixBackground/>
        <div className="content"><p>Yükleniyor…</p></div>
      </div>
    );
  }

  return (
    <div className="g-center">
      <MatrixBackground/>
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{textAlign:"center"}}>Hoş geldin, {user.displayName || user.email}</h2>
        <p className="small">Core bağlantı aktif. Sırada Risk Skoru ve PDF.</p>
        <button onClick={()=>signOut(auth)} style={{marginTop:14}}>Çıkış</button>
      </div>
    </div>
  );
}
