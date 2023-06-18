import "@/styles/globals.css";
import { ModalProvider } from "@team.poi/ui/dist/cjs/hooks/Modal";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://poi.kr/" />
        <meta property="og:description" content="Share everything you have." />
        <meta property="og:site_name" content="poi.kr (포이)" />
        <meta property="og:locale" content="en_US" />
      </Head>
      <Component {...pageProps} />
    </ModalProvider>
  );
}
