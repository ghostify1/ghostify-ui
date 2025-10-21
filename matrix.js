// GHOSTIFY MATRIX BACKGROUND - VIP EDITION
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Karakter seti - Matrix efekti için
const chars = "01";
const font_size = 10; // Daha ince yazı
const columns = canvas.width / font_size;

// Düşen kod dizileri
const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;

// Ana çizim fonksiyonu
function draw() {
  // Arka planı hafif silerek akıcı efekt
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Yazı stili - neon mavi ton
  ctx.fillStyle = "rgba(0, 255, 255, 0.08)";
  ctx.font = font_size + "px monospace";

  // Karakterleri çiz
  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * font_size, drops[i] * font_size);

    // Rastgele sıfırlama (sonsuz akış efekti)
    if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    // Düşen karakterin hızını kontrol et
    drops[i]++;
  }
}

// Daha akıcı ve soft bir animasyon için yavaşlatılmış hız
setInterval(draw, 45);

// Ekran boyutu değiştiğinde yeniden ayarla
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
