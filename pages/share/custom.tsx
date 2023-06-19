import Features from "@/components/features";
import Home from "@/components/home";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Customized Path URL" />
      </Head>
      <Home type="CUSTOM" featureType="share" />
      <Features />
    </>
  );
}
