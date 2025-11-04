import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <link rel="icon" href="/ghostify.ico" />
        <meta name="theme-color" content="#05080b" />
        <title>Ghostify</title>
      </Head>
      <body className="bg-[#05080b]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
