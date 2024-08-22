'use client'
import MonthsAvgBarGraph from "@/components/generalComponents/graphs/MonthsAvgBarGraph";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { moneyMovementDataType, monthlyGraphDataType } from "@/types/general";
import { formatNumber } from "@/utils/utils";
import React, { useEffect, useState } from "react";

const MoneyMovement = ({
  moneyMovementData,
}: {
  moneyMovementData: moneyMovementDataType;
}) => {
  const [formattedData, setFormattedData] = useState<monthlyGraphDataType[]>(
    moneyMovementData.avgValueDistribution.map((value) => ({
      name: value.toString(),
      amt: value,
      uv: value,
      pv: value,
    }))
  );
  const [isDataFormatted, setIsDataFormatted] = useState(false);
  useEffect(() => {
    if (moneyMovementData.avgValueDistribution.length > 0 && !isDataFormatted) {
      setFormattedData(
        moneyMovementData.avgValueDistribution.map((value) => ({
          name: value.toString(),
          amt: value,
          uv: value,
          pv: value,
        }))
      );
      setIsDataFormatted(true);
    }
  }, [moneyMovementData.avgValueDistribution]);
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
            ${Math.abs(moneyMovementData.value).toFixed(2).toLocaleString()}
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
          <p>{category.title}</p>
          <p>${category.value.toFixed(2).toLocaleString()}</p>
        </div>
      ))}
      {/* <span className="border border-input"></span> */}
      <div className="flex justify-between border-t border-[#F3F3F3] mt-2 pt-6 pb-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-label">Avg (3 months)</p>
          <p className="text-sm text-primary font-medium">
            ${formatNumber(moneyMovementData.avgValue)}
          </p>
        </div>
        {isDataFormatted && (
          <MonthsAvgBarGraph
          monthlyData={formattedData}
          />
        )}
      </div>
    </div>
  );
};

export default MoneyMovement;
