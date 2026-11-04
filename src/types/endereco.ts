import type { Bairro } from "./bairro";
import type { Cidade } from "./cidade";
import type { Logradouro } from "./logradouro";

export type Endereco = {
    idEndereco: number;
    cep: string;
    cidade: Cidade;
    bairro: Bairro;
    logradouro: Logradouro;
}