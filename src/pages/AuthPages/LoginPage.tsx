import { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
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
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account</p>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <TextField
              fullWidth size="small" placeholder="emilys"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <TextField
              fullWidth size="small" type="password" placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error.message}</p>}

        <Button
          fullWidth variant="contained"
          onClick={handleSubmit}
          disabled={isPending || !username.trim() || !password.trim()}
        >
          {isPending ? <CircularProgress size={16} color="inherit" /> : "Sign in"}
        </Button>

        <p className={styles.footer}>
          Don't have an account?{" "}
          <Link to="/register" className={styles["footer-link"]}>Register</Link>
        </p>
      </div>
    </div>
  );
}
