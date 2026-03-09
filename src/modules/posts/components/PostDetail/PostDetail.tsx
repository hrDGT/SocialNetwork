import { Box, Container, Divider, Skeleton, Stack, Typography } from "@mui/material";
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
import styles from "./PostDetail.module.css";

type PostDetailProps = {
  postId: number;
};

export default function PostDetail({ postId }: PostDetailProps) {
  const post = usePostDetail(postId);
  const comments = usePostComments(postId);

  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="md" className={styles.container}>

        <Link to="/" className={styles.back}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <ArrowBackIcon sx={{ fontSize: 13 }} />
            <span>Back to feed</span>
          </Stack>
        </Link>

        {post.isLoading && (
          <Stack gap={2} mt={4}>
            <Skeleton variant="rectangular" height={24} width="30%" sx={{ bgcolor: "divider" }} />
            <Skeleton variant="rectangular" height={64} sx={{ bgcolor: "divider" }} />
            <Skeleton variant="rectangular" height={120} sx={{ bgcolor: "divider" }} />
          </Stack>
        )}

        {post.isError && (
          <ErrorState
            message={post.error?.message ?? "Failed to load post"}
            onRetry={post.refetch}
          />
        )}

        {post.data && (
          <>
            <Box mt={4}>
              <Typography className={styles.postId}>
                #{String(post.data.id).padStart(3, "0")}
              </Typography>

              <Typography variant="h1" className={styles.title}>
                {post.data.title}
              </Typography>

              <Stack direction="row" gap={3} mt={2} flexWrap="wrap">
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <VisibilityOutlinedIcon className={styles.statIcon} />
                  <Typography className={styles.stat}>
                    {post.data.views.toLocaleString()} views
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <FavoriteBorderIcon className={styles.statIcon} />
                  <Typography className={styles.stat}>
                    {post.data.reactions.likes} likes
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <ThumbDownOffAltIcon className={styles.statIcon} />
                  <Typography className={styles.stat}>
                    {post.data.reactions.dislikes} dislikes
                  </Typography>
                </Stack>
              </Stack>

              <Box mt={2}>
                <TagList tags={post.data.tags} />
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: "divider" }} />

            <Typography className={styles.body}>{post.data.body}</Typography>

            <Divider sx={{ my: 4, borderColor: "divider" }} />

            <Box>
              <Stack direction="row" alignItems="baseline" gap={2} mb={3}>
                <Typography className={styles.sectionTitle}>Comments</Typography>
                {comments.data && (
                  <Typography className={styles.commentCount}>
                    {comments.data.total}
                  </Typography>
                )}
              </Stack>

              {comments.isLoading && <Spinner label="Loading comments…" />}

              {comments.isError && (
                <ErrorState
                  message="Failed to load comments"
                  onRetry={comments.refetch}
                />
              )}

              {comments.data?.comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))}

              {comments.data?.comments.length === 0 && (
                <Typography className={styles.empty}>No comments yet</Typography>
              )}
            </Box>

            <Box mt={4}>
              <CommentForm postId={postId} />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
