import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#0a0a0a", color: "#fff"
    }}>
      <h2>Hoş geldin {session.user?.name}</h2>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        style={{
          marginTop: "20px",
          background: "transparent",
          color: "#f55",
          border: "1px solid #f55",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer"
        }}
      >
        Çıkış Yap
      </button>
    </div>
  );
}
