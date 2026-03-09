import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { usePostComments } from "../../hooks/usePostComments";
import CommentCard from "../CommentCard/CommentCard";
import type { CommentsPreviewProps } from "./types";
import styles from "./CommentsPreview.module.css";

export default function CommentsPreview({ postId }: CommentsPreviewProps) {
  const { data, isLoading, isError } = usePostComments(postId, 3);

  return (
    <Box className={styles.root}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography className={styles.heading}>Comments</Typography>
        {data && (
          <Typography className={styles.total}>{data.total} total</Typography>
        )}
      </Stack>

      {isLoading && (
        <Stack gap={1}>
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={40}
              sx={{ bgcolor: "divider", borderRadius: 0 }}
            />
          ))}
        </Stack>
      )}

      {isError && (
        <Typography className={styles.error}>Failed to load comments</Typography>
      )}

      {data?.comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} compact />
      ))}

      {data?.comments.length === 0 && (
        <Typography className={styles.empty}>No comments yet</Typography>
      )}
    </Box>
  );
}
