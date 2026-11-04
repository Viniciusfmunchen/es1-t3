import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PublicIcon from "@mui/icons-material/Public";
import { useState } from "react";
import api from "../../../service/api";
import type { Endereco } from "../../../types/endereco";

const ExternalAddressSearchCard = () => {
    const [cep, setCep] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<Endereco | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const cleanCep = cep.replace(/\D/g, "").trim();

        if (!cleanCep) {
            setErrorMsg("Informe um CEP válido para buscar.");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setResult(null);

        try {
            const response = await api.get<Endereco>("/endereco/externo", {
                params: { cep: cleanCep },
            });
            if (response.data && response.data.cidade) {
                setResult(response.data);
            } else {
                setErrorMsg("Endereço não localizado na plataforma externa.");
            }
        } catch (err: unknown) {
            const serverMessage =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Não foi possível localizar o endereço para o CEP informado.";
            setErrorMsg(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setCep("");
        setResult(null);
        setErrorMsg("");
    };

    return (
        <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PublicIcon color="primary" />
                        <Typography variant="h6" component="h2">
                            Consulta Externa de Endereço (ViaCEP)
                        </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Consulte dados de endereço em uma plataforma externa a partir do CEP. O resultado será retornado no formato padrão da aplicação.
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}
                    >
                        <TextField
                            size="small"
                            label="CEP"
                            placeholder="Ex: 85819770"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            sx={{ width: 220 }}
                        />
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                            disabled={loading}
                        >
                            {loading ? "Buscando..." : "Consultar CEP"}
                        </Button>
                        {(cep || result || errorMsg) && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ClearIcon />}
                                onClick={handleClear}
                                disabled={loading}
                            >
                                Limpar
                            </Button>
                        )}
                    </Box>

                    {errorMsg && (
                        <Alert severity="warning" onClose={() => setErrorMsg("")}>
                            {errorMsg}
                        </Alert>
                    )}

                    {result && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1, border: "1px solid", borderColor: "grey.200" }}>
                                <Typography variant="subtitle2" color="primary" sx={{ mb: 1.5, fontWeight: 600 }}>
                                    Resultado Obtido da Plataforma Externa:
                                </Typography>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "repeat(2, 1fr)",
                                            md: "repeat(4, 1fr)",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            CEP
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {result.cep || "-"}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            Cidade
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {result.cidade?.nomeCidade || "-"}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            Estado / UF
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {[
                                                result.cidade?.unidadeFederativa?.nomeUF ?? result.cidade?.unidadeFederativa?.nomeUf,
                                                result.cidade?.unidadeFederativa?.siglaUF ?? result.cidade?.unidadeFederativa?.siglaUf,
                                            ]
                                                .filter(Boolean)
                                                .join(" - ") || "-"}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            Bairro
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {result.bairro?.nomeBairro || "-"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                                            Logradouro
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {result.logradouro?.nomeLogradouro || "-"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ExternalAddressSearchCard;
