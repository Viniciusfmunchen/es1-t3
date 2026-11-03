import { DataGrid, type GridColDef } from "@mui/x-data-grid"


interface TableProps<T extends object> {
    columns: GridColDef<T>[]
    data: T[]
}

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
    return (
        <DataGrid
            rows={data}
            columns={columns}
            hideFooter
        />
    )
}

export default Table