import Features from "@/components/features";
import Home from "@/components/home";
import Head from "next/head";

export default function Page() {
  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Share Text" />
      </Head>
      <Home type="TEXT" featureType="share" />
      <Features />
    </>
  );
}
