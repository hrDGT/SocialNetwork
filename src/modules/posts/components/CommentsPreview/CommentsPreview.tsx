import { Skeleton } from "@mui/material";
import { usePostComments } from "../../hooks/usePostComments";
import CommentCard from "../CommentCard/CommentCard";
import type { CommentsPreviewProps } from "./types";
import styles from "./CommentsPreview.module.css";

export default function CommentsPreview({ postId }: CommentsPreviewProps) {
  const { data, isLoading, isError } = usePostComments(postId, 3);

  return (
    <div className={styles.root}>
      <div className={styles["heading-row"]}>
        <span className={styles.heading}>Comments</span>
        {data && <span className={styles.total}>{data.total}</span>}
      </div>

      {isLoading && (
        <>
          <Skeleton variant="rectangular" height={36} sx={{ mb: 1, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={36} sx={{ mb: 1, borderRadius: 1 }} />
        </>
      )}

      {isError && <p className={styles.error}>Failed to load comments</p>}

      {data?.comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} compact />
      ))}

      {data?.comments.length === 0 && (
        <p className={styles.empty}>No comments yet</p>
      )}
    </div>
  );
}
