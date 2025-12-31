import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "../lib/firebaseClient";
import { inviteRequired, hasInviteCookie } from "../lib/gate";

export async function getServerSideProps({ req }) {
  if (inviteRequired() && !hasInviteCookie(req)) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/dashboard");
    });

    return () => unsub();
  }, [router]);

  const login = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    setLoading(true);
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      router.push("/dashboard");
    } catch {
      setErr("Giriş başarısız. E-posta/şifre kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="h1">GHOSTIFY • LOGIN</div>

        <input className="input" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ height: 10 }} />
        <input className="input" placeholder="Şifre" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <div style={{ height: 12 }} />

        <button className="btn" onClick={login} disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>

        {err && <div className="err">{err}</div>}
        <a className="link" href="/register">Hesabın yok mu? Kayıt ol</a>
      </div>
    </div>
  );
}
