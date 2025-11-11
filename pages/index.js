import { useEffect, useState } from "react";
import MatrixBackground from "../components/MatrixBackground";

export default function Invite(){
  if (typeof window === "undefined") return null; // ✅ build fix
  const [code, setCode] = useState("");

  useEffect(() => {
    const invited = sessionStorage.getItem("invited");
    if (invited === "true") window.location.replace("/login");
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const real = process.env.NEXT_PUBLIC_INVITE_CODE;
    if (code.trim() === real){
      sessionStorage.setItem("invited", "true");
      window.location.replace("/login");
    } else {
      alert("Davet kodu hatalı.");
    }
  };

  return (
    <div className="g-center">
      <MatrixBackground />
      <div className="content card">
        <div className="brand">GHOSTIFY</div>
        <h2 style={{textAlign:"center", marginBottom:12}}>VIP Davet</h2>
        <form onSubmit={submit}>
          <input placeholder="Davet kodu" value={code} onChange={e=>setCode(e.target.value)} />
          <button type="submit">Devam Et</button>
        </form>
      </div>
    </div>
  );
}
