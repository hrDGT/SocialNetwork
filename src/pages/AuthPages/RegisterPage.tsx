import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { useRegister } from "../../modules/auth";
import styles from "./AuthPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useRegister();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    age: "",
  });

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function isValid() {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.username.trim() &&
      form.password.trim() &&
      Number(form.age) > 0
    );
  }

  function handleSubmit() {
    if (!isValid()) return;
    mutate(
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        password: form.password.trim(),
        age: Number(form.age),
      },
      { onSuccess: () => navigate({ to: "/" }) }
    );
  }

  return (
    <Box className={styles.wrapper}>
      <Container maxWidth="xs">
        <Box className={styles.card}>
          <Typography className={styles.heading}>Create account</Typography>
          <Typography className={styles.sub}>
            Join the social network
          </Typography>

          <Box className={styles.fields}>
            <Stack direction="row" gap={1.5}>
              <Box className={styles.field} flex={1}>
                <Typography className={styles.label}>First name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="John"
                  value={form.firstName}
                  onChange={set("firstName")}
                  disabled={isPending}
                  className={styles.input}
                />
              </Box>
              <Box className={styles.field} flex={1}>
                <Typography className={styles.label}>Last name</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set("lastName")}
                  disabled={isPending}
                  className={styles.input}
                />
              </Box>
            </Stack>

            <Box className={styles.field}>
              <Typography className={styles.label}>Username</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="johndoe"
                value={form.username}
                onChange={set("username")}
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
                value={form.password}
                onChange={set("password")}
                disabled={isPending}
                className={styles.input}
              />
            </Box>

            <Box className={styles.field}>
              <Typography className={styles.label}>Age</Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                placeholder="25"
                value={form.age}
                onChange={set("age")}
                disabled={isPending}
                className={styles.input}
                inputProps={{ min: 1, max: 120 }}
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
            disabled={isPending || !isValid()}
          >
            {isPending ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Create account"
            )}
          </Button>

          <Typography className={styles.footer}>
            Already have an account?{" "}
            <Link to="/login" className={styles.footerLink}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
