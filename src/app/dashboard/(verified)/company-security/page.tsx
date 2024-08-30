"use client";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import SecuritySkeleton from "@/components/skeletons/dashboard/SecuritySkeleton";
import { useUserContext } from "@/context/User";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { Suspense, useState } from "react";

export const getSecurityTableColumns = (): ColumnDef<any>[] => {
  const dateCol: ColumnDef<any> = {
    accessorKey: "activity",
    header: "Most recent activity",
    cell: ({ cell }) => {
      return (
        <div className="text-sm">
          {format(cell.getValue() as string, "MMM d, yyyy") +
            " at " +
            format(cell.getValue() as string, "h:mm a")}
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

  const teamMember: ColumnDef<any> = {
    accessorKey: "teamMember",
    header: "Team Member",
    // cell: ({ cell }) => {
    //   return (
    //     <div className="text-sm">{cell.getValue() as string}</div>
    //   );
    // },
  };
  return [dateCol, teamMember, browserCol, ipCol, countryCol];
};

const CompanySecurityPage = () => {
  const { loading: userDataLoading } = useUserContext();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 100,
  });
  const [dateFilter, setDateFilter] = useState<any>();
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
  const [columnFilters, setColumnFilters] = useState<any>([]);

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px] text-primary">
        <div className="flex gap-4 flex-col">
          <h1 className="text-2xl font-medium max-md:hidden">
            Company security
          </h1>
          <div className="flex flex-col gap-1">
            <p>Activity history from all team members</p>
            <DataTable
              columns={getSecurityTableColumns()}
              data={activeHistory}
              loading={userDataLoading}
              showFilter={true}
              type="security"
              showDownloadButton={true}
              showDownload={true}
              showPagination={false}
              pagination={pagination}
              filtersCategory={[
                {
                  label: "Date",
                  value: "date",
                },
              ]}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              defaultOpenedFilter="date"
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
      <CompanySecurityPage />
    </Suspense>
  );
}
