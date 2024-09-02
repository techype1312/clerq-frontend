import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import SymbolIcon from "../MaterialSymbol/SymbolIcon";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Filters from "./Filters";

const FilterTrigger = ({
  columnFilters,
  dateFilter,
  amountFilter,
  showFilter,
  setColumnFilters,
  setDateFilter,
  setAmountFilter,
  openedFilter,
  setOpenedFilter,
  noOfFiltersApplied,
  filtersCategory,
}: {
  columnFilters?: ColumnFiltersState;
  dateFilter: any;
  amountFilter: any;
  showFilter: boolean;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  setDateFilter: any;
  setAmountFilter: any;
  openedFilter: string;
  setOpenedFilter: Dispatch<SetStateAction<string>>;
  noOfFiltersApplied: number;
  filtersCategory: { label: string; value: string }[];
}) => {
  return (
    <Fragment>
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
        <PopoverContent
          align="start"
          className="h-screen md:h-full md:w-max w-screen -mt-28 md:mt-0"
        >
          <div className="flex justify-between">
            <h6>Filters</h6>
            <PopoverClose>
              <SymbolIcon icon="close" color={"#9D9DA7"} />
            </PopoverClose>
          </div>
          <DropdownMenuSeparator />
          <div className="flex flex-col md:flex-row h-full mb-12 md:mb-0 overflow-scroll md:overflow-visible">
            <div className="flex flex-col gap-2 h-full text-left md:border-r">
              {filtersCategory.map((category, index) => {
                return (
                  <Fragment key={index}>
                    <Button
                      variant={"ghost"}
                      key={index}
                      onClick={() => {
                        setOpenedFilter(category?.value);
                      }}
                      className={`${
                        openedFilter === category?.value
                          ? "text-primary bg-muted"
                          : " text-label hover:text-label"
                      } justify-between min-w-36`}
                    >
                      {category?.label}{" "}
                      <SymbolIcon
                        className={`${
                          openedFilter === category?.value &&
                          "rotate-90 md:rotate-0"
                        }`}
                        icon="arrow_right"
                        color={"#1e1e2a"}
                      />
                    </Button>
                    {openedFilter === category?.value && (
                      <div className="md:hidden min-w-40 max-w-screen-sm overflow-x-scroll">
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
                    )}
                  </Fragment>
                );
              })}

              <div className="flex md:hidden flex-col gap-2 mt-auto mb-8">
                <PopoverClose>
                  <Button className="h-8 gap-2 px-2 flex w-full items-center">
                    {(columnFilters && columnFilters.length > 0) ||
                    dateFilter?.value ||
                    amountFilter?.value ? (
                      <span>
                        ({noOfFiltersApplied}) Filter
                        {noOfFiltersApplied > 1 && "s"} applied
                      </span>
                    ) : (
                      <span>No Filters applied</span>
                    )}
                  </Button>
                </PopoverClose>
                <PopoverClose>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setColumnFilters && setColumnFilters([]);
                      setDateFilter && setDateFilter({});
                      setAmountFilter && setAmountFilter({});
                    }}
                    className={` ${
                      (columnFilters && columnFilters.length > 0) ||
                      dateFilter?.value ||
                      amountFilter?.value
                        ? "text-primary"
                        : "text-muted"
                    } h-8 mx-auto w-full`}
                  >
                    Clear
                  </Button>
                </PopoverClose>
              </div>
            </div>
            <div className="hidden md:block min-w-96 max-w-lg md:w-full overflow-auto">
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
    </Fragment>
  );
};

export default FilterTrigger;
