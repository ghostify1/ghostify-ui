import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MatrixBackground from "../components/MatrixBackground";
import { useRouter } from "next/router";

export default function Home() {
  const [inviteCode, setInviteCode] = useState("");
  const [toast, setToast] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (inviteCode.trim().length < 6) {
      setToast("Lütfen geçerli bir davet kodu girin.");
      return;
    }
    localStorage.setItem("ghostify_invite", inviteCode);
    router.push("/login");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInviteCode(text);
      setToast("Kod yapıştırıldı.");
    } catch {
      setToast("Panoya erişilemiyor.");
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05080b] text-cyan-50 flex flex-col items-center justify-center">
      <MatrixBackground />

      {/* Glow Rings */}
      <div className="absolute -left-20 top-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute -right-20 bottom-1/3 w-[380px] h-[380px] bg-cyan-500/10 rounded-full blur-[100px]" />

      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-cyan-400 drop-shadow-[0_0_20px_rgba(37,230,255,0.4)] mb-4 animate-pulse">
          <svg
            width="110"
            height="110"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
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
        <h1 className="text-5xl font-extrabold tracking-[0.25em] text-cyan-400 drop-shadow-[0_0_25px_rgba(37,230,255,0.4)]">
          GHOSTIFY
        </h1>
        <p className="text-cyan-200/70 text-xs tracking-[0.35em] mt-2">
          GHOSTIFY CORE LOADING
        </p>
      </motion.div>

      {/* Invite Form */}
      <motion.div
        className="bg-[#0a1116]/70 border border-cyan-900/40 backdrop-blur-lg p-8 rounded-2xl shadow-[0_0_25px_rgba(37,230,255,0.15)] w-[90%] max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-center text-cyan-400 text-2xl font-bold tracking-widest mb-5">
          DAVET KODUNUZU GİRİN
        </h2>

        <div className="flex gap-2">
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="DAVET KODU"
            className="flex-1 bg-black/30 border border-cyan-900/50 text-cyan-100 text-center rounded-xl py-3 px-4 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 placeholder-cyan-700/50 transition"
          />
          <button
            onClick={handlePaste}
            className="px-4 bg-cyan-400/10 border border-cyan-900/60 text-cyan-200 rounded-xl hover:bg-cyan-400/20 hover:text-cyan-100 transition font-semibold tracking-wider"
          >
            Yapıştır
          </button>
        </div>

        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,230,255,0.35)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-500 rounded-xl font-bold text-[#00151a] tracking-widest shadow-[0_0_25px_rgba(37,230,255,0.35)]"
        >
          DEVAM ET
        </motion.button>

        <p className="text-center text-cyan-200/70 text-sm mt-4">
          Davet kodunuz yok mu?{" "}
          <a href="#" className="text-cyan-300 hover:text-cyan-100 underline">
            Kod talep et
          </a>
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
