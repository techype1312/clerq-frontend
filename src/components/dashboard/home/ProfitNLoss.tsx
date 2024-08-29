import ProfitNLossGraph from "@/components/common/graphs/ProfitNLossGraph";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { MonthlyGraphDataType, ProfitLossDataType, TextType } from "@/types/general";
import React, { useEffect, useState } from "react";
import { months } from "./BookkeepingStatus";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";

const ProfitNLoss = ({ profitNLoss }: { profitNLoss: ProfitLossDataType }) => {
  
  const [formattedData, setFormattedData] = useState<MonthlyGraphDataType[]>(
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

  const [selectedTimeLine, setSelectedTimeLine] = React.useState<TextType>({
    label: "This month",
    value: 30,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-primary font-medium text-base md:text-xl">Profit & Loss</h1>
        {/* <p className="text-sm text-muted ml-auto">Group by</p> */}
        <div className="text-xs md:text-sm text-muted ml-auto md:ml-0 flex gap-2 items-center justify-center">
          Group by
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center cursor-pointer px-1 text-primary border rounded-md">
              <DropdownMenuLabel className="text-xs">{selectedTimeLine.label}</DropdownMenuLabel>
              <SymbolIcon icon="expand_more" color="#9D9DA7" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-16 w-16">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTimeLine({ label: "Last month", value: -30 });
                }}
              >
                Last month
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTimeLine({ label: "This month", value: 30 });
                }}
              >
                This month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid md:grid-cols-3 w-full gap-4">
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-sm md:text-base">Total revenue</CardTitle>
          <p className="text-background-primary text-lg md:text-xl">
            ${profitNLoss.totalRevenue.toFixed(2).toLocaleString()}
          </p>
        </Card>
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-sm md:text-base">Total expense</CardTitle>
          <p className="text-[#900B09] text-lg md:text-xl">
            ${profitNLoss.totalExpenses.toFixed(2).toLocaleString()}
          </p>
        </Card>
        <Card className="flex flex-col py-4 px-6">
          <CardTitle className="text-label text-sm md:text-base">
            Net profit/loss
          </CardTitle>
          <div
            className={`${
              profitNLoss.totalRevenue - profitNLoss.totalExpenses > 0
                ? "text-[#02542D]"
                : "text-[#900B09]"
            } text-lg md:text-xl`}
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
