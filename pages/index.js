export default function Home() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#000", color: "#0ff"
    }}>
      <h1 style={{ fontSize: "32px" }}>👻 Ghostify HQ</h1>
      <p style={{ marginTop: 10, opacity: 0.8 }}>
        Sistem aktif. Lütfen <a href="/login" style={{ color: "#0ff" }}>giriş yapın</a>.
      </p>
    </div>
  );
}
