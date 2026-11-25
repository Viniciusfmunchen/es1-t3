import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Stack, TextField } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useGetAll from "../../../hooks/services/getAll";
import api from "../../../service/api";
import type { TipoEquipamento } from "../../../types/tipo-equipamento";
import Table from "../../table";

const colunas: GridColDef<TipoEquipamento>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nome", headerName: "Nome do Tipo de Equipamento", flex: 1 },
];

interface TabelaTiposEquipamentoProps {
    refreshKey?: number;
}

const TabelaTiposEquipamento = ({ refreshKey }: TabelaTiposEquipamentoProps) => {
    const {
        data: allTipos,
        isLoading: isAllLoading,
        refetch,
    } = useGetAll<TipoEquipamento>(
        "/tipo-equipamento",
        "Erro ao buscar tipos de equipamento:",
        "Tipos de equipamento carregados com sucesso!"
    );

    const [searchResults, setSearchResults] = useState<TipoEquipamento[] | null>(null);
    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (refreshKey) {
            refetch();
        }
    }, [refreshKey, refetch]);

    const rows = searchResults ?? allTipos;

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = searchId.trim();

        if (!trimmed) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            let data: TipoEquipamento | null = null;
            try {
                const res = await api.get<TipoEquipamento>("/tipo-equipamento/id", {
                    params: { id: trimmed },
                });
                data = res.data;
            } catch {
                const res = await api.get<TipoEquipamento>(`/tipo-equipamento/${trimmed}`);
                data = res.data;
            }

            if (data) {
                setSearchResults([data]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Erro ao buscar tipo de equipamento por ID:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchId("");
        setSearchResults(null);
    };

    return (
        <Stack spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
                <TextField
                    size="small"
                    type="number"
                    label="Buscar por ID"
                    placeholder="Ex: 1"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    sx={{ width: 180 }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SearchIcon />}
                    disabled={isSearching}
                >
                    Buscar
                </Button>
                {searchId && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                    >
                        Limpar
                    </Button>
                )}
            </Box>

            <Box sx={{ flex: 1, width: "100%" }}>
                <Table
                    data={rows}
                    columns={colunas}
                    getRowId={(row) => row.id}
                    loading={isAllLoading || isSearching}
                />
            </Box>
        </Stack>
    );
};

export default TabelaTiposEquipamento;
