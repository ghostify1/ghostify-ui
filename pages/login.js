import { useState } from "react";
import { motion } from "framer-motion";
import MatrixBackground from "../components/MatrixBackground";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const [mode, setMode] = useState("login"); // login or register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [toast, setToast] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (!email || !password) {
        setToast("Lütfen tüm alanları doldurun");
        return;
      }

      if (mode === "register" && password !== confirm) {
        setToast("Şifreler uyuşmuyor");
        return;
      }

      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push("/dashboard");
      }
    } catch (err) {
      setToast("Hata: " + err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      setToast("Google ile giriş başarısız");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05080b] text-cyan-50 flex flex-col items-center justify-center">
      <MatrixBackground />

      {/* Glow */}
      <div className="absolute -left-20 top-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute -right-20 bottom-1/3 w-[380px] h-[380px] bg-cyan-500/10 rounded-full blur-[100px]" />

      {/* Logo */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-cyan-400 mb-4 animate-pulse">
          <svg width="110" height="110" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
            <path d="M56 12c19.882 0 36 16.118 36 36v42c0 3.314-2.686 6-6 6-4.418 0-6-6-12-6s-7.582 6-12 6-7.582-6-12-6-7.582 6-12 6-7.582-6-12-6c-3.314 0-6-2.686-6-6V48c0-19.882 16.118-36 36-36z" stroke="currentColor" strokeWidth="3" />
            <circle cx="44" cy="46" r="6" fill="currentColor" />
            <circle cx="68" cy="46" r="6" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_25px_rgba(37,230,255,0.4)]">
          GHOSTIFY
        </h1>
      </motion.div>

      {/* Form */}
      <motion.div
        className="bg-[#0a1116]/70 border border-cyan-900/40 backdrop-blur-lg p-8 rounded-2xl shadow-[0_0_25px_rgba(37,230,255,0.15)] w-[90%] max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        {/* Tabs */}
        <div className="flex justify-around mb-6 text-cyan-200/80 text-lg font-semibold">
          <button
            onClick={() => setMode("login")}
            className={`pb-1 border-b-2 ${
              mode === "login"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent hover:text-cyan-300"
            }`}
          >
            GİRİŞ YAP
          </button>
          <button
            onClick={() => setMode("register")}
            className={`pb-1 border-b-2 ${
              mode === "register"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent hover:text-cyan-300"
            }`}
          >
            KAYIT OL
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-POSTA ADRESİNİZ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 px-4 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 placeholder-cyan-700/50 transition"
          />
          <input
            type="password"
            placeholder={mode === "login" ? "ŞİFRENİZ" : "ŞİFRE OLUŞTURUN"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 px-4 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 placeholder-cyan-700/50 transition"
          />
          {mode === "register" && (
            <input
              type="password"
              placeholder="ŞİFREYİ DOĞRULAYIN"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 px-4 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 placeholder-cyan-700/50 transition"
            />
          )}
        </div>

        <motion.button
          onClick={handleSubmit}
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,230,255,0.35)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-500 rounded-xl font-bold text-[#00151a] tracking-widest shadow-[0_0_25px_rgba(37,230,255,0.35)]"
        >
          DEVAM ET
        </motion.button>

        <div className="mt-6 text-center text-cyan-300/70 text-sm">
          VEYA
        </div>

        {/* Google & Apple */}
        <div className="flex flex-col gap-3 mt-3">
          <button
            onClick={handleGoogle}
            className="w-full border border-cyan-900/50 rounded-xl py-2 text-cyan-100 hover:bg-cyan-400/10 transition"
          >
            <span className="font-semibold">G</span> GOOGLE İLE GİRİŞ
          </button>
          <button
            className="w-full border border-cyan-900/50 rounded-xl py-2 text-cyan-100 hover:bg-cyan-400/10 transition"
          >
             APPLE İLE GİRİŞ
          </button>
        </div>

        <p className="text-center text-cyan-200/70 text-sm mt-6">
          {mode === "login"
            ? "Hesabınız yok mu? "
            : "Zaten hesabınız var mı? "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-cyan-300 hover:text-cyan-100 underline"
          >
            {mode === "login" ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </motion.div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-900/40 text-cyan-100 px-4 py-2 rounded-lg shadow-lg"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
