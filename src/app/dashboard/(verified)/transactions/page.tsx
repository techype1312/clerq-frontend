"use client";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import { Select, SelectContent } from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { supabase } from "@/utils/supabase/client";
import { SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type merchant = {
  merchant_name: string;
  merchant_logo: string;
};

// const filterByDateRange = (rows: any, id: any, filterValue: any) => {
//   const [startDate, endDate] =
//     filterValue === "thisMonth" ? getCurrentMonthRange() : getLastMonthRange();
//   return rows?.filter((row: any) => {
//     const rowDate = new Date(row.original[id]);
//     return rowDate >= startDate && rowDate <= endDate;
//   });
// };

// const getCurrentMonthRange = () => {
//   const now = new Date();
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//   const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//   return [startOfMonth, endOfMonth];
// };

// const getLastMonthRange = () => {
//   const now = new Date();
//   const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//   const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
//   return [lastMonth, endOfLastMonth];
// };

export const glCode = [
  "230 - Electric Bills",
  "120 - Accounts Receivable",
  "400 - Inventory",
  "440 - Raw Materials",
  "503 - Debt Service Prep",
  "620 - Entertainment",
  "664 - Utilities",
];

export const categories = [
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

export const transactionsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "date",
    // header: "Date",
    // filterFn: dateFilter,
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
          {format(cell.getValue() as string, "MMMM d, yyyy")}
        </div>
      );
    },
  },
  {
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
              <span>{(cell.getValue() as merchant).merchant_name}</span>
            </>
          ) : (
            <span>{(cell.getValue() as merchant).merchant_name}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ cell }) => {
      return (
        <div className="flex text-label text-base">
          <SymbolIcon icon="account_balance" />
          {(cell.getValue() as any).name} ••
          {(cell.getValue() as any).mask}
        </div>
      );
    },
  },
  // Created a custom cell to display the amount in the correct format
  {
    accessorKey: "amount",
    // header: "Amount",
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
    cell: ({ cell }) => (
      <div className="text-label text-base">
        {(cell.getValue() as number) && (cell.getValue() as number) < 0 && "-"}$
        {Math.abs(cell.getValue() as number)}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "clerq_category",
    header: "Clerq category",
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
        <SelectContent>
          {categories.map((value, index) => (
            <SelectItem value={value ?? "undefined"} key={value + index}>
              {value ?? "Undefined value"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "gl_code",
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
        <SelectContent>
          {glCode.map((value, index) => (
            <SelectItem value={value ?? "undefined"} key={value + index}>
              {value ?? "Undefined value"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
  },
  {
    accessorKey: "receipt",
    header: "Receipt",
    cell: ({ cell }) => (
      <Button
      onClick={()=>{
        if(cell.getValue()){
          console.log("Receipt")
        } else {
          toast.error("No receipt available")
        }
      }}
      variant="ghost" className="text-label">
        {cell.getValue() ? (
          <SymbolIcon icon="receipt_long" />
        ): (
          <SymbolIcon icon="inactive_order" />
        )}
      </Button>
    ),
  },
];

const Page = () => {
  const [transactions, setTransactions] = React.useState([]);
  useEffect(() => {
    supabase.functions.invoke("plaid-transactions").then((res) => {
      if (res.data) {
        setTransactions(
          res.data.transactions.map((transaction: any, index: number) => {
            return {
              ...transaction,
              merchant: {
                merchant_name: transaction.merchant_name,
                merchant_logo: transaction.logo_url,
              },
              gl_code: index === 0 ? "400 - Inventory" : "230 - Electric Bills",
              clerq_category: index === 0 ? "Cleaning" : "Advertising",
              account: res.data.accounts.filter((account: any) => {
                if (account.account_id === transaction.account_id) {
                  return account;
                }
              })[0],
            };
          })
        );
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-primary text-2xl font-medium ml-1">Transaction</h1>
      {transactions.length !== 0 && (
        <DataTable columns={transactionsColumns} data={transactions} />
      )}
    </div>
  );
};

export default Page;
