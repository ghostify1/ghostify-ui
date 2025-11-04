import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MatrixBackground from "../components/MatrixBackground";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(87);
  const [risk, setRisk] = useState(5);
  const [lastScan, setLastScan] = useState("12 EKİM 2025");
  const [reportStatus, setReportStatus] = useState("HAZIR");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userDoc = await getDoc(doc(db, "users", u.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.risk) setRisk(data.risk);
          if (data.score) setScore(data.score);
        }
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#05080b] text-cyan-50 overflow-hidden flex flex-col items-center justify-start pt-10">
      <MatrixBackground />

      {/* Üst Bar */}
      <div className="flex justify-between items-center w-[90%] max-w-5xl mb-10">
        <div className="flex items-center gap-3">
          <svg width="42" height="42" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="text-cyan-400 drop-shadow-[0_0_10px_rgba(37,230,255,0.6)] animate-pulse">
            <path d="M56 12c19.882 0 36 16.118 36 36v42c0 3.314-2.686 6-6 6-4.418 0-6-6-12-6s-7.582 6-12 6-7.582-6-12-6-7.582 6-12 6-7.582-6-12-6c-3.314 0-6-2.686-6-6V48c0-19.882 16.118-36 36-36z"
              stroke="currentColor" strokeWidth="3" />
            <circle cx="44" cy="46" r="6" fill="currentColor" />
            <circle cx="68" cy="46" r="6" fill="currentColor" />
          </svg>
          <h1 className="text-3xl font-bold tracking-[0.25em] text-cyan-400">GHOSTIFY</h1>
        </div>
        <div className="flex gap-6 text-cyan-400 text-2xl">
          <i className="ri-user-line hover:text-cyan-300 transition"></i>
          <i className="ri-ghost-line hover:text-cyan-300 transition"></i>
        </div>
      </div>

      {/* Hoş Geldin */}
      <motion.h2
        className="text-4xl font-extrabold tracking-wider text-cyan-400 mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        HOŞ GELDİN, {user ? user.displayName || "KULLANICI" : "EMRE"}
      </motion.h2>
      <p className="text-cyan-300/70 mb-8 tracking-widest">
        DİJİTAL İZLERİNİ KORUMA ZAMANI.
      </p>

      {/* Dijital Skor */}
      <motion.div
        className="relative flex flex-col items-center justify-center text-center mb-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-48 h-48 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(37,230,255,0.4)] relative overflow-hidden">
          <motion.div
            className="absolute w-full h-full rounded-full border-2 border-cyan-400/20 animate-spin-slow"
            style={{ borderTopColor: "transparent" }}
          />
          <div className="text-5xl font-extrabold text-cyan-400">{score}</div>
          <span className="absolute bottom-8 text-sm text-cyan-300/70 tracking-widest">
            DİJİTAL İZ SKORU
          </span>
        </div>
        <p className="text-cyan-300 mt-4">SİSTEM ANALİZİ AKTİF</p>
      </motion.div>

      {/* Butonlar */}
      <div className="flex flex-col gap-5 w-[90%] max-w-md mb-10">
        {[
          { text: "YENİ TARAMA BAŞLAT", icon: "ri-search-line" },
          { text: "RAPORLARI GÖRÜNTÜLE", icon: "ri-file-list-line" },
          { text: "SİLME TALEBİ OLUŞTUR", icon: "ri-delete-bin-line" },
        ].map((btn, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(37,230,255,0.3)" }}
            className="flex items-center justify-center gap-3 py-3 border border-cyan-400/40 rounded-xl text-cyan-300 tracking-widest uppercase font-medium bg-black/20 hover:bg-cyan-400/10 transition"
          >
            <i className={`${btn.icon} text-cyan-400 text-xl`}></i> {btn.text}
          </motion.button>
        ))}
      </div>

      {/* Alt İstatistikler */}
      <div className="grid grid-cols-3 gap-4 text-center mb-16 text-cyan-200/90">
        <div className="p-4 border border-cyan-400/30 rounded-xl backdrop-blur-sm">
          <p className="text-xs text-cyan-300/60">SON TARAMA</p>
          <p className="text-lg font-semibold">{lastScan}</p>
        </div>
        <div className="p-4 border border-cyan-400/30 rounded-xl backdrop-blur-sm">
          <p className="text-xs text-cyan-300/60">RİSKLİ HESAPLAR</p>
          <p className="text-lg font-semibold">{risk}</p>
        </div>
        <div className="p-4 border border-cyan-400/30 rounded-xl backdrop-blur-sm">
          <p className="text-xs text-cyan-300/60">PDF RAPOR</p>
          <p className="text-lg font-semibold">{reportStatus}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-cyan-400/40 tracking-widest pb-5">
        Ghostify AI Core Online — v3.5 Build 1125
      </div>
    </div>
  );
}
