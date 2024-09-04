"use client";
import MonthsAvgBarGraph from "@/components/common/graphs/MonthsAvgBarGraph";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { MoneyMovementDataType, MonthlyGraphDataType } from "@/types/general";
import { formatAmount } from "@/utils/utils";
import React, { useEffect, useState } from "react";

const MoneyMovement = ({
  moneyMovementData,
}: {
  moneyMovementData: MoneyMovementDataType;
}) => {
  const [formattedData, setFormattedData] = useState<MonthlyGraphDataType[]>(
    moneyMovementData?.avgValueDistribution.map((value) => ({
      name: value.toString(),
      amt: value,
      uv: value,
      pv: value,
    }))
  );
  const [isDataFormatted, setIsDataFormatted] = useState(false);
  useEffect(() => {
    if (
      moneyMovementData?.avgValueDistribution.length > 0 &&
      !isDataFormatted
    ) {
      setFormattedData(
        moneyMovementData?.avgValueDistribution.map((value) => ({
          name: value.toString(),
          amt: value,
          uv: value,
          pv: value,
        }))
      );
      setIsDataFormatted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moneyMovementData?.avgValueDistribution]);
  return (
    <div className="flex flex-col gap-2 w-full border-input border p-4 rounded-md">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-primary text-base">{moneyMovementData.title}</h2>
          <p
            className={`${
              moneyMovementData.value > 0 ? "text-[#29BC97]" : "text-[#900B09]"
            } text-xl`}
          >
            {formatAmount(moneyMovementData.value)}
          </p>
        </div>
        <div
          className={`${
            moneyMovementData.value > 0 ? "-rotate-90" : "rotate-90"
          } w-6 h-6`}
        >
          <SymbolIcon icon="arrow_insert" color="#70707C" />
        </div>
      </div>
      <p className="text-sm text-label">Top categories</p>
      {moneyMovementData.categories.map((category, index) => (
        <div
          key={index}
          className="flex justify-between items-center text-sm text-muted"
        >
          <p>{category.label}</p>
          <p>{formatAmount(category.value)}</p>
        </div>
      ))}
      {/* <span className="border border-input"></span> */}
      <div className="flex justify-between border-t border-[#F3F3F3] mt-2 pt-6 pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-label">Avg (3 months)</p>
          <p className="text-sm text-primary font-medium">
            {formatAmount(moneyMovementData.avgValue)}
          </p>
        </div>
        {isDataFormatted && <MonthsAvgBarGraph monthlyData={formattedData} />}
      </div>
    </div>
  );
};

export default MoneyMovement;
