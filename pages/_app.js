import "../styles/globals.css";
import MatrixBackground from "../components/MatrixBackground";

export default function App({ Component, pageProps }) {
  return (
    <>
      <MatrixBackground opacity={0.18} speed={0.35} />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
