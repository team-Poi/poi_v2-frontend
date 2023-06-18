import { Icon } from "@team.poi/ui";
import styles from "./style.module.css";
import HomeType from "@/types/homeType";
import Link from "next/link";

interface HeaderProps {
  type?: HomeType;
  linked?: string;
}

export default function Header(props: HeaderProps) {
  return (
    <header className={styles.header}>
      <Icon
        animated
        icon={
          { URL: "link", TEXT: "description", CUSTOM: "settings_suggest" }[
            props.type || "URL"
          ]
        }
        className={styles.logo}
        style={{
          transform: props.type === "URL" ? "rotate(-45deg)" : "",
        }}
      />
      <div className={styles.title}>
        {props.linked ? (
          <Link
            href={props.linked}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            poi.kr
          </Link>
        ) : (
          <>poi.kr</>
        )}
      </div>
    </header>
  );
}
