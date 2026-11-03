import { Button, Stack, styled, Typography } from "@mui/material";
import { NAVIGATION_COLLAPSED_WIDTH, NAVIGATION_WIDTH } from "../../constants/navigation";

export const NavigationContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== "isCollapsed",
})<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
    width: isCollapsed ? NAVIGATION_COLLAPSED_WIDTH : NAVIGATION_WIDTH,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    overflowX: "hidden",
    overflowY: "auto",
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    height: "100vh",
    flexShrink: 0,
    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
    },
}));

export const NavigationHeader = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: 64,
    height: 64,
    boxSizing: "border-box",
    width: "100%",
}));

export const NavigationHeaderToggleSlot = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: NAVIGATION_COLLAPSED_WIDTH,
    minWidth: NAVIGATION_COLLAPSED_WIDTH,
    flexShrink: 0,
});

export const NavigationHeaderTitle = styled(Typography, {
    shouldForwardProp: (prop) => prop !== "isCollapsed",
})<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    opacity: isCollapsed ? 0 : 1,
    maxWidth: isCollapsed ? 0 : 160,
    transform: isCollapsed ? "translateX(-6px)" : "translateX(0)",
    transition: theme.transitions.create(["opacity", "max-width", "transform"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    pointerEvents: isCollapsed ? "none" : "auto",
    userSelect: "none",
    fontWeight: 600,
    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
    },
}));

export const NavigationButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "isActive" && prop !== "isCollapsed",
})<{ isActive: boolean; isCollapsed: boolean }>(({ theme, isActive }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 0,
    width: "100%",
    minWidth: 0,
    padding: 0,
    height: 52,
    backgroundColor: isActive ? theme.palette.primary.main : "transparent",
    color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
    transition: theme.transitions.create(["background-color", "color"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    "&:hover": {
        backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
    },
}));

export const NavigationIconWrapper = styled("span")({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: NAVIGATION_COLLAPSED_WIDTH,
    minWidth: NAVIGATION_COLLAPSED_WIDTH,
    flexShrink: 0,
});

export const NavigationLabel = styled("span", {
    shouldForwardProp: (prop) => prop !== "isCollapsed",
})<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    opacity: isCollapsed ? 0 : 1,
    maxWidth: isCollapsed ? 0 : 180,
    transform: isCollapsed ? "translateX(-6px)" : "translateX(0)",
    transition: theme.transitions.create(["opacity", "max-width", "transform"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    pointerEvents: isCollapsed ? "none" : "auto",
    display: "inline-block",
    fontSize: theme.typography.body2.fontSize,
    fontWeight: 500,
    "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
    },
}));
