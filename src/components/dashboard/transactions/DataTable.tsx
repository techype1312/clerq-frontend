"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
// import {
//   parseISO,
//   isSameMonth,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
// } from "date-fns";
import { mkConfig, generateCsv, download } from "export-to-csv";

// export const dateFilter = (row: any[], columnIds: (string | number)[], filterValue: string) => {
//   const currentDate = new Date();
//   let startDate, endDate;

//   if (filterValue === 'this_month') {
//     startDate = startOfMonth(currentDate);
//     endDate = endOfMonth(currentDate);
//   } else if (filterValue === 'last_month') {
//     const lastMonth = subMonths(currentDate, 1);
//     startDate = startOfMonth(lastMonth);
//     endDate = endOfMonth(lastMonth);
//   } else {
//     return row;
//   }

//   return row?.filter(row => {
//     const date = parseISO(row.original[columnIds[0]]);
//     return date >= startDate && date <= endDate;
//   });
// };
// const filterTypes = {
//     dateFilter
//   };

const csvConfig = mkConfig({
  fieldSeparator: ",",
  filename: "my-table-data",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const exportExcel = (rows: any) => {
    // const rowData = rows.map((row: any) => row.original);
    const rowData = rows.map((row: any) => {
      // Extract desired data from row.original
      console.log(row.original);
      const { date, merchant_name, amount, category, clerq_category, gl_code, receipt } =
        row.original;
        const Category = category.join(", ");
      return {
        date,
        mask: row.original.account.mask,
        merchant_name,
        amount,
        Category,
        clerq_category,
        gl_code,
        receipt
      };
    });
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 gap-2 px-2 flex items-center">
              <span className="-mb-1">
                <SymbolIcon icon="filter_list" color={"#9D9DA7"} />
              </span>
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem
                onClick={() => {
                  table.getColumn("date")?.setFilterValue("this_month");
                }}
              >
                Last month
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  table.getColumn("clerq_category")?.setFilterValue("Advertising");
                }}
              >
                Advertising
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  table.getColumn("gl_code")?.setFilterValue("400 - Inventory");
                }}
              >
                Inventory
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div>
            <span className="text-muted">
              {pagination.pageSize * pagination.pageIndex + 1}-
              {pagination.pageSize * (pagination.pageIndex + 1) < data.length
                ? pagination.pageSize * (pagination.pageIndex + 1)
                : data.length}{" "}
              of {data.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="py-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <SymbolIcon icon="chevron_left" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="py-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <SymbolIcon icon="chevron_right" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => exportExcel(table.getFilteredRowModel().rows)}
          >
            <SymbolIcon icon="download" />
          </Button>
        </div>
      </div>
      <Table className="overflow-x-scroll">
        <TableHeader className="border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-[#757575]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3 text-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
