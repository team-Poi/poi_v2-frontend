import "@/styles/globals.css";
import { ModalProvider } from "@team.poi/ui/dist/cjs/hooks/Modal";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://poi.kr/" />
        <meta property="og:description" content="Share everything you have." />
        <meta property="og:site_name" content="poi.kr (포이)" />
        <meta property="og:locale" content="en_US" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Analytics />
      <ToastContainer autoClose={3000} position="bottom-right" />
    </ModalProvider>
  );
}
