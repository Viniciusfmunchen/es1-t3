import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "./layouts/root";
import PaginaAlugueis from "./pages/alugueis";
import PaginaDetalhesAluguel from "./pages/alugueis/detalhes";
import PaginaClientes from "./pages/clientes";
import PaginaDetalhesCliente from "./pages/clientes/detalhes";
import PaginaBairros from "./pages/endereco/bairros";
import PaginaCidades from "./pages/endereco/cidades";
import PaginaEnderecos from "./pages/endereco/enderecos";
import PaginaLogradouros from "./pages/endereco/logradouros";
import PaginaEquipamentos from "./pages/equipamentos";
import PaginaDetalhesEquipamento from "./pages/equipamentos/detalhes";
import PaginaTelefones from "./pages/telefones";
import PaginaTiposEquipamento from "./pages/tipos-equipamento";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/clientes" replace />,
            },
            {
                path: "clientes",
                children: [
                    {
                        index: true,
                        element: <PaginaClientes />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesCliente />,
                    },
                ],
            },
            {
                path: "cliente",
                children: [
                    {
                        index: true,
                        element: <Navigate to="/clientes" replace />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesCliente />,
                    },
                ],
            },
            {
                path: "telefones",
                element: <PaginaTelefones />,
            },
            {
                path: "tipos-equipamento",
                element: <PaginaTiposEquipamento />,
            },
            {
                path: "equipamentos",
                children: [
                    {
                        index: true,
                        element: <PaginaEquipamentos />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesEquipamento />,
                    },
                ],
            },
            {
                path: "equipamento",
                children: [
                    {
                        index: true,
                        element: <Navigate to="/equipamentos" replace />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesEquipamento />,
                    },
                ],
            },
            {
                path: "alugueis",
                children: [
                    {
                        index: true,
                        element: <PaginaAlugueis />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesAluguel />,
                    },
                ],
            },
            {
                path: "aluguel",
                children: [
                    {
                        index: true,
                        element: <Navigate to="/alugueis" replace />,
                    },
                    {
                        path: ":id",
                        element: <PaginaDetalhesAluguel />,
                    },
                ],
            },
            {
                path: "endereco",
                children: [
                    {
                        index: true,
                        element: <Navigate to="/endereco/enderecos" replace />,
                    },
                    {
                        path: "enderecos",
                        element: <PaginaEnderecos />,
                    },
                    {
                        path: "cidades",
                        element: <PaginaCidades />,
                    },
                    {
                        path: "bairros",
                        element: <PaginaBairros />,
                    },
                    {
                        path: "logradouros",
                        element: <PaginaLogradouros />,
                    },
                ],
            },
        ],
    },
]);
