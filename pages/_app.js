// pages/_app.js
import "../styles/globals.css";
import dynamic from "next/dynamic";

// Matrix sadece client tarafında çalışsın
const MatrixBackground = dynamic(
  () => import("../components/MatrixBackground.jsx"),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-root">
      {/* Arka planda matrix canvas */}
      <MatrixBackground />
      {/* Sayfa içeriği */}
      <Component {...pageProps} />
    </div>
  );
}

