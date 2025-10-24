// ==================== GHOSTIFY BACKEND ====================

// Firebase global script yöntemi (Netlify uyumlu)
const firebaseConfig = {
  apiKey: "*******", // senin gizli key'in
  authDomain: "ghostify-core.firebaseapp.com",
  projectId: "ghostify-core",
  storageBucket: "ghostify-core.firebasestorage.app",
  messagingSenderId: "311435609935",
  appId: "1:311435609935:web:2493c7a97ecd97bac9673a"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);
console.log("🔥 Ghostify Firebase backend aktif!");
const auth = firebase.auth();
const db = firebase.firestore();

// Kayıt ol
async function registerUser(email, password) {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    alert("Kayıt başarılı!");
  } catch (error) {
    console.error(error.message);
    alert("Hata: " + error.message);
  }
}

// Giriş yap
async function loginUser(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Giriş başarısız: " + error.message);
  }
}

// Çıkış yap
function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Kullanıcı durumu izle
auth.onAuthStateChanged((user) => {
  console.log("Aktif kullanıcı:", user ? user.email : "Yok");
});

  });
}
