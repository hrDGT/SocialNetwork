import { observer } from "mobx-react-lite";
import { Divider, Skeleton } from "@mui/material";
import { Link } from "@tanstack/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TagList, Spinner, ErrorState } from "../../../../ui";
import { usePostDetail } from "../../hooks/usePostDetail";
import { usePostComments } from "../../hooks/usePostComments";
import CommentCard from "../CommentCard/CommentCard";
import CommentForm from "../CommentForm/CommentForm";
import { authStore } from "../../../../modules/auth";
import styles from "./PostDetail.module.css";

type PostDetailProps = { postId: number };

export default observer(function PostDetail({ postId }: PostDetailProps) {
  const post = usePostDetail(postId);
  const comments = usePostComments(postId);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Link to="/" className={styles["back-link"]}>
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to feed
        </Link>

        {post.isLoading && (
          <>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </>
        )}

        {post.isError && (
          <ErrorState message={post.error?.message ?? "Failed to load post"} onRetry={post.refetch} />
        )}

        {post.data && (
          <>
            <div className={styles["post-card"]}>
              <p className={styles["post-id"]}>#{String(post.data.id).padStart(3, "0")}</p>
              <h1 className={styles.title}>{post.data.title}</h1>

              <div className={styles.stats}>
                <span className={styles.stat}>
                  <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                  {post.data.views.toLocaleString()} views
                </span>
                <span className={styles.stat}>
                  <FavoriteBorderIcon sx={{ fontSize: 15 }} />
                  {post.data.reactions.likes} likes
                </span>
                <span className={styles.stat}>
                  <ThumbDownOffAltIcon sx={{ fontSize: 15 }} />
                  {post.data.reactions.dislikes} dislikes
                </span>
              </div>

              <TagList tags={post.data.tags} />
              <Divider sx={{ my: 2 }} />
              <p className={styles.body}>{post.data.body}</p>
            </div>

            <div className={styles["comments-card"]}>
              <h2 className={styles["section-title"]}>
                Comments {comments.data ? `(${comments.data.total})` : ""}
              </h2>

              {comments.isLoading && <Spinner label="Loading comments…" />}
              {comments.isError && <ErrorState message="Failed to load comments" onRetry={comments.refetch} />}

              {comments.data?.comments.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}

              {comments.data?.comments.length === 0 && (
                <p className={styles.empty}>No comments yet</p>
              )}

              {authStore.isAuthenticated ? (
                <CommentForm postId={postId} />
              ) : (
                <div className={styles["auth-prompt"]}>
                  <Link to="/login" className={styles["auth-link"]}>Sign in</Link> to leave a comment
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});
