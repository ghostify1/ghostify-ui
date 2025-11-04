import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const chars = "01QWERTYUIOPASDFGHJKLZXCVBNM";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 11, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(37, 230, 255, 0.25)";
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);
        if (y * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[-1] opacity-25"
    />
  );
}
