import { useState } from "react";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useRegister } from "../../modules/auth";
import styles from "./AuthPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useRegister();
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", password: "" });
  const [touched, setTouched] = useState({ firstName: false, lastName: false, username: false, password: false });

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function touch(key: keyof typeof touched) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  const errors = {
    firstName: form.firstName.trim().length > 0 && form.firstName.trim().length < 2
      ? "Min 2 characters" : "",
    lastName: form.lastName.trim().length > 0 && form.lastName.trim().length < 2
      ? "Min 2 characters" : "",
    password: form.password.length > 0 && form.password.length < 6
      ? "Min 6 characters" : "",
  };

  function isValid() {
    return (
      form.firstName.trim().length >= 2 &&
      form.lastName.trim().length >= 2 &&
      form.username.trim().length > 0 &&
      form.password.length >= 6
    );
  }

  function handleSubmit() {
    setTouched({ firstName: true, lastName: true, username: true, password: true });
    if (!isValid()) return;
    mutate(
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        password: form.password
      },
      { onSuccess: () => navigate({ to: "/" }) }
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Join the social network</p>

        <div className={styles.fields}>
          <Stack direction="row" gap={1.5}>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>First name</label>
              <TextField
                fullWidth size="small" placeholder="John"
                value={form.firstName}
                onChange={set("firstName")}
                onBlur={() => touch("firstName")}
                disabled={isPending}
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName ? errors.firstName : ""}
              />
            </div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>Last name</label>
              <TextField
                fullWidth size="small" placeholder="Doe"
                value={form.lastName}
                onChange={set("lastName")}
                onBlur={() => touch("lastName")}
                disabled={isPending}
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName ? errors.lastName : ""}
              />
            </div>
          </Stack>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <TextField
              fullWidth size="small" placeholder="johndoe"
              value={form.username}
              onChange={set("username")}
              onBlur={() => touch("username")}
              disabled={isPending}
              error={touched.username && form.username.trim().length === 0}
              helperText={touched.username && form.username.trim().length === 0 ? "Required" : ""}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <TextField
              fullWidth size="small" type="password" placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              onBlur={() => touch("password")}
              disabled={isPending}
              error={touched.password && !!errors.password}
              helperText={touched.password ? errors.password : ""}
            />
          </div>
        </div>

        {error && <p className={styles.error}>{error.message}</p>}

        <Button
          fullWidth variant="contained"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={16} color="inherit" /> : "Create account"}
        </Button>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" className={styles["footer-link"]}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
