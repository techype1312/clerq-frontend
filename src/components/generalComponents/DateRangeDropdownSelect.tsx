import React from "react";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { dateRangeType } from "@/types/general";

const DateRangeDropdownSelect = ({
  dateRange,
  selectedDateRange,
  setSelectedDateRange,
  selectedDateRangeIndex,
  setSelectedDateRangeIndex,
}: {
  dateRange: dateRangeType[];
  selectedDateRange: dateRangeType;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<dateRangeType>>;
  selectedDateRangeIndex: number;
  setSelectedDateRangeIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="background-muted flex items-center rounded-md pl-3">
      <SymbolIcon icon="calendar_month" color="#70707C" />
      <Select
        onValueChange={(e) => {
          setSelectedDateRangeIndex(parseInt(e));
          setSelectedDateRange(dateRange[parseInt(e)]);
        }}
        value={selectedDateRangeIndex.toString()}
      >
        <SelectTrigger className="border-none bg-transparent outline-none">
          <SelectValue>
            {selectedDateRange.startDate} - {selectedDateRange.endDate}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {dateRange.map((value, index) => (
            <SelectItem value={index.toString()} key={index}>
              {value.startDate} - {value.endDate}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateRangeDropdownSelect;
