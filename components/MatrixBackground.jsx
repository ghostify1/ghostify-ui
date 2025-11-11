import { useEffect, useRef } from "react";

export default function MatrixBackground(){
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w, h, cols, yPos, anim;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / 18);
      yPos = Array(cols).fill(0);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle = "#00d1ff";
      ctx.font = "14px monospace";
      yPos.forEach((y, i) => {
        const ch = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = i * 18;
        ctx.fillText(ch, x, y);
        yPos[i] = y > h + Math.random()*100 ? 0 : y + 16;
      });
      anim = requestAnimationFrame(draw);
    };

    resize(); draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="matrix-layer" aria-hidden />;
}
