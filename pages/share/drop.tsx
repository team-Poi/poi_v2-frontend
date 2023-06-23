import dynamic from "next/dynamic";
import Head from "next/head";
import common from "./../../styles/common.module.css";
import styles from "./../../styles/drop.module.css";
import classNames from "@team.poi/ui/dist/cjs/utils/classNames";
import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { Socket, io } from "socket.io-client";
import { useModal } from "@team.poi/ui/dist/cjs/hooks/Modal";
import { toast } from "react-toastify";
import { uid } from "uid";

const Header = dynamic(() => import("@/components/header/index"), {
  loading() {
    return <div>Loading...</div>;
  },
});
const Features = dynamic(() => import("@/components/features"), {
  loading() {
    return <div>Loading...</div>;
  },
});
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
const Icon = dynamic(() => import("@team.poi/ui/dist/cjs/components/Icon"), {
  loading() {
    return <div>Loading...</div>;
  },
});

interface Peer {
  id: string;
  name: string;
}

const PEERCONNECTION_OPTIONS = {
  sdpSemantics: "unified-plan",
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
};

const Peer = (props: { name: string; id: string; socket: Socket | null }) => {
  const inputref = useRef<HTMLInputElement>(null);
  const sendRequest = (file: File) => {
    if (file.size == 0) {
      toast("Please select a non-empty file.", {
        type: "error",
      });
      return;
    }
    const filename = file.name;
    const fileUID = uid(32);

    props.socket?.emit("local.file.request", {
      id: props.id,
      filename: filename,
      uid: fileUID,
    });
    const id = toast.loading(`Waiting ${props.name} to accept...`);

    const rejectHandler = (data: { id: string; uid: string }) => {
      if (data.uid != fileUID) return;
      removeAllListeners();

      toast.update(id, {
        render: `${props.name} rejected your file transfer request.`,
        isLoading: false,
        type: "error",
        autoClose: 3000,
      });
    };
    const acceptHandler = async (data: { id: string; uid: string }) => {
      if (data.uid != fileUID) return;
      removeAllListeners();

      toast.update(id, {
        render: `Sending ${filename} to ${props.name} (0%)`,
        isLoading: true,
      });

      // Make RTC
      const peerConnection = new RTCPeerConnection(PEERCONNECTION_OPTIONS);

      const handleIce = async () => {
        const iceHandler = (data: {
          id: string;
          uid: string;
          ice: RTCIceCandidate;
        }) => {
          console.log("RTC", "Recieve ice", data);
          if (fileUID != data.uid) return;
          peerConnection.addIceCandidate(data.ice);
        };
        peerConnection.onicecandidate = (ice) => {
          // send ice
          console.log("RTC", "made icecandidate", ice);
          props.socket?.emit("local.rtc.ice", {
            id: props.id,
            uid: fileUID,
            ice: ice.candidate,
          });
        };

        props.socket?.on("local.rtc.ice", iceHandler);
      };

      const handleRtcAnswer = async () => {
        const answerHandler = (data: {
          id: string;
          uid: string;
          answer: RTCSessionDescriptionInit;
        }) => {
          if (data.uid != fileUID) return;
          console.log("RTC", "got answer", data);
          peerConnection.setRemoteDescription(data.answer);
        };
        props.socket?.on("local.file.answer", answerHandler);
      };

      const handleRtcOffer = async () => {
        let offer = await peerConnection.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
        });

        await peerConnection.setLocalDescription(offer);
        props.socket?.emit("local.rtc.offer", {
          id: props.id,
          offer: offer,
          uid: fileUID,
          size: file.size,
          name: file.name,
        });
      };

      const createDataChannel = async () => {
        const chunkSize = 16384;
        const lowThread = chunkSize * 64;

        const disconnectHandler = (data: { id: string; uid: string }) => {
          if (data.id != props.id) return;
          removeAllListeners();

          toast.update(id, {
            render: `${props.name} disconnected from the server.`,
            isLoading: false,
            type: "error",
            autoClose: 3000,
          });

          sendChannel.close();

          props.socket?.off("local.user.disconnection", disconnectHandler);
          props.socket?.off("local.rtc.close", closeFileStreamHandler);
        };

        const sendData = () => {
          let fileReader = new FileReader();
          let offset = 0;

          fileReader.addEventListener("load", (e) => {
            if (!e.target) return;
            if (sendChannel.readyState != "open")
              return disconnectHandler({
                id: props.id,
                uid: fileUID,
              });
            sendChannel.send(e.target.result as ArrayBuffer);
            offset += (e.target.result! as ArrayBuffer).byteLength;
            toast.update(id, {
              render: `Sending "${filename}" to ${props.name} (${Math.round(
                (offset / file.size) * 100
              )}%)`,
              isLoading: true,
            });
            if (offset < file.size) {
              if (sendChannel.bufferedAmount < lowThread + chunkSize) {
                readSlice(offset);
                sendChannel.onbufferedamountlow = () => {};
              } else
                sendChannel.onbufferedamountlow = () => {
                  if (offset != file.size) {
                    readSlice(offset);
                  }
                };
            }
          });
          const readSlice = (o: number) => {
            const slice = file.slice(offset, o + chunkSize);
            fileReader.readAsArrayBuffer(slice);
          };
          readSlice(0);
        };
        const onSendChannelStateChange = () => {
          console.log(sendChannel.readyState);
          if (sendChannel.readyState != "open") return;
          sendData();
          props.socket?.on("local.user.disconnection", disconnectHandler);
        };
        const onError = () => {};

        let sendChannel = peerConnection.createDataChannel("sendDataChannel");
        sendChannel.binaryType = "arraybuffer";

        sendChannel.addEventListener("open", onSendChannelStateChange);
        sendChannel.addEventListener("close", onSendChannelStateChange);
        sendChannel.addEventListener("error", onError);

        sendChannel.bufferedAmountLowThreshold = lowThread;

        const closeFileStreamHandler = (data: { id: string; uid: string }) => {
          if (data.uid != fileUID) return;
          sendChannel.close();

          props.socket?.off("local.user.disconnection", disconnectHandler);
          props.socket?.off("local.rtc.close", closeFileStreamHandler);
          toast.update(id, {
            render: `"${filename}" has been completely sent.`,
            autoClose: 3000,
            isLoading: false,
            type: "success",
          });
        };

        props.socket?.on("local.rtc.close", closeFileStreamHandler);
      };

      await handleIce();
      await createDataChannel();
      await handleRtcAnswer();
      await handleRtcOffer();
    };
    const disconnectHandler = (data: { id: string; uid: string }) => {
      if (data.id != props.id) return;
      removeAllListeners();

      toast.update(id, {
        render: `${props.name} disconnected from the server.`,
        isLoading: false,
        type: "error",
      });
    };

    const listeners: { [key: string]: (data: any) => void } = {
      "local.file.response.accepted": acceptHandler,
      "local.file.response.reject": rejectHandler,
      "local.user.disconnection": disconnectHandler,
    };

    function removeAllListeners() {
      Object.keys(listeners).forEach((key) =>
        props.socket?.off(key, listeners[key])
      );
    }

    Object.keys(listeners).forEach((key) =>
      props.socket?.on(key, listeners[key])
    );
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    sendRequest(e.target.files[0]);
    e.target.value = "";
  };
  return (
    <div
      onClick={() => {
        inputref.current?.click();
      }}
      className={styles.peer}
    >
      <input type="file" ref={inputref} onChange={handleFileChange} hidden />
      <Saero className={classNames(styles.fitwh, styles.peerContent)}>
        <div className={styles.circle}>
          <Garo
            className={classNames(common.w100, common.h100, common.centerFlex)}
          >
            <Icon
              animated
              size={48}
              icon="offline_share"
              style={{
                color: "white",
              }}
            />
          </Garo>
        </div>
        <div className={common.tcenter}>{props.name}</div>
      </Saero>
    </div>
  );
};

