"use client";
import DateRangeDropdownSelect from "@/components/generalComponents/DateRangeDropdownSelect";
import { DownloadButton } from "@/components/generalComponents/DownloadButton";
import HeaderCard from "@/components/generalComponents/HeaderCard";
import SheetsData from "@/components/generalComponents/SheetsData";
import IncomeBankSkeleton from "@/components/skeletonLoading/dashboard/IncomeBankSkeleton";
import { cardDetails, dateRangeType, sheetDataType } from "@/types/general";
import { generateDateRange } from "@/utils/utils";
import React, { Fragment, useEffect, useState } from "react";

const Page = () => {
  const dateRange = generateDateRange();
  const [selectedDateRange, setSelectedDateRange] = useState<dateRangeType>(
    dateRange[0]
  );
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
  const [sheetData, setSheetData] = useState<sheetDataType>({
    title: { title: "Revenue", value: 162500.7 },
    data: [
      { title: "Sales revenue", value: 112205.17 },
      { title: "Operating expenses", value: 162500.123 },
    ],
    showFooter: true,
    footerData: { title: "Gross profit", value: -500.0 },
    isCollapsible: false,
  });
  const [sheetData1, setSheetData1] = useState<sheetDataType>({
    title: { title: "Operating expenses", value: 162982.11 },
    data: [
      { title: "Individual contractor expenses", value: 159716.61 },
      { title: "Travel & transportation expense", value: 1300.78 },
      { title: "Training & education expense", value: 300.78 },
      { title: "Business meals", value: 178.73 },
      { title: "Overhead costs (Rent, utilities etc)", value: 515.19 },
      { title: "Gift expense", value: 14.32 },
    ],
    showFooter: false,
    isCollapsible: false,
  });
  const [cardDetails, setCardDetails] = useState<cardDetails>({
    dateRange: dateRange[0],
    download:
      "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
    leftText: { title: "Net profit", value: -500.0 },
    centerText: { title: "Gross profit", value: 162500.123 },
    rightText: { title: "Expenses", value: 162500.123 },
  });
  useEffect(() => {
    setCardDetails({
      dateRange: selectedDateRange,
      download:
        "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
      leftText: { title: "Net profit", value: -500.0 },
      centerText: { title: "Gross profit", value: 162500.123 },
      rightText: { title: "Expenses", value: 162500.123 },
    });
  }, [selectedDateRange]);
  const netProfit = sheetData.title.value - sheetData1.title.value;

  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
     setDataLoading(false);
  }, []);

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 md:gap-0 justify-between flex-col md:flex-row">
            <h1 className="text-primary text-2xl font-medium ml-1 max-md:hidden">
              Income statement
            </h1>
            <div className="flex justify-between">
              <DateRangeDropdownSelect
                dateRange={dateRange}
                selectedDateRange={selectedDateRange}
                setSelectedDateRange={setSelectedDateRange}
                setSelectedDateRangeIndex={setSelectedDateRangeIndex}
                selectedDateRangeIndex={selectedDateRangeIndex}
              />
              <div className="w-fit md:hidden">
                <DownloadButton
                  showText={false}
                  downloadLink={cardDetails.download}
                />
              </div>
            </div>
          </div>
          {dataLoading ? (
            <IncomeBankSkeleton showLastSkeleton={true} />
          ) : (
            <Fragment>
              <HeaderCard cardDetails={cardDetails} />
              <div className="flex flex-col gap-4 mt-4 mx-1">
                <SheetsData sheetData={sheetData} />
                <span className="border-b border-muted"></span>
                <SheetsData sheetData={sheetData1} />
                <span className="border-b border-muted"></span>
              </div>
              <div className="flex justify-between font-semibold text-primary mx-1">
                <p className="text-base">Net profit</p>
                <p className="text-base">
                  {netProfit < 0 && "-"}$
                  {Math.abs(netProfit).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
