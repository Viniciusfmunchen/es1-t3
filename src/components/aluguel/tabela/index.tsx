import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useGetAll from "../../../hooks/services/getAll";
import type { Aluguel } from "../../../types/aluguel";
import Table from "../../table";

const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null || isNaN(Number(valor))) return "-";
    return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
};

const formatarData = (dataStr: string | undefined | null) => {
    if (!dataStr) return "-";
    const partes = dataStr.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
};

const colunas: GridColDef<Aluguel>[] = [
    { field: "nroAluguel", headerName: "Nº Aluguel", width: 160 },
    {
        field: "cliente",
        headerName: "Cliente",
        flex: 1.2,
        valueGetter: (cliente: Aluguel["cliente"]) => {
            if (!cliente) return "-";
            return (
                cliente.nome ||
                cliente.nomeSocial ||
                [cliente.primeiroNome, cliente.sobreNome].filter(Boolean).join(" ") ||
                "-"
            );
        },
    },
    {
        field: "equipamento",
        headerName: "Equipamento",
        flex: 1.3,
        valueGetter: (equipamento: Aluguel["equipamento"]) => {
            return equipamento?.nome || "-";
        },
    },
    {
        field: "dataInicioLocacao",
        headerName: "Início",
        width: 120,
        valueGetter: (data: string) => formatarData(data),
    },
    {
        field: "dataPrevistoDevolucao",
        headerName: "Previsão Devolução",
        width: 160,
        valueGetter: (data: string) => formatarData(data),
    },
    {
        field: "valorDiaria",
        headerName: "Diária",
        width: 120,
        valueGetter: (valor: number) => formatarMoeda(valor),
    },
    {
        field: "valorLocacao",
        headerName: "Valor Total",
        width: 130,
        valueGetter: (valor: number) => formatarMoeda(valor),
    },
];

interface TabelaAlugueisProps {
    refreshKey?: number;
}

const TabelaAlugueis = ({ refreshKey }: TabelaAlugueisProps) => {
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetAll<Aluguel>(
        "/pedido-aluguel-equipamento",
        "Erro ao buscar aluguéis:",
        "Aluguéis carregados com sucesso!"
    );

    useEffect(() => {
        if (refreshKey) {
            refetch();
        }
    }, [refreshKey, refetch]);

    const handleRowClick = (params: GridRowParams<Aluguel>) => {
        const id = params.row.id;
        if (id) {
            navigate(`/aluguel/${id}`);
        }
    };

    return (
        <Table
            data={data}
            columns={colunas}
            getRowId={(row) => row.id ?? row.nroAluguel}
            loading={isLoading}
            onRowClick={handleRowClick}
            sx={{
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                },
            }}
        />
    );
};

export default TabelaAlugueis;
