"use client";
import FinanceApis from "@/actions/data/finance.data";
import DateRangeDropdownSelect from "@/components/common/DateRangeDropdownSelect";
import HeaderCard from "@/components/common/HeaderCard";
import SheetsData from "@/components/common/SheetsData";
import IncomeBankSkeleton from "@/components/skeletons/dashboard/IncomeBankSkeleton";
import { Button } from "@/components/ui/button";
import {
  CardDetails,
  DateRangeType,
  ErrorProps,
  SheetDataType,
} from "@/types/general";
import { generateDateRange } from "@/utils/utils";
import { isObject } from "lodash";
import React, { Fragment, useCallback, useEffect, useState } from "react";

const Page = () => {
  const dateRange = generateDateRange();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>(
    dateRange[0]
  );
  const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
  const [isOpened, setIsOpened] = useState("all");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sheet, setBalanceSheet] = useState<Record<string, any>>();

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchBalanceSheetSuccess = (res: any) => {
    if (res) {
      setBalanceSheet(res);
    }
    setLoading(false);
  };

  const fetchBalanceSheet = useCallback(async () => {
    if (loading || !selectedDateRange?.year) return false;
    setLoading(true);
    return FinanceApis.getBalanceSheet(selectedDateRange.year).then(
      onFetchBalanceSheetSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateRange]);

  useEffect(() => {
    fetchBalanceSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBalanceSheet]);

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 md:gap-0 flex-col md:flex-row">
            <h1 className="text-primary text-2xl font-medium ml-1 max-md:hidden">
              Balance sheet
            </h1>
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
          {loading || !sheet ? (
            <IncomeBankSkeleton showLastSkeleton={false} />
          ) : (
            <Fragment>
              <HeaderCard cardDetails={sheet?.overview} />
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
                <SheetsData sheetData={sheet?.revenue} isOpened={isOpened} />
                <span className="border-b border-muted"></span>
                <SheetsData
                  sheetData={sheet?.liabilities}
                  isOpened={isOpened}
                />
                <span className="border-b border-muted"></span>
                <SheetsData sheetData={sheet?.equity} isOpened={isOpened} />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
