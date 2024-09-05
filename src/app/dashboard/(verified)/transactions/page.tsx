"use client";

import { DataTable } from "@/components/common/table/DataTable";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import { Select, SelectContent } from "@/components/ui/select";
import { useCompanySessionContext } from "@/context/CompanySession";
import { useMainContext } from "@/context/Main";
import { cn } from "@/utils/utils";
import { SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBankAccountsContext } from "@/context/BankAccounts";
import { isObject } from "lodash";
import { ErrorProps } from "@/types/general";
import BankingApis from "@/actions/data/banking.data";

type merchant = {
  merchant_name: string;
  merchant_logo: string;
};

const glCodes = [
  "230 - Electric Bills",
  "120 - Accounts Receivable",
  "400 - Inventory",
  "440 - Raw Materials",
  "503 - Debt Service Prep",
  "620 - Entertainment",
  "664 - Utilities",
];

const categories = [
  "Advertising",
  "Bank Charges",
  "Business Meals",
  "Cleaning",
  "Consulting",
  "Dues & Subscriptions",
  "Education & Training",
  "Equipment",
  "Freight & Delivery",
  "Insurance",
  "Interest",
  "Legal & Professional Fees",
  "Maintenance & Repairs",
  "Meals & Entertainment",
  "Office Supplies",
  "Other",
  "Rent",
  "Salaries & Wages",
  "Taxes & Licenses",
  "Travel",
  "Utilities",
];

