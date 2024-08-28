import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import PercentageBar from "@/components/common/graphs/PercentageBar";
import { textType } from "@/types/general";
import React from "react";

const TopExpenses = ({ topExpenses }: { topExpenses: textType[] }) => {
  const [selectedTimeLine, setSelectedTimeLine] = React.useState<textType>({
    title: "This month",
    value: 30,
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-primary text-base md:text-xl">Top Expenses</h1>
        <div className="text-xs md:text-sm text-muted ml-auto md:ml-0 flex gap-2 items-center justify-center">
          Compare to
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center cursor-pointer px-1 text-primary border rounded-md">
              <DropdownMenuLabel className="text-xs">{selectedTimeLine.title}</DropdownMenuLabel>
              <SymbolIcon icon="expand_more" color="#9D9DA7" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-16 w-16">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTimeLine({ title: "Last month", value: -30 });
                }}
              >
                Last month
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTimeLine({ title: "This month", value: 30 });
                }}
              >
                This month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {topExpenses.map((expense, index) => (
        <div
          key={index}
          className="grid gap-4 md:gap-0 custom-grid-template justify-between border-b last:border-0 py-2 text-label"
        >
          <p className="col-span-2 flex items-center gap-2 text-xs md:text-base">
            <SymbolIcon icon="local_shipping" color="#9D9DA7" />
            {expense.title}
          </p>
          <p className="text-end w-fit text-sm md:text-base ml-auto md:ml-0">
            -$
            {Math.abs(expense.value).toFixed(2).toLocaleString()}
          </p>
          <p className="hidden md:flex gap-2 items-center justify-end px-2">
            <PercentageBar percentage={expense.percentage ?? 0} />
            {expense.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopExpenses;
