import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/root";
import { lazy } from "react";


const Adresses = lazy(() => import("./pages/addresses"));
const Cities = lazy(() => import("./pages/cities"));
const Neighborhoods = lazy(() => import("./pages/neighborhoods"));
const Streets = lazy(() => import("./pages/streets"));

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "enderecos",
                element: <Adresses />,
            },
            {
                path: "cidades",
                element: <Cities />,
            },
            {
                path: "bairros",
                element: <Neighborhoods />,
            },
            {
                path: "logradouros",
                element: <Streets />,
            }
        ]
    }
]);