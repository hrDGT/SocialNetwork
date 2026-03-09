import { CircularProgress, Stack, Typography } from "@mui/material";
import type { SpinnerProps } from "./types";
import styles from "./Spinner.module.css";

export default function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <Stack className={styles.root}>
      <CircularProgress size={28} thickness={2} color="primary" />
      <Typography variant="caption" className={styles.label}>
        {label}
      </Typography>
    </Stack>
  );
}
