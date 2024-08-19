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
import { Fragment, useEffect, useState } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showDownloadButton?: boolean;
  showUploadButton?: boolean;
  showHeader?: boolean;
  showPagination?: boolean;
  showFilter?: boolean;
  onUpload?: () => void;
  setTransactions?: any;
  setLoading?: any;
  accounts?: any;
  currentUcrm?: any;
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
import { labelValue } from "@/types/general";
import { formatFilterId } from "@/utils/utils";
import BankingApis from "@/actions/apis/BankingApis";

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
  showFilter = false,
  showDownloadButton = true,
  showUploadButton = false,
  showHeader = true,
  showPagination = true,
  setTransactions,
  setLoading,
  accounts,
  currentUcrm,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const exportExcel = (rows: any) => {
    // const rowData = rows.map((row: any) => row.original);
    const rowData = rows.map((row: any) => {
      // Extract desired data from row.original
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
    // getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    // onPaginationChange: setPagination,
    state: {
      // pagination,
      sorting,
      columnFilters,
    },
  });
  const [openedFilter, setOpenedFilter] = useState<string>("category");
  const [filterCategories, setFilterCategories] = useState<labelValue[]>([
    {
      label: "Date",
      value: "date",
    },
    // {
    //   label: "Clerq Category",
    //   value: "clerq_category",
    // },
    {
      label: "Category",
      value: "category",
    },
    {
      label: "Sub Categories",
      value: "sub_categories",
    },
    {
      label: "GL Code",
      value: "gl_code",
    },
    {
      label: "Amount Range",
      value: "amount",
    },
  ]);
  const [dateFilter, setDateFilter] = useState<any>();
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [pagesVisited, setPagesVisited] = useState<number[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<any[]>([]);
  const [amountFilter, setAmountFilter] = useState<any>();
  const fetchTransactions = async () => {
    setLoading(true);
    if (accounts.length === 0) return;
    let response;
    if (!pagesVisited.includes(pagination.pageIndex) || filtersChanged) {
      response = await BankingApis.getBankTransactions(
        currentUcrm?.company?.id,
        {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          sort: sorting.map((sort) => {
            return {
              order: sort.desc ? "DESC" : "ASC",
              orderBy: sort.id,
            };
          }),
          filters:
            columnFilters &&
            columnFilters.map((filter) => {
              return {
                id: filter.id,
                value: filter.value,
              };
            }),
          dateFilter: dateFilter && dateFilter.value,
          amountFilter: amountFilter && amountFilter,
        }
      );
    } else {
      response = true;
    }
    if (response) {
      if (filtersChanged || !pagesVisited.includes(pagination.pageIndex)) {
        setTransactions(
          response.data?.data.map((transaction: any, index: number) => {
            return {
              ...transaction,
              date: transaction.createdAt,
              merchant: {
                merchant_name: transaction.merchant_name,
                merchant_logo: transaction.merchant_logo_url,
              },
              // gl_code: index === 0 ? "400 - Inventory" : "230 - Electric Bills",
              // clerq_category: index === 0 ? "Cleaning" : "Advertising",
              account: accounts?.filter(
                (account: any) => account.id === transaction.account.id
              )[0],
            };
          })
        );
      } else {
        setTransactions(historyTransactions[pagination.pageIndex - 1]);
      }
      if (filtersChanged) {
        setHistoryTransactions([
          response.data?.data.map((transaction: any, index: number) => {
            return {
              ...transaction,
              date: transaction.createdAt,
              merchant: {
                merchant_name: transaction.merchant_name,
                merchant_logo: transaction.merchant_logo_url,
              },
              account: accounts?.filter(
                (account: any) => account.id === transaction.account.id
              )[0],
            };
          }),
        ]);
      } else if (!pagesVisited.includes(pagination.pageIndex)) {
        setHistoryTransactions([
          ...historyTransactions,
          response.data?.data.map((transaction: any, index: number) => {
            return {
              ...transaction,
              date: transaction.createdAt,
              merchant: {
                merchant_name: transaction.merchant_name,
                merchant_logo: transaction.merchant_logo_url,
              },
              account: accounts?.filter(
                (account: any) => account.id === transaction.account.id
              )[0],
            };
          }),
        ]);
        setPagesVisited([...pagesVisited, pagination.pageIndex]);
      }
      //Once we have total length of data, we can calculate if there are more pages
      setHasNextPage(
        response?.data?.hasNextPage ??
          pagesVisited.includes(pagination.pageIndex + 1)
      );
      setLoading(false);
    }
    setFiltersChanged(false);
  };

  const [oldSorting, setOldSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (currentUcrm?.company?.id) fetchTransactions();
  }, [pagination.pageIndex]);

  useEffect(() => {
    if (data.length === 0 && currentUcrm?.company?.id) fetchTransactions();
  }, []);

  useEffect(() => {
    if (sorting !== oldSorting && currentUcrm?.company?.id && accounts) {
      setOldSorting(sorting);
      setFiltersChanged(true);
      setPagesVisited([]);
    } else if (columnFilters.length > 0) {
      setFiltersChanged(true);
      setPagesVisited([]);
    }
  }, [sorting, columnFilters]);

  useEffect(() => {
    if (filtersChanged && currentUcrm?.company?.id && accounts) {
      fetchTransactions();
    }
  }, [filtersChanged]);

  useEffect(() => {
    setFiltersChanged(true);
    setPagesVisited([]);
  }, [dateFilter]);
  useEffect(() => {
    setFiltersChanged(true);
    setPagesVisited([]);
  }, [amountFilter]);

  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2">
          <Popover>
            {showFilter && (
              <PopoverTrigger asChild>
                <Button className="h-8 gap-2 px-2 flex items-center">
                  <span className="-mb-1">
                    <SymbolIcon icon="filter_list" color={"#9D9DA7"} />
                  </span>
                  <span>Filter</span>
                </Button>
              </PopoverTrigger>
            )}
            <PopoverContent
              style={{
                width: "580px",
                height: "100%",
              }}
              align="start"
            >
              <h6>Filters</h6>
              <DropdownMenuSeparator />
              <div className="flex">
                <div className="flex flex-col gap-2 text-left border-r">
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
                      >
                        {category.label}{" "}
                        <SymbolIcon icon="arrow_right" color={"#1e1e2a"} />
                      </Button>
                    );
                  })}
                </div>
                <div className="w-[100%] overflow-x-scroll">
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
          <div className="flex gap-2">
            {columnFilters.map((filter: any, index: number) => {
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
                <p className="text-primary-alt">
                  {dateFilter.label}
                  {/* {Array.isArray(filter?.value)
                      ? filter?.value.length > 1
                      ? formatFilterId(filter?.id) +
                      ` (${filter?.value.length})`
                      : filter?.value
                      : (filter.id === "amount" ? "$" : "") +
                      " " +
                      filter?.value} */}
                </p>
                <p
                  className="cursor-pointer h-5"
                  onClick={() => {
                    setDateFilter({});
                  }}
                >
                  <SymbolIcon icon="close" color="#535460" size={20} />
                </p>
              </div>
            )}
            {amountFilter && amountFilter?.value && (
              <div className="h-8 bg-muted flex gap-2 w-fit px-2 items-center justify-center rounded-md text-sm text-nowrap">
                <p className="text-primary-alt">
                  ${amountFilter?.value}
                  {/* {Array.isArray(filter?.value)
                      ? filter?.value.length > 1
                      ? formatFilterId(filter?.id) +
                      ` (${filter?.value.length})`
                      : filter?.value
                      : (filter.id === "amount" ? "$" : "") +
                      " " +
                      filter?.value} */}
                </p>
                <p
                  className="cursor-pointer h-5"
                  onClick={() => {
                    setAmountFilter({});
                  }}
                >
                  <SymbolIcon icon="close" color="#535460" size={20} />
                </p>
              </div>
            )}
            {(columnFilters.length > 0 || dateFilter?.value || amountFilter?.value) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setColumnFilters([]);
                  setDateFilter({});
                  setAmountFilter({});
                }}
                className="h-8"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          {showPagination && (
            <Fragment>
              <div>
                <span className="text-muted">
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
              Upload New
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
