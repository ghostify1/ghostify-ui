import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../lib/firebaseClient";

export default function Register() {
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{
      display: "grid",
      height: "100vh",
      placeItems: "center",
      background: "#000",
      color: "#80E6FF"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        background: "rgba(0,0,0,0.7)",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(128,230,255,0.3)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Kayıt Ol</h2>

        <form onSubmit={handleRegister}>
          <label>E-posta</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", padding: "10px",
              marginBottom: "15px", borderRadius: "6px"
            }} required />

          <label>Şifre</label>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", padding: "10px",
              marginBottom: "15px", borderRadius: "6px"
            }} required />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit"
            style={{
              width: "100%", padding: "12px",
              background: "#1EA7D7",
              borderRadius: "8px",
              border: 0, color: "#fff",
              fontSize: "16px"
            }}>
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Zaten hesabın var mı?
          <a href="/login" style={{ color: "#80E6FF" }}> Giriş Yap</a>
        </p>
      </div>
    </div>
  );
}
