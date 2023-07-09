import Features from "@/components/features";
import Header from "@/components/header";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Shorten URL" />
        <title>poi.kr / Shorten URL</title>
      </Head>
      <Header type="DROP" featureType="share" />
      <Features />
    </>
  );
}
