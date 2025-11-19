// pages/_app.js
import "../styles/global.css";
import dynamic from "next/dynamic";

// Matrix sadece client’ta çalışsın diye dynamic import
const MatrixBackground = dynamic(
  () => import("../components/MatrixBackground"),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-root">
      <MatrixBackground />
      <Component {...pageProps} />
    </div>
  );
}
