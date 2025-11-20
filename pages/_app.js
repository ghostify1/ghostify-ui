// pages/_app.js
import "../styles/globals.css";
import dynamic from "next/dynamic";

// Matrix arka planı sadece client'ta render et
const MatrixBackground = dynamic(
  () => import("../components/MatrixBackground"),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-root">
      {/* Tüm sayfaların arkasında Matrix */}
      <MatrixBackground />
      {/* Sayfa içeriği */}
      <Component {...pageProps} />
    </div>
  );
}
