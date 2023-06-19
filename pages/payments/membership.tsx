import {
  loadPaymentWidget,
  PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import common from "./../../styles/common.module.css";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import Header from "@/components/header";
import { uid } from "uid";

import Container from "@team.poi/ui/dist/cjs/components/Container/index";
const Button = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Button"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
const Garo = dynamic(() => import("@team.poi/ui/dist/cjs/components/Row"), {
  loading() {
    return <div>Loading...</div>;
  },
});

const clientKey = "test_ck_aBX7zk2yd8yxbYOR2dQrx9POLqKQ";

export default function Buy() {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const price = 1;

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(
        clientKey,
        "YbX2HuSlsC9uVJW6NMRMj",
        {}
      );

      paymentWidget.renderPaymentMethods("#payment-widget", price);

      paymentWidgetRef.current = paymentWidget;
    })();
  }, []);

  return (
    <>
      <Header featureType="pay" type="PAY" />
      <Container>
        <h1>Buy Premium Membership</h1>
        <div id="payment-widget" />
        <Garo className={classNames(common.w100, common.centerFlex)}>
          <Button
            onClick={async () => {
              const paymentWidget = paymentWidgetRef.current;

              try {
                await paymentWidget?.requestPayment({
                  orderId: uid(),
                  orderName: "토스 티셔츠 외 2건",
                  customerName: "김토스",
                  customerEmail: "customer123@gmail.com",
                  successUrl: `${window.location.origin}/payments/success`,
                  failUrl: `${window.location.origin}/payments/failed`,
                });
              } catch (err) {
                console.log(err);
              }
            }}
          >
            Pay!
          </Button>
        </Garo>
      </Container>
    </>
  );
}
