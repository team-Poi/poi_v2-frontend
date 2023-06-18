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
const Editor = dynamic(() => import("./../Editor/index"), {
  loading() {
    return <div>Loading...</div>;
  },
});

import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import { useModal } from "@team.poi/ui/dist/cjs/hooks/Modal";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import doCopy from "@/utils/copy";
import isURL from "validator/lib/isURL";
import axios from "axios";
import HomeType from "@/types/homeType";
import { optCSS } from "@team.poi/ui";

export default function Home(props: { type: HomeType }) {
  const [input, setInput] = useState("");
  const [isEng, setIsEng] = useState(false);
  const [useOnce, setUseOnce] = useState(true);
  const { addModal } = useModal();
  const editorRef = useRef<any>(null);

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

  const openerr = (data: string) => setTimeout(openError, 20, data);
  const opensuc = (data: string) => setTimeout(openSuccess, 20, data);

  let axioserIndex =
    props.type === "URL"
      ? 0
      : props.type === "CUSTOM"
      ? 1
      : props.type == "TEXT"
      ? 2
      : -1;

  const axioers = [
    (close: () => void) => {
      axios
        .post("/api/url/new", {
          eng: isEng,
          to: input,
          expire: useOnce,
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
            if (e.response.status == 500)
              return openerr("Internal Server Error");
            return openerr("Error occurred while shortening url");
          }
        })
        .finally(() => {
          close();
        });
    },
    (close: () => void, data: string) => {
      axios
        .post("/api/custom/new", {
          eng: isEng,
          to: input,
          from: data,
          expire: useOnce,
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
            if (e.response.status == 500)
              return openerr("Internal Server Error");
            return openerr("Error occurred while shortening url");
          }
        })
        .finally(() => {
          close();
        });
    },
    (close: () => void, data: string) => {
      axios
        .post("/api/text/new", {
          isEng: isEng,
          text: data,
          useOnce: useOnce,
        })
        .then((v) => {
          let data = v.data as {
            s: boolean;
            e: string;
          };

          if (data.s)
            // Success!
            return opensuc(`https://poi.kr/t/${data.e}`);

          openerr(data.e);
        })
        .catch((e) => {
          if (e.response && e.response.status) {
            if (e.response.status == 500)
              return openerr("Internal Server Error");
            return openerr("Error occurred while shortening url");
          }
        })
        .finally(() => {
          close();
        });
    },
  ];

  const loader = (data?: string) => {
    return addModal.modal({
      canExit: false,
      RenderChildren: ({ close }) => {
        let axiosing = useRef(false);
        useEffect(() => {
          if (axiosing.current == true) return;
          axiosing.current = true;
          axioers[axioserIndex](close, data as string);
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
  };
  const buttonHandler = () => {
    if (
      (props.type == "URL" || props.type == "CUSTOM") &&
      !isURL(input, {
        allow_trailing_dot: false,
        protocols: ["http", "https"],
      })
    )
      return openError("Please enter a Valid URL");

    if (props.type == "URL") return loader();
    if (props.type == "CUSTOM")
      return addModal
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

          loader(data);
        });
    if (props.type == "TEXT") {
      let input = editorRef.current.getContent();
      if (input == null || input.length == 0)
        return openError("Text cannot be empty.");
      if (input.length > 32768)
        return openError("Text html cannot be more than 32768 characters.");
      return loader(input);
    }
  };
  const TitleElement = () => {
    if (props.type == "CUSTOM")
      return (
        <h1>
          Shorten every <span className={common.titleSpan}>Link</span> with
          customized path.
        </h1>
      );
    if (props.type == "URL")
      return (
        <h1>
          Shorten every <span className={common.titleSpan}>Link</span> you have!
        </h1>
      );
    if (props.type == "TEXT")
      return (
        <h1>
          Share every <span className={common.titleSpan}>Text</span> you have!
        </h1>
      );
    return <h1>What?</h1>;
  };
  const InputPlaceholder = () => {
    if (props.type == "CUSTOM") return "Not customized Link";
    if (props.type == "URL") return "Loooong Link";
  };
  const ButtonText = () => {
    if (props.type == "URL") return "Shorten";
    if (props.type == "CUSTOM") return "Customize";
    if (props.type == "TEXT") return "Share";
  };
  // const KorEngSwitch = () => {
  //   return (

  //   );
  // };

  return (
    <>
      <Header type={props.type} />
      <Conatiner>
        <Saero gap={5}>
          <TitleElement />
          <Garo
            gap={8}
            style={{
              alignItems: "center",
            }}
            className={classNames(
              styles.inputGaro,
              optCSS(props.type == "TEXT", styles.text)
            )}
          >
            <FullFlex className={styles.input}>
              {["CUSTOM", "URL"].includes(props.type) ? (
                <Input
                  value={input}
                  onChange={(e) =>
                    setInput((e.target as HTMLInputElement).value)
                  }
                  icon="link"
                  type="url"
                  placeholder={InputPlaceholder()}
                  css={{
                    margin: "0px",
                  }}
                />
              ) : null}
              {props.type == "TEXT" ? (
                <Editor
                  tinymceScriptSrc={"/tinymce/tinymce/tinymce.min.js"}
                  onInit={(evt, editor) => (editorRef.current = editor)}
                />
              ) : null}
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
                  onClick={buttonHandler}
                >
                  {ButtonText()}
                </Button>
              </div>
            </Saero>
          </Garo>
          <Garo gap={7} className={classNames(common.w100, common.centerFlex)}>
            {["URL", "TEXT"].includes(props.type) && (
              <Flex>
                <Garo
                  gap={7}
                  className={classNames(
                    styles.optionContainers,
                    common.centerFlex
                  )}
                >
                  <div>KOR</div>
                  <div
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
                  </div>
                  <div>ENG</div>
                </Garo>
              </Flex>
            )}
            <Flex>
              <Garo
                gap={7}
                className={classNames(
                  styles.optionContainers,
                  common.centerFlex
                )}
              >
                <div>Use once</div>
                <div
                  style={{
                    minWidth: "3rem",
                  }}
                >
                  <Switch
                    style={{
                      width: "100%",
                    }}
                    value={useOnce}
                    onChange={setUseOnce}
                  />
                </div>
              </Garo>
            </Flex>
          </Garo>
        </Saero>
      </Conatiner>
    </>
  );
}
