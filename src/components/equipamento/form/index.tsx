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
import type { TipoEquipamento } from "../../../types/tipo-equipamento";

interface CreateEquipamentoDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const equipamentoSchema = z.object({
    nome: z.string().min(1, "O nome do equipamento é obrigatório"),
    valorDiaria: z.coerce.number().min(0.01, "O valor da diária deve ser maior que zero"),
    idTipoEquipamento: z.coerce.number().min(1, "Selecione um tipo de equipamento"),
});

type EquipamentoFormData = z.input<typeof equipamentoSchema>;

const CreateEquipamentoDialog = ({
    open,
    onClose,
    onSuccess,
}: CreateEquipamentoDialogProps) => {
    const { data: tiposEquipamento } = useGetAll<TipoEquipamento>("/tipo-equipamento");
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EquipamentoFormData>({
        resolver: zodResolver(equipamentoSchema),
        defaultValues: {
            nome: "",
            valorDiaria: "" as unknown as number,
            idTipoEquipamento: "" as unknown as number,
        },
    });

    const handleClose = () => {
        reset();
        setServerError("");
        onClose();
    };

    const onSubmit = async (values: EquipamentoFormData) => {
        setServerError("");

        const payload = {
            nome: values.nome.trim(),
            valorDiaria: Number(values.valorDiaria),
            tipoEquipamento: {
                id: Number(values.idTipoEquipamento),
            },
        };

        try {
            try {
                await api.post("/equipamento/cadastrar", payload);
            } catch (postErr: unknown) {
                const status = (postErr as { response?: { status?: number } })?.response?.status;
                if (status === 404) {
                    await api.post("/equipamento", payload);
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
                      "Erro ao cadastrar equipamento no servidor.";
            setServerError(message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cadastrar Novo Equipamento</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        {serverError && <Alert severity="error">{serverError}</Alert>}

                        <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nome do Equipamento"
                                    size="small"
                                    required
                                    fullWidth
                                    placeholder="Ex: Lixadeira Orbital"
                                    error={Boolean(errors.nome)}
                                    helperText={errors.nome?.message}
                                />
                            )}
                        />

                        <Controller
                            name="idTipoEquipamento"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idTipoEquipamento)}
                                >
                                    <InputLabel id="tipo-equipamento-label">Tipo de Equipamento</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="tipo-equipamento-label"
                                        label="Tipo de Equipamento"
                                    >
                                        {tiposEquipamento.map((t) => (
                                            <MenuItem key={t.id} value={t.id}>
                                                {t.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idTipoEquipamento && (
                                        <FormHelperText>
                                            {errors.idTipoEquipamento.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="valorDiaria"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Valor da Diária (R$)"
                                    type="number"
                                    size="small"
                                    required
                                    fullWidth
                                    placeholder="Ex: 30.00"
                                    error={Boolean(errors.valorDiaria)}
                                    helperText={errors.valorDiaria?.message}
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Cadastrando..." : "Cadastrar Equipamento"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateEquipamentoDialog;
