import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c8f04d",
      contrastText: "#0d0d0d",
    },
    background: {
      default: "#0d0d0d",
      paper: "#131313",
    },
    text: {
      primary: "#f0ede6",
      secondary: "#8a8780",
    },
    divider: "#272727",
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 900,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    caption: {
      fontFamily: '"DM Mono", "Fira Mono", monospace',
      letterSpacing: "0.08em",
    },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500&family=DM+Mono&display=swap');
        body { background: #0d0d0d; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Mono", "Fira Mono", monospace',
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontSize: 11,
          borderRadius: 2,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
