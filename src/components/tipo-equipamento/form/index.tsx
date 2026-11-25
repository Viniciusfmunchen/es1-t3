import { zodResolver } from "@hookform/resolvers/zod";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import api from "../../../service/api";

interface CreateTipoEquipamentoDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const tipoEquipamentoSchema = z.object({
    nome: z.string().min(1, "O nome do tipo de equipamento é obrigatório"),
});

type TipoEquipamentoFormData = z.input<typeof tipoEquipamentoSchema>;

const CreateTipoEquipamentoDialog = ({
    open,
    onClose,
    onSuccess,
}: CreateTipoEquipamentoDialogProps) => {
    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TipoEquipamentoFormData>({
        resolver: zodResolver(tipoEquipamentoSchema),
        defaultValues: {
            nome: "",
        },
    });

    const handleClose = () => {
        reset();
        setServerError("");
        onClose();
    };

    const onSubmit = async (values: TipoEquipamentoFormData) => {
        setServerError("");

        const payload = {
            nome: values.nome.trim(),
        };

        try {
            try {
                await api.post("/tipo-equipamento/cadastrar", payload);
            } catch (postErr: unknown) {
                const status = (postErr as { response?: { status?: number } })?.response?.status;
                if (status === 404) {
                    await api.post("/tipo-equipamento", payload);
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
                      "Erro ao cadastrar tipo de equipamento no servidor.";
            setServerError(message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Cadastrar Novo Tipo de Equipamento</DialogTitle>
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
                                    label="Nome do Tipo"
                                    size="small"
                                    required
                                    fullWidth
                                    placeholder="Ex: Gerador, Lixadeira"
                                    error={Boolean(errors.nome)}
                                    helperText={errors.nome?.message}
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
                        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateTipoEquipamentoDialog;
