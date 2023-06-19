import Features from "@/components/features";
import Header from "@/components/header";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Share everything" />
      </Head>
      <Header type={"MAIN"} />
      <Features />
    </>
  );
}
