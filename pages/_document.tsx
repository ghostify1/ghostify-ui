import { Html, Head, Main, NextScript } from "next/document";
export default function Document(){
  return (
    <Html lang="tr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#00E5FF" />
        <meta name="description" content="Ghostify – Dijital izini gör ve sil." />
      </Head>
      <body className="bg-grid">
        <Main /><NextScript />
      </body>
    </Html>
  );
}
