import {
  categories,
  glCode,
} from "@/app/dashboard/(verified)/transactions/page";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction, useEffect } from "react";

const Filters = ({
  openedFilter,
  columnFilters,
  setColumnFilters,
}: {
  openedFilter: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}) => {
  const handleCheckboxClick = (value: string, isChecked: boolean) => {
    setColumnFilters((prevFilters) => {
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
    setFilter(columnFilters.filter((filter) => filter.id === openedFilter));
  }, [columnFilters, openedFilter]);
  return (
    <div className="p-2">
      {openedFilter === "date" && <div>Date</div>}
      {openedFilter === "clerq_category" && (
        <div>
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
        <div>
          {glCode.map((value, index) => {
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
    </div>
  );
};

export default Filters;
