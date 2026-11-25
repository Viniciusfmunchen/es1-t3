import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import useGetAll from "../../../hooks/services/getAll";
import api from "../../../service/api";
import type { Endereco } from "../../../types/endereco";
import type { DDD, DDI } from "../../../types/telefone";

interface CreateClienteDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const clienteSchema = z.object({
    primeiroNome: z.string().min(1, "Primeiro nome é obrigatório"),
    sobreNome: z.string().min(1, "Sobrenome é obrigatório"),
    nomeSocial: z.string().optional(),
    cpf: z
        .string()
        .min(1, "O CPF é obrigatório")
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 11, {
            message: "O CPF deve ter exatamente 11 dígitos numéricos",
        }),
    idEndereco: z.coerce.number().min(1, "Selecione um endereço"),
    nroCasa: z.coerce.number().min(1, "O número da casa é obrigatório"),
    complemento: z.string().optional(),
    fones: z
        .array(
            z.object({
                numero: z
                    .string()
                    .min(1, "O telefone é obrigatório")
                    .transform((val) => val.replace(/\D/g, "")),
                idDdd: z.coerce.number().min(1, "DDD é obrigatório"),
                idDdi: z.coerce.number().min(1, "DDI é obrigatório"),
            })
        )
        .min(1, "Informe ao menos um telefone"),
    emails: z
        .array(
            z.object({
                enderecoEmail: z
                    .string()
                    .min(1, "O e-mail é obrigatório")
                    .email("Formato de e-mail inválido"),
            })
        )
        .min(1, "Informe ao menos um e-mail"),
});

type ClienteFormData = z.input<typeof clienteSchema>;

