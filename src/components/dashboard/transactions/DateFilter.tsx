import { calculateDateRange, formatDateRange, formatDateRangeWithDay } from "@/utils/utils";
import React, { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import Select from "react-select";

const options = [
  { value: calculateDateRange("last_30_days"), label: "Last 30 days" },
  { value: calculateDateRange("this_month"), label: "This month" },
  { value: calculateDateRange("last_month"), label: "Last month" },
  {
    value: calculateDateRange("last_4_financial_quarters"),
    label: "Last 4 financial quarters",
  },
  { value: calculateDateRange("this_year"), label: "This year" },
  { value: calculateDateRange("last_year"), label: "Last year" },
  { value: calculateDateRange("all"), label: "All" },
];

const DateFilter = ({
  dateFilter,
  setDateFilter,
}: {
  dateFilter: any;
  setDateFilter: any;
}) => {
  const year = new Date().getFullYear();
  const [month, setMonth] = React.useState<Date | undefined>();

  useEffect(() => {
    setMonth(dateFilter?.value?.from);
  }, [dateFilter]);

  return (
    <div className="flex flex-col gap-2">
      <Select
        className="z-50"
        options={options}
        onChange={(e) => {
          console.log(e);
          setDateFilter({ value: e?.value, label: e?.label });
        }}
      />
      <DayPicker
        className="w-80 text-sm"
        mode="range"
        month={month}
        onMonthChange={setMonth}
        selected={dateFilter?.value}
        onSelect={(e) => {
          if (e?.from && e?.to) {
            setDateFilter({
              value: e,
              label: formatDateRangeWithDay(
                e.from.toDateString(),
                e.to.toDateString()
              ),
            });
          }
        }}
        showOutsideDays
        fixedWeeks
        captionLayout="dropdown-buttons"
        fromYear={1900}
        toYear={year}
      />
    </div>
  );
};

export default DateFilter;
