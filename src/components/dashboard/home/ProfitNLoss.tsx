import ProfitNLossGraph from "@/components/generalComponents/graphs/ProfitNLossGraph";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { monthlyGraphDataType, profitLossDataType } from "@/types/general";
import React, { useEffect, useState } from "react";
import { months } from "./BookkeepingStatus";

const ProfitNLoss = ({ profitNLoss }: { profitNLoss: profitLossDataType }) => {
  
  const [formattedData, setFormattedData] = useState<monthlyGraphDataType[]>(
    profitNLoss.profitLoss.map((value,index) => ({
      name: value.revenue.toString(),
      uv: value.expenses,
      pv: value.revenue,
      amt: value.revenue - value.expenses,
      month: months[index],
    }))
  );
  const [isDataFormatted, setIsDataFormatted] = useState(false);
  useEffect(() => {
    if (profitNLoss.profitLoss.length > 0 && !isDataFormatted) {
      setFormattedData(
        profitNLoss.profitLoss.map((value,index) => ({
          name: value.revenue.toString(),
          uv: value.expenses,
          pv: value.revenue,
          amt: value.revenue - value.expenses,
          month: months[index],
        }))
      );
      setIsDataFormatted(true);
    }
  }, [profitNLoss.profitLoss, isDataFormatted]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-primary font-medium text-xl">Profit & Loss</h1>
        <p className="text-sm text-muted ml-auto">Group by</p>
      </div>
      <div className="grid md:grid-cols-3 w-full gap-4">
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-base">Total revenue</CardTitle>
          <p className="text-background-primary text-xl">
            ${profitNLoss.totalRevenue.toFixed(2).toLocaleString()}
          </p>
        </Card>
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-base">Total expense</CardTitle>
          <p className="text-xl text-[#900B09]">
            ${profitNLoss.totalExpenses.toFixed(2).toLocaleString()}
          </p>
        </Card>
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-base">
            Net profit/loss
          </CardTitle>
          <div
            className={`${
              profitNLoss.totalRevenue - profitNLoss.totalExpenses > 0
                ? "text-[#02542D]"
                : "text-[#900B09]"
            } text-xl`}
          >
            $
            {(
              profitNLoss.totalRevenue - profitNLoss.totalExpenses
            ).toFixed(2).toLocaleString()}
          </div>
        </Card>
      </div>
      {isDataFormatted && (
        <ProfitNLossGraph profitNLoss={formattedData} />
      )}
    </div>
  );
};

export default ProfitNLoss;
