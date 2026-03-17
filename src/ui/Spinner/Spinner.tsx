import { CircularProgress } from "@mui/material";
import type { SpinnerProps } from "./types";
import styles from "./Spinner.module.css";

export default function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div className={styles.root}>
      <CircularProgress size={28} thickness={2} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