const getTableColumns = ({
  windowWidth,
  manageTransactions,
}: {
  windowWidth: number;
  manageTransactions: boolean;
}): ColumnDef<any>[] => {
  const dateCol: ColumnDef<any> = {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-right"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      return (
        <div className="text-muted text-sm">
          {format(cell.getValue() as string, "MMM d, yyyy")}
        </div>
      );
    },
  };

  const merchantCol: ColumnDef<any> = {
    accessorKey: "merchant",
    header: "Merchant",
    cell: ({ cell, row }) => {
      return (
        <div className="flex flex-row items-center gap-2 text-label text-base">
          <Fragment>
            {(cell.getValue() as merchant)?.merchant_logo ? (
              <Image
                width={28}
                height={28}
                src={(cell.getValue() as merchant)?.merchant_logo}
                alt={(cell.getValue() as merchant)?.merchant_name}
                className="rounded-full"
              />
            ) : (
              <div className="rounded-full h-7 w-7 bg-[#CCE8EA]" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {(cell.getValue() as merchant)?.merchant_name ?? "Unknown"}
              </span>

              <p className="flex flex-row text-[12px] leading-4 md:hidden">
                <span>{row.original.account?.name} ••</span>
                <span>{row.original.account?.mask}</span>
              </p>

              <span className="text-muted text-[10px] leading-4">
                {format(row.original.date, "MMM d, yyyy")}
              </span>
            </div>
          </Fragment>
        </div>
      );
    },
  };

  const accountCol: ColumnDef<any> = {
    accessorKey: "account",
    header: "Account",
    cell: ({ cell }) => {
      return (
        <div className="flex text-label text-xs gap-1 items-center">
          <SymbolIcon icon="account_balance" size={18} />
          <span className="text-sm">{(cell.getValue() as any)?.name} ••</span>
          <span>{(cell.getValue() as any)?.mask}</span>
        </div>
      );
    },
  };

  const amountCol: ColumnDef<any> = {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 w-full max-md:justify-end justify-start"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const isDebited =
        (cell.getValue() as number) && (cell.getValue() as number) < 0;
      return (
        <div
          className={cn("text-label text-base max-md:text-right", {
            ["text-[#036e43]"]: !isDebited,
          })}
        >
          {isDebited && "-"}${Math.abs(cell.getValue() as number)}
        </div>
      );
    },
  };

  const categoryCol: ColumnDef<any> = {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ cell }) => {
      return <span className="text-sm">{cell.getValue() as string}</span>;
    },
  };

  const ottoCategoryCol: ColumnDef<any> = {
    accessorKey: "ottoCategory",
    header: "Otto category",
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ cell }) => (
      <Select defaultValue={cell.getValue() as string}>
        <SelectTrigger className="flex h-5 w-full text-black">
          <SelectValue placeholder="select value">
            <div className="flex px-2 w-full justify-between border rounded-md">
              {cell.getValue() as string}
              <SymbolIcon icon="arrow_drop_down" />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="p-2 cursor-pointer">
          {categories.map((value, index) => (
            <SelectItem
              className="px-2 py-2 border-b"
              value={value ?? "undefined"}
              key={value + index}
            >
              {value ?? "Undefined value"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  };

  const glCodeCol: ColumnDef<any> = {
    accessorKey: "glCode",
    header: "GL code",
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ cell }) => (
      <Select defaultValue={cell.getValue() as string}>
        <SelectTrigger className="h-5 w-full text-black outline-none">
          <SelectValue placeholder="select value">
            <div className="flex px-2 w-full justify-between border rounded-md outline-none">
              {cell.getValue() as string}
              <SymbolIcon icon="arrow_drop_down" />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="p-2 cursor-pointer">
          {glCodes.map((value, index) => (
            <SelectItem
              className="px-2 py-2 border-b"
              value={value ?? "undefined"}
              key={value + index}
            >
              {value ?? "Undefined value"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  };

  const receiptCol: ColumnDef<any> = {
    accessorKey: "receipt",
    header: () => <span className="text-right block w-full">{"Receipt"}</span>,
    cell: ({ cell }) => (
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            if (cell.getValue()) {
              console.log("Receipt");
            } else {
              toast.error("No receipt available");
            }
          }}
          variant="ghost"
          className="text-label rounded-full p-0 h-8 w-8 bg-slate-100 hover:bg-slate-200"
        >
          {cell.getValue() ? (
            <SymbolIcon icon="receipt_long" size={24} />
          ) : (
            <SymbolIcon icon="add" size={24} />
          )}
        </Button>
      </div>
    ),
  };

  if (windowWidth < 576) {
    return [merchantCol, amountCol];
  }
  if (windowWidth < 768) {
    if (manageTransactions) {
      return [merchantCol, amountCol, receiptCol];
    } else {
      return [merchantCol, accountCol, amountCol];
    }
  }
  if (windowWidth < 1024) {
    if (manageTransactions) {
      return [merchantCol, accountCol, amountCol, receiptCol];
    } else {
      return [merchantCol, accountCol, amountCol, categoryCol];
    }
  }
  if (manageTransactions) {
    return [merchantCol, accountCol, amountCol, categoryCol, receiptCol];
  } else {
    return [merchantCol, accountCol, amountCol, categoryCol];
  }
};

const Page = () => {
  const { windowWidth } = useMainContext();
  const { bankAccountsData: accounts, loading: accountsLoading } =
    useBankAccountsContext();
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUcrm, permissions } = useCompanySessionContext();
  const [serverError, setServerError] = useState("");
  const [pagesVisited, setPagesVisited] = useState<number[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<any[]>([]);
  const [filtersChanged, setFiltersChanged] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [oldSorting, setOldSorting] = useState<SortingState>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dateFilter, setDateFilter] = useState<any>();
  const [amountFilter, setAmountFilter] = useState<any>();

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
    if (!accounts?.length || !currentUcrm?.company?.id) return false;
    if (!pagesVisited.includes(pagination.pageIndex) || filtersChanged) {
      setLoading(true);
      return BankingApis.getBankTransactions(currentUcrm.company.id, {
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
    if (
      !loading &&
      currentUcrm?.company?.id &&
      permissions?.routes?.transactions
    ) {
      handleFetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex]);

  useEffect(() => {
    if (
      transactions.length === 0 &&
      currentUcrm?.company?.id &&
      accounts &&
      permissions?.routes?.transactions
    ) {
      handleFetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id, accounts]);

  useEffect(() => {
    if (
      sorting !== oldSorting &&
      currentUcrm?.company?.id &&
      accounts?.length &&
      permissions?.routes?.transactions
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
      accounts?.length &&
      permissions?.routes?.transactions
    ) {
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
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <h1 className="text-primary text-2xl font-medium ml-1 max-md:hidden">
            Transactions
          </h1>

          {accountsLoading && (
            <div className="w-full flex items-center h-80 justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          )}

          {!accountsLoading && !accounts.length && (
            <div className="w-full flex items-center h-12 justify-center">
              No Accounts connected
            </div>
          )}

          {!accountsLoading &&
            !!accounts.length &&
            permissions?.routes?.transactions && (
              <DataTable
                columns={getTableColumns({
                  windowWidth,
                  manageTransactions: permissions?.finance?.manageTransactions,
                })}
                data={transactions}
                loading={loading}
                showFilter={true}
                type="transaction"
                hasNextPage={hasNextPage}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                amountFilter={amountFilter}
                setAmountFilter={setAmountFilter}
                showDownloadButton={
                  permissions?.reports?.downloadTransactionReports
                }
                showDownload={permissions?.reports?.downloadTransactionReports}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Page;
