import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLogin } from "../../modules/auth";
import styles from "./AuthPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit() {
    if (!username.trim() || !password.trim()) return;
    mutate(
      { username: username.trim(), password: password.trim() },
      { onSuccess: () => navigate({ to: "/" }) }
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="xs">
        <Box className={styles.card}>
          <Typography className={styles.heading}>Welcome back</Typography>
          <Typography className={styles.sub}>
            Sign in to your account
          </Typography>

          <Box className={styles.fields}>
            <Box className={styles.field}>
              <Typography className={styles.label}>Username</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                className={styles.input}
              />
            </Box>

            <Box className={styles.field}>
              <Typography className={styles.label}>Password</Typography>
              <TextField
                fullWidth
                size="small"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                className={styles.input}
              />
            </Box>
          </Box>

          {error && (
            <Typography className={styles.error}>
              {error.message}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={styles.submit}
            onClick={handleSubmit}
            disabled={isPending || !username.trim() || !password.trim()}
          >
            {isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>

          <Typography className={styles.footer}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.footerLink}>
              Register
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
