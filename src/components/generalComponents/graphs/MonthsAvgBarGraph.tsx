"use client";
import { monthlyGraphDataType } from "@/types/general";
import React from "react";
import { BarChart, Bar, Legend } from "recharts";

const MonthsAvgBarGraph = ({
  monthlyData,
}: {
  monthlyData: monthlyGraphDataType[];
}) => {
    
  return (
    <BarChart barGap={0} width={150} height={56} data={monthlyData}>
      <defs>
        <linearGradient
          id="colorUv"
          x1="0"
          y1="0"
          x2="0"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#5266EB" />
          <stop offset="1" stopColor="#5266EB00" />
        </linearGradient>
      </defs>
      <Bar barSize={100} dataKey="amt" fill="url(#colorUv)" />
    </BarChart>
  );
};

export default MonthsAvgBarGraph;

// <BarChart width={150} height={40} data={monthlyData}>
//   {/* <Bar dataKey="uv" fill="#8884d8" /> */}
//   {/* <XAxis dataKey="name" />
//   <YAxis />
//   <CartesianGrid strokeDasharray="3 3" />
//   <Bar dataKey="value" fill="none" barSize={20}>
//     <CustomBar x={"#5266EB00"} y={"#5266EB"}  height={100} />
//   </Bar> */}
// </BarChart>
