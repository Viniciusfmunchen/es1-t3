import type { UnidadeFederativa } from "./unidade-federativa";

export type Cidade = {
    idCidade: number;
    nomeCidade: string;
    unidadeFederativa: UnidadeFederativa;
}