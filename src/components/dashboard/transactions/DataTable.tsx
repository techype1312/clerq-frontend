"use client";

import {
  ColumnDef,
  ColumnFilter,
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
import { Fragment, useState } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showDownloadButton?: boolean;
  showUploadButton?: boolean;
  showHeader?: boolean;
  showPagination?: boolean;
  onUpload?: () => void;
}
// import {
//   parseISO,
//   isSameMonth,
//   subMonths,
//   startOfMonth,
//   endOfMonth,
// } from "date-fns";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Filters from "./Filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverPortal } from "@radix-ui/react-popover";
import { labelValue, textType } from "@/types/general";
import { formatFilterId } from "@/utils/utils";

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
  onUpload,
  showDownloadButton = true,
  showUploadButton = false,
  showHeader = true,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterValue, setFilterValue] = useState<string[]>([]);

  const exportExcel = (rows: any) => {
    // const rowData = rows.map((row: any) => row.original);
    const rowData = rows.map((row: any) => {
      // Extract desired data from row.original
      console.log(row.original);
      const {
        date,
        merchant_name,
        amount,
        category,
        clerq_category,
        gl_code,
        receipt,
      } = row.original;
      const Category = category.join(", ");
      return {
        date,
        mask: row.original.account.mask,
        merchant_name,
        amount,
        Category,
        clerq_category,
        gl_code,
        receipt,
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
  const [openedFilter, setOpenedFilter] = useState<string>("clerq_category");
  const [filterCategories, setFilterCategories] = useState<labelValue[]>([
    {
      label: "Date",
      value: "date",
    },
    {
      label: "Clerq Category",
      value: "clerq_category",
    },
    {
      label: "GL Code",
      value: "gl_code",
    },
  ]);
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-8 gap-2 px-2 flex items-center">
                <span className="-mb-1">
                  <SymbolIcon icon="filter_list" color={"#9D9DA7"} />
                </span>
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              style={{
                width: "480px",
              }}
              align="start"
            >
              <h6>Filters</h6>
              <DropdownMenuSeparator />
              <div className="flex">
                <div className="flex flex-col gap-2 text-left  border-r">
                  {filterCategories.map((category, index) => {
                    // let hover;
                    // if (openedFilter === category.value) hover = true;
                    return (
                      <Button
                        variant={"ghost"}
                        key={index}
                        onClick={() => {
                          setOpenedFilter(category.value);
                        }}
                        className={`${
                          openedFilter === category.value
                            ? "text-primary bg-muted"
                            : " text-label hover:text-label"
                        } justify-between`}
                        // onMouseEnter={() => {
                        //   console.log("hover");
                        //   hover = true;
                        // }}
                        // onMouseLeave={() => {
                        //   console.log("hover");
                        //   if (openedFilter !== category.value) hover = false;
                        // }}
                      >
                        {category.label}{" "}
                        <SymbolIcon icon="arrow_right" color={"#1e1e2a"} />
                      </Button>
                    );
                  })}
                </div>
                <div className="w-42 h-64 overflow-x-scroll">
                  <Filters
                    openedFilter={openedFilter}
                    setColumnFilters={setColumnFilters}
                    columnFilters={columnFilters}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* <DropdownMenuItem onClick={() => {}}>
                  Advertising
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (filterValue.length === 0) {
                      setFilterValue(["400 - Inventory"]);
                      setColumnFilters([
                        { id: "gl_code", value: "400 - Inventory" },
                      ]);
                    } else {
                      setFilterValue([...filterValue, "400 - Inventory"]);
                      setColumnFilters([
                        { id: "gl_code", value: "400 - Inventory" },
                      ]);
                    }
                  }}
                >
                  Inventory
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (filterValue.length === 0) {
                      setFilterValue(["230 - Electric Bills"]);
                    } else {
                      setFilterValue([...filterValue, "230 - Electric Bills"]);
                      setColumnFilters([{ id: "gl_code", value: filterValue }]);
                    }
                  }}
                >
                  Electric Bills
                </DropdownMenuItem> */}
          {/* </DropdownMenuGroup> */}
          <div className="flex gap-2">
            {columnFilters.map((filter: any, index: number) => (
              <div
                className="h-8 bg-muted flex gap-2 w-fit px-2 items-center justify-center rounded-md text-sm text-nowrap"
                key={index}
              >
                <p className="text-primary-alt">
                  {filter?.value.length > 1
                    ? formatFilterId(filter?.id) + ` (${filter?.value.length})`
                    : filter?.value}
                </p>
                <p
                  className="cursor-pointer h-5"
                  onClick={() => {
                    setColumnFilters(
                      columnFilters.filter((val) => val.id !== filter.id)
                    );
                  }}
                >
                  <SymbolIcon icon="close" color="#535460" size={20} />
                </p>
              </div>
            ))}
            {columnFilters.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setColumnFilters([]);
                }}
                className="h-8"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          {showPagination && (
            <Fragment>
              <div>
                <span className="text-muted">
                  {pagination.pageSize * pagination.pageIndex + 1}-
                  {pagination.pageSize * (pagination.pageIndex + 1) <
                  data.length
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
            </Fragment>
          )}
          {showDownloadButton && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => exportExcel(table.getFilteredRowModel().rows)}
            >
              <SymbolIcon icon="download" />
              Download
            </Button>
          )}
          {showUploadButton && (
            <Button
              type="button"
              variant="ghost"
              onClick={onUpload}
              className="p-1"
            >
              <SymbolIcon icon="upload" />
              Upload
            </Button>
          )}
        </div>
      </div>
      <Table className="overflow-x-scroll">
        {showHeader && (
          <TableHeader className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[#757575] px-0">
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
        )}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b"
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-0 py-3 text-nowrap">
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
