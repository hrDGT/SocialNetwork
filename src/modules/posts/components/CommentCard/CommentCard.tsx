import { Avatar } from "@mui/material";
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
    <div className={compact ? styles["row-compact"] : styles.row}>
      <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "primary.main" }}>
        {initials}
      </Avatar>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{comment.user.fullName}</span>
          <span className={styles.likes}>
            <FavoriteBorderIcon sx={{ fontSize: 12 }} />
            {comment.likes}
          </span>
        </div>
        <p className={compact ? styles["body-compact"] : styles.body}>
          {comment.body}
        </p>
      </div>
    </div>
  );
}
