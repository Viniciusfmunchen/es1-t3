import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConstructionIcon from "@mui/icons-material/Construction";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../../service/api";
import type { Equipamento } from "../../../types/equipamento";

const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null || isNaN(Number(valor))) return "-";
    return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
};

const EquipamentoDetalhes = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        const carregarEquipamento = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data: Equipamento | null = null;
                try {
                    const res = await api.get<Equipamento>("/equipamento/id", {
                        params: { id },
                    });
                    data = res.data;
                } catch {
                    const res = await api.get<Equipamento>(`/equipamento/${id}`);
                    data = res.data;
                }

                if (!ignore) {
                    setEquipamento(data);
                }
            } catch (err: unknown) {
                if (!ignore) {
                    console.error("Erro ao buscar dados do equipamento:", err);
                    setError("Não foi possível carregar as informações do equipamento.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        carregarEquipamento();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 280,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !equipamento) {
        return (
            <Stack spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                    onClick={() => navigate("/equipamentos")}
                >
                    Voltar para Equipamentos
                </Button>
                <Alert severity="error">
                    {error ?? `Equipamento com ID "${id}" não foi encontrado.`}
                </Alert>
            </Stack>
        );
    }

    return (
        <Stack spacing={3} sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/equipamentos")}
                >
                    Voltar para Equipamentos
                </Button>
                <Typography variant="caption" color="text.secondary">
                    ID: {equipamento.id}
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <ConstructionIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Dados do Equipamento
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Nome do Equipamento
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {equipamento.nome}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Tipo de Equipamento
                                    </Typography>
                                    <Typography variant="body1">
                                        {equipamento.tipoEquipamento?.nome || "-"}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor da Diária
                                    </Typography>
                                    <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                                        {formatarMoeda(equipamento.valorDiaria)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        ID no Sistema
                                    </Typography>
                                    <Typography variant="body2">
                                        {equipamento.id}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default EquipamentoDetalhes;
