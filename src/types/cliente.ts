import type { Email } from "./email";
import type { Endereco } from "./endereco";
import type { Telefone } from "./telefone";

export type EnderecoResidencial = {
    endereco: Endereco;
    nroCasa: number;
    complemento?: string;
};

export type Cliente = {
    id: number | string;
    nome: string;
    nomeSocial: string;
    enderecoResidencial: EnderecoResidencial;
    fones: Telefone[];
    emails: Email[];
    cpf: string;
    primeiroNome: string;
    sobreNome: string;
};
