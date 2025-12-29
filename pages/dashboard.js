import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";
import { inviteRequired, hasInviteCookie } from "../lib/gate";

export async function getServerSideProps({ req }) {
  if (inviteRequired() && !hasInviteCookie(req)) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: {} };
}

export default function DashboardPage() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setUid(user.uid);
        setEmail(user.email || "");
      }
    });
    return () => unsub();
  }, [router]);

  const logout = async () => {
    await signOut(auth);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <div className="h1" style={{ margin: 0 }}>DASHBOARD</div>
          <div className="small">Oturum: {email}</div>
        </div>
        <button className="btn" style={{ width: 120 }} onClick={logout}>Çıkış</button>
      </div>

      <div className="card">
        <div className="small">UID</div>
        <div style={{ wordBreak: "break-all", marginTop: 6 }}>{uid || "—"}</div>

        <div style={{ height: 14 }} />
        <div className="small">
          Paket 1 tamam. Sıradaki: <b>SCAN</b> (HIBP + LeakCheck + Firestore).
        </div>
      </div>
    </div>
  );
}
