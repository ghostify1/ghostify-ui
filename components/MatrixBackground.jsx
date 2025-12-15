import { useEffect, useRef } from "react";

export default function MatrixBackground({ opacity = 0.18, speed = 0.35 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const chars = "01";
    const fontSize = 14;
    const columns = Math.floor(w / fontSize);
    const drops = new Array(columns).fill(1);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let last = performance.now();
    const frame = (now) => {
      const dt = now - last;
      last = now;

      // background fade (soft trail)
      ctx.fillStyle = `rgba(0,0,0,${0.08})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      ctx.fillStyle = `rgba(128,230,255,${opacity})`;

      // slow factor
      const step = Math.max(1, Math.floor(dt * speed * 0.08));

      for (let i = 0; i < drops.length; i++) {
        if (Math.random() < 0.08 / step) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > h && Math.random() > 0.985) drops[i] = 0;
          drops[i] += 1;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        filter: "blur(0.2px)",
      }}
    />
  );
}
