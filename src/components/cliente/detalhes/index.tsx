import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
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
import type { Cliente } from "../../../types/cliente";
import type { Endereco } from "../../../types/endereco";

const ClienteDetalhes = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        let ignore = false;

        const carregarCliente = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data: Cliente | null = null;
                try {
                    const res = await api.get<Cliente>("/cliente/id", {
                        params: { id },
                    });
                    data = res.data;
                } catch {
                    const res = await api.get<Cliente>(`/cliente/${id}`);
                    data = res.data;
                }

                if (!ignore) {
                    setCliente(data);
                }
            } catch (err: unknown) {
                if (!ignore) {
                    console.error("Erro ao buscar dados do cliente:", err);
                    setError("Não foi possível carregar as informações do cliente.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        carregarCliente();

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

    if (error || !cliente) {
        return (
            <Stack spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    sx={{ alignSelf: "flex-start" }}
                    onClick={() => navigate("/clientes")}
                >
                    Voltar para Clientes
                </Button>
                <Alert severity="error">
                    {error ?? `Cliente com ID "${id}" não foi encontrado.`}
                </Alert>
            </Stack>
        );
    }

    const nomeCompleto =
        cliente.nome ||
        [cliente.primeiroNome, cliente.sobreNome].filter(Boolean).join(" ") ||
        "Não informado";

    const enderecoBase =
        cliente.enderecoResidencial?.endereco ??
        (cliente.enderecoResidencial as unknown as Endereco);
    const nroCasa = cliente.enderecoResidencial?.nroCasa;
    const complemento = cliente.enderecoResidencial?.complemento;

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
                    onClick={() => navigate("/clientes")}
                >
                    Voltar para Clientes
                </Button>
                <Typography variant="caption" color="text.secondary">
                    ID: {cliente.id}
                </Typography>
            </Box>

            <Grid container spacing={2.5}>
                {/* Dados Gerais */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Dados Pessoais
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Nome
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {nomeCompleto}
                                    </Typography>
                                </Box>

                                {cliente.nomeSocial && (
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Nome Social
                                        </Typography>
                                        <Typography variant="body1">
                                            {cliente.nomeSocial}
                                        </Typography>
                                    </Box>
                                )}

                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        CPF
                                    </Typography>
                                    <Typography variant="body1">
                                        {cliente.cpf || "Não informado"}
                                    </Typography>
                                </Box>

                                {(cliente.primeiroNome || cliente.sobreNome) && (
                                    <Box sx={{ display: "flex", gap: 3 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Primeiro Nome
                                            </Typography>
                                            <Typography variant="body2">
                                                {cliente.primeiroNome || "-"}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Sobrenome
                                            </Typography>
                                            <Typography variant="body2">
                                                {cliente.sobreNome || "-"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Contatos */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <PhoneIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Contatos
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                                    >
                                        <PhoneIcon fontSize="inherit" /> Telefones
                                    </Typography>
                                    {cliente.fones && cliente.fones.length > 0 ? (
                                        <Stack spacing={0.5}>
                                            {cliente.fones.map((fone, index) => {
                                                const ddd = fone.ddd?.codigo
                                                    ? `(${fone.ddd.codigo}) `
                                                    : "";
                                                const ddi = fone.ddi?.codigo
                                                    ? `+${fone.ddi.codigo} `
                                                    : "";
                                                return (
                                                    <Typography key={index} variant="body2">
                                                        {ddi}
                                                        {ddd}
                                                        {fone.numero}
                                                    </Typography>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum telefone cadastrado
                                        </Typography>
                                    )}
                                </Box>

                                <Box>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
                                    >
                                        <EmailIcon fontSize="inherit" /> E-mails
                                    </Typography>
                                    {cliente.emails && cliente.emails.length > 0 ? (
                                        <Stack spacing={0.5}>
                                            {cliente.emails.map((email, index) => (
                                                <Typography key={index} variant="body2">
                                                    {email.enderecoEmail}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Nenhum e-mail cadastrado
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Endereço Residencial */}
                <Grid size={{ xs: 12 }}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <HomeIcon color="primary" />
                                <Typography variant="h6" component="div">
                                    Endereço Residencial
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {cliente.enderecoResidencial ? (
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            CEP
                                        </Typography>
                                        <Typography variant="body2">
                                            {enderecoBase?.cep || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Logradouro
                                        </Typography>
                                        <Typography variant="body2">
                                            {logradouroFormatado || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Número da Residência
                                        </Typography>
                                        <Typography variant="body2">
                                            {nroCasa ?? "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Complemento
                                        </Typography>
                                        <Typography variant="body2">
                                            {complemento || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Bairro
                                        </Typography>
                                        <Typography variant="body2">
                                            {enderecoBase?.bairro?.nomeBairro || "-"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Cidade / UF
                                        </Typography>
                                        <Typography variant="body2">
                                            {cidadeFormatada || "-"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum endereço vinculado.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default ClienteDetalhes;
