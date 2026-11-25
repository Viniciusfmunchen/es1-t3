import type { TipoEquipamento } from "./tipo-equipamento";

export type Equipamento = {
    id: number;
    nome: string;
    valorDiaria: number;
    tipoEquipamento: TipoEquipamento;
};
