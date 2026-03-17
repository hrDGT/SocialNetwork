import { observer } from "mobx-react-lite";
import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { authStore } from "../../modules/auth";
import styles from "./Header.module.css";

export default observer(function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    authStore.logout();
    navigate({ to: "/" });
  }

  return (
    <Box component="header" className={styles.root}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>SN</Link>

        {authStore.isAuthenticated ? (
          <div className={styles.actions}>
            <Link
              to="/users/$userId"
              params={{ userId: String(authStore.user!.id) }}
              className={styles.navLink}
            >
              Profile
            </Link>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLogout}
              sx={{ borderColor: "divider", color: "text.secondary", ml: 1 }}
            >
              Exit
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate({ to: "/login" })}
          >
            Sign in
          </Button>
        )}
      </div>
    </Box>
  );
});
