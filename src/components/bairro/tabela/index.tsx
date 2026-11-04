import type { GridColDef } from "@mui/x-data-grid";
import useGetAll from "../../../hooks/services/getAll";
import type { Bairro } from "../../../types/bairro";
import Table from "../../table";

const columns: GridColDef<Bairro>[] = [
    { field: "idBairro", headerName: "ID", width: 90 },
    { field: "nomeBairro", headerName: "Nome do Bairro", flex: 1 },
];

const NeighborhoodTable = () => {
    const { data, isLoading } = useGetAll<Bairro>(
        "/bairro",
        "Erro ao buscar bairros:",
        "Bairros carregados com sucesso!"
    );

    return (
        <Table
            data={data}
            columns={columns}
            getRowId={(row) => row.idBairro}
            loading={isLoading}
        />
    );
};

export default NeighborhoodTable;

