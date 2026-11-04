import {
    DataGrid,
    type DataGridProps,
    type GridColDef,
    type GridValidRowModel,
} from "@mui/x-data-grid";
import { useMemo } from "react";

export interface TableProps<T extends GridValidRowModel>
    extends Omit<DataGridProps<T>, "rows" | "columns"> {
    columns: GridColDef<T>[];
    data: T[];
}

const Table = <T extends GridValidRowModel>({
    columns,
    data,
    hideFooter = true,
    disableColumnMenu = true,
    disableColumnSorting = true,
    disableColumnFilter = true,
    disableColumnResize = true,
    disableColumnSelector = true,
    ...rest
}: TableProps<T>) => {
    const computedColumns = useMemo(
        () =>
            columns.map((col) => {
                if (col.width === undefined && col.flex === undefined) {
                    return { flex: 1, ...col };
                }
                return col;
            }),
        [columns]
    );

    return (
        <DataGrid
            rows={data}
            columns={computedColumns}
            hideFooter={hideFooter}
            disableColumnMenu={disableColumnMenu}
            disableColumnSorting={disableColumnSorting}
            disableColumnFilter={disableColumnFilter}
            disableColumnResize={disableColumnResize}
            disableColumnSelector={disableColumnSelector}
            {...rest}
        />
    );
};

export default Table;

