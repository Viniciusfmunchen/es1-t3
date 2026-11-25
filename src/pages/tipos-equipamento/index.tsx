import { useState } from "react";
import CreateTipoEquipamentoDialog from "../../components/tipo-equipamento/form";
import TabelaTiposEquipamento from "../../components/tipo-equipamento/tabela";
import PageLayout from "../../layouts/page";

const PaginaTiposEquipamento = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageLayout
            title="Tipos de Equipamento"
            addButtonLabel="Novo Tipo"
            onAdd={() => setIsCreateOpen(true)}
        >
            <TabelaTiposEquipamento refreshKey={refreshKey} />
            <CreateTipoEquipamentoDialog
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

export default PaginaTiposEquipamento;
