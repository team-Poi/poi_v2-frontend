import Headers from "@/components/header";
import { Button, Saero, FullFlex } from "@/components/ui";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/error.module.css";
import NoSSR from "react-no-ssr";
import { useRouter } from "next/router";
import { Conatiner } from "@team.poi/ui";
import Head from "next/head";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

export default function Errors() {
  const router = useRouter();
  return (
    <Saero className={common.w100}>
      <Head>
        <meta
          property="og:title"
          content="poi.kr / No customized path link found"
        />
        <title>poi.kr / No customized path link found</title>
      </Head>
      <Headers type="ERROR" featureType="error" />
      <FullFlex className={common.w100}>
        <Conatiner>
          <Saero className={classNames(common.w100, common.centerFlex)}>
            <NoSSR>
              <div className={classNames(styles.errorFace, common.tcenter)}>
                {words[Math.floor(Math.random() * words.length)]}
              </div>
            </NoSSR>
            <h1 className={classNames(common.tcenter, styles.h1)}>
              Uhh.. There is no customized path link for {router.query.i}.
            </h1>
            <h2 className={classNames(common.tcenter, styles.h2)}>
              Or reached the max usage count, or expired...
            </h2>
            <div className={common.tcenter}>
              But you can make your own{" "}
              <Button
                color="INFO"
                bordered
                onClick={() => router.push("/share/custom")}
              >
                customized path links!
              </Button>
            </div>
          </Saero>
        </Conatiner>
      </FullFlex>
    </Saero>
  );
}
