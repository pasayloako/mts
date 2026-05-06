// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="BibleGPT - AI Bible Assistant" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
