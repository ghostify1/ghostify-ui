// components/MatrixBackground.js
import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);

    // Karakter seti: katakana + ghostify sembolleri
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789◇◆○●☉☼▒░░▓█◎∞⊕⊗Ω";
    const charArray = chars.split("");

    const fontSize = 18;
    const columns = Math.floor(width / fontSize);

    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -20; // biraz yukarıdan başlasın
    }

    let animationFrameId;

    const draw = () => {
      // arkayı hafifçe karartarak “trail” efekti
      ctx.fillStyle = "rgba(2, 7, 15, 0.35)";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        // layer’a göre renk seç
        const depth = Math.random();
        if (depth < 0.6) {
          ctx.fillStyle = "rgba(128, 230, 255, 0.7)";
        } else if (depth < 0.9) {
          ctx.fillStyle = "rgba(77, 246, 255, 0.9)";
        } else {
          ctx.fillStyle = "rgba(0, 255, 176, 0.9)";
        }

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // satır aşağı
        drops[i] += 0.8 + Math.random() * 0.3;

        // ekran dışına çıkınca yukarı resetle
        if (drops[i] * fontSize > height + 50) {
          drops[i] = Math.random() * -20;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-bg-canvas"
      aria-hidden="true"
    />
  );
}
