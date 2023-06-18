import dynamic from "next/dynamic";

const Conatiner = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Container"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
const Flex = dynamic(() => import("@team.poi/ui/dist/cjs/components/Flex"), {
  loading() {
    return <div>Loading...</div>;
  },
});
const Saero = dynamic(() => import("@team.poi/ui/dist/cjs/components/Column"), {
  loading() {
    return <div>Loading...</div>;
  },
});
const Icon = dynamic(() => import("@team.poi/ui/dist/cjs/components/Icon"), {
  loading() {
    return <div>Loading...</div>;
  },
});
const Garo = dynamic(() => import("@team.poi/ui/dist/cjs/components/Row"), {
  loading() {
    return <div>Loading...</div>;
  },
});

import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./styles.module.css";
import Link from "next/link";

export default function Features() {
  return (
    <Conatiner>
      <h1>poi.kr&apos;s features</h1>
      <Garo
        gap={16}
        className={classNames(common.centerFlex, common.w100, styles.fea)}
      >
        <Flex>
          <Link href={"/"} style={{ textDecoration: "none" }}>
            <Saero className={classNames(common.centerFlex, styles.feature)}>
              <Icon icon="link" animated size={48} className={styles.rot45} />
              <h3>Shorten Link</h3>
            </Saero>
          </Link>
        </Flex>
        <Flex>
          <Link href="/custom" style={{ textDecoration: "none" }}>
            <Saero className={classNames(common.centerFlex, styles.feature)}>
              <Icon icon="settings_suggest" animated size={48} />
              <h3>Customized Path Link</h3>
            </Saero>
          </Link>
        </Flex>
      </Garo>
    </Conatiner>
  );
}
