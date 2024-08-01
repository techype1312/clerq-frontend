"use client";
import DateRangeDropdownSelect from "@/components/generalComponents/DateRangeDropdownSelect";
import HeaderCard from "@/components/generalComponents/HeaderCard";
import { cardDetails, dateRangeType } from "@/types/general";
import { generateDateRange } from "@/utils/utils";
import React, { useEffect, useState } from "react";

const Page = () => {
  const dateRange = generateDateRange();
  const [selectedDateRange, setSelectedDateRange] = useState<dateRangeType>(
    dateRange[0]
  );
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
  const [cardDetails, setCardDetails] = useState<cardDetails>({
    dateRange: dateRange[0],
    download:
      "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
    leftText: { title: "Net profit", value: -500.0 },
    centerText: { title: "Gross profit", value: 162500.123 },
    rightText: { title: "Operating expenses", value: 162500.123 },
  });
  useEffect(() => {
    setCardDetails({
      dateRange: selectedDateRange,
      download:
        "https://gseijrhbhurcrpgbxrgt.supabase.co/storage/v1/object/sign/Test%20bucket/sample.pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJUZXN0IGJ1Y2tldC9zYW1wbGUucGRmIiwiaWF0IjoxNzIyNDMwNzgxLCJleHAiOjE3MjMwMzU1ODF9.DJSWsvWgcN6VPhR1Tc59nlHu1CcVqCVUDAv2Y5w4RqE&t=2024-07-31T12%3A59%3A41.813Z",
      leftText: { title: "Net profit", value: -500.0 },
      centerText: { title: "Gross profit", value: 162500.123 },
      rightText: { title: "Operating expenses", value: 162500.123 },
    });
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <h1 className="text-primary text-2xl font-medium ml-1">
          Income statement
        </h1>
        <DateRangeDropdownSelect
          dateRange={dateRange}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          setSelectedDateRangeIndex={setSelectedDateRangeIndex}
          selectedDateRangeIndex={selectedDateRangeIndex}
        />
      </div>
      <HeaderCard cardDetails={cardDetails} />
    </div>
  );
};

export default Page;
