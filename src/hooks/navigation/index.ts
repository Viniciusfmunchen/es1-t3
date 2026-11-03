import { useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { NavigationContext } from "../../contexts/navigation";
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import EditRoadIcon from '@mui/icons-material/EditRoad';

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (!context) {
        throw new Error("useNavigation deve ser usado dentro de um NavigationProvider");
    }

    const { isCollapsed, toggleCollapse } = context;

    const routes = [
        { label: "Endereços", path: "/enderecos", icon: HomeIcon },
        { label: "Cidades", path: "/cidades", icon: LocationCityIcon },
        { label: "Bairros", path: "/bairros", icon: HolidayVillageIcon },
        { label: "Logradouros", path: "/logradouros", icon: EditRoadIcon },
    ];

    const isRouteActive = (path: string) => {
        return location.pathname === path;
    };

    const navigateTo = (path: string) => {
        navigate(path, { replace: true });
    };

    return {
        isCollapsed,
        toggleCollapse,
        routes,
        isRouteActive,
        navigateTo,
    };
};