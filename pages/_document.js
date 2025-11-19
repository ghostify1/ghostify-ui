import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>

        {/* --- META --- */}
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#020510" />
        <meta name="description" content="Ghostify - Dijital İz Güvenliği Platformu" />

        {/* --- FAVICON + MANIFEST --- */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* --- GHOSTIFY FONTS --- */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Orbitron (Logo + Başlıklar) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Exo 2 (Input + Buton tipografi) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&display=swap"
          rel="stylesheet"
        />

        {/* JetBrains Mono (Matrix fontu + teknik text) */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;500;700&display=swap"
          rel="stylesheet"
        />

        {/* --- PERFORMANCE OPTIMIZATION --- */}
        <link rel="preload" href="/matrix-texture.png" as="image" />

      </Head>

      <body>
        {/* Matrix Background her sayfaya uygulanır */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
