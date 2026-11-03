import { Typography } from "@mui/material"
import AddressTable from "../../components/address/table"

const AddressesPage = () => {
    return (
        <>
            <Typography variant="h1" component="h1">Endereços</Typography>
            <AddressTable />
        </>
    )
}

export default AddressesPage