import dynamic from "next/dynamic";
import { Conatiner, Flex, Saero, Icon, Garo } from "@team.poi/ui";

import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import common from "./../../styles/common.module.css";
import styles from "./styles.module.css";
import Link from "next/link";

export default function Features() {
  return (
    <Conatiner>
      <h1
        style={{
          borderBottom: "1px solid var(--nextui-colors-border)",
          padding: "2rem 0px",
        }}
      >
        poi.kr&apos;s features
      </h1>
      <div
        style={{
          padding: "0px 2rem",
        }}
      >
        <h2>Sharing</h2>
        <Saero gap={24}>
          <Garo
            gap={24}
            className={classNames(common.centerFlex, common.w100, styles.fea)}
          >
            <Flex>
              <Link href={"/share/"} style={{ textDecoration: "none" }}>
                <Saero
                  className={classNames(common.centerFlex, styles.feature)}
                >
                  <Icon
                    icon="link"
                    animated
                    size={48}
                    className={styles.rot45}
                  />
                  <h3>Shorten Link</h3>
                </Saero>
              </Link>
            </Flex>
            <Flex>
              <Link href="/share/custom" style={{ textDecoration: "none" }}>
                <Saero
                  className={classNames(common.centerFlex, styles.feature)}
                >
                  <Icon icon="settings_suggest" animated size={48} />
                  <h3>Customized Path Link</h3>
                </Saero>
              </Link>
            </Flex>
          </Garo>
          <Garo
            gap={24}
            className={classNames(common.centerFlex, common.w100, styles.fea)}
          >
            <Flex>
              <Link href={"/share/text"} style={{ textDecoration: "none" }}>
                <Saero
                  className={classNames(common.centerFlex, styles.feature)}
                >
                  <Icon icon="description" animated size={48} />
                  <h3>Share Text</h3>
                </Saero>
              </Link>
            </Flex>
            <Flex>
              <Link href={"/share/qrcode"} style={{ textDecoration: "none" }}>
                <Saero
                  className={classNames(common.centerFlex, styles.feature)}
                >
                  <Icon icon="qr_code_2" animated size={48} />
                  <h3>Share with QR Code</h3>
                </Saero>
              </Link>
            </Flex>
          </Garo>
        </Saero>
        <h2>Information</h2>
        <Saero gap={24}>
          <Garo
            gap={24}
            className={classNames(common.centerFlex, common.w100, styles.fea)}
          >
            <Flex>
              <Link href={"/ip"} style={{ textDecoration: "none" }}>
                <Saero
                  className={classNames(common.centerFlex, styles.feature)}
                >
                  <Icon icon="language" animated size={48} />
                  <h3>My IP Adress</h3>
                </Saero>
              </Link>
            </Flex>
          </Garo>
        </Saero>
      </div>
    </Conatiner>
  );
}
