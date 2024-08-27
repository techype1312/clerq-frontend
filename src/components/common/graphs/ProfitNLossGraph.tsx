import { formatNumber } from "@/utils/utils";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomTickFormatter = (tick: any) => `$${formatNumber(tick)}`;

const ProfitNLossGraph = ({ profitNLoss }: { profitNLoss: any }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart barGap={5} data={profitNLoss}>
        <XAxis dataKey="month" />
        <YAxis tickFormatter={CustomTickFormatter} />
        <defs>
          <linearGradient
            id="colorUv"
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
        <Tooltip />
        {/* <Bar barSize={23} name={"revenue"} dataKey="pv" fill="url(#colorUv)" /> */}
        <Bar radius={[4,4,0,0]} barSize={23} name={"revenue"} dataKey="pv" fill="#5266EB" />
        <Bar radius={[4,4,0,0]} barSize={23} name={"expense"} dataKey="uv" fill="#070C2C80" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitNLossGraph;
