import type { GridColDef } from "@mui/x-data-grid";
import useGetAll from "../../../hooks/services/getAll";
import type { Logradouro } from "../../../types/logradouro";
import Table from "../../table";

const columns: GridColDef<Logradouro>[] = [
    { field: "idLogradouro", headerName: "ID", width: 90 },
    {
        field: "tipoLogradouro",
        headerName: "Tipo",
        width: 140,
        valueGetter: (tipo: Logradouro["tipoLogradouro"]) =>
            typeof tipo === "object" && tipo !== null
                ? (tipo.siglaLogradouro ?? tipo.nomeLogradouro ?? "")
                : (tipo ?? ""),
    },
    { field: "nomeLogradouro", headerName: "Nome do Logradouro", flex: 1.5 },
];

const StreetTable = () => {
    const { data, isLoading } = useGetAll<Logradouro>(
        "/logradouro",
        "Erro ao buscar logradouros:",
        "Logradouros carregados com sucesso!"
    );

    return (
        <Table
            data={data}
            columns={columns}
            getRowId={(row) => row.idLogradouro}
            loading={isLoading}
        />
    );
};

export default StreetTable;

