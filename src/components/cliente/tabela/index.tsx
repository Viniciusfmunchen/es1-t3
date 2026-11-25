import type { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useGetAll from "../../../hooks/services/getAll";
import type { Cliente } from "../../../types/cliente";
import type { Endereco } from "../../../types/endereco";
import Table from "../../table";

const colunas: GridColDef<Cliente>[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
        field: "nome",
        headerName: "Nome",
        flex: 1.2,
        valueGetter: (value: string, row: Cliente) => {
            if (value) return value;
            const full = [row.primeiroNome, row.sobreNome].filter(Boolean).join(" ");
            return full || "-";
        },
    },
    {
        field: "cpf",
        headerName: "CPF",
        flex: 0.9,
        valueGetter: (value: string) => value || "-",
    },
    {
        field: "fones",
        headerName: "Telefone",
        flex: 1,
        valueGetter: (value: Cliente["fones"]) => {
            if (!Array.isArray(value) || value.length === 0) return "-";
            return (
                value
                    .map((fone) => {
                        const ddd = fone.ddd?.codigo ? `(${fone.ddd.codigo}) ` : "";
                        return `${ddd}${fone.numero ?? ""}`.trim();
                    })
                    .filter(Boolean)
                    .join(", ") || "-"
            );
        },
    },
    {
        field: "emails",
        headerName: "E-mail",
        flex: 1.2,
        valueGetter: (value: Cliente["emails"]) => {
            if (!Array.isArray(value) || value.length === 0) return "-";
            return (
                value
                    .map((email) => email.enderecoEmail)
                    .filter(Boolean)
                    .join(", ") || "-"
            );
        },
    },
    {
        field: "enderecoResidencial",
        headerName: "Cidade/UF",
        flex: 1,
        valueGetter: (value: Cliente["enderecoResidencial"]) => {
            if (!value) return "-";
            const end = value.endereco ?? (value as unknown as Endereco);
            const cidade = end?.cidade?.nomeCidade;
            const uf =
                end?.cidade?.unidadeFederativa?.siglaUF ??
                end?.cidade?.unidadeFederativa?.siglaUf;
            if (cidade && uf) return `${cidade}/${uf}`;
            return cidade || end?.cep || "-";
        },
    },
];

interface TabelaClientesProps {
    refreshKey?: number;
}

const TabelaClientes = ({ refreshKey }: TabelaClientesProps) => {
    const navigate = useNavigate();

    const { data, isLoading, refetch } = useGetAll<Cliente>(
        "/cliente",
        "Erro ao buscar clientes:",
        "Clientes carregados com sucesso!"
    );

    useEffect(() => {
        if (refreshKey) {
            refetch();
        }
    }, [refreshKey, refetch]);

    const handleRowClick = (params: GridRowParams<Cliente>) => {
        const clienteId =
            params.row.id ??
            (params.row as unknown as { idCliente?: string | number }).idCliente;
        if (clienteId) {
            navigate(`/cliente/${clienteId}`);
        }
    };

    return (
        <Table
            data={data}
            columns={colunas}
            getRowId={(row) =>
                row.id ??
                (row as unknown as { idCliente?: string | number }).idCliente ??
                row.cpf
            }
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

export default TabelaClientes;
