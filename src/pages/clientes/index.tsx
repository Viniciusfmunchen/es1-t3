import { useState } from "react";
import CreateClienteDialog from "../../components/cliente/form";
import TabelaClientes from "../../components/cliente/tabela";
import PageLayout from "../../layouts/page";

const PaginaClientes = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageLayout
            title="Clientes"
            addButtonLabel="Novo Cliente"
            onAdd={() => setIsCreateOpen(true)}
        >
            <TabelaClientes refreshKey={refreshKey} />
            <CreateClienteDialog
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    setRefreshKey((k) => k + 1);
                }}
            />
        </PageLayout>
    );
};

export default PaginaClientes;
