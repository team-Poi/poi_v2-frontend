import { useRouter } from "next/router";

import Container from "@team.poi/ui/dist/cjs/components/Container/index";
import dynamic from "next/dynamic";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/payresult.module.css";
import { Icon, classNames } from "@team.poi/ui";

const Garo = dynamic(() => import("@team.poi/ui/dist/cjs/components/Row"), {
  loading() {
    return <div>Loading...</div>;
  },
});

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className={styles.recipet}>
      <Garo gap={8} className={classNames(common.w100, common.centerFlex)}>
        <Icon icon="receipt_long" animated size={48} />
        <h1 className={styles.h1}>결제 성공</h1>
      </Garo>
      <div className={styles.spacer}></div>
      <div>{`주문 아이디: ${router.query["orderId"]}`}</div>
      <div>{`결제 금액: ${Number(
        router.query["amount"]
      ).toLocaleString()}원`}</div>
    </div>
  );
}
