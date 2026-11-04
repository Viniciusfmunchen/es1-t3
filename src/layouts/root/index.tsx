import { Stack } from "@mui/material";
import { Outlet } from "react-router";
import Navigation from "../../components/navigation";
import theme from "../../theme";

const RootLayout = () => {
    return (
        <Stack
            sx={{
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                backgroundColor: theme.palette.grey[100],
            }}
            direction="row"
            spacing={0}
        >
            <Navigation />
            <Stack
                sx={{
                    flex: 1,
                    minWidth: 0,
                    height: `calc(100vh - ${theme.spacing(2)})`,
                    margin: theme.spacing(1),
                    padding: theme.spacing(2),
                    backgroundColor: theme.palette.background.default,
                    borderRadius: theme.shape.borderRadius,
                    overflow: "auto",
                    boxSizing: "border-box",
                }}
            >
                <Outlet />
            </Stack>
        </Stack>
    );
};

export default RootLayout;