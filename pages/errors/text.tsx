import Headers from "@/components/header";
import dynamic from "next/dynamic";
import { Button, Saero, FullFlex } from "@team.poi/ui";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/error.module.css";
import NoSSR from "react-no-ssr";
import { useRouter } from "next/router";
import { Conatiner } from "@team.poi/ui";
import Head from "next/head";
import Errors from "@/components/error";

const words = [`˙◠˙`, `ᴖ̈`, `(っ◞‸◟ c)`, `(ㅠ﹏ㅠ)`, `ꃋᴖꃋ`];

export default function Error() {
  const router = useRouter();
  return (
    <>
      <Errors
        title="No shared text found"
        bigTitle="Uhh.. There is no shared text for $i."
        smallTitle="Or reached the max usage count, or expired..."
        button={
          <>
            But you can share your{" "}
            <Button
              color="INFO"
              bordered
              onClick={() => router.push("/share/custom")}
            >
              texts!
            </Button>
          </>
        }
      />
    </>
  );
}
