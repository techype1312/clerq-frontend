import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { BookKeepingStatusType } from "@/types/general";
import React from "react";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BookkeepingStatus = ({
  bookkeepingStatus,
}: {
  bookkeepingStatus: BookKeepingStatusType[];
}) => {
  return (
    <div className="flex flex-col gap-4 md:px-4 md:py-8 py-2 md:border md:border-input rounded-md">
      <div className="flex justify-between flex-col md:flex-row">
        <h2 className="text-primary text-base font-medium md:text-xl">Bookkeeping status</h2>
        <p className="text-muted text-sm">
          See progress towards your tax ready books.
        </p>
      </div>
      <div className="grid w-full grid-flow-col overflow-scroll">
        {bookkeepingStatus?.map((status, index) => (
          <div key={index} className="flex flex-col gap-1 py-2 px-4 first:pl-0 last:pr-0 items-center">
            <p className="text-sm text-muted">{months[index]?.toUpperCase()}</p>
            <p
              className={`${
                status.value === "completed"
                  ? "bg-[#5266EB29]"
                  : status.value === "in-progress"
                  ? "bg-muted"
                  : "border-dotted border-2 border-input"
              } rounded-full h-7 w-7 flex items-center justify-center`}
            >
              {status.value === "completed" ? (
                <SymbolIcon icon="check" color="#5266EB" size={22} />
              ) : (
                status.value === "pending" && (
                  <SymbolIcon icon="cached" color="#9D9DA7" size={22} />
                )
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookkeepingStatus;
