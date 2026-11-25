import { useState } from "react";
import CreateAluguelDialog from "../../components/aluguel/form";
import TabelaAlugueis from "../../components/aluguel/tabela";
import PageLayout from "../../layouts/page";

const PaginaAlugueis = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageLayout
            title="Aluguéis"
            addButtonLabel="Novo Aluguel"
            onAdd={() => setIsCreateOpen(true)}
        >
            <TabelaAlugueis refreshKey={refreshKey} />
            <CreateAluguelDialog
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

export default PaginaAlugueis;
