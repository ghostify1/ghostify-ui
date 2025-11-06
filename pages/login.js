import { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Giriş başarısız. Bilgileri kontrol et.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      setError("Google ile giriş başarısız.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>GHOSTIFY GİRİŞ</h2>
        <form onSubmit={handleEmailLogin} style={styles.form}>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            {loading ? "Yükleniyor..." : "Giriş Yap"}
          </button>
        </form>

        <p style={styles.or}>veya</p>

        <button onClick={handleGoogleLogin} style={styles.google}>
          Google ile Giriş
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#000",
  },
  card: {
    background: "rgba(20, 20, 30, 0.8)",
    borderRadius: "12px",
    padding: "40px",
    width: "340px",
    textAlign: "center",
    boxShadow: "0 0 25px #0ff3",
  },
  title: {
    color: "#0ff",
    fontFamily: "monospace",
    marginBottom: "20px",
    fontSize: "22px",
    letterSpacing: "1px",
  },
  form: { display: "grid", gap: "10px" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#111",
    color: "#0ff",
  },
  button: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#0ff",
    color: "#000",
    cursor: "pointer",
    fontWeight: "bold",
  },
  google: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #0ff",
    background: "transparent",
    color: "#0ff",
    cursor: "pointer",
  },
  or: {
    color: "#888",
    margin: "10px 0",
  },
  error: {
    color: "#f66",
    fontSize: "14px",
    marginTop: "10px",
  },
};
