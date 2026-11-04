import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useGetAll from "../../../hooks/services/getAll";
import api from "../../../service/api";
import type { Bairro } from "../../../types/bairro";
import type { Cidade } from "../../../types/cidade";
import type { Endereco } from "../../../types/endereco";
import type { Logradouro } from "../../../types/logradouro";

interface CreateAddressDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const addressSchema = z.object({
    cep: z
        .string()
        .min(1, "O CEP é obrigatório")
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 8, {
            message: "O CEP deve ter exatamente 8 dígitos numéricos",
        }),
    idCidade: z.coerce.number().min(1, "Selecione uma cidade"),
    idBairro: z.coerce.number().min(1, "Selecione um bairro"),
    idLogradouro: z.coerce.number().min(1, "Selecione um logradouro"),
});

type AddressFormData = z.input<typeof addressSchema>;

const CreateAddressDialog = ({
    open,
    onClose,
    onSuccess,
}: CreateAddressDialogProps) => {
    const { data: cidades } = useGetAll<Cidade>("/cidade");
    const { data: bairros } = useGetAll<Bairro>("/bairro");
    const { data: logradouros } = useGetAll<Logradouro>("/logradouro");

    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            cep: "",
            idCidade: "" as unknown as number,
            idBairro: "" as unknown as number,
            idLogradouro: "" as unknown as number,
        },
    });

    const handleClose = () => {
        reset();
        setServerError("");
        onClose();
    };

    const onSubmit = async (values: AddressFormData) => {
        setServerError("");
        const cleanCep = values.cep.replace(/\D/g, "");

        try {
            // Obter os endereços existentes para gerar o próximo idEndereco incremental
            let nextId = 1;
            try {
                const response = await api.get<Endereco[]>("/endereco");
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const maxId = response.data.reduce(
                        (max, item) => (item.idEndereco > max ? item.idEndereco : max),
                        0
                    );
                    nextId = maxId + 1;
                }
            } catch {
                nextId = 1;
            }

            await api.post("/endereco/cadastrar", {
                idEndereco: nextId,
                cep: cleanCep,
                cidade: { idCidade: Number(values.idCidade) },
                logradouro: { idLogradouro: Number(values.idLogradouro) },
                bairro: { idBairro: Number(values.idBairro) },
            });

            handleClose();
            onSuccess();
        } catch (err: unknown) {
            const responseData = (err as { response?: { data?: unknown } })?.response?.data;
            const message =
                typeof responseData === "string"
                    ? responseData
                    : (responseData as { message?: string })?.message ??
                      "Erro ao cadastrar endereço no servidor.";
            setServerError(message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cadastrar Novo Endereço</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        {serverError && (
                            <Alert severity="error">{serverError}</Alert>
                        )}

                        <Controller
                            name="cep"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="CEP"
                                    size="small"
                                    required
                                    fullWidth
                                    placeholder="Ex: 85875028"
                                    error={Boolean(errors.cep)}
                                    helperText={errors.cep?.message ?? "Digite 8 dígitos numéricos"}
                                />
                            )}
                        />

                        <Controller
                            name="idCidade"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idCidade)}
                                >
                                    <InputLabel id="cidade-label">Cidade</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="cidade-label"
                                        label="Cidade"
                                    >
                                        {cidades.map((c) => (
                                            <MenuItem key={c.idCidade} value={c.idCidade}>
                                                {c.nomeCidade} ({c.unidadeFederativa?.siglaUF ?? c.unidadeFederativa?.siglaUf ?? ""})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idCidade && (
                                        <FormHelperText>{errors.idCidade.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="idBairro"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idBairro)}
                                >
                                    <InputLabel id="bairro-label">Bairro</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="bairro-label"
                                        label="Bairro"
                                    >
                                        {bairros.map((b) => (
                                            <MenuItem key={b.idBairro} value={b.idBairro}>
                                                {b.nomeBairro}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idBairro && (
                                        <FormHelperText>{errors.idBairro.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="idLogradouro"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idLogradouro)}
                                >
                                    <InputLabel id="logradouro-label">Logradouro</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="logradouro-label"
                                        label="Logradouro"
                                    >
                                        {logradouros.map((l) => {
                                            const tipo =
                                                typeof l.tipoLogradouro === "object" && l.tipoLogradouro
                                                    ? (l.tipoLogradouro.siglaLogradouro ?? "")
                                                    : (l.tipoLogradouro ?? "");
                                            const label = [tipo, l.nomeLogradouro].filter(Boolean).join(" ");
                                            return (
                                                <MenuItem key={l.idLogradouro} value={l.idLogradouro}>
                                                    {label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    {errors.idLogradouro && (
                                        <FormHelperText>{errors.idLogradouro.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateAddressDialog;
