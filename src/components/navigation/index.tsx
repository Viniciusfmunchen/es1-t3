import { Collapse, IconButton, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
    NavigationButton,
    NavigationContainer,
    NavigationExpandIconWrapper,
    NavigationHeader,
    NavigationHeaderTitle,
    NavigationHeaderToggleSlot,
    NavigationIconWrapper,
    NavigationLabel,
    NavigationSubButton,
    NavigationSubBullet,
    NavigationSubLabel,
} from "./styles";
import { useNavigation } from "../../hooks/navigation";

const Navigation = () => {
    const {
        routes,
        isRouteActive,
        isParentActive,
        isSubmenuOpen,
        handleRouteClick,
        navigateTo,
        isCollapsed,
        toggleCollapse,
    } = useNavigation();

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

            {routes.map((route) => {
                const hasChildren = Boolean(route.children && route.children.length > 0);
                const isOpen = isSubmenuOpen(route.path);
                const isParentHighlighted = isCollapsed
                    ? isParentActive(route)
                    : !isOpen && isParentActive(route);

                return (
                    <div key={route.path}>
                        <Tooltip
                            title={isCollapsed ? route.label : ""}
                            placement="right"
                            arrow
                            disableHoverListener={!isCollapsed}
                        >
                            <NavigationButton
                                isActive={hasChildren ? isParentHighlighted : isRouteActive(route.path)}
                                isCollapsed={isCollapsed}
                                onClick={() => handleRouteClick(route)}
                            >
                                <NavigationIconWrapper>
                                    <route.icon />
                                </NavigationIconWrapper>
                                <NavigationLabel isCollapsed={isCollapsed}>
                                    {route.label}
                                </NavigationLabel>
                                {hasChildren && (
                                    <NavigationExpandIconWrapper
                                        isCollapsed={isCollapsed}
                                        isActive={isParentHighlighted}
                                    >
                                        {isOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                    </NavigationExpandIconWrapper>
                                )}
                            </NavigationButton>
                        </Tooltip>

                        {hasChildren && (
                            <Collapse in={!isCollapsed && isOpen} timeout="auto" unmountOnExit>
                                {route.children?.map((child) => {
                                    const active = isRouteActive(child.path);
                                    return (
                                        <NavigationSubButton
                                            key={child.path}
                                            isActive={active}
                                            onClick={() => navigateTo(child.path)}
                                        >
                                            <NavigationSubBullet isActive={active} />
                                            <NavigationSubLabel>{child.label}</NavigationSubLabel>
                                        </NavigationSubButton>
                                    );
                                })}
                            </Collapse>
                        )}
                    </div>
                );
            })}
        </NavigationContainer>
    );
};

export default Navigation;
