// ==================== GHOSTIFY BACKEND ====================
// Firebase modüllerini import et
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==================== Firebase Config ====================
const firebaseConfig = {
  apiKey: "*********", // gizledin, tamam.
  authDomain: "ghostify-core.firebaseapp.com",
  projectId: "ghostify-core",
  storageBucket: "ghostify-core.firebasestorage.app",
  messagingSenderId: "311435609935",
  appId: "1:311435609935:web:2493c7a97ecd97bac9673a"
};

// ==================== Firebase Başlatma ====================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================================
// ============ KAYIT OL (register.html) =====================
const registerForm = document.querySelector('.form-register');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = registerForm.querySelector('input[type="email"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        createdAt: new Date(),
        plan: "free",
        riskScore: 0
      });
      alert("Kayıt başarılı! Dashboard'a yönlendiriliyorsunuz...");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Kayıt hatası: " + err.message);
    }
  });
}

// ==========================================================
// ============ GİRİŞ (login.html) ===========================
const loginForm = document.querySelector('.form-login');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("Giriş hatası: " + err.message);
    }
  });
}

// ==========================================================
// ============ DASHBOARD OTURUM KONTROL =====================
if (window.location.pathname.includes("dashboard.html")) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Kullanıcı verisini çek
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    // Ekranda kullanıcı adını göster
    const nameEl = document.getElementById("userName");
    const emailEl = document.getElementById("userEmail");
    if (nameEl) nameEl.textContent = userData?.name || "Kullanıcı";
    if (emailEl) emailEl.textContent = user.email;
  });
}

// ==========================================================
// ============ ÇIKIŞ (settings.html) =======================
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    alert("Çıkış yapıldı.");
    window.location.href = "login.html";
  });
}

// ==========================================================
// ============ DESTEK FORMU (support.html) =================
// Bu aşamada backend'e kayıt ekliyor (ileride EmailJS bağlanacak)
const supportForm = document.querySelector('.form-support');
if (supportForm) {
  supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = supportForm.querySelector('input[name="name"]').value;
    const email = supportForm.querySelector('input[name="email"]').value;
    const message = supportForm.querySelector('textarea[name="message"]').value;

    try {
      await addDoc(collection(db, "supportMessages"), {
        name,
        email,
        message,
        createdAt: new Date()
      });
      alert("Mesajınız başarıyla gönderildi!");
      supportForm.reset();
    } catch (err) {
      alert("Mesaj gönderme hatası: " + err.message);
    }
  });
}
