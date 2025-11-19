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

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    setSize();
    window.addEventListener("resize", setSize);

    // Ghostify karakter seti
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
      "0123456789" +
      "◇◆○●◎∞⊕⊗Ω" +
      "@#$%&";

    const charArray = chars.split("");

    const fontSize = 18;
    let columns = Math.floor(width / fontSize);

    // Her kolon için durum
    let columnsState = Array.from({ length: columns }, (_, i) => ({
      y: Math.random() * -20,
      speed: 0.8 + Math.random() * 1.4, // farklı hızlar
      glowPhase: Math.random() * Math.PI * 2, // nefes efekti
    }));

    let animationFrameId;

    const draw = () => {
      // Arka planı hafif karart – trail efekti
      ctx.fillStyle = "rgba(2, 7, 15, 0.35)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Space Grotesk", "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < columnsState.length; i++) {
        const state = columnsState[i];
        const char = charArray[Math.floor(Math.random() * charArray.length)];

        // Glow fazını ilerlet
        state.glowPhase += 0.03 + Math.random() * 0.01;
        const glow = (Math.sin(state.glowPhase) + 1) / 2; // 0–1

        // Renk geçişi: koyu mavi → neon cyan → hafif yeşilimsi
        const baseCyan = { r: 0, g: 190, b: 255 };
        const brightCyan = { r: 120, g: 240, b: 255 };
        const ghostGreen = { r: 0, g: 255, b: 176 };

        // Derinlik/random katman
        const depth = Math.random();
        let target;

        if (depth < 0.6) target = baseCyan;
        else if (depth < 0.9) target = brightCyan;
        else target = ghostGreen;

        const r = Math.round(target.r + glow * 20);
        const g = Math.round(target.g + glow * 20);
        const b = Math.round(target.b + glow * 20);

        const alpha = 0.55 + glow * 0.35;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        // Glow efekti
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${0.35 + glow * 0.4})`;
        ctx.shadowBlur = 8 + glow * 10;

        const x = i * fontSize;
        const y = state.y * fontSize;

        ctx.fillText(char, x, y);

        // Kolonu aşağı indir
        state.y += state.speed;

        // Ekran dışına çıktıysa resetle
        if (y > height + 50) {
          state.y = Math.random() * -20;
          state.speed = 0.8 + Math.random() * 1.4;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
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
