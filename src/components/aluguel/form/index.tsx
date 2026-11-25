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
    Grid,
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
import type { Cliente } from "../../../types/cliente";
import type { Equipamento } from "../../../types/equipamento";

interface CreateAluguelDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const aluguelSchema = z.object({
    nroAluguel: z.string().min(1, "O número do aluguel é obrigatório"),
    dataPedido: z.string().min(1, "A data do pedido é obrigatória"),
    dataInicioLocacao: z.string().min(1, "A data de início da locação é obrigatória"),
    dataPrevistoDevolucao: z.string().min(1, "A data prevista de devolução é obrigatória"),
    valorDiaria: z.coerce.number().min(0.01, "O valor da diária deve ser maior que zero"),
    idEquipamento: z.coerce.number().min(1, "Selecione um equipamento"),
    idCliente: z.coerce.number().min(1, "Selecione um cliente"),
});

type AluguelFormData = z.input<typeof aluguelSchema>;

const getHojeString = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
};

const CreateAluguelDialog = ({
    open,
    onClose,
    onSuccess,
}: CreateAluguelDialogProps) => {
    const { data: equipamentos } = useGetAll<Equipamento>("/equipamento");
    const { data: clientes } = useGetAll<Cliente>("/cliente");

    const [serverError, setServerError] = useState("");

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AluguelFormData>({
        resolver: zodResolver(aluguelSchema),
        defaultValues: {
            nroAluguel: "",
            dataPedido: getHojeString(),
            dataInicioLocacao: getHojeString(),
            dataPrevistoDevolucao: "",
            valorDiaria: "" as unknown as number,
            idEquipamento: "" as unknown as number,
            idCliente: "" as unknown as number,
        },
    });

    const handleClose = () => {
        reset();
        setServerError("");
        onClose();
    };

    const handleEquipamentoChange = (equipamentoId: number) => {
        const eq = equipamentos.find((item) => item.id === equipamentoId);
        if (eq && eq.valorDiaria) {
            setValue("valorDiaria", eq.valorDiaria, { shouldValidate: true });
        }
    };

    const onSubmit = async (values: AluguelFormData) => {
        setServerError("");

        const payload = {
            nroAluguel: values.nroAluguel.trim(),
            dataPedido: values.dataPedido,
            dataInicioLocacao: values.dataInicioLocacao,
            dataPrevistoDevolucao: values.dataPrevistoDevolucao,
            valorDiaria: Number(values.valorDiaria),
            equipamento: {
                id: Number(values.idEquipamento),
            },
            cliente: {
                id: Number(values.idCliente),
            },
        };

        try {
            try {
                await api.post("/pedido-aluguel-equipamento/cadastrar", payload);
            } catch (postErr: unknown) {
                const status = (postErr as { response?: { status?: number } })?.response?.status;
                if (status === 404) {
                    await api.post("/pedido-aluguel-equipamento", payload);
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
                      "Erro ao cadastrar aluguel no servidor.";
            setServerError(message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cadastrar Novo Aluguel</DialogTitle>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent dividers>
                    <Stack spacing={2.5}>
                        {serverError && <Alert severity="error">{serverError}</Alert>}

                        <Controller
                            name="nroAluguel"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Número do Aluguel"
                                    size="small"
                                    required
                                    fullWidth
                                    placeholder="Ex: ALG-2026-0007"
                                    error={Boolean(errors.nroAluguel)}
                                    helperText={errors.nroAluguel?.message}
                                />
                            )}
                        />

                        <Controller
                            name="idCliente"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idCliente)}
                                >
                                    <InputLabel id="cliente-label">Cliente</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="cliente-label"
                                        label="Cliente"
                                    >
                                        {clientes.map((c) => {
                                            const nome =
                                                c.nome ||
                                                c.nomeSocial ||
                                                [c.primeiroNome, c.sobreNome].filter(Boolean).join(" ");
                                            return (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {nome} {c.cpf ? `— CPF: ${c.cpf}` : ""}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    {errors.idCliente && (
                                        <FormHelperText>{errors.idCliente.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="idEquipamento"
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    size="small"
                                    required
                                    fullWidth
                                    error={Boolean(errors.idEquipamento)}
                                >
                                    <InputLabel id="equipamento-label">Equipamento</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="equipamento-label"
                                        label="Equipamento"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleEquipamentoChange(Number(e.target.value));
                                        }}
                                    >
                                        {equipamentos.map((eq) => (
                                            <MenuItem key={eq.id} value={eq.id}>
                                                {eq.nome} (R$ {Number(eq.valorDiaria).toFixed(2)}/dia)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.idEquipamento && (
                                        <FormHelperText>{errors.idEquipamento.message}</FormHelperText>
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

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="dataPedido"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Data do Pedido"
                                            type="date"
                                            size="small"
                                            required
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            error={Boolean(errors.dataPedido)}
                                            helperText={errors.dataPedido?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="dataInicioLocacao"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Início Locação"
                                            type="date"
                                            size="small"
                                            required
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            error={Boolean(errors.dataInicioLocacao)}
                                            helperText={errors.dataInicioLocacao?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Controller
                                    name="dataPrevistoDevolucao"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Previsão Devolução"
                                            type="date"
                                            size="small"
                                            required
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            error={Boolean(errors.dataPrevistoDevolucao)}
                                            helperText={errors.dataPrevistoDevolucao?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Cadastrando..." : "Cadastrar Aluguel"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateAluguelDialog;
