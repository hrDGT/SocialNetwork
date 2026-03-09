import { Avatar, Box, Stack, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { CommentCardProps } from "./types";
import styles from "./CommentCard.module.css";

export default function CommentCard({ comment, compact = false }: CommentCardProps) {
  const initials = comment.user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box className={compact ? styles.compact : styles.full}>
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <Avatar className={styles.avatar}>{initials}</Avatar>

        <Box flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography className={styles.username}>
              @{comment.user.username}
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5} flexShrink={0}>
              <FavoriteBorderIcon className={styles.likeIcon} />
              <Typography className={styles.likes}>{comment.likes}</Typography>
            </Stack>
          </Stack>

          <Typography
            className={compact ? styles.bodyCompact : styles.body}
          >
            {comment.body}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
