import { Grid } from "@mui/material";
import TabelaDDD from "../../components/telefone/tabela-ddd";
import TabelaDDI from "../../components/telefone/tabela-ddi";
import PageLayout from "../../layouts/page";

const PaginaTelefones = () => {
    return (
        <PageLayout title="Telefones">
            <Grid container spacing={2.5} sx={{ height: "100%", width: "100%" }}>
                <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                    <TabelaDDI />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} sx={{ height: "100%" }}>
                    <TabelaDDD />
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default PaginaTelefones;
