import { useState } from "react";
import { motion } from "framer-motion";
import MatrixBackground from "../components/MatrixBackground";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { useRouter } from "next/router";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const router = useRouter();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSubmit = async () => {
    if (!email || !password) return showToast("Alanları doldurun.");

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Giriş başarılı!");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        if (password !== confirmPassword)
          return showToast("Şifreler eşleşmiyor.");
        await createUserWithEmailAndPassword(auth, email, password);
        showToast("Kayıt başarılı!");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err) {
      showToast("Hata: " + err.code.split("/")[1]);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      showToast("Google hesabıyla giriş başarılı!");
      router.push("/dashboard");
    } catch (err) {
      showToast("Google hatası.");
    }
  };

  const handleApple = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      await signInWithPopup(auth, provider);
      showToast("Apple hesabıyla giriş başarılı!");
      router.push("/dashboard");
    } catch (err) {
      showToast("Apple hatası.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05080b] text-cyan-50 flex flex-col items-center justify-center">
      <MatrixBackground />

      {/* Neon Glow Alanları */}
      <div className="absolute -left-32 top-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute -right-32 bottom-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      {/* Logo */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-cyan-400 mb-4 animate-pulse">
          <svg
            width="100"
            height="100"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto drop-shadow-[0_0_30px_rgba(37,230,255,0.6)]"
          >
            <path
              d="M56 12c19.882 0 36 16.118 36 36v42c0 3.314-2.686 6-6 6-4.418 0-6-6-12-6s-7.582 6-12 6-7.582-6-12-6-7.582 6-12 6-7.582-6-12-6c-3.314 0-6-2.686-6-6V48c0-19.882 16.118-36 36-36z"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="44" cy="46" r="6" fill="currentColor" />
            <circle cx="68" cy="46" r="6" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-[0.25em] text-cyan-400">
          GHOSTIFY
        </h1>
      </motion.div>

      {/* Form Alanı */}
      <motion.div
        className="bg-[#0a1116]/70 border border-cyan-900/40 backdrop-blur-lg p-8 rounded-2xl shadow-[0_0_25px_rgba(37,230,255,0.15)] w-[90%] max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        {/* Sekmeler */}
        <div className="flex justify-center space-x-12 mb-6">
          {["login", "register"].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`tracking-widest ${
                tab === key
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-cyan-600 hover:text-cyan-300"
              }`}
            >
              {key === "login" ? "GİRİŞ YAP" : "KAYIT OL"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-POSTA ADRESİNİZ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 tracking-widest placeholder-cyan-700/50 focus:ring-2 focus:ring-cyan-400/60"
          />
          <input
            type="password"
            placeholder="ŞİFRE OLUŞTURUN"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 tracking-widest placeholder-cyan-700/50 focus:ring-2 focus:ring-cyan-400/60"
          />
          {tab === "register" && (
            <input
              type="password"
              placeholder="ŞİFREYİ DOĞRULAYIN"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 tracking-widest placeholder-cyan-700/50 focus:ring-2 focus:ring-cyan-400/60"
            />
          )}
        </div>

        <motion.button
          onClick={handleSubmit}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 25px rgba(37,230,255,0.35)",
          }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-500 rounded-xl font-bold text-[#00151a] tracking-widest"
        >
          {tab === "login" ? "GİRİŞ YAP" : "KAYIT OL"}
        </motion.button>

        <p className="text-center text-cyan-200/60 text-sm my-4">VEYA</p>

        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            className="w-full border border-cyan-900/50 py-2 rounded-xl hover:bg-cyan-400/10 transition"
          >
            <span className="text-cyan-400 font-medium">G</span> GOOGLE İLE{" "}
            {tab === "login" ? "GİRİŞ" : "KAYIT"}
          </button>
          <button
            onClick={handleApple}
            className="w-full border border-cyan-900/50 py-2 rounded-xl hover:bg-cyan-400/10 transition"
          >
            <span className="text-cyan-400 font-medium"></span> APPLE İLE{" "}
            {tab === "login" ? "GİRİŞ" : "KAYIT"}
          </button>
        </div>

        <p className="text-center text-cyan-300/60 text-xs mt-6">
          {tab === "login"
            ? "Hesabınız yok mu? "
            : "Zaten hesabınız var mı? "}
          <button
            onClick={() => setTab(tab === "login" ? "register" : "login")}
            className="underline hover:text-cyan-100"
          >
            {tab === "login" ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </motion.div>

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
