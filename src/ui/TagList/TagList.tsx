import { Box, Chip } from "@mui/material";
import type { TagListProps } from "./types";
import styles from "./TagList.module.css";

export default function TagList({ tags }: TagListProps) {
  return (
    <Box component="ul" className={styles.list}>
      {tags.map((tag) => (
        <li key={tag}>
          <Chip
            label={tag}
            variant="outlined"
            size="small"
            className={styles.chip}
          />
        </li>
      ))}
    </Box>
  );
}
