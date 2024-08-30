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
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Fragment, useEffect, useState } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Filters from "./Filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LabelValue } from "@/types/general";
import { formatFilterId } from "@/utils/utils";
import TransactionSkeleton from "@/components/skeletons/dashboard/TransactionSkeleton";
import DocumentSkeleton from "@/components/skeletons/dashboard/DocumentSkeleton";
import TeamSkeleton from "@/components/skeletons/dashboard/TeamSkeleton";
import SecuritySkeleton from "@/components/skeletons/dashboard/SecuritySkeleton";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  filename: "my-table-data",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

type pagination = {
  pageIndex: number;
  pageSize: number;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  showDownloadButton?: boolean;
  showUploadButton?: boolean;
  showHeader?: boolean;
  showPagination?: boolean;
  showFilter?: boolean;
  onUpload?: () => void;
  showDownload?: boolean;
  type?: string;
  filtersCategory?: LabelValue[];
  hasNextPage?: boolean;
  pagination?: pagination;
  setPagination?: React.Dispatch<React.SetStateAction<pagination>>;
  sorting?: SortingState;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  dateFilter?: any;
  setDateFilter?: React.Dispatch<React.SetStateAction<any>>;
  amountFilter?: any;
  setAmountFilter?: React.Dispatch<React.SetStateAction<any>>;
  defaultOpenedFilter?: string;
}

const filterCategories = [
  {
    label: "Date",
    value: "date",
  },
  // {
  //   label: "Otto Category",
  //   value: "ottocategory",
  // },
  {
    label: "Category",
    value: "category",
  },
  {
    label: "Sub Categories",
    value: "sub_categories",
  },
  // {
  //   label: "GL Code",
  //   value: "glCode",
  // },
  {
    label: "Amount Range",
    value: "amount",
  },
];

