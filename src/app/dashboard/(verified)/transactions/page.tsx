"use client";

import { DataTable } from "@/components/dashboard/transactions/DataTable";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import { Select, SelectContent } from "@/components/ui/select";
import { useCompanySessionContext } from "@/context/CompanySession";
import { useMainContext } from "@/context/Main";
import { cn } from "@/utils/utils";
import { SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useBankAccountsContext } from "@/context/BankAccounts";

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
}: {
  windowWidth: number;
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
    header: "Company",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center gap-2 text-label text-base">
          {(cell.getValue() as merchant) &&
          (cell.getValue() as merchant).merchant_logo &&
          (cell.getValue() as merchant).merchant_name ? (
            <>
              <Image
                width={24}
                height={24}
                src={(cell.getValue() as merchant).merchant_logo}
                alt={(cell.getValue() as merchant).merchant_name}
                className="rounded-full"
              />
              <span className="text-sm font-semibold">
                {(cell.getValue() as merchant).merchant_name}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">
              {(cell.getValue() as merchant).merchant_name}
            </span>
          )}
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
          className={cn("text-label text-base", {
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
    header: "Receipt",
    cell: ({ cell }) => (
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
    ),
  };

  if (windowWidth < 576) {
    return [dateCol, merchantCol, amountCol, receiptCol];
  }
  if (windowWidth < 768) {
    return [dateCol, merchantCol, amountCol, receiptCol];
  }
  if (windowWidth < 1024) {
    return [dateCol, merchantCol, accountCol, amountCol, receiptCol];
  }
  return [dateCol, merchantCol, accountCol, amountCol, categoryCol, receiptCol];
};

const Page = () => {
  const { windowWidth } = useMainContext();
  const { bankAccountsData: accounts, loading: accountsLoading } =
    useBankAccountsContext();
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUcrm } = useCompanySessionContext();

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

          {!accountsLoading && !!accounts.length && (
            <DataTable
              columns={getTableColumns({ windowWidth })}
              data={transactions}
              accounts={accounts}
              setTransactions={setTransactions}
              loading={loading}
              setLoading={setLoading}
              currentUcrm={currentUcrm}
              showFilter={true}
              type="transaction"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
