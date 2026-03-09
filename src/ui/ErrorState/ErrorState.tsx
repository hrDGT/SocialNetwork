import { Button, Stack, Typography } from "@mui/material";
import type { ErrorStateProps } from "./types";
import styles from "./ErrorState.module.css";

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Stack className={styles.root}>
      <Typography className={styles.icon}>⚠</Typography>
      <Typography variant="caption" className={styles.message}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Stack>
  );
}
