import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(","),
        h1: {
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
        },
        h2: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
        },
        h3: {
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: 1.35,
        },
        h4: {
            fontSize: "1.25rem",
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: "1.125rem",
            fontWeight: 600,
            lineHeight: 1.45,
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.5,
        },
        subtitle1: {
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.5,
        },
        subtitle2: {
            fontSize: "0.875rem",
            fontWeight: 500,
            lineHeight: 1.57,
        },
        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.5,
        },
        body2: {
            fontSize: "0.875rem",
            lineHeight: 1.57,
        },
        button: {
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
        },
        caption: {
            fontSize: "0.75rem",
            lineHeight: 1.66,
        },
        overline: {
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight: 2.66,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
    },
});

export default theme;
