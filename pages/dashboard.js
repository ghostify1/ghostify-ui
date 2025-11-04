import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";
import MatrixBackground from "../components/MatrixBackground";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);
  const [riskCount, setRiskCount] = useState(0);
  const [lastScan, setLastScan] = useState("-");
  const [toast, setToast] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        loadUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    try {
      const docRef = doc(db, "reports", uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setScore(data.score || 0);
        setRiskCount(data.risk || 0);
        setLastScan(new Date(data.date).toLocaleDateString("tr-TR"));
      } else {
        setScore(0);
        setRiskCount(0);
        setLastScan("-");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startScan = async () => {
    setToast("Tarama başlatılıyor...");
    setTimeout(() => {
      // Buraya Cloud Function bağlantısı eklenecek (scanEmail)
      setScore(87);
      setRiskCount(5);
      setLastScan(new Date().toLocaleDateString("tr-TR"));
      setToast("Tarama tamamlandı ✅");
    }, 3000);
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen bg-[#05080b] text-cyan-300 overflow-hidden">
      <MatrixBackground />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6"
      >
        {/* Üst Logo ve Kullanıcı */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <img src="/ghostify_logo.svg" alt="Ghostify" className="h-6 w-auto" />
          <span className="text-cyan-400 font-semibold tracking-widest text-sm">GHOSTIFY</span>
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-5 text-xl">
          <button onClick={logout} title="Çıkış Yap" className="hover:text-cyan-200">
            <i className="ri-logout-box-r-line"></i>
          </button>
          <i className="ri-user-line hover:text-cyan-200"></i>
        </div>

        {/* Hoş geldin metni */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mt-10 mb-1 text-cyan-400 drop-shadow-[0_0_15px_#25E6FF]"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          HOŞ GELDİN, {user?.email?.split("@")[0]?.toUpperCase() || "KULLANICI"}
        </motion.h1>
        <p className="text-sm text-cyan-300/70 tracking-widest mb-10">
          DİJİTAL İZLERİNİ KORUMA ZAMANI.
        </p>

        {/* Skor Halkası */}
        <motion.div
          className="relative flex items-center justify-center w-56 h-56 mb-10 rounded-full border-2 border-cyan-400/40 shadow-[0_0_40px_#25E6FF30]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <motion.div
            key={score}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute text-center"
          >
            <p className="text-sm tracking-widest text-cyan-400/70">DİJİTAL İZ SKORU</p>
            <p className="text-5xl font-bold text-cyan-300 mt-2">{score}</p>
            <p className="text-xl text-cyan-400/80">/ 100</p>
          </motion.div>
        </motion.div>

        {/* Butonlar */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <motion.button
            onClick={startScan}
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(37,230,255,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="py-3 border border-cyan-400/30 rounded-lg font-semibold text-cyan-200 tracking-widest hover:bg-cyan-400/10 transition-all"
          >
            🔍 YENİ TARAMA BAŞLAT
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/reports")}
            className="py-3 border border-cyan-400/30 rounded-lg font-semibold text-cyan-200 tracking-widest hover:bg-cyan-400/10 transition-all"
          >
            📄 RAPORLARI GÖRÜNTÜLE
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push("/delete-request")}
            className="py-3 border border-cyan-400/30 rounded-lg font-semibold text-cyan-200 tracking-widest hover:bg-cyan-400/10 transition-all"
          >
            🧹 SİLME TALEBİ OLUŞTUR
          </motion.button>
        </div>

        {/* Alt Bilgi */}
        <div className="grid grid-cols-3 gap-4 mt-12 text-center text-sm text-cyan-300/70">
          <div>
            <p className="text-cyan-400/60">SON TARAMA</p>
            <p className="font-medium text-cyan-300">{lastScan}</p>
          </div>
          <div>
            <p className="text-cyan-400/60">RİSKLİ HESAPLAR</p>
            <p className="font-medium text-cyan-300">{riskCount}</p>
          </div>
          <div>
            <p className="text-cyan-400/60">PDF RAPOR</p>
            <p className="font-medium text-cyan-300">HAZIR</p>
          </div>
        </div>

        {/* Toast bildirimi */}
        {toast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-cyan-950/90 text-cyan-300 px-6 py-2 rounded-xl border border-cyan-400/30 shadow-lg z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
