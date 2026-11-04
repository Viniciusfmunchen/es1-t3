import type { GridColDef } from "@mui/x-data-grid";
import { Box, Button, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import api from "../../../service/api";
import useGetAll from "../../../hooks/services/getAll";
import type { Cidade } from "../../../types/cidade";
import Table from "../../table";

const columns: GridColDef<Cidade>[] = [
    { field: "idCidade", headerName: "ID", width: 90 },
    { field: "nomeCidade", headerName: "Nome da Cidade", flex: 1.5 },
    {
        field: "unidadeFederativa",
        headerName: "UF",
        width: 100,
        valueGetter: (uf: Cidade["unidadeFederativa"]) =>
            uf?.siglaUF ?? uf?.siglaUf ?? "",
    },
    {
        field: "estado",
        headerName: "Estado",
        flex: 1,
        valueGetter: (_, row) =>
            row.unidadeFederativa?.nomeUF ??
            row.unidadeFederativa?.nomeUf ??
            "",
    },
];

const CityTable = () => {
    const { data: allCities, isLoading: isAllLoading } = useGetAll<Cidade>(
        "/cidade",
        "Erro ao buscar cidades:",
        "Cidades carregadas com sucesso!"
    );

    const [searchResults, setSearchResults] = useState<Cidade[] | null>(null);
    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const rows = searchResults ?? allCities;

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = searchId.trim();

        if (!trimmed) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get<Cidade>("/cidade/id", {
                params: { id: trimmed },
            });
            if (response.data) {
                setSearchResults([response.data]);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Erro ao buscar cidade por ID:", error);
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
                    columns={columns}
                    getRowId={(row) => row.idCidade}
                    loading={isAllLoading || isSearching}
                />
            </Box>
        </Stack>
    );
};

export default CityTable;
