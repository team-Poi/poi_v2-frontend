import Headers from "@/components/header";
import { Saero, FullFlex } from "@team.poi/ui";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./error.module.css";
import NoSSR from "react-no-ssr";
import { useRouter } from "next/router";
import { Conatiner } from "@team.poi/ui";
import Head from "next/head";
import React from "react";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];
type ErrorProps = {
  title: string;
  bigTitle: string;
  smallTitle: string;
  button: React.ReactNode;
};

export default function Errors(props: ErrorProps) {
  const router = useRouter();
  return (
    <Saero className={common.w100}>
      <Head>
        <meta property="og:title" content={`poi.kr / ${props.title}`} />
        <title>poi.kr / ${props.title}</title>
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
              {props.bigTitle.replace(
                "$i",
                router.query.i?.toString() || "Unknown"
              )}
            </h1>
            <h2 className={classNames(common.tcenter, styles.h2)}>
              {props.smallTitle}
            </h2>
            <div className={common.tcenter}>{props.button}</div>
          </Saero>
        </Conatiner>
      </FullFlex>
    </Saero>
  );
}
