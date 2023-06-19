import Headers from "@/components/header";
import dynamic from "next/dynamic";
import Link from "next/link";
const Button = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Button"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
const Saero = dynamic(() => import("@team.poi/ui/dist/cjs/components/Column"), {
  loading() {
    return <div>Loading...</div>;
  },
});

const FullFlex = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/FullFlex"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/error.module.css";
import NoSSR from "react-no-ssr";
import { useRouter } from "next/router";
import { Conatiner } from "@team.poi/ui";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

export default function Errors() {
  const router = useRouter();
  return (
    <Saero className={common.w100}>
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
              Uhh.. There is no shared text for {router.query.i}.
            </h1>
            <h2 className={classNames(common.tcenter, styles.h2)}>
              Or reached the max usage count, or expired...
            </h2>
            <div className={common.tcenter}>
              But you can share your{" "}
              <Button
                color="INFO"
                bordered
                onClick={() => router.push("/share/custom")}
              >
                texts!
              </Button>
            </div>
          </Saero>
        </Conatiner>
      </FullFlex>
    </Saero>
  );
}
