import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ConstructionIcon from "@mui/icons-material/Construction";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../../service/api";
import type { Aluguel } from "../../../types/aluguel";
import type { Endereco } from "../../../types/endereco";

const formatarMoeda = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null || isNaN(Number(valor))) return "-";
    return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
};

const formatarData = (dataStr: string | undefined | null) => {
    if (!dataStr) return "-";
    const partes = dataStr.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
};

const AluguelDetalhes = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [aluguel, setAluguel] = useState<Aluguel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        const carregarAluguel = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data: Aluguel | null = null;
                try {
                    const res = await api.get<Aluguel>("/pedido-aluguel-equipamento/id", {
                        params: { id },
                    });
                    data = res.data;
                } catch {
                    const res = await api.get<Aluguel>(`/pedido-aluguel-equipamento/${id}`);
                    data = res.data;
                }

                if (!ignore) {
                    setAluguel(data);
                }
            } catch (err: unknown) {
                if (!ignore) {
                    console.error("Erro ao buscar dados do aluguel:", err);
                    setError("Não foi possível carregar as informações do aluguel.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        carregarAluguel();

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

    if (error || !aluguel) {
        return (
            <Stack spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                    onClick={() => navigate("/alugueis")}
                >
                    Voltar para Aluguéis
                </Button>
                <Alert severity="error">
                    {error ?? `Aluguel com ID "${id}" não foi encontrado.`}
                </Alert>
            </Stack>
        );
    }

    const cliente = aluguel.cliente;
    const nomeCliente =
        cliente?.nome ||
        cliente?.nomeSocial ||
        [cliente?.primeiroNome, cliente?.sobreNome].filter(Boolean).join(" ") ||
        "Não informado";

    const enderecoBase =
        cliente?.enderecoResidencial?.endereco ??
        (cliente?.enderecoResidencial as unknown as Endereco);
    const nroCasa = cliente?.enderecoResidencial?.nroCasa;
    const complemento = cliente?.enderecoResidencial?.complemento;

    const logradouro = enderecoBase?.logradouro;
    const tipoLogradouro =
        logradouro &&
        (typeof logradouro.tipoLogradouro === "object" && logradouro.tipoLogradouro
            ? (logradouro.tipoLogradouro.siglaLogradouro ?? "")
            : (logradouro.tipoLogradouro ?? ""));
    const logradouroFormatado = logradouro
        ? [tipoLogradouro, logradouro.nomeLogradouro].filter(Boolean).join(" ")
        : "";

    const cidade = enderecoBase?.cidade;
    const uf =
        cidade?.unidadeFederativa?.siglaUF ?? cidade?.unidadeFederativa?.siglaUf ?? "";
    const cidadeFormatada = cidade
        ? [cidade.nomeCidade, uf].filter(Boolean).join(" - ")
        : "";

    return (
        <Stack spacing={3} sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/alugueis")}
                >
                    Voltar para Aluguéis
                </Button>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                    <Chip
                        label={`Total: ${formatarMoeda(aluguel.valorLocacao)}`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        ID: {aluguel.id}
                    </Typography>
                </Box>
            </Box>

            <Grid container spacing={2.5}>
                {/* Dados da Locação */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <ReceiptIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Informações da Locação
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Número do Aluguel
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {aluguel.nroAluguel}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Data do Pedido
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatarData(aluguel.dataPedido)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Início da Locação
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatarData(aluguel.dataInicioLocacao)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Previsão de Devolução
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatarData(aluguel.dataPrevistoDevolucao)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor da Diária
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatarMoeda(aluguel.valorDiaria)}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Valor Total da Locação
                                    </Typography>
                                    <Typography variant="body1" color="primary.main" sx={{ fontWeight: 600 }}>
                                        {formatarMoeda(aluguel.valorLocacao)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Equipamento */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <ConstructionIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Equipamento Alugado
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Nome do Equipamento
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {aluguel.equipamento?.nome || "Não informado"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Tipo do Equipamento
                                    </Typography>
                                    <Typography variant="body1">
                                        {aluguel.equipamento?.tipoEquipamento?.nome || "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Diária Padrão do Equipamento
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatarMoeda(aluguel.equipamento?.valorDiaria)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        ID do Equipamento
                                    </Typography>
                                    <Typography variant="body2">
                                        {aluguel.equipamento?.id || "-"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Cliente */}
                <Grid size={{ xs: 12 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Dados do Cliente
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Nome
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {nomeCliente}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        CPF
                                    </Typography>
                                    <Typography variant="body1">
                                        {cliente?.cpf || "Não informado"}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                                    >
                                        <PhoneIcon fontSize="inherit" /> Telefones
                                    </Typography>
                                    {cliente?.fones && cliente.fones.length > 0 ? (
                                        <Stack spacing={0.5}>
                                            {cliente.fones.map((f, i) => (
                                                <Typography key={i} variant="body2">
                                                    {f.ddi?.codigo ? `+${f.ddi.codigo} ` : ""}
                                                    {f.ddd?.codigo ? `(${f.ddd.codigo}) ` : ""}
                                                    {f.numero}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum telefone
                                        </Typography>
                                    )}
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                                    >
                                        <EmailIcon fontSize="inherit" /> E-mails
                                    </Typography>
                                    {cliente?.emails && cliente.emails.length > 0 ? (
                                        <Stack spacing={0.5}>
                                            {cliente.emails.map((e, i) => (
                                                <Typography key={i} variant="body2">
                                                    {e.enderecoEmail}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum e-mail
                                        </Typography>
                                    )}
                                </Grid>

                                {cliente?.enderecoResidencial && (
                                    <Grid size={{ xs: 12 }}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}
                                        >
                                            <HomeIcon fontSize="inherit" /> Endereço Residencial
                                        </Typography>
                                        <Typography variant="body2">
                                            {[
                                                logradouroFormatado,
                                                nroCasa ? `Nº ${nroCasa}` : "",
                                                complemento,
                                                enderecoBase?.bairro?.nomeBairro,
                                                cidadeFormatada,
                                                enderecoBase?.cep ? `CEP: ${enderecoBase.cep}` : "",
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default AluguelDetalhes;
