import { Box, Paper, Typography } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import useGetAll from "../../../hooks/services/getAll";
import type { DDI } from "../../../types/telefone";
import Table from "../../table";

const colunas: GridColDef<DDI>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "codigo",
        headerName: "Código DDI",
        flex: 1,
        valueGetter: (codigo: string) => (codigo ? `+${codigo}` : "-"),
    },
];

const TabelaDDI = () => {
    const { data, isLoading } = useGetAll<DDI>(
        "/ddi",
        "Erro ao buscar DDIs:",
        "DDIs carregados com sucesso!"
    );

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxSizing: "border-box",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                DDIs (Internacionais)
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <Table
                    data={data}
                    columns={colunas}
                    getRowId={(row) => row.id}
                    loading={isLoading}
                />
            </Box>
        </Paper>
    );
};

export default TabelaDDI;
