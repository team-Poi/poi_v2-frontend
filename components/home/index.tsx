import dynamic from "next/dynamic";

import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import { useModal } from "@team.poi/ui/dist/cjs/hooks/Modal";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import doCopy from "@/utils/copy";
import isURL from "validator/lib/isURL";
import axios from "axios";
import HomeType from "@/@types/homeType";
import { optCSS } from "@team.poi/ui";
import { useRouter } from "next/router";
import qrcoder from "@/utils/qrcoder";
import {
  Saero,
  Icon,
  Garo,
  Flex,
  Button,
  Input,
  Loading,
  FullFlex,
  Conatiner,
  Switch,
} from "@team.poi/ui";
import Header from "@/components/header";

const Editor = dynamic(() => import("./../Editor/index"), {
  loading() {
    return <div>Loading...</div>;
  },
});

export default function Home(props: { type: HomeType; featureType?: string }) {
  const [input, setInput] = useState("");
  const [isEng, setIsEng] = useState(false);
  const [maxUsage, setMaxUsage] = useState(1);
  const [expireAfter, setExpireAfter] = useState(86400 * 7);
  const [editorLoading, setEditorLoading] = useState(true);
  const { addModal } = useModal();
  const editorRef = useRef<any>(null);
  const router = useRouter();

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
                <Button
                  className={common.w100}
                  color="SUCCESS"
                  onClick={() => {
                    close();
                    router.push("/share/qrcode?url=" + encodeURI(url));
                  }}
                >
                  QR Code
                </Button>
              </Flex>
            </Garo>
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

  const ableTimes = [
    60, 120, 180, 300, 600, 1800, 3600, 7200, 10800, 18000, 43200, 86400,
    172800, 259200, 432000, 604800, 1209600, 1814400, 2592000, 7948800,
    13132800, 31536000,
  ];
  const ableUsages = [1, 2, 5, 10, 50, 100, 500, -1];

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
          usage: maxUsage,
          expire: expireAfter,
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
          usage: maxUsage,
          expire: expireAfter,
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
          usage: maxUsage,
          expire: expireAfter,
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

  const INPUT_SUPPORTS = ["URL", "CUSTOM", "QRCODE"];
  const URL_INPUT_THINGS = ["URL", "CUSTOM", "QRCODE"];
  const LIMIT_USAGES = ["URL", "CUSTOM", "TEXT"];

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
    if (LIMIT_USAGES.includes(props.type) && !ableTimes.includes(expireAfter))
      return openError("Please choose a valid expire time");
    if (LIMIT_USAGES.includes(props.type) && !ableUsages.includes(maxUsage))
      return openError("Please choose a valid max usage");

    if (
      URL_INPUT_THINGS.includes(props.type) &&
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
    if (props.type == "QRCODE") return qrcoder(addModal, input);
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
          Share every <span className={common.titleSpan}>Text</span> easily!
        </h1>
      );
    if (props.type == "QRCODE")
      return (
        <h1>
          Share Links with <span className={common.titleSpan}>QR Code</span>
        </h1>
      );
    return <h1>What?</h1>;
  };
  const InputPlaceholder = () => {
    if (props.type == "CUSTOM") return "Not customized Link";
    if (props.type == "URL") return "Loooong Link";
    if (props.type == "QRCODE") return "Not QR Coded Link";
  };
  const ButtonText = () => {
    if (props.type == "URL") return "Shorten";
    if (props.type == "CUSTOM") return "Customize";
    if (props.type == "TEXT") return "Share";
    if (props.type == "QRCODE") return "QR Code it";
  };
  const ExpiresAfter = () => (
    <Garo gap={7} className={classNames(common.w100, common.centerFlex)}>
      <Flex>
        <Garo
          gap={7}
          className={classNames(styles.optionContainers, common.centerFlex)}
        >
          <div>Expires after</div>
          <div
            style={{
              minWidth: "3rem",
            }}
          >
            <select
              className={styles.select}
              value={expireAfter}
              onChange={(e) => setExpireAfter(parseInt(e.target.value || "1"))}
            >
              <option value={60}>60 Seconds</option>
              <option value={120}>2 Minuites</option>
              <option value={180}>3 Minuites</option>
              <option value={300}>5 Minuites</option>
              <option value={600}>10 Minuites</option>
              <option value={1800}>30 Minuites</option>
              <option value={3600}>1 Hour</option>
              <option value={3600 * 2}>2 Hours</option>
              <option value={3600 * 3}>3 Hours</option>
              <option value={3600 * 5}>5 Hours</option>
              <option value={3600 * 12}>12 Hours</option>
              <option value={86400}>1 Day</option>
              <option value={86400 * 2}>2 Days</option>
              <option value={86400 * 3}>3 Days</option>
              <option value={86400 * 5}>5 Days</option>
              <option value={86400 * 7}>1 Week</option>
              <option value={86400 * 7 * 2}>2 Weeks</option>
              <option value={86400 * 7 * 3}>3 Weeks</option>
              <option value={86400 * 30}>1 Month (30 Days)</option>
              <option value={86400 * 92}>3 Months (92 Days)</option>
              <option value={86400 * 152}>5 Months (152 Days)</option>
              <option value={86400 * 365}>1 Year (365 Days)</option>
            </select>
          </div>
        </Garo>
      </Flex>
    </Garo>
  );

  return (
    <>
      <Header type={props.type} featureType={props.featureType} />
      <Conatiner>
        <Saero gap={5}>
          <TitleElement />
          {/* Input / Button */}
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
              {INPUT_SUPPORTS.includes(props.type) ? (
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
                <>
                  {editorLoading && (
                    <Saero
                      className={classNames(common.w100, common.centerFlex)}
                      style={{
                        margin: "3rem 0px",
                      }}
                      gap={16}
                    >
                      <Loading size={64} />
                      <div>Loading Editor...</div>
                    </Saero>
                  )}
                  <Editor
                    tinymceScriptSrc={"/tinymce/tinymce/tinymce.min.js"}
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                      setEditorLoading(false);
                    }}
                  />
                </>
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

          {props.type == "QRCODE" ? null : (
            <>
              <Garo
                gap={7}
                className={classNames(common.w100, common.centerFlex)}
              >
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
                          minWidth: "2.45rem",
                        }}
                      >
                        <Switch
                          value={isEng}
                          onChange={setIsEng}
                          style={{
                            width: "100%",
                          }}
                          key={"ISENG"}
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
                    <div>Usage</div>
                    <div
                      style={{
                        minWidth: "3rem",
                      }}
                    >
                      <select
                        className={styles.select}
                        value={maxUsage}
                        onChange={(e) =>
                          setMaxUsage(parseInt(e.target.value || "1"))
                        }
                      >
                        <option value={1}>Once</option>
                        <option value={2}>2 Times</option>
                        <option value={5}>5 Times</option>
                        <option value={10}>10 Times</option>
                        <option value={50}>50 Times</option>
                        <option value={100}>100 Times</option>
                        <option value={500}>500 Times</option>
                        <option value={-1}>Unlimited</option>
                      </select>
                    </div>
                  </Garo>
                </Flex>
              </Garo>
              <ExpiresAfter />
            </>
          )}
        </Saero>
      </Conatiner>
    </>
  );
}
