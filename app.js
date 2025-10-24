// ================== GHOSTIFY BACKEND ==================

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "SENİN_API_KEYİN",
  authDomain: "ghostify-core.firebaseapp.com",
  projectId: "ghostify-core",
  storageBucket: "ghostify-core.appspot.com",
  messagingSenderId: "311435609935",
  appId: "1:311435609935:web:2493c7a97ecd97bac9673a"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("🔥 Ghostify Backend Yüklendi");

// Basit test (kaynak kontrolü)
window.addEventListener("load", () => {
  const test = document.createElement("div");
  test.innerText = "Backend aktif!";
  test.style.color = "#00ffff";
  test.style.position = "fixed";
  test.style.bottom = "10px";
  test.style.right = "10px";
  test.style.fontSize = "10px";
  document.body.appendChild(test);
});
