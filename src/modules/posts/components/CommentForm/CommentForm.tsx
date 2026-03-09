import { useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
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
    <Box className={styles.root}>
      <Typography className={styles.label}>Leave a comment</Typography>

      <TextField
        multiline
        minRows={3}
        fullWidth
        placeholder="Write something…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={isPending}
        className={styles.textarea}
        inputProps={{ maxLength: 500 }}
      />

      <Box className={styles.footer}>
        <Typography className={styles.charCount}>
          {body.length} / 500
        </Typography>

        <Box className={styles.actions}>
          {isSuccess && (
            <Typography className={styles.successMsg}>
              ✓ Comment submitted (mock — won't persist)
            </Typography>
          )}
          {isError && (
            <Typography className={styles.errorMsg}>
              Failed to submit. Try again.
            </Typography>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit}
            disabled={isPending || !body.trim()}
            className={styles.submitBtn}
          >
            {isPending ? <CircularProgress size={14} color="inherit" /> : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
