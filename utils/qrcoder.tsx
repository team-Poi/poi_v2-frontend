import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import dynamic from "next/dynamic";
import common from "./../styles/common.module.css";
import styles from "./../styles/Home.module.css";

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
const Button = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Button"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
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

const qrcoder = (addModal: any, input: string) => {
  addModal.modal({
    canExit: true,
    RenderChildren: ({ close }: any) => {
      let [bg, setBg] = useState("#ffffff");
      let [fg, setFg] = useState("#000000");
      return (
        <Saero
          style={{
            padding: "2rem 0px",
          }}
          gap={12}
          className={classNames(
            styles.successContainer,
            common.centerFlex,
            common.w100
          )}
        >
          <Icon
            style={{
              color: "var(--POI-UI-SUCCESS)",
            }}
            icon="check_circle"
            size={64}
            animated
            className={styles.success}
          />
          <Garo className={classNames(common.w100, common.centerFlex)} gap={16}>
            <Flex
              className={classNames(common.centerFlex)}
              style={{
                display: "flex",
              }}
            >
              <Saero className={classNames(common.centerFlex, styles.cst)}>
                <input
                  type="color"
                  className={styles.cinput}
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                />
                <div>Background</div>
              </Saero>
            </Flex>
            <Flex
              className={classNames(common.centerFlex)}
              style={{
                display: "flex",
              }}
            >
              <Saero className={classNames(common.centerFlex, styles.cst)}>
                <input
                  type="color"
                  className={styles.cinput}
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                />
                <div>Foreground</div>
              </Saero>
            </Flex>
          </Garo>
          <Garo className={classNames(common.w100, common.centerFlex)}>
            <QRCodeCanvas
              bgColor={bg}
              fgColor={fg}
              value={input}
              size={1024}
              includeMargin
              id="qrcanvas"
              style={{
                width: "128px",
                height: "128px",
                borderRadius: "5px",
                border: "2px solid black",
                boxShadow: ".5rem .5rem .5rem rgba(0,0,0,0.1)",
              }}
            />
          </Garo>
          <Garo
            className={styles.buttons}
            gap={4}
            style={{
              width: "90%",
              marginTop: "2rem",
            }}
          >
            <Flex>
              <Button
                className={common.w100}
                color="SUCCESS"
                onClick={() => {
                  let canvasEl = document.getElementById(
                    "qrcanvas"
                  ) as HTMLCanvasElement;

                  if (!canvasEl) return;
                  let a = document.createElement("a");
                  a.download = "qrcode.png";
                  a.href = canvasEl.toDataURL("image/png");
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                Download
              </Button>
            </Flex>
            <Flex>
              <Button className={common.w100} color="ERROR" onClick={close}>
                Close
              </Button>
            </Flex>
          </Garo>
        </Saero>
      );
    },
  });
};

export default qrcoder;
