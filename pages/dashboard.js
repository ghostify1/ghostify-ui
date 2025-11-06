'use client';
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div style={{ color: "#0ff", textAlign: "center", marginTop: "20vh" }}>
        <h2>👻 Giriş gerekli</h2>
        <p>Lütfen önce giriş yapın.</p>
        <a href="/login" style={{ color: "#0ff" }}>Giriş sayfasına dön</a>
      </div>
    );
  }

  return (
    <div style={{
      background: "#000",
      color: "#0ff",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <h1>Ghostify Dashboard</h1>
      <p>Hoş geldin, {session.user?.email}</p>
    </div>
  );
}
