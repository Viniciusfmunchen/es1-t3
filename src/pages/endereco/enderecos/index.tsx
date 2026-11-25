import { Stack } from "@mui/material";
import { useState } from "react";
import ExternalAddressSearchCard from "../../../components/address/external-search-card";
import CreateAddressDialog from "../../../components/address/form";
import AddressTable from "../../../components/address/table";
import PageLayout from "../../../layouts/page";

const PaginaEnderecos = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageLayout
            title="Endereços"
            addButtonLabel="Novo Endereço"
            onAdd={() => setIsCreateOpen(true)}
        >
            <Stack spacing={2} sx={{ width: "100%", height: "100%" }}>
                <ExternalAddressSearchCard />
                <AddressTable refreshKey={refreshKey} />
                <CreateAddressDialog
                    open={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={() => {
                        setIsCreateOpen(false);
                        setRefreshKey((k) => k + 1);
                    }}
                />
            </Stack>
        </PageLayout>
    );
};

export default PaginaEnderecos;
