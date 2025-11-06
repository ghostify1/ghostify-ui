import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#0a0a0a", color: "#fff"
    }}>
      <img src="/assets/logo.svg" alt="Ghostify Logo" width="160" />
      <h2>Ghostify Paneline Giriş Yap</h2>
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        style={{
          marginTop: "20px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Google ile Giriş Yap
      </button>
    </div>
  );
}
