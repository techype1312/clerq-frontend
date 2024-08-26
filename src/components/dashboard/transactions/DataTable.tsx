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
import { Fragment, useEffect, useState } from "react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { mkConfig, generateCsv, download } from "export-to-csv";
import Filters from "./Filters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ErrorProps } from "@/types/general";
import { formatFilterId } from "@/utils/utils";
import TransactionSkeleton from "@/components/skeletonLoading/dashboard/TransactionSkeleton";
import DocumentSkeleton from "@/components/skeletonLoading/dashboard/DocumentSkeleton";
import TeamSkeleton from "@/components/skeletonLoading/dashboard/TeamSkeleton";
import BankingApis from "@/actions/data/banking.data";
import isObject from "lodash/isObject";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  filename: "my-table-data",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

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
  setTransactions?: any;
  setLoading?: any;
  accounts?: any;
  currentUcrm?: any;
  showDownload?: boolean;
  type?: string;
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
  setTransactions,
  setLoading,
  accounts,
  currentUcrm,
  showDownload = true,
  type,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [openedFilter, setOpenedFilter] = useState<string>("category");
  const [dateFilter, setDateFilter] = useState<any>();
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [pagesVisited, setPagesVisited] = useState<number[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<any[]>([]);
  const [amountFilter, setAmountFilter] = useState<any>();
  const [oldSorting, setOldSorting] = useState<SortingState>([]);
  const [serverError, setServerError] = useState("");

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

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchTransactionsSuccess = (res: any) => {
    if (filtersChanged || !pagesVisited.includes(pagination.pageIndex)) {
      setTransactions(
        res.data?.map((transaction: any, index: number) => {
          return {
            ...transaction,
            date: transaction.createdAt,
            merchant: {
              merchant_name: transaction.merchant_name,
              merchant_logo: transaction.merchant_logo_url,
            },
            // glCode: index === 0 ? "400 - Inventory" : "230 - Electric Bills",
            // ottoCategory: index === 0 ? "Cleaning" : "Advertising",
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
        res.data?.map((transaction: any, index: number) => {
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
        res.data?.map((transaction: any, index: number) => {
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
      res.hasNextPage ?? pagesVisited.includes(pagination.pageIndex + 1)
    );
    setFiltersChanged(false);
    setLoading(false);
  };

  const handleFetchTransactions = () => {
    if (!accounts.length) return false;
    if (!pagesVisited.includes(pagination.pageIndex) || filtersChanged) {
      setLoading(true);
      return BankingApis.getBankTransactions(currentUcrm?.company?.id, {
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
      }).then(onFetchTransactionsSuccess, onError);
    }
  };

  useEffect(() => {
    if (!loading && currentUcrm?.company?.id) {
      handleFetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex]);

  useEffect(() => {
    if (data.length === 0 && currentUcrm?.company?.id) {
      handleFetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      sorting !== oldSorting &&
      currentUcrm?.company?.id &&
      accounts?.length
    ) {
      setOldSorting(sorting);
      setFiltersChanged(true);
      setPagesVisited([]);
    } else if (columnFilters.length > 0) {
      setFiltersChanged(true);
      setPagesVisited([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, columnFilters]);

  useEffect(() => {
    if (
      !loading &&
      filtersChanged &&
      currentUcrm?.company?.id &&
      accounts?.length
    ) {
      console.log("filtersChanged >>>>>");
      handleFetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    {columnFilters.length > 0 ||
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
                    {filterCategories.map((category, index) => {
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
                  <div className="max-w-lg overflow-x-scroll">
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
                <p className="text-primary-alt">{dateFilter.label}</p>
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
                <p className="text-primary-alt">${amountFilter?.value}</p>
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
            {(columnFilters.length > 0 ||
              dateFilter?.value ||
              amountFilter?.value) && (
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
