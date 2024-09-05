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
import { useUserContext } from "@/context/User";
import { cn } from "@/utils/utils";
import { useCompanySessionContext } from "@/context/CompanySession";

const Dashboard = () => {
  const { userData } = useUserContext();
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

  const { permissions } = useCompanySessionContext();

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
            <h1 className="text-primary text-xl font-medium leading-10">
              {userData?.firstName ? `Welcome, ${userData?.firstName}` : ""}
            </h1>
            <div className="flex gap-2 overflow-auto">
              {overviewTimeLine.map((timeLine, index) => (
                <Button
                  key={index}
                  variant={"ghost"}
                  className={cn("hover:text-label", {
                    ["text-background-primary background-muted"]:
                      selectedTimeLine.value === timeLine.value,
                    ["text-muted"]: selectedTimeLine.value !== timeLine.value,
                  })}
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
            <Fragment>
              {analyticsReport?.bookKeepingStatus &&
                permissions?.finance?.viewBookKeepings && (
                  <BookkeepingStatus
                    bookkeepingStatus={analyticsReport?.bookKeepingStatus}
                  />
                )}
              {permissions?.finance?.viewFinance && (
                <Fragment>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-primary font-medium text-base md:text-xl">
                      Money movement
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {analyticsReport?.moneyIn &&
                        analyticsReport?.moneyOut && (
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
                </Fragment>
              )}
            </Fragment>
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
