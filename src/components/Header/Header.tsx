import { Box, Button, Container } from "@mui/material";
import { Link } from "@tanstack/react-router";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <Box component="header" className={styles.root}>
      <Container maxWidth="xl" className={styles.inner}>
        <Link to="/" className={styles.logo}>
          SN
        </Link>

        <Button variant="outlined" color="primary" className={styles.signIn}>
          Sign in
        </Button>
      </Container>
    </Box>
  );
}
