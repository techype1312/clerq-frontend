import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import PercentageBar from "@/components/generalComponents/graphs/PercentageBar";
import { Select } from "@/components/ui/select";
import { textType } from "@/types/general";
import React from "react";

const TopExpenses = ({ topExpenses }: { topExpenses: textType[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-primary text-xl">Top Expenses</h1>
        <p className="text-sm text-muted">Compare to</p>
      </div>
      {topExpenses.map((expense, index) => (
        <div
          key={index}
          className="grid custom-grid-template justify-between border-b last:border-0 py-2 text-label"
        >
          <p className="col-span-2 flex items-center gap-2">
            <SymbolIcon icon="local_shipping" color="#9D9DA7" />
            {expense.title}
          </p>
          <p className="text-end w-fit">
            -$
            {Math.abs(expense.value).toFixed(2).toLocaleString()}
          </p>
          <p className="flex gap-2 items-center justify-end px-2">
            <PercentageBar percentage={expense.percentage ?? 0} />
            {expense.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopExpenses;
