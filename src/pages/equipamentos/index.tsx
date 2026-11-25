import { useState } from "react";
import CreateEquipamentoDialog from "../../components/equipamento/form";
import TabelaEquipamentos from "../../components/equipamento/tabela";
import PageLayout from "../../layouts/page";

const PaginaEquipamentos = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageLayout
            title="Equipamentos"
            addButtonLabel="Novo Equipamento"
            onAdd={() => setIsCreateOpen(true)}
        >
            <TabelaEquipamentos refreshKey={refreshKey} />
            <CreateEquipamentoDialog
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

export default PaginaEquipamentos;
