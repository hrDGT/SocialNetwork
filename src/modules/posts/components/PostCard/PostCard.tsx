import { observer } from "mobx-react-lite";
import { Link, useNavigate } from "@tanstack/react-router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { TagList } from "../../../../ui";
import { likesStore } from "../../../likes";
import { authStore } from "../../../auth";
import CommentsPreview from "../CommentsPreview/CommentsPreview";
import type { PostCardProps } from "./types";
import styles from "./PostCard.module.css";

export default observer(function PostCard({ post, index }: PostCardProps) {
  const navigate = useNavigate();
  const liked = likesStore.isLiked(post.id);
  const likeCount = liked ? post.reactions.likes + 1 : post.reactions.likes;

  function handleLike() {
    if (!authStore.isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    likesStore.toggle(post);
  }

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 40}ms` }}>
      <div className={styles.meta}>
        <span className={styles["post-id"]}>#{String(post.id).padStart(3, "0")}</span>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
            {post.views.toLocaleString()}
          </span>
          <button
            className={liked ? styles["like-btn-active"] : styles["like-btn"]}
            onClick={handleLike}
          >
            {liked
              ? <FavoriteIcon sx={{ fontSize: 14 }} />
              : <FavoriteBorderIcon sx={{ fontSize: 14 }} />
            }
            {likeCount}
          </button>
        </div>
      </div>

      <h2 className={styles.title}>{post.title}</h2>
      <p className={styles.body}>{post.body}</p>

      <TagList tags={post.tags} />
      <CommentsPreview postId={post.id} />

      <div className={styles.footer}>
        <span />
        <Link to="/posts/$postId" params={{ postId: String(post.id) }} className={styles["view-link"]}>
          View post <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Link>
      </div>
    </div>
  );
});
