"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  bookKeepingStatusType,
  moneyMovementDataType,
  profitLossDataType,
  textType,
} from "@/types/general";
import BookkeepingStatus from "@/components/dashboard/home/BookkeepingStatus";
import MoneyMovement from "@/components/dashboard/home/MoneyMovement";
import TopExpenses from "@/components/dashboard/home/TopExpenses";
import ProfitNLoss from "@/components/dashboard/home/ProfitNLoss";

const Page = () => {
  const [overviewTimeLine, setOverviewTimeLine] = useState<textType[]>([
    {
      title: "Last 7 days",
      value: -7,
    },
    {
      title: "Last month",
      value: -30,
    },
    {
      title: "This month",
      value: 30,
    },
    {
      title: "Year to date",
      value: 365,
    },
  ]);
  const [selectedTimeLine, setSelectedTimeLine] = useState<textType>({
    title: "This month",
    value: 30,
  });

  const [bookkeepingStatus, setBookkeepingStatus] = useState<
    bookKeepingStatusType[]
  >([
    { value: "completed" },
    { value: "completed" },
    { value: "completed" },
    { value: "completed" },
    { value: "completed" },
    { value: "completed" },
    { value: "completed" },
    { value: "pending" },
    { value: "upcoming" },
    { value: "upcoming" },
    { value: "upcoming" },
    { value: "upcoming" },
  ]);

  const [moneyMovementData, setMoneyMovementData] =
    useState<moneyMovementDataType>({
      title: "Money in",
      value: 10000,
      categories: [
        { title: "Logistics", value: 1000 },
        { title: "Wages", value: 700 },
        { title: "Stationery", value: 200 },
        { title: "Uncategorised", value: 100 },
      ],
      avgValue: 4000000,
      avgValueDistribution: [1000000, 2000000, 3000000],
    });
  const [moneyMovementData1, setMoneyMovementData1] =
    useState<moneyMovementDataType>({
      title: "Money out",
      value: -10000,
      categories: [
        { title: "Logistics", value: 1000 },
        { title: "Wages", value: 700 },
        { title: "Stationery", value: 200 },
        { title: "Uncategorised", value: 100 },
      ],
      avgValue: 200000,
      avgValueDistribution: [10000, 20000, 30000],
    });
  const [topExpenses, setTopExpenses] = useState<textType[]>([
    {
      title: "Independent Contractor Expense",
      value: -1456,
      percentage: 40,
    },
    {
      title: "Travel & Transportation Expense",
      value: -1000,
      percentage: 30,
    },
    {
      title: "Training & Education Expense",
      value: -500,
      percentage: 15,
    },
    {
      title: "Business Meals",
      value: -200,
      percentage: 10,
    },
    {
      title: "Overhead Costs (Rent, Utilities etc)",
      value: -100,
      percentage: 5,
    },
  ]);

  const [profitNLoss, setProfitNLoss] = useState<profitLossDataType>({
    totalRevenue: 100000.5,
    totalExpenses: 50000.632,
    fromMonth: "Jan",
    toMonth: "Mar",
    profitLoss: [
      {
        revenue: 100000,
        expenses: 50000,
      },
      {
        revenue: 150000,
        expenses: 50000,
      },
      {
        revenue: 6000,
        expenses: 50000,
      },
    ],
  });

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col md:flex-row justify-between">
            <h1 className="text-primary text-2xl font-medium ml-1 max-md:hidden">
              Overview
            </h1>
            <div className="flex gap-2 overflow-auto">
              {overviewTimeLine.map((timeLine, index) => (
                <Button
                  key={index}
                  variant={"ghost"}
                  className={`${
                    selectedTimeLine.value === timeLine.value
                      ? "text-background-primary background-muted"
                      : "text-muted"
                  } hover:text-label `}
                >
                  {timeLine.title}
                </Button>
              ))}
            </div>
          </div>
          <BookkeepingStatus bookkeepingStatus={bookkeepingStatus} />
          <div className="flex flex-col gap-4">
            <h2 className="text-primary font-medium text-base md:text-xl">
              Money movement
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <MoneyMovement moneyMovementData={moneyMovementData} />
              <MoneyMovement moneyMovementData={moneyMovementData1} />
            </div>
          </div>
          <TopExpenses topExpenses={topExpenses} />
          <ProfitNLoss profitNLoss={profitNLoss} />
        </div>
      </div>
    </div>
  );
};

export default Page;

{
  /* <Card
  onClick={() => {
    open();
  }}
  className="p-4 flex gap-2 bg-[#FAFBFD] border-none cursor-pointer"
>
  <div className="my-auto">
    <Image
      src="/plaid&clerq.png"
      alt="Plaid & Clerq"
      width={102}
      height={64}
    />
  </div>
  <CardHeader>
    <CardTitle className="text-xl font-normal text-primary">
      Connect with Plaid
    </CardTitle>
    <CardDescription className="text-base font-normal text-label">
      Deploy your new project in one-click.
    </CardDescription>
  </CardHeader>
</Card> */
}
