import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TagList } from "../../../../ui";
import CommentsPreview from "../CommentsPreview/CommentsPreview";
import type { PostCardProps } from "./types";
import styles from "./PostCard.module.css";

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <Card
      variant="outlined"
      className={styles.card}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className={styles.content}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" className={styles.id}>
            #{String(post.id).padStart(3, "0")}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <VisibilityOutlinedIcon className={styles.icon} />
              <Typography variant="caption" className={styles.stat}>
                {post.views.toLocaleString()}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <FavoriteBorderIcon className={styles.icon} />
              <Typography variant="caption" className={styles.stat}>
                {post.reactions.likes}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="h2" className={styles.title}>
          {post.title}
        </Typography>

        <Typography variant="body2" className={styles.body}>
          {post.body}
        </Typography>

        <TagList tags={post.tags} />

        <CommentsPreview postId={post.id} />

        <Box className={styles.linkRow}>
          <Link to="/posts/$postId" params={{ postId: String(post.id) }} className={styles.link}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <span>View post</span>
              <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </Stack>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}