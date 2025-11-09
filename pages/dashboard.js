// pages/dashboard.js
import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (!user)
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#000", color: "#80E6FF" }}>
        <p>Yükleniyor...</p>
      </div>
    );

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", background: "#000", color: "#80E6FF" }}>
      <h2>Hoş geldin, {user.displayName || user.email}</h2>
      <button
        onClick={() => signOut(getAuth(app))}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          borderRadius: 8,
          background: "#80E6FF",
          color: "#000",
          border: "none",
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}
