document.addEventListener("DOMContentLoaded", function() {
  }); // DOMContentLoaded sonu
window.addEventListener("DOMContentLoaded", () => {
  // mevcut matrix kodların buradan başlasın

// matrix.js — yumuşak, dikkat dağıtmayan sürüm
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function size() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
size(); window.addEventListener('resize', size);

const symbols = '01';
const fontSize = 16;
let columns = Math.floor(window.innerWidth / fontSize);
let drops = Array(columns).fill(1);

function draw() {
  ctx.fillStyle = 'rgba(0,0,0,0.05)';              // hafif iz bırak
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle = '#00ffff';
  ctx.font = `${fontSize}px monospace`;

  for(let i=0;i<drops.length;i++){
    const text = symbols.charAt(Math.floor(Math.random()*symbols.length));
    const x = i*fontSize;
    const y = drops[i]*fontSize;

    ctx.globalAlpha = 0.25 + Math.random()*0.25;   // yumuşak parıltı
    ctx.fillText(text,x,y);

    if(y > canvas.height && Math.random() > 0.975){ drops[i] = 0; }
    drops[i]++;
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
