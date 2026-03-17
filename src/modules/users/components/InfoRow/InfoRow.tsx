import styles from "./InfoRow.module.css";
import type { InfoRowProps } from "../../types";

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className={styles["info-row"]}>
      <span className={styles["info-icon"]}>{icon}</span>
      <div>
        <p className={styles["info-label"]}>{label}</p>
        <p className={styles["info-value"]}>{value}</p>
      </div>
    </div>
  );
}
