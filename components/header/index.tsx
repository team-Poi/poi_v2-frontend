import { Icon } from "@team.poi/ui";
import styles from "./style.module.css";

interface HeaderProps {
  type?: "URL" | "IMAGE" | "CUSTOM";
}

export default function Header(props: HeaderProps) {
  return (
    <header className={styles.header}>
      <Icon
        animated
        icon={
          { URL: "link", IMAGE: "image", CUSTOM: "settings_suggest" }[
            props.type || "URL"
          ]
        }
        className={styles.logo}
        style={{
          transform: props.type === "URL" ? "rotate(-45deg)" : "",
        }}
      />
      <div className={styles.title}>poi.kr</div>
    </header>
  );
}
