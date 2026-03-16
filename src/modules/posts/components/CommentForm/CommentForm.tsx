import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { useCreateComment } from "../../hooks/useCreateComment";
import type { CommentFormProps } from "./types";
import styles from "./CommentForm.module.css";

export default function CommentForm({ postId }: CommentFormProps) {
  const [body, setBody] = useState("");
  const { mutate, isPending, isSuccess, isError, reset } = useCreateComment(postId);

  function handleSubmit() {
    if (!body.trim()) return;
    mutate(
      { body: body.trim(), postId, userId: 1 },
      {
        onSuccess: () => {
          setBody("");
          setTimeout(reset, 3000);
        },
      }
    );
  }

  return (
    <div className={styles.root}>
      <span className={styles.label}>Leave a comment</span>
      <TextField
        multiline
        minRows={3}
        fullWidth
        placeholder="Write something…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={isPending}
        sx={{ bgcolor: "background.default" }}
      />
      <div className={styles.footer}>
        <span className={styles["char-count"]}>{body.length} / 500</span>
        <div className={styles.actions}>
          {isSuccess && <span className={styles["success-msg"]}>✓ Submitted</span>}
          {isError && <span className={styles["error-msg"]}>Failed. Try again.</span>}
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
            disabled={isPending || !body.trim()}
          >
            {isPending ? <CircularProgress size={14} color="inherit" /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
