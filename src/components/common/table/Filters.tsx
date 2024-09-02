import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import "react-day-picker/dist/style.css";
import DateFilter from "./DateFilter";

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
  "Food and Drink",
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

const amount = ["All", "0-50", "50-200", "200-500", "500-1000", "1000+"];

const sub_categories = ["Taxi", "Hotel", "Flight", "Train"];

const Filters = ({
  openedFilter,
  columnFilters,
  setColumnFilters,
  dateFilter,
  setDateFilter,
  amountFilter,
  setAmountFilter,
}: {
  openedFilter: string;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  dateFilter?: any;
  setDateFilter?: any;
  setAmountFilter?: any;
  amountFilter?: any;
}) => {
  const handleCheckboxClick = (value: string, isChecked: boolean) => {
    setColumnFilters && setColumnFilters((prevFilters) => {
      let updatedFilters = prevFilters.map((filter) =>
        filter.id === openedFilter
          ? {
              ...filter,
              value: (filter?.value as string[]).includes(value)
                ? (filter?.value as string[]).filter((val) => val !== value)
                : [...(filter.value as string[]), value],
            }
          : filter
      );
      updatedFilters = updatedFilters.filter((filter) => {
        if ((filter?.value as string[]).length !== 0) {
          return filter;
        }
      });
      const valueExists = updatedFilters.find(
        (filter) => filter.id === openedFilter
      );
      if (isChecked) {
        if (!valueExists) {
          return [...updatedFilters, { id: openedFilter, value: [value] }];
        }
      }
      if (updatedFilters.length === 0) {
        if (!valueExists && !isChecked) {
          return [];
        } else {
          return [
            {
              id: openedFilter,
              value: [value],
            },
          ];
        }
      } else {
        return updatedFilters;
      }
    });
  };
  const [filter, setFilter] = React.useState<any | null>([]);
  useEffect(() => {
    setFilter(columnFilters && columnFilters.filter((filter) => filter.id === openedFilter));
  }, [columnFilters, openedFilter]);

  return (
    <div className="p-2 pb-0 w-full">
      {openedFilter === "date" && (
        <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />
      )}
      {openedFilter === "category" && (
        <div className="h-96 w-full flex flex-col gap-2">
          {categories.map((value, index) => (
            <div
              key={value + index}
              className="flex gap-2 items-center pl-4 text-label"
            >
              <Checkbox
                checked={
                  filter.length !== 0
                    ? (filter[0]?.value as string[])?.includes(value)
                    : false
                }
                onCheckedChange={(checked: boolean) => {
                  handleCheckboxClick(value, checked);
                }}
              />
              {value ?? "Undefined value"}
            </div>
          ))}
        </div>
      )}
      {openedFilter === "gl_code" && (
        <div className="md:h-80 w-full">
          {glCodes.map((value, index) => {
            return (
              <div
                key={value + index}
                className="flex gap-2 items-center pl-4 text-label"
              >
                <Checkbox
                  checked={
                    filter.length !== 0
                      ? (filter[0]?.value as string[])?.includes(value)
                      : false
                  }
                  onCheckedChange={(checked: boolean) => {
                    handleCheckboxClick(value, checked);
                  }}
                />
                {value ?? "Undefined value"}
              </div>
            );
          })}
        </div>
      )}
      {openedFilter === "sub_categories" && (
        <div className="md:h-80 w-full">
          {sub_categories.map((value, index) => {
            return (
              <div
                key={value + index}
                className="flex gap-2 items-center pl-4 text-label"
              >
                <Checkbox
                  checked={
                    filter.length !== 0
                      ? (filter[0]?.value as string[])?.includes(value)
                      : false
                  }
                  onCheckedChange={(checked: boolean) => {
                    handleCheckboxClick(value, checked);
                  }}
                />
                {value ?? "Undefined value"}
              </div>
            );
          })}
        </div>
      )}
      {openedFilter === "amount" && (
        <div className="md:h-80 w-full px-2">
          <RadioGroup
            onValueChange={(e) => {
              if (e === "All") {
                setAmountFilter({});
                return;
              }
              setAmountFilter({ id: "amount", value: e });
            }}
            defaultValue={amountFilter?.value || "All"}
          >
            {amount.map((value, index) => {
              return (
                <div
                  key={value}
                  className="mb-2 flex items-center gap-3 space-y-0"
                >
                  <RadioGroupItem value={value} />
                  <label className="font-normal">{value}</label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default Filters;
