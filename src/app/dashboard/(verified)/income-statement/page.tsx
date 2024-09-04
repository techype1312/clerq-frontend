"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import FinanceApis from "@/actions/data/finance.data";
import DateRangeDropdownSelect from "@/components/common/DateRangeDropdownSelect";
import { DownloadButton } from "@/components/common/DownloadButton";
import HeaderCard from "@/components/common/HeaderCard";
import SheetsData from "@/components/common/SheetsData";
import IncomeBankSkeleton from "@/components/skeletons/dashboard/IncomeBankSkeleton";
import { DateRangeType, ErrorProps } from "@/types/general";
import { formatAmount, generateDateRange } from "@/utils/utils";
import { isObject } from "lodash";

const Page = () => {
  const dateRange = generateDateRange();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>(
    dateRange[0]
  );
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [incomeStatement, setIncomeStatement] = useState<Record<string, any>>();

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchStatementSuccess = (res: any) => {
    if (res) {
      setIncomeStatement(res);
    }
    setLoading(false);
  };

  const fetchIncomeStatement = useCallback(async () => {
    if (loading || !selectedDateRange?.year) return false;
    setLoading(true);
    return FinanceApis.getIncomeStatement(selectedDateRange.year).then(
      onFetchStatementSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateRange]);

  useEffect(() => {
    fetchIncomeStatement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchIncomeStatement]);

  const netProfit =
    incomeStatement?.revenue.title.value -
    incomeStatement?.expenses.title.value;

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
                  downloadLink={incomeStatement?.overview.download}
                />
              </div>
            </div>
          </div>
          {loading || !incomeStatement ? (
            <IncomeBankSkeleton showLastSkeleton={true} />
          ) : (
            <Fragment>
              <HeaderCard cardDetails={incomeStatement?.overview} />
              <div className="flex flex-col gap-4 mt-4 mx-1">
                <SheetsData sheetData={incomeStatement?.revenue} />
                <span className="border-b border-muted"></span>
                <SheetsData sheetData={incomeStatement?.expenses} />
                <span className="border-b border-muted"></span>
              </div>
              <div className="flex justify-between font-semibold text-primary mx-1">
                <p className="text-base">Net profit</p>
                <p className="text-base">
                  {formatAmount(netProfit)}
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
