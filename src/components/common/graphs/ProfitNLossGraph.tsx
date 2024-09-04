import { formatNumber } from "@/utils/utils";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTickFormatter = (tick: any) => `$${formatNumber(tick)}`;

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <div className="bg-muted p-2 rounded-md">
        <p className="text-primary capitalize">{`${
          payload[0].name === "profit"
            ? payload[0]?.payload?.amt > 0
              ? "Profit"
              : "Loss"
            : payload[0].name
        } : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};
const ProfitNLossGraph = ({ profitNLoss }: { profitNLoss: any }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart barGap={5} data={profitNLoss}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={CustomTickFormatter} />
        <defs>
          <linearGradient
            id="colorUv3"
            x1="0"
            y1="0"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#5266EB" />
            <stop offset=".5" stopColor="#5266EB" />
            <stop offset="1" stopColor="#5266EB" />
          </linearGradient>
        </defs>
        <Tooltip
          cursorStyle={"pointer"}
          shared={false}
          content={CustomTooltip}
        />
        <ReferenceLine y={0} stroke="#000" />
        <Bar
          radius={[4, 4, 0, 0]}
          barSize={23}
          name={"revenue"}
          label={"revenue"}
          dataKey="pv"
          fill="#5266EB"
        />

        <Bar
          radius={[4, 4, 0, 0]}
          barSize={23}
          dataKey="amt"
          fill={"#29BC97"}
          name={"profit"}
        >
          {profitNLoss.map((entry: any, index: number) => (
            <Cell
              name={profitNLoss.amt > 0 ? "profit" : "loss"}
              key={`cell-${index}`}
              fill={entry.amt > 0 ? "#29BC97" : "#900B09"}
              stroke={entry.amt > 0 ? "#29BC97" : "#900B09"}
            />
          ))}
        </Bar>
        <Bar
          radius={[4, 4, 0, 0]}
          barSize={23}
          name={"expense"}
          dataKey="uv"
          fill="#900B09"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitNLossGraph;
