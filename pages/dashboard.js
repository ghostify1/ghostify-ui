import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session && typeof window !== "undefined") {
    window.location.href = "/login";
    return null;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#0a0a0a", color: "#fff"
    }}>
      <h2>Hoş geldin {session?.user?.name || "Kullanıcı"}</h2>
      <p style={{opacity:.8, marginTop:6}}>{session?.user?.email}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          marginTop: 20, background: "transparent", color: "#f55",
          border: "1px solid #f55", borderRadius: 8, padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}
