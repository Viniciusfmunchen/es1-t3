import { Stack } from "@mui/material";
import { Outlet } from "react-router";
import Navigation from "../../components/navigation";
import theme from "../../theme";

const RootLayout = () => {
    return (
        <Stack sx={{ height: "100vh", width: "100vw", backgroundColor: theme.palette.grey[100] }} direction="row" spacing={0}>
            <Navigation />
            <Stack sx={{ flex: 1, margin: theme.spacing(1), padding: theme.spacing(2), backgroundColor: theme.palette.background.default, borderRadius: theme.shape.borderRadius }}>
                <Outlet />
            </Stack>
        </Stack>
    )
}

export default RootLayout;