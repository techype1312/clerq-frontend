"use client";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import SecuritySkeleton from "@/components/skeletons/dashboard/SecuritySkeleton";
import { useUserContext } from "@/context/User";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { Suspense, useState } from "react";
import { getSecurityTableColumns } from "../company-security/page";

const getTableColumns = (): ColumnDef<any>[] => {
  const dateCol: ColumnDef<any> = {
    accessorKey: "activity",
    header: "Most recent activity",
    cell: ({ cell }) => {
      return (
        <div className="text-sm">
          {cell.getValue() === "current session" ? (
            "Current session"
          ) : (
            <>
              {format(cell.getValue() as string, "MMM d, yyyy") +
                " at " +
                format(cell.getValue() as string, "h:mm a")}
            </>
          )}
        </div>
      );
    },
  };
  const browserCol: ColumnDef<any> = {
    accessorKey: "browser",
    header: "Browser",
    // cell: ({ cell }) => {
    //   return (
    //     <div className="text-muted text-sm">{cell.getValue() as string}</div>
    //   );
    // },
  };
  const countryCol: ColumnDef<any> = {
    accessorKey: "country",
    header: "Country",
    // cell: ({ cell }) => {
    //   return (
    //     <div className="text-muted text-sm">{cell.getValue() as string}</div>
    //   );
    // },
  };
  const ipCol: ColumnDef<any> = {
    accessorKey: "ip",
    header: "IP Address",
    // cell: ({ cell }) => {
    //   return (
    //     <div className="text-sm">{cell.getValue() as string}</div>
    //   );
    // },
  };
  return [browserCol, countryCol, dateCol, ipCol];
};

const SecurityPage = () => {
  const { loading: userDataLoading, userData } = useUserContext();
  const [activeSessions, setActiveSessions] = useState([
    {
      browser: "Chrome",
      country: "United States",
      activity: new Date(),
      ip: "127.0.0.1",
    },
    {
      browser: "Brave",
      country: "India",
      activity: "current session",
      ip: "127.0.0.1",
    },
  ]);
  const [activeHistory, setActiveHistory] = useState([
    {
      browser: "Chrome",
      country: "United States",
      teamMember: "John Doe",
      activity: new Date(),
      ip: "127.0.0.1",
    },
    {
      browser: "Brave",
      country: "India",
      teamMember: "John Doe",
      activity: new Date(),
      ip: "127.0.0.1",
    },
  ]);
  const handleFetchActivitySessions = (filters: any) => {
    //Handle Activity sessions filters
    console.log(filters);
  };

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px] text-primary">
        <div className="flex gap-4 flex-col">
          <h1 className="text-2xl font-medium max-md:hidden">Security</h1>
          <div className="flex flex-col gap-1">
            <h3 className="text-base">Active sessions</h3>
            <p>
              All sessions currently logged in with{" "}
              <span className="font-medium">{userData?.email}</span>
            </p>
            <DataTable
              columns={getTableColumns()}
              data={activeSessions}
              loading={userDataLoading}
              //   setLoading={setLoading}
              //   currentUcrm={currentUcrm}
              showFilter={false}
              type="security"
              showDownloadButton={false}
              showDownload={false}
              showPagination={false}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base">Activity history</h3>
            <p>Here are the last 30 days of activity on your account:</p>
            <DataTable
              columns={getSecurityTableColumns()}
              data={activeHistory}
              loading={userDataLoading}
              //   setLoading={setLoading}
              //   currentUcrm={currentUcrm}
              showFilter={false}
              type="security"
              showDownloadButton={false}
              showDownload={false}
              showPagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<SecuritySkeleton />}>
      <SecurityPage />
    </Suspense>
  );
}
