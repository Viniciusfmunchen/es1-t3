import { createContext, useState, type ReactNode } from "react";

interface NavigationContextType {
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <NavigationContext.Provider value={{ isCollapsed, toggleCollapse }}>
            {children}
        </NavigationContext.Provider>
    );
};