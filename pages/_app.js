// pages/_app.js
import "../styles/global.css";
import "../styles/invite.css";
import "../styles/login.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
