export type TipoLogradouro = {
    siglaLogradouro?: string | number;
    nomeLogradouro?: string;
};

export type Logradouro = {
    idLogradouro: number;
    nomeLogradouro: string;
    tipoLogradouro?: TipoLogradouro | string;
};
