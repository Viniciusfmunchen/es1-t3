import type { Cliente } from "./cliente";
import type { Equipamento } from "./equipamento";

export type Aluguel = {
    id: number;
    nroAluguel: string;
    dataPedido: string;
    dataInicioLocacao: string;
    dataPrevistoDevolucao: string;
    valorDiaria: number;
    valorLocacao: number;
    equipamento: Equipamento;
    cliente: Cliente;
};