const defaultPagination = {
  pageIndex: 1,
  pageSize: 10,
};

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  onUpload,
  showFilter = false,
  showDownloadButton = true,
  showUploadButton = false,
  showHeader = true,
  showPagination = true,
  showDownload = true,
  type,
  filtersCategory = filterCategories,
  hasNextPage = false,
  pagination = defaultPagination,
  setPagination,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  dateFilter,
  setDateFilter,
  amountFilter,
  setAmountFilter,
  defaultOpenedFilter = "category",
}: DataTableProps<TData, TValue>) {
  const [openedFilter, setOpenedFilter] = useState<string>(defaultOpenedFilter);

  const exportExcel = (rows: any) => {
    // const rowData = rows.map((row: any) => row.original);
    const rowData = rows.map((row: any) => {
      // Extract desired data from row.original
      const {
        date,
        merchant_name,
        amount,
        category,
        ottoCategory,
        gl_code,
        receipt,
      } = row.original;
      // const Category = category?.join(", ");
      return {
        date,
        mask: row.original.account.mask,
        merchant_name,
        amount,
        category,
        ottoCategory,
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
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-4 md:gap-0 w-full">
        <div className="flex flex-row max-md:flex-nowrap gap-2 w-full">
          <div className="flex items-center justify-between gap-2 max-md:w-full">
            <Popover>
              {showFilter && (
                <PopoverTrigger asChild>
                  <Button className="h-8 gap-2 px-2 flex items-center">
                    <span className="-mb-1">
                      <SymbolIcon icon="filter_list" color={"#9D9DA7"} />
                    </span>
                    {(columnFilters && columnFilters.length > 0) ||
                    dateFilter?.value ||
                    amountFilter?.value ? (
                      <span>Filter applied</span>
                    ) : (
                      <span>Filter</span>
                    )}
                  </Button>
                </PopoverTrigger>
              )}
              <PopoverContent align="start" className="h-full w-max">
                <h6>Filters</h6>
                <DropdownMenuSeparator />
                <div className="flex">
                  <div className="flex flex-col gap-2 text-left border-r">
                    {filtersCategory.map((category, index) => {
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
                          } justify-between min-w-36`}
                        >
                          {category.label}{" "}
                          <SymbolIcon icon="arrow_right" color={"#1e1e2a"} />
                        </Button>
                      );
                    })}
                  </div>
                  <div className="min-w-40 max-w-lg overflow-x-scroll">
                    <Filters
                      openedFilter={openedFilter}
                      setColumnFilters={setColumnFilters}
                      columnFilters={columnFilters}
                      setDateFilter={setDateFilter}
                      dateFilter={dateFilter}
                      setAmountFilter={setAmountFilter}
                      amountFilter={amountFilter}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center justify-end ml-auto md:mx-0 w-full md:hidden">
              {showPagination && (
                <Fragment>
                  <div>
                    <span className="text-muted text-nowrap">
                      {pagination.pageSize * (pagination.pageIndex - 1) + 1}-
                      {pagination.pageSize * pagination.pageIndex < data?.length
                        ? pagination.pageSize * pagination.pageIndex
                        : data?.length}{" "}
                      of {data?.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="py-0"
                    onClick={() =>
                      pagination.pageIndex > 1 &&
                      setPagination &&
                      setPagination({
                        ...pagination,
                        pageIndex: pagination.pageIndex - 1,
                      })
                    }
                    disabled={pagination.pageIndex === 1}
                  >
                    <SymbolIcon icon="chevron_left" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="py-0"
                    onClick={() =>
                      setPagination &&
                      setPagination((prev) => ({
                        ...prev,
                        pageIndex: pagination.pageIndex + 1,
                      }))
                    }
                    disabled={!hasNextPage}
                  >
                    <SymbolIcon icon="chevron_right" />
                  </Button>
                </Fragment>
              )}
              <Fragment>
                {showDownloadButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      exportExcel(table.getFilteredRowModel().rows)
                    }
                    className="max-md:hidden gap-2"
                  >
                    <SymbolIcon icon="download" />
                    Download
                  </Button>
                )}
                {showDownload && (
                  <Popover>
                    <PopoverTrigger asChild className="md:hidden">
                      <Button type="button" variant="ghost" className="p-0">
                        <SymbolIcon icon="more_vert" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1" align="end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          exportExcel(table.getFilteredRowModel().rows)
                        }
                        className="p-1 gap-2"
                      >
                        <SymbolIcon icon="download" />
                        Download
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </Fragment>

              {showUploadButton && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onUpload}
                  className="p-1"
                >
                  <SymbolIcon icon="upload" />
                  Upload New
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-2 max-md:hidden">
            {columnFilters &&
              columnFilters.map((filter: any, index: number) => {
                return (
                  <div
                    className="h-8 bg-muted flex gap-2 w-fit px-2 items-center justify-center rounded-md text-sm text-nowrap"
                    key={index}
                  >
                    <p className="text-primary-alt">
                      {Array.isArray(filter?.value)
                        ? filter?.value.length > 1
                          ? formatFilterId(filter?.id) +
                            ` (${filter?.value.length})`
                          : filter?.value
                        : (filter.id === "amount" ? "$" : "") +
                          " " +
                          filter?.value}
                    </p>
                    <p
                      className="cursor-pointer h-5"
                      onClick={() => {
                        setColumnFilters &&
                          setColumnFilters(
                            columnFilters.filter((val) => val.id !== filter.id)
                          );
                      }}
                    >
                      <SymbolIcon icon="close" color="#535460" size={20} />
                    </p>
                  </div>
                );
              })}
            {dateFilter && dateFilter?.value && (
              <div className="h-8 bg-muted flex gap-2 w-fit px-2 items-center justify-center rounded-md text-sm text-nowrap">
                <p className="text-primary-alt">{dateFilter.label}</p>
                <p
                  className="cursor-pointer h-5"
                  onClick={() => {
                    setDateFilter && setDateFilter({});
                  }}
                >
                  <SymbolIcon icon="close" color="#535460" size={20} />
                </p>
              </div>
            )}
            {amountFilter && amountFilter?.value && (
              <div className="h-8 bg-muted flex gap-2 w-fit px-2 items-center justify-center rounded-md text-sm text-nowrap">
                <p className="text-primary-alt">${amountFilter?.value}</p>
                <p
                  className="cursor-pointer h-5"
                  onClick={() => {
                    setAmountFilter && setAmountFilter({});
                  }}
                >
                  <SymbolIcon icon="close" color="#535460" size={20} />
                </p>
              </div>
            )}
            {((columnFilters && columnFilters.length > 0) ||
              dateFilter?.value ||
              amountFilter?.value) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setColumnFilters && setColumnFilters([]);
                  setDateFilter && setDateFilter({});
                  setAmountFilter && setAmountFilter({});
                }}
                className="h-8"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 mx-auto md:mx-0 max-md:hidden">
          {showPagination && (
            <Fragment>
              <div>
                <span className="text-muted text-nowrap">
                  {pagination.pageSize * (pagination.pageIndex - 1) + 1}-
                  {pagination.pageSize * pagination.pageIndex < data?.length
                    ? pagination.pageSize * pagination.pageIndex
                    : data?.length}{" "}
                  of {data?.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="py-0"
                onClick={() =>
                  pagination.pageIndex > 1 &&
                  setPagination &&
                  setPagination({
                    ...pagination,
                    pageIndex: pagination.pageIndex - 1,
                  })
                }
                disabled={pagination.pageIndex === 1}
              >
                <SymbolIcon icon="chevron_left" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="py-0"
                onClick={() =>
                  setPagination &&
                  setPagination((prev) => ({
                    ...prev,
                    pageIndex: pagination.pageIndex + 1,
                  }))
                }
                disabled={!hasNextPage}
              >
                <SymbolIcon icon="chevron_right" />
              </Button>
            </Fragment>
          )}
          <Fragment>
            {showDownloadButton && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => exportExcel(table.getFilteredRowModel().rows)}
                className="max-md:hidden gap-2"
              >
                <SymbolIcon icon="download" />
                Download
              </Button>
            )}
            {showDownload && (
              <Popover>
                <PopoverTrigger asChild className="md:hidden">
                  <Button type="button" variant="ghost" className="p-0">
                    <SymbolIcon icon="more_vert" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-1" align="end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      exportExcel(table.getFilteredRowModel().rows)
                    }
                    className="p-1 flex justify-start w-full text-left gap-2"
                  >
                    <SymbolIcon icon="download" />
                    Download
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </Fragment>
          {showUploadButton && (
            <Button
              type="button"
              variant="ghost"
              onClick={onUpload}
              className="p-1"
            >
              <SymbolIcon icon="upload" />
              Upload New
            </Button>
          )}
        </div>
      </div>
      <Table className="overflow-x-scroll border-spacing-4">
        {showHeader && (
          <TableHeader className="border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[#757575] md:px-0 text-nowrap"
                    >
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
        {loading ? (
          <>
            {type === "document" && <DocumentSkeleton />}
            {type === "transaction" && <TransactionSkeleton />}
            {type === "team" && <TeamSkeleton />}
            {type === "security" && <SecuritySkeleton />}
          </>
        ) : (
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="md:px-0 p-3 text-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </>
  );
}
