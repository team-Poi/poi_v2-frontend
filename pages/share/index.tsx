import Features from "@/components/features";
import Home from "@/components/home";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Shorten URL" />
      </Head>
      <Home type="URL" featureType="share" />
      <Features />
    </>
  );
}
