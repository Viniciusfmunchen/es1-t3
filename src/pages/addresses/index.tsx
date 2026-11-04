import AddressTable from "../../components/address/table";
import ExternalAddressSearchCard from "../../components/address/external-search-card";
import PageLayout from "../../layouts/page";

const AddressesPage = () => {
    return (
        <PageLayout title="Endereços">
            <ExternalAddressSearchCard />
            <AddressTable />
        </PageLayout>
    );
};

export default AddressesPage;

