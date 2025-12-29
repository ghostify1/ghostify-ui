import "../styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import { inviteRequired, hasInviteCookie } from "../lib/gate";

export async function getServerSideProps({ req }) {
  if (inviteRequired() && !hasInviteCookie(req)) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const register = async () => {
    setLoading(true);
    setErr("");
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      router.push("/dashboard");
    } catch (e) {
      setErr("Kayıt başarısız. Şifre en az 6 karakter olmalı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="h1">GHOSTIFY • REGISTER</div>
        <input className="input" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ height: 10 }} />
        <input className="input" placeholder="Şifre (min 6)" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <div style={{ height: 12 }} />
        <button className="btn" onClick={register} disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Kayıt Ol"}
        </button>
        {err && <div className="err">{err}</div>}
        <a className="link" href="/login">Zaten hesabın var mı? Giriş yap</a>
      </div>
    </div>
  );
}
