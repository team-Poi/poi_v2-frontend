import Features from "@/components/features";
import Home from "@/components/home";
import qrcoder from "@/utils/qrcoder";
import { useModal } from "@team.poi/ui/dist/cjs/hooks/Modal";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const { addModal } = useModal();
  const urlShown = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (urlShown.current) return;
    let url = router.query.url;
    if (!url) return;
    qrcoder(addModal, url as string);
    urlShown.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.url]);

  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Make QR Code" />
        <title>poi.kr / Make QR Code</title>
      </Head>
      <Home type="QRCODE" featureType="share" />
      <Features />
    </>
  );
}
