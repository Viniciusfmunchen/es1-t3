import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useGetAll from "../../../hooks/services/getAll";
import type { Equipamento } from "../../../types/equipamento";
import Table from "../../table";

const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null || isNaN(Number(valor))) return "-";
    return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
};

const colunas: GridColDef<Equipamento>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome do Equipamento", flex: 1.4 },
    {
        field: "tipoEquipamento",
        headerName: "Tipo",
        flex: 1,
        valueGetter: (tipo: Equipamento["tipoEquipamento"]) => tipo?.nome || "-",
    },
    {
        field: "valorDiaria",
        headerName: "Diária",
        width: 140,
        valueGetter: (valor: number) => formatarMoeda(valor),
    },
];

interface TabelaEquipamentosProps {
    refreshKey?: number;
}

const TabelaEquipamentos = ({ refreshKey }: TabelaEquipamentosProps) => {
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetAll<Equipamento>(
        "/equipamento",
        "Erro ao buscar equipamentos:",
        "Equipamentos carregados com sucesso!"
    );

    useEffect(() => {
        if (refreshKey) {
            refetch();
        }
    }, [refreshKey, refetch]);

    const handleRowClick = (params: GridRowParams<Equipamento>) => {
        const id = params.row.id;
        if (id) {
            navigate(`/equipamento/${id}`);
        }
    };

    return (
        <Table
            data={data}
            columns={colunas}
            getRowId={(row) => row.id}
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

export default TabelaEquipamentos;
