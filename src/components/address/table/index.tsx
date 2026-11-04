import type { GridColDef } from "@mui/x-data-grid";
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import api from "../../../service/api";
import useGetAll from "../../../hooks/services/getAll";
import type { Endereco } from "../../../types/endereco";
import Table from "../../table";
import CreateAddressDialog from "../form";

const columns: GridColDef<Endereco>[] = [
    { field: "idEndereco", headerName: "ID", width: 90 },
    { field: "cep", headerName: "CEP" },
    {
        field: "cidade",
        headerName: "Cidade",
        valueGetter: (cidade: Endereco["cidade"]) => cidade?.nomeCidade,
    },
    {
        field: "bairro",
        headerName: "Bairro",
        valueGetter: (bairro: Endereco["bairro"]) => bairro?.nomeBairro,
    },
    {
        field: "logradouro",
        headerName: "Logradouro",
        flex: 1.4,
        valueGetter: (logradouro: Endereco["logradouro"]) => {
            if (!logradouro) return "";
            const tipo =
                typeof logradouro.tipoLogradouro === "object" && logradouro.tipoLogradouro
                    ? (logradouro.tipoLogradouro.siglaLogradouro ?? "")
                    : (logradouro.tipoLogradouro ?? "");
            return [tipo, logradouro.nomeLogradouro].filter(Boolean).join(" ");
        },
    },
];

type SearchType = "id" | "cep";

const AddressTable = () => {
    const {
        data: allAddresses,
        isLoading: isAllLoading,
        refetch,
    } = useGetAll<Endereco>(
        "/endereco",
        "Erro ao buscar endereços:",
        "Endereços carregados com sucesso!"
    );

    const [searchResults, setSearchResults] = useState<Endereco[] | null>(null);
    const [searchType, setSearchType] = useState<SearchType>("cep");
    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const rows = searchResults ?? allAddresses;

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = searchValue.trim();

        if (!trimmed) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            if (searchType === "id") {
                const response = await api.get<Endereco>("/endereco/id", {
                    params: { id: trimmed },
                });
                if (response.data) {
                    setSearchResults([response.data]);
                } else {
                    setSearchResults([]);
                }
            } else {
                const cleanCep = trimmed.replace(/\D/g, "");
                const response = await api.get<Endereco[]>("/endereco/cep", {
                    params: { cep: cleanCep },
                });
                if (Array.isArray(response.data)) {
                    setSearchResults(response.data);
                } else if (response.data) {
                    setSearchResults([response.data]);
                } else {
                    setSearchResults([]);
                }
            }
        } catch (error) {
            console.error("Erro ao consultar endereço:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setSearchValue("");
        setSearchResults(null);
    };

    return (
        <Stack spacing={2} sx={{ width: "100%", height: "100%" }}>
            <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
            >
                <FormControl size="small" sx={{ width: 110 }}>
                    <Select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value as SearchType)}
                    >
                        <MenuItem value="cep">Por CEP</MenuItem>
                        <MenuItem value="id">Por ID</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    type={searchType === "id" ? "number" : "text"}
                    label={searchType === "id" ? "ID" : "CEP"}
                    placeholder={searchType === "id" ? "Ex: 1" : "Ex: 85819770"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{ width: 220 }}
                />

                <Button
                    variant="contained"
                    type="submit"
                    startIcon={<SearchIcon />}
                    disabled={isSearching}
                >
                    Buscar
                </Button>

                {searchValue && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<ClearIcon />}
                        onClick={handleClear}
                    >
                        Limpar
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateOpen(true)}
                    sx={{ ml: { sm: "auto" } }}
                >
                    Novo Endereço
                </Button>
            </Box>

            <CreateAddressDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => refetch()}
            />

            <Box sx={{ flex: 1, width: "100%" }}>
                <Table
                    data={rows}
                    columns={columns}
                    getRowId={(row) => row.idEndereco}
                    loading={isAllLoading || isSearching}
                />
            </Box>
        </Stack>
    );
};

export default AddressTable;