export default function Page() {
  const [isglobal, setisglobal] = useState(false);
  const [me, setme] = useState<Peer>({
    id: "Loading...",
    name: "Loading...",
  });
  const [peers, setPeers] = useState<Peer[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const alwaysAllows = useRef<string[]>([]);
  const notAlwaysAllow = useRef<string[]>([]);
  const alwaysDeny = useRef<string[]>([]);
  const socketEventListenerInited = useRef(false);

  const { addModal } = useModal();

  const downloadUrl = (url: string, name: string) => {
    let a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function initSocket() {
    if (socketEventListenerInited.current) return;
    if (!socketRef.current) return;

    socketEventListenerInited.current = true;

    socketRef.current.on(
      "system.disconnection",
      (data: { message: string }) => {
        alert(data.message);
      }
    );
    socketRef.current.on("local.user.info", (data: Peer) => {
      setme(data);
    });
    socketRef.current.on(
      "local.user.connection",
      (data: { id: string; name: string }) => {
        setPeers((oldUsers) => [...oldUsers, { name: data.name, id: data.id }]);
      }
    );
    socketRef.current.on("local.user.disconnection", (data: Peer) => {
      setPeers((prvdata: Peer[]) => {
        return prvdata.filter((val, i) => {
          return val.id !== data.id;
        });
      });
    });
    socketRef.current.on("local.room.users", (data: Peer[]) => {
      setPeers(data);
    });

    // File Handling
    socketRef.current.on(
      "local.file.request",
      (data: { id: string; filename: string; name: string; uid: string }) => {
        if (alwaysAllows.current.includes(data.id))
          return socketRef.current?.emit("local.file.request.accept", {
            id: data.id,
            uid: data.uid,
          });

        if (alwaysDeny.current.includes(data.id))
          return socketRef.current?.emit("local.file.reject", {
            id: data.id,
            uid: data.uid,
          });

        addModal
          .confirm({
            title: "Someone wants to send a file.",
            body: `${data.name} wants you send a file "${data.filename}".`,
            okayButton: "Allow",
            cancelButton: "Deny",
            canExit: true,
          })
          .then((res) => {
            if (res == "EXITED" || res == "NO") {
              addModal
                .confirm({
                  title: "Always deny",
                  body: `Always deny ${data.name} to send you a file?`,
                  okayButton: "Deny",
                  cancelButton: "not always",
                  canExit: false,
                })
                .then((v) => {
                  if (v == "YES") alwaysDeny.current.push(data.id);
                  else notAlwaysAllow.current.push(data.id);
                });
              socketRef.current?.emit("local.file.reject", {
                id: data.id,
                uid: data.uid,
              });
              return;
            }

            socketRef.current?.emit("local.file.request.accept", {
              id: data.id,
              uid: data.uid,
            });

            if (notAlwaysAllow.current.includes(data.id)) return;

            addModal
              .confirm({
                title: "Always allow",
                body: `Always allow ${data.name} to send you a file?`,
                okayButton: "Allow",
                cancelButton: "not always",
                canExit: false,
              })
              .then((v) => {
                if (v == "YES") alwaysAllows.current.push(data.id);
                else notAlwaysAllow.current.push(data.id);
              });
          });
      }
    );
    socketRef.current.on("local.file.offer", async (data) => {
      console.log("RTC", "got offer", data);

      // 1. Maker peer connection
      const peerConnection = new RTCPeerConnection(PEERCONNECTION_OPTIONS);

      // 2. Handle ice
      peerConnection.addEventListener("icecandidate", (ice) => {
        console.log("RTC", "made icecandidate", ice);
        // send ice
        socketRef.current?.emit("local.rtc.ice", {
          id: data.id,
          uid: data.uid,
          ice: ice.candidate,
        });
      });
      const iceHandler = (iceData: {
        id: string;
        uid: string;
        ice: RTCIceCandidate;
      }) => {
        console.log("RTC", "Recieve ice", iceData);
        if (data.uid != iceData.uid) return;
        peerConnection.addIceCandidate(iceData.ice);
      };
      socketRef.current?.on("local.rtc.ice", iceHandler);

      // 3. Handler offer
      await peerConnection.setRemoteDescription(data.offer);

      // 4. Handle file

      const receiveChannelCallback = (event: RTCDataChannelEvent) => {
        let receiveChannel = event.channel;
        receiveChannel.binaryType = "arraybuffer";

        let receiveBuffer: any = [];
        let receivedSize = 0;
        let bytesPrev = 0;
        let lastTime = Date.now();
        let speed = "0kbit/s";

        let toastId = toast.loading(`Downloading "${data.name}" (0%)`);

        const calcSpeed = () => {
          const bitrate = Math.round(
            ((receivedSize - bytesPrev) * 8) / (Date.now() - lastTime)
          );

          lastTime = Date.now();
          bytesPrev = receivedSize;

          speed = `${Math.round(bitrate / 1024)}KB/s`;
        };

        const inter = setInterval(calcSpeed, 1000);

        const onReceiveMessageCallback = (event: MessageEvent<any>) => {
          receiveBuffer.push(event.data);
          receivedSize += event.data.byteLength;
          toast.update(toastId, {
            render: `Downloading "${data.name}" (${Math.round(
              (receivedSize / data.size) * 100
            )}%, ${speed})`,
            isLoading: true,
          });

          if (receivedSize === data.size) {
            const received = new Blob(receiveBuffer);
            receiveBuffer = [];

            let url = URL.createObjectURL(received);
            downloadUrl(url, data.name);

            receiveChannel.close();
            socketRef.current?.emit("local.rtc.close", {
              id: data.id,
              uid: data.uid,
            });

            toast.update(toastId, {
              render: `"${data.name}" has been completely downloaded.`,
              autoClose: 3000,
              isLoading: false,
              type: "success",
            });
            clearInterval(inter);
          }
        };

        receiveChannel.onmessage = onReceiveMessageCallback;
      };
      peerConnection.addEventListener("datachannel", receiveChannelCallback);

      // 5. Make an answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // 6. Send the answer
      socketRef.current?.emit("local.rtc.answer", {
        id: data.id,
        answer: answer,
        uid: data.uid,
      });
    });
  }

  useEffect(() => {
    if (!socketRef.current)
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER as string);

    socketRef.current.connect();
    initSocket();
    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <meta property="og:title" content="poi.kr / Shorten URL" />
        <title>poi.kr / Shorten URL</title>
      </Head>
      <Header type="DROP" featureType="drop" />

      <div className={styles.body}>
        <div
          className={styles.rootContainer}
          style={{
            transform: `translateX(${isglobal ? "-50%" : "0px"})`,
          }}
        >
          <div className={classNames(styles.container, styles.localContainer)}>
            <div className={styles.peers}>
              {peers.map((user, index) => (
                <Peer
                  name={user.name}
                  id={user.id}
                  socket={socketRef.current}
                  key={index}
                />
              ))}
            </div>
            <div className={styles.myself}>
              You are known as{" "}
              <strong className={common.bold}>{me.name}</strong>
            </div>
          </div>
          <div className={styles.container}></div>
        </div>
        <div className={styles.switch}>
          <Garo
            className={common.centerFlex}
            gap={8}
            style={{
              padding: "5px",
              borderRadius: "5px",
              background: "#f2f2f2",
              color: "black",
            }}
          >
            <div>Local</div>
            <div
              style={{
                minWidth: "2.45rem",
              }}
            >
              <Switch
                value={isglobal}
                onChange={(e) => {
                  if (!isglobal)
                    return toast.error("Global drop is working in progress.");
                  setisglobal(!isglobal);
                }}
                style={{
                  width: "100%",
                }}
              />
            </div>
            <div>Global</div>
          </Garo>
        </div>
      </div>
      <Features />
    </>
  );
}
