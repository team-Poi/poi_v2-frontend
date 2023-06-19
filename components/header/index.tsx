import { Icon, classNames, optCSS } from "@team.poi/ui";
import styles from "./style.module.css";
import HomeType from "@/@types/homeType";
import Link from "next/link";

interface HeaderProps {
  type?: HomeType;
  href?: string;
  featureType?: string;
}

export default function Header(props: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link
        href={props.href || "/"}
        style={{
          textDecoration: "none",
          color: "white",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          animated
          icon={
            {
              URL: "link",
              TEXT: "description",
              CUSTOM: "settings_suggest",
              QRCODE: "qr_code_2",
              MAIN: "deployed_code",
              ERROR: "error",
              PAY: "payments",
            }[props.type || "URL"]
          }
          className={styles.logo}
          style={{
            transform: props.type === "URL" ? "rotate(-45deg)" : "",
            color: props.type == "MAIN" ? "var(--POI-UI-PRIMARY)" : "black",
          }}
        />
        <div
          className={classNames(
            styles.title,
            optCSS(props.type == "MAIN", styles.main)
          )}
        >
          poi.kr{props.featureType ? " / " + props.featureType : ""}
        </div>
      </Link>
    </header>
  );
}
