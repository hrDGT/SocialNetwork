import { Button } from "@mui/material";
import type { ErrorStateProps } from "./types";
import styles from "./ErrorState.module.css";

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.root}>
      <span className={styles.icon}>⚠</span>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="outlined" size="small" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
