import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#0a0a0a", color: "#fff"
    }}>
      <img src="/assets/logo.svg" alt="Ghostify" width="140" height="140" />
      <h2 style={{marginTop: 16}}>Ghostify Paneline Giriş</h2>

      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          marginTop: 20, background: "#4285F4", color: "#fff",
          border: 0, borderRadius: 8, padding: "12px 24px",
          cursor: "pointer", fontSize: 16
        }}
      >
        Google ile Giriş Yap
      </button>
    </div>
  );
}
