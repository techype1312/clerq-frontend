"use client";
import DateRangeDropdownSelect from "@/components/generalComponents/DateRangeDropdownSelect";
import HeaderCard from "@/components/generalComponents/HeaderCard";
import SheetsData from "@/components/generalComponents/SheetsData";
import { Button } from "@/components/ui/button";
import { useMainContext } from "@/context/Main";
import { cardDetails, dateRangeType, sheetDataType } from "@/types/general";
import { generateDateRange } from "@/utils/utils";
import React, { useEffect, useState } from "react";

const Page = () => {
  const dateRange = generateDateRange();
  const [selectedDateRange, setSelectedDateRange] = useState<dateRangeType>(
    dateRange[0]
  );
  const { windowWidth } = useMainContext();
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
  const [sheetData, setSheetData] = useState<sheetDataType>({
    title: { title: "Revenue", value: 162500.7 },
    data: [
      { title: "Sales revenue", value: 112205.17 },
      { title: "Operating expenses", value: 162500.123 },
    ],
    showFooter: false,
    isCollapsible: true,
  });
  const [sheetData1, setSheetData1] = useState<sheetDataType>({
    title: { title: "Liabilities", value: 162982.11 },
    data: [
      { title: "Individual contractor expenses", value: 159716.61 },
      { title: "Travel & transportation expense", value: 1300.78 },
      { title: "Training & education expense", value: 300.78 },
      { title: "Business meals", value: 178.73 },
      { title: "Overhead costs (Rent, utilities etc)", value: 515.19 },
      { title: "Gift expense", value: 14.32 },
    ],
    showFooter: false,
    isCollapsible: true,
  });
  const [sheetData2, setSheetData2] = useState<sheetDataType>({
    title: { title: "Equity", value: 162982.11 },
    data: [
      { title: "Individual contractor expenses", value: 159716.61 },
      { title: "Travel & transportation expense", value: 1300.78 },
      { title: "Training & education expense", value: 300.78 },
      { title: "Business meals", value: 178.73 },
      { title: "Overhead costs (Rent, utilities etc)", value: 515.19 },
      { title: "Gift expense", value: 14.32 },
    ],
    showFooter: false,
    isCollapsible: true,
  });
  const [cardDetails, setCardDetails] = useState<cardDetails>({
    dateRange: dateRange[0],
    title: "Balance sheet",
    download:
      "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
    leftText: { title: "Net profit", value: -500.0 },
    centerText: { title: "Gross profit", value: 162500.123 },
    rightText: { title: "Operating expenses", value: 162500.123 },
  });
  useEffect(() => {
    setCardDetails({
      dateRange: selectedDateRange,
      title: "Balance sheet",
      download:
        "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
      leftText: { title: "Assets", value: 50000.0 },
      centerText: { title: "Liabilities", value: 5020.123 },
      rightText: { title: "Equity", value: 5000.123 },
    });
  }, [selectedDateRange]);
  const [isOpened, setIsOpened] = useState("all");

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 md:gap-0 flex-col md:flex-row">
            {windowWidth > 767 && (
              <h1 className="text-primary text-2xl font-medium ml-1">
                Balance sheet
              </h1>
            )}
            <div className="w-fit md:ml-auto">
              <DateRangeDropdownSelect
                dateRange={dateRange}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
                setSelectedDateRangeIndex={setSelectedDateRangeIndex}
                selectedDateRangeIndex={selectedDateRangeIndex}
              />
            </div>
          </div>
          <HeaderCard cardDetails={cardDetails} windowWidth={windowWidth} />
          <div className="flex flex-col gap-4 mt-4 mx-1">
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsOpened("all");
                }}
                className={
                  isOpened === "all"
                    ? "bg-primary text-background-muted hover:text-white"
                    : "background-muted text-label hover:text-white"
                }
              >
                All
              </Button>
              <Button
                onClick={() => {
                  setIsOpened("Revenue");
                }}
                className={
                  isOpened === "Revenue"
                    ? "bg-primary text-background-muted hover:text-white"
                    : "background-muted text-label hover:text-white"
                }
              >
                Revenue
              </Button>
              <Button
                onClick={() => {
                  setIsOpened("Liabilities");
                }}
                className={
                  isOpened === "Liabilities"
                    ? "bg-primary text-background-muted hover:text-white"
                    : "background-muted text-label hover:text-white"
                }
              >
                Liabilities
              </Button>
              <Button
                onClick={() => {
                  setIsOpened("Equity");
                }}
                className={
                  isOpened === "Equity"
                    ? "bg-primary text-background-muted hover:text-white"
                    : "background-muted text-label hover:text-white"
                }
              >
                Equity
              </Button>
            </div>
            <SheetsData sheetData={sheetData} isOpened={isOpened} />
            <span className="border-b border-muted"></span>
            <SheetsData sheetData={sheetData1} isOpened={isOpened} />
            <span className="border-b border-muted"></span>
            <SheetsData sheetData={sheetData2} isOpened={isOpened} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
