"use client";
import React, {
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { ErrorProps, LabelValue } from "@/types/general";
import BookkeepingStatus from "@/components/dashboard/home/BookkeepingStatus";
import MoneyMovement from "@/components/dashboard/home/MoneyMovement";
import TopExpenses from "@/components/dashboard/home/TopExpenses";
import ProfitNLoss from "@/components/dashboard/home/ProfitNLoss";
import DashboardSkeleton from "@/components/skeletons/dashboard/DashboardSkeleton";
import FinanceApis from "@/actions/data/finance.data";
import { isObject } from "lodash";

const Dashboard = () => {
  const [overviewTimeLine, setOverviewTimeLine] = useState<LabelValue[]>([
    {
      label: "Last 7 days",
      value: "-7",
    },
    {
      label: "Last month",
      value: "-30",
    },
    {
      label: "This month",
      value: "30",
    },
    {
      label: "Year to date",
      value: "ytd",
    },
  ]);
  const [selectedTimeLine, setSelectedTimeLine] = useState<LabelValue>({
    label: "This month",
    value: "30",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyticsReport, setAnalyticsReport] = useState<Record<string, any>>();
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
    setDataLoading(false);
  };

  const onFetchAnalyticsSuccess = (res: any) => {
    if (res) {
      setAnalyticsReport(res);
    }
    setDataLoading(false);
    setLoading(false);
  };

  const fetchAnalyticsReport = useCallback(async () => {
    if (loading || !selectedTimeLine?.value) return false;
    setLoading(true);
    return FinanceApis.getAnalytics(selectedTimeLine.value).then(
      onFetchAnalyticsSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeLine]);

  useEffect(() => {
    fetchAnalyticsReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAnalyticsReport]);


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
                  onClick={() => {
                    setSelectedTimeLine(timeLine);
                  }}
                >
                  {timeLine.label}
                </Button>
              ))}
            </div>
          </div>
          {dataLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {analyticsReport?.bookKeepingStatus && (
                <BookkeepingStatus
                  bookkeepingStatus={analyticsReport?.bookKeepingStatus}
                />
              )}
              <div className="flex flex-col gap-4">
                <h2 className="text-primary font-medium text-base md:text-xl">
                  Money movement
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {analyticsReport?.moneyIn && analyticsReport?.moneyOut && (
                    <Fragment>
                      <MoneyMovement
                        moneyMovementData={analyticsReport.moneyIn}
                      />
                      <MoneyMovement
                        moneyMovementData={analyticsReport.moneyOut}
                      />
                    </Fragment>
                  )}
                </div>
              </div>
              {analyticsReport?.topExpenses && (
                <TopExpenses topExpenses={analyticsReport?.topExpenses} />
              )}
              {analyticsReport?.PNL && (
                <ProfitNLoss profitNLoss={analyticsReport?.PNL} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
