import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface PageLayoutProps {
    title: string;
    children: ReactNode;
}

const PageLayout = ({ title, children }: PageLayoutProps) => {
    return (
        <Stack spacing={2} sx={{ width: "100%", height: "100%", minWidth: 0 }}>
            <Typography variant="h1" component="h1">
                {title}
            </Typography>
            <Box sx={{ flex: 1, width: "100%", minHeight: 0, minWidth: 0 }}>
                {children}
            </Box>
        </Stack>
    );
};

export default PageLayout;

