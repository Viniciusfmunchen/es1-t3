import { useContext, useEffect, useState, type ComponentType } from "react";
import { useNavigate, useLocation } from "react-router";
import { NavigationContext } from "../../contexts/navigation";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConstructionIcon from '@mui/icons-material/Construction';
import HardwareIcon from '@mui/icons-material/Hardware';
import PhoneIcon from '@mui/icons-material/Phone';

export interface NavigationSubItem {
    label: string;
    path: string;
}

export interface NavigationRoute {
    label: string;
    path: string;
    icon: ComponentType;
    children?: NavigationSubItem[];
}

export const ROUTES: NavigationRoute[] = [
    { label: "Clientes", path: "/clientes", icon: PeopleIcon },
    { label: "Aluguéis", path: "/alugueis", icon: ReceiptIcon },
    { label: "Equipamentos", path: "/equipamentos", icon: HardwareIcon },
    { label: "Tipos de Equipamento", path: "/tipos-equipamento", icon: ConstructionIcon },
    { label: "Telefones", path: "/telefones", icon: PhoneIcon },
    {
        label: "Endereço",
        path: "/endereco",
        icon: HomeIcon,
        children: [
            { label: "Endereços", path: "/endereco/enderecos" },
            { label: "Cidades", path: "/endereco/cidades" },
            { label: "Bairros", path: "/endereco/bairros" },
            { label: "Logradouros", path: "/endereco/logradouros" },
        ],
    },
];

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!context) {
        throw new Error("useNavigation deve ser usado dentro de um NavigationProvider");
    }

    const { isCollapsed, toggleCollapse } = context;
    const routes = ROUTES;

    const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        routes.forEach((route) => {
            if (
                route.children?.some(
                    (child) => location.pathname === child.path || location.pathname.startsWith(child.path)
                ) ||
                location.pathname.startsWith(route.path)
            ) {
                initial[route.path] = true;
            }
        });
        return initial;
    });

    useEffect(() => {
        ROUTES.forEach((route) => {
            if (
                route.children?.some(
                    (child) => location.pathname === child.path || location.pathname.startsWith(child.path)
                ) ||
                location.pathname.startsWith(route.path)
            ) {
                setOpenSubmenus((prev) => (prev[route.path] ? prev : { ...prev, [route.path]: true }));
            }
        });
    }, [location.pathname]);

    const isRouteActive = (path: string) => {
        if (location.pathname === path) return true;
        if (
            path === "/clientes" &&
            (location.pathname.startsWith("/clientes/") ||
                location.pathname.startsWith("/cliente/"))
        ) {
            return true;
        }
        if (
            path === "/equipamentos" &&
            (location.pathname.startsWith("/equipamentos/") ||
                location.pathname.startsWith("/equipamento/"))
        ) {
            return true;
        }
        if (
            path === "/alugueis" &&
            (location.pathname.startsWith("/alugueis/") ||
                location.pathname.startsWith("/aluguel/"))
        ) {
            return true;
        }
        return false;
    };

    const isParentActive = (route: NavigationRoute) => {
        if (location.pathname === route.path) return true;
        if (route.children) {
            return route.children.some(
                (child) => location.pathname === child.path || location.pathname.startsWith(child.path)
            );
        }
        return false;
    };

    const toggleSubmenu = (path: string) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [path]: !prev[path],
        }));
    };

    const isSubmenuOpen = (path: string) => {
        return Boolean(openSubmenus[path]);
    };

    const navigateTo = (path: string) => {
        navigate(path, { replace: true });
    };

    const handleRouteClick = (route: NavigationRoute) => {
        if (route.children && route.children.length > 0) {
            if (isCollapsed) {
                toggleCollapse();
                setOpenSubmenus((prev) => ({ ...prev, [route.path]: true }));
            } else {
                toggleSubmenu(route.path);
            }
        } else {
            navigateTo(route.path);
        }
    };

    return {
        isCollapsed,
        toggleCollapse,
        routes,
        isRouteActive,
        isParentActive,
        isSubmenuOpen,
        toggleSubmenu,
        handleRouteClick,
        navigateTo,
    };
};
