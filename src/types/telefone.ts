export type DDI = {
    id: number;
    codigo: string;
    nomePais?: string;
    pais?: string;
};

export type DDD = {
    id: number;
    codigo: string;
    regiao?: string;
    estado?: string;
};

export type Telefone = {
    numero: string;
    ddd: DDD;
    ddi: DDI;
};
