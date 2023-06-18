import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/header/index"), {
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
const Switch = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Switch"),
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
const Garo = dynamic(() => import("@team.poi/ui/dist/cjs/components/Row"), {
  loading() {
    return <div>Loading...</div>;
  },
});
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
const FullFlex = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/FullFlex"),
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
const Input = dynamic(() => import("@team.poi/ui/dist/cjs/components/Input"), {
  loading() {
    return <div>Loading...</div>;
  },
});
const Loading = dynamic(
  () => import("@team.poi/ui/dist/cjs/components/Loading"),
  {
    loading() {
      return <div>Loading...</div>;
    },
  }
);
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import { useModal } from "@team.poi/ui/dist/cjs/hooks/Modal";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import doCopy from "@/utils/copy";
import isURL from "validator/lib/isURL";
import axios from "axios";

export default function Home(props: { customed?: boolean }) {
  const [input, setInput] = useState("");
  const [isEng, setIsEng] = useState(false);
  const { addModal } = useModal();

  const openSuccess = (url: string) => {
    addModal.modal({
      canExit: true,
      RenderChildren: ({ close }) => {
        return (
          <Saero
            style={{
              padding: "2rem 0px",
            }}
            gap={16}
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
            <Input readOnly placeholder="Shorted URL" value={url} />
            <Garo className={styles.buttons} gap={4}>
              <Flex>
                <Button className={common.w100} onClick={() => doCopy(url)}>
                  Copy
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

  const openError = (message?: string) => {
    addModal.modal({
      canExit: true,
      RenderChildren: ({ close }) => {
        return (
          <Saero
            style={{
              padding: "2rem 0px",
            }}
            gap={16}
            className={classNames(
              styles.successContainer,
              common.centerFlex,
              common.w100
            )}
          >
            <Icon
              style={{
                color: "var(--POI-UI-ERROR)",
              }}
              icon="error"
              size={64}
              animated
              className={styles.success}
            />
            <div
              style={{
                textAlign: "center",
              }}
            >
              {message ? message : "Failed to shorten your url."}
            </div>
            <Garo className={styles.buttons} gap={4}>
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

  const axioser = (close: () => void) => {
    const openerr = (data: string) => setTimeout(openError, 20, data);
    const opensuc = (data: string) => setTimeout(openSuccess, 20, data);
    axios
      .post("/api/url/new", {
        eng: isEng,
        to: input,
      })
      .then((v) => {
        let data = v.data as {
          s: boolean;
          e: string;
        };

        if (data.s)
          // Success!
          return opensuc(`https://poi.kr/${data.e}`);

        openerr(data.e);
      })
      .catch((e) => {
        if (e.response && e.response.status) {
          if (e.response.status == 500) return openerr("Internal Server Error");
          return openerr("Error occurred while shortening url");
        }
      })
      .finally(() => {
        close();
      });
  };

  const axioser2 = (close: () => void, data: string) => {
    const openerr = (data: string) => setTimeout(openError, 20, data);
    const opensuc = (data: string) => setTimeout(openSuccess, 20, data);
    axios
      .post("/api/custom/new", {
        eng: isEng,
        to: input,
        from: data,
      })
      .then((v) => {
        let data = v.data as {
          s: boolean;
          e: string;
        };

        if (data.s)
          // Success!
          return opensuc(`https://poi.kr/c/${data.e}`);

        openerr(data.e);
      })
      .catch((e) => {
        if (e.response && e.response.status) {
          if (e.response.status == 500) return openerr("Internal Server Error");
          return openerr("Error occurred while shortening url");
        }
      })
      .finally(() => {
        close();
      });
  };

  const shorten = () => {
    if (
      !isURL(input, {
        allow_trailing_dot: false,
        protocols: ["http", "https"],
      })
    )
      return openError("Please enter a Valid URL");

    if (!props.customed)
      return addModal.modal({
        canExit: false,
        RenderChildren: ({ close }) => {
          let axiosing = useRef(false);
          useEffect(() => {
            if (axiosing.current == true) return;
            axiosing.current = true;
            axioser(close);
          }, [close]);
          return (
            <Saero
              style={{
                padding: "2rem 0px",
              }}
              className={classNames(common.centerFlex, common.w100)}
              gap={16}
            >
              <Loading size={48} />
              <div>Wait a moment...</div>
            </Saero>
          );
        },
      });

    addModal
      .line({
        canExit: true,
        title: "Custom path",
        body: "https://poi.kr/c/[Your Path]",
        canBeEmpty: false,
        okayButton: "Customize",
      })
      .then((data) => {
        if (data == null || data.length == 0)
          return openError("Path cannot be empty.");
        if (data.length < 5)
          return openError("Math must be longer than 6 characters.");
        if (data.length > 24)
          return openError("Math must be less than 24 characters.");

        addModal.modal({
          canExit: false,
          RenderChildren: ({ close }) => {
            let axiosing = useRef(false);
            useEffect(() => {
              if (axiosing.current == true) return;
              axiosing.current = true;
              axioser2(close, data);
            }, [close]);
            return (
              <Saero
                style={{
                  padding: "2rem 0px",
                }}
                className={classNames(common.centerFlex, common.w100)}
                gap={16}
              >
                <Loading size={48} />
                <div>Wait a moment...</div>
              </Saero>
            );
          },
        });
      });
  };

  return (
    <>
      <Header type={props.customed ? "CUSTOM" : "URL"} />
      <Conatiner>
        <Saero>
          {props.customed ? (
            <h1>
              Shorten every <span className={common.titleSpan}>Link</span> with
              customized path.
            </h1>
          ) : (
            <h1>
              Shorten every <span className={common.titleSpan}>Link</span> you
              have!
            </h1>
          )}
          <Garo
            gap={8}
            style={{
              alignItems: "center",
            }}
            className={styles.inputGaro}
          >
            <FullFlex className={styles.input}>
              <Input
                value={input}
                onChange={(e) => setInput((e.target as HTMLInputElement).value)}
                icon="link"
                type="url"
                placeholder={
                  props.customed ? "Not customized Link" : "Loooong Link"
                }
                css={{
                  margin: "0px",
                }}
              />
            </FullFlex>
            <Saero
              className={classNames(styles.buttons, common.centerFlex)}
              gap={5}
            >
              <div
                style={{
                  overflow: "hidden",
                  minWidth: "fit-content",
                }}
                className={common.w100}
              >
                <Button
                  style={{
                    fontFamily: "var(--POI-UI-FONT-BOLD)",
                    fontSize: "1.2rem",
                  }}
                  css={{
                    width: "100%",
                  }}
                  color="SUCCESS"
                  className={classNames(styles.button, common.w100)}
                  onClick={shorten}
                >
                  {props.customed ? "Customize" : "Shorten"}
                </Button>
              </div>
              {!props.customed && (
                <Garo
                  gap={7}
                  className={classNames(
                    styles.optionContainers,
                    common.centerFlex
                  )}
                >
                  <Flex>KOR</Flex>
                  <FullFlex
                    style={{
                      minWidth: "3rem",
                    }}
                  >
                    <Switch
                      value={isEng}
                      onChange={setIsEng}
                      style={{
                        width: "100%",
                      }}
                    />
                  </FullFlex>
                  <Flex>ENG</Flex>
                </Garo>
              )}
            </Saero>
          </Garo>
        </Saero>
      </Conatiner>
    </>
  );
}
