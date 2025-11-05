import "../styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  // Matrix efektine ufak fade animasyonu ekliyoruz
  useEffect(() => {
    document.body.style.backgroundColor = "#05080b";
  }, []);

  return <Component {...pageProps} />;
}
