import { IconButton, Tooltip } from "@mui/material";
import {
    NavigationButton,
    NavigationContainer,
    NavigationHeader,
    NavigationHeaderTitle,
    NavigationHeaderToggleSlot,
    NavigationIconWrapper,
    NavigationLabel,
} from "./styles";
import { useNavigation } from "../../hooks/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const Navigation = () => {
    const { routes, isRouteActive, navigateTo, isCollapsed, toggleCollapse } = useNavigation();

    return (
        <NavigationContainer isCollapsed={isCollapsed} direction="column">
            <NavigationHeader>
                <NavigationHeaderToggleSlot>
                    <Tooltip
                        title={isCollapsed ? "Expandir menu" : "Recolher menu"}
                        placement={isCollapsed ? "right" : "bottom"}
                        arrow
                    >
                        <IconButton onClick={toggleCollapse} size="medium">
                            <ChevronLeftIcon
                                sx={(theme) => ({
                                    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: theme.transitions.create("transform", {
                                        easing: theme.transitions.easing.easeInOut,
                                        duration: theme.transitions.duration.standard,
                                    }),
                                })}
                            />
                        </IconButton>
                    </Tooltip>
                </NavigationHeaderToggleSlot>
                <NavigationHeaderTitle variant="h6" isCollapsed={isCollapsed}>
                    Menu
                </NavigationHeaderTitle>
            </NavigationHeader>

            {routes.map((route) => (
                <Tooltip
                    key={route.path}
                    title={isCollapsed ? route.label : ""}
                    placement="right"
                    arrow
                    disableHoverListener={!isCollapsed}
                >
                    <NavigationButton
                        isActive={isRouteActive(route.path)}
                        isCollapsed={isCollapsed}
                        onClick={() => navigateTo(route.path)}
                    >
                        <NavigationIconWrapper>
                            <route.icon />
                        </NavigationIconWrapper>
                        <NavigationLabel isCollapsed={isCollapsed}>
                            {route.label}
                        </NavigationLabel>
                    </NavigationButton>
                </Tooltip>
            ))}
        </NavigationContainer>
    );
};

export default Navigation;