const CreateClienteDialog = ({
    open,
    onClose,
    onSuccess,
}: CreateClienteDialogProps) => {
    const { data: enderecos } = useGetAll<Endereco>("/endereco");
    const { data: ddis } = useGetAll<DDI>("/ddi");
    const { data: ddds } = useGetAll<DDD>("/ddd");
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClienteFormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            primeiroNome: "",
            sobreNome: "",
            nomeSocial: "",
            cpf: "",
            idEndereco: "" as unknown as number,
            nroCasa: "" as unknown as number,
            complemento: "",
            fones: [{ numero: "", idDdd: 1, idDdi: 1 }],
            emails: [{ enderecoEmail: "" }],
        },
    });

    const {
        fields: foneFields,
        append: appendFone,
        remove: removeFone,
    } = useFieldArray({
        control,
        name: "fones",
    });

    const {
        fields: emailFields,
        append: appendEmail,
        remove: removeEmail,
    } = useFieldArray({
        control,
        name: "emails",
    });

    const handleClose = () => {
        reset();
        setServerError("");
        onClose();
    };

    const onSubmit = async (values: ClienteFormData) => {
        setServerError("");
        const cleanCpf = values.cpf.replace(/\D/g, "");

        const payload = {
            primeiroNome: values.primeiroNome.trim(),
            sobreNome: values.sobreNome.trim(),
            nomeSocial: (values.nomeSocial ?? "").trim() || values.primeiroNome.trim(),
            cpf: cleanCpf,
            enderecoResidencial: {
                endereco: {
                    idEndereco: Number(values.idEndereco),
                },
                nroCasa: Number(values.nroCasa),
                complemento: (values.complemento ?? "").trim() || "Casa",
            },
            fones: values.fones.map((f) => ({
                numero: f.numero.replace(/\D/g, ""),
                ddd: {
                    id: Number(f.idDdd),
                },
                ddi: {
                    id: Number(f.idDdi),
                },
            })),
            emails: values.emails.map((e) => ({
                enderecoEmail: e.enderecoEmail.trim(),
            })),
        };

        try {
            try {
                await api.post("/cliente/cadastrar", payload);
            } catch (postErr: unknown) {
                const status = (postErr as { response?: { status?: number } })?.response?.status;
                if (status === 404) {
                    await api.post("/cliente", payload);
                } else {
                    throw postErr;
                }
            }

            handleClose();
            onSuccess();
        } catch (err: unknown) {
            const responseData = (err as { response?: { data?: unknown } })?.response?.data;
            const message =
                typeof responseData === "string"
                    ? responseData
                    : (responseData as { message?: string })?.message ??
                    "Erro ao cadastrar cliente no servidor.";
            setServerError(message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <Stack spacing={3}>
                        {serverError && <Alert severity="error">{serverError}</Alert>}

                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                <PersonIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Dados Pessoais
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="primeiroNome"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Primeiro Nome"
                                                size="small"
                                                required
                                                fullWidth
                                                error={Boolean(errors.primeiroNome)}
                                                helperText={errors.primeiroNome?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="sobreNome"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Sobrenome"
                                                size="small"
                                                required
                                                fullWidth
                                                error={Boolean(errors.sobreNome)}
                                                helperText={errors.sobreNome?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="nomeSocial"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Nome Social"
                                                size="small"
                                                fullWidth
                                                placeholder="Opcional"
                                                error={Boolean(errors.nomeSocial)}
                                                helperText={errors.nomeSocial?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="cpf"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="CPF"
                                                size="small"
                                                required
                                                fullWidth
                                                placeholder="Ex: 12345678901"
                                                error={Boolean(errors.cpf)}
                                                helperText={errors.cpf?.message ?? "11 dígitos numéricos"}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* Endereço Residencial */}
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                <HomeIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Endereço Residencial
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name="idEndereco"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl
                                                size="small"
                                                required
                                                fullWidth
                                                error={Boolean(errors.idEndereco)}
                                            >
                                                <InputLabel id="endereco-label">Endereço (Base)</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="endereco-label"
                                                    label="Endereço (Base)"
                                                >
                                                    {enderecos.map((end) => {
                                                        const tipo =
                                                            typeof end.logradouro?.tipoLogradouro === "object" &&
                                                                end.logradouro?.tipoLogradouro
                                                                ? (end.logradouro.tipoLogradouro.siglaLogradouro ?? "")
                                                                : (end.logradouro?.tipoLogradouro ?? "");
                                                        const logr = [tipo, end.logradouro?.nomeLogradouro]
                                                            .filter(Boolean)
                                                            .join(" ");
                                                        const local = [
                                                            logr,
                                                            end.bairro?.nomeBairro,
                                                            end.cidade?.nomeCidade,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ");
                                                        return (
                                                            <MenuItem key={end.idEndereco} value={end.idEndereco}>
                                                                ID {end.idEndereco} — CEP {end.cep} {local ? `(${local})` : ""}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                                {errors.idEndereco && (
                                                    <FormHelperText>{errors.idEndereco.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Controller
                                        name="nroCasa"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Número da Residência"
                                                type="number"
                                                size="small"
                                                required
                                                fullWidth
                                                error={Boolean(errors.nroCasa)}
                                                helperText={errors.nroCasa?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 8 }}>
                                    <Controller
                                        name="complemento"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Complemento"
                                                size="small"
                                                fullWidth
                                                placeholder="Ex: Apto 101, Casa, Bloco B"
                                                error={Boolean(errors.complemento)}
                                                helperText={errors.complemento?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider />

                        {/* Telefones */}
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1.5,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <PhoneIcon color="primary" fontSize="small" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        Telefones
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() =>
                                        appendFone({
                                            numero: "",
                                            idDdd: ddds[0]?.id ?? 1,
                                            idDdi: ddis[0]?.id ?? 1,
                                        })
                                    }
                                >
                                    Adicionar Telefone
                                </Button>
                            </Box>
                            <Stack spacing={1.5}>
                                {foneFields.map((fieldItem, index) => (
                                    <Box
                                        key={fieldItem.id}
                                        sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                                    >
                                        <Controller
                                            name={`fones.${index}.idDdi`}
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl
                                                    size="small"
                                                    sx={{ width: 110 }}
                                                    error={Boolean(errors.fones?.[index]?.idDdi)}
                                                    required
                                                >
                                                    <InputLabel id={`ddi-label-${index}`}>DDI</InputLabel>
                                                    <Select
                                                        {...field}
                                                        labelId={`ddi-label-${index}`}
                                                        label="DDI"
                                                    >
                                                        {ddis.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                +{item.codigo}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors.fones?.[index]?.idDdi && (
                                                        <FormHelperText>
                                                            {errors.fones[index]?.idDdi?.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name={`fones.${index}.idDdd`}
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl
                                                    size="small"
                                                    sx={{ width: 110 }}
                                                    error={Boolean(errors.fones?.[index]?.idDdd)}
                                                    required
                                                >
                                                    <InputLabel id={`ddd-label-${index}`}>DDD</InputLabel>
                                                    <Select
                                                        {...field}
                                                        labelId={`ddd-label-${index}`}
                                                        label="DDD"
                                                    >
                                                        {ddds.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                ({item.codigo})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors.fones?.[index]?.idDdd && (
                                                        <FormHelperText>
                                                            {errors.fones[index]?.idDdd?.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name={`fones.${index}.numero`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Número"
                                                    size="small"
                                                    placeholder="999990000"
                                                    sx={{ flex: 1 }}
                                                    error={Boolean(errors.fones?.[index]?.numero)}
                                                    helperText={errors.fones?.[index]?.numero?.message}
                                                />
                                            )}
                                        />
                                        <IconButton
                                            color="error"
                                            onClick={() => removeFone(index)}
                                            disabled={foneFields.length === 1}
                                            sx={{ mt: 0.5 }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>

                        <Divider />

                        {/* E-mails */}
                        <Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1.5,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <EmailIcon color="primary" fontSize="small" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                        E-mails
                                    </Typography>
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => appendEmail({ enderecoEmail: "" })}
                                >
                                    Adicionar E-mail
                                </Button>
                            </Box>
                            <Stack spacing={1.5}>
                                {emailFields.map((fieldItem, index) => (
                                    <Box
                                        key={fieldItem.id}
                                        sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                                    >
                                        <Controller
                                            name={`emails.${index}.enderecoEmail`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Endereço de E-mail"
                                                    type="email"
                                                    size="small"
                                                    placeholder="exemplo@email.com"
                                                    sx={{ flex: 1 }}
                                                    error={Boolean(errors.emails?.[index]?.enderecoEmail)}
                                                    helperText={
                                                        errors.emails?.[index]?.enderecoEmail?.message
                                                    }
                                                />
                                            )}
                                        />
                                        <IconButton
                                            color="error"
                                            onClick={() => removeEmail(index)}
                                            disabled={emailFields.length === 1}
                                            sx={{ mt: 0.5 }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Cadastrando..." : "Cadastrar Cliente"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateClienteDialog;
