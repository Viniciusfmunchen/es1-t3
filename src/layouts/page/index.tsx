import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

export interface PageLayoutProps {
    title: string;
    action?: ReactNode;
    addButtonLabel?: string;
    onAdd?: () => void;
    children: ReactNode;
}

const PageLayout = ({
    title,
    action,
    addButtonLabel,
    onAdd,
    children,
}: PageLayoutProps) => {
    return (
        <Stack spacing={2} sx={{ width: "100%", height: "100%", minWidth: 0 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    flexShrink: 0,
                }}
            >
                <Typography variant="h1" component="h1">
                    {title}
                </Typography>
                {action ??
                    (onAdd && addButtonLabel ? (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={onAdd}
                        >
                            {addButtonLabel}
                        </Button>
                    ) : null)}
            </Box>
            <Box sx={{ flex: 1, width: "100%", minHeight: 0, minWidth: 0 }}>
                {children}
            </Box>
        </Stack>
    );
};

export default PageLayout;
