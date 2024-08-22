"use client";

import React, { useCallback, useEffect, useState } from "react";
import { find, findIndex, isObject, reject } from "lodash";
import { Loader2Icon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { ErrorProps } from "@/types/general";
import TeamApis from "@/actions/apis/TeamApis";
import { useUserContext } from "@/context/User";
import { allRoles, statuses } from "@/utils/constants";
import InviteTeamApis from "@/actions/apis/InviteApi";
import InviteNewMemberDialog from "@/components/teams/InviteNewMember";
import ColumnProfileItem from "@/components/teams/Columns/ProfileItem";
import ColumnRoleItem from "@/components/teams/Columns/RoleItem";
import TeamActionMenu from "@/components/teams/TeamActionMenu";
import { useCompanySessionContext } from "@/context/CompanySession";

const Page = () => {
  const { userData } = useUserContext();
  const { currentUcrm } = useCompanySessionContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Record<string, any>[]>([]);
  const [teamInvites, setTeamInvites] = useState<Record<string, any>[]>([]);
  const [rowData, setRowData] = useState<Record<string, any>[]>([]);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onStatusUpdate = (ucrmId: string, status: Record<string, any>) => {
    const index = findIndex(teamMembers, { id: ucrmId });
    if (index !== -1) {
      teamMembers[index].status = status;
    }
    setTeamMembers(teamMembers);
    handleRowData();
  };

  const onRolePermissionsUpdate = (
    ucrmId: string,
    data: Record<string, any>
  ) => {
    const index = findIndex(teamMembers, { id: ucrmId });
    if (index !== -1) {
      teamMembers[index].role = data.role;
      teamMembers[index].permissions = data.permissions;
    }
    setTeamMembers(teamMembers);
    handleRowData();
  };

  const onFetchTeamMembersSuccess = (res: any) => {
    if (res.data && res.data?.data?.length) {
      setTeamMembers(res.data.data);
    }
    setLoading(false);
  };

  const fetchTeamMembers = useCallback(() => {
    if (loading) return false;
    setLoading(true);
    return TeamApis.getAllTeamMembers({}).then(
      onFetchTeamMembersSuccess,
      onError
    );
  }, [loading]);

  const onRemoveInvite = (inviteId: string) => {
    const updatedInvites = reject(teamInvites, { id: inviteId });
    setTeamInvites(updatedInvites);
  };

  const onAddInvite = (data: Record<string, any>) => {
    setTeamInvites([...teamInvites, data]);
  };

  const onFetchInvitesSuccess = (res: any) => {
    if (res.data && res.data?.data?.length) {
      setTeamInvites(res.data.data);
    }
  };

  const fetchInvites = useCallback(() => {
    setLoading(true);
    return InviteTeamApis.getAllInvites({}).then(
      onFetchInvitesSuccess,
      onError
    );
  }, []);

  useEffect(() => {
    fetchTeamMembers();
    fetchInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const teamsColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ cell, row }) => {
        return (
          <ColumnProfileItem
            label={cell.getValue() as string}
            row={row.original}
          />
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ cell, row }) => {
        return (
          <ColumnRoleItem label={row.original.roleLabel} row={row.original} />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ cell, row }) => {
        return (
          <ColumnRoleItem
            label={row.original.statusLabel as string}
            row={row.original}
          />
        );
      },
    },
    {
      accessorKey: "lastActive",
      header: () => <div className="text-center">{"Last Active"}</div>,
      cell: ({ cell, row }) => {
        return (
          <div className="flex flex-row gap-2 justify-end">
            <span
              style={{
                fontWeight: 400,
                fontSize: "12px",
                letterSpacing: ".2px",
                lineHeight: "20px",
                color: "#535461",
              }}
            >
              {cell.getValue() as string}
            </span>
            <TeamActionMenu
              row={row.original}
              onRemoveInvite={onRemoveInvite}
              onRolePermissionsUpdate={onRolePermissionsUpdate}
              onStatusUpdate={onStatusUpdate}
            />
          </div>
        );
      },
    },
  ];

  const handleRowData = () => {
    const members = teamMembers.map((tm) => ({
      id: tm.id,
      name: [tm.user?.firstName, tm.user?.lastName].join(" "),
      firstName: tm.user?.firstName,
      lastName: tm.user?.lastName,
      email: tm.user?.email,
      role: tm.role?.id,
      roleLabel: find(allRoles, { id: tm.role?.id })?.name,
      status: tm.status?.id,
      statusLabel: find(statuses, { id: tm.status?.id })?.name,
      showEdit:
        tm.role?.id !== 3 && userData?.id !== tm.user?.id && tm.status?.id === 1,
      showStatusUpdate: tm.role?.id !== 3 && userData?.id !== tm.user?.id,
      lastActive: "Yesterday",
      photo: tm.user?.photo
    }));
    const invites = teamInvites.map((im) => ({
      id: im.id,
      name: [im.firstName, im.lastName].join(" "),
      firstName: im.firstName,
      lastName: im.lastName,
      email: im.email,
      role: im.role.id,
      roleLabel: find(allRoles, { id: im.role.id })?.name,
      status: im.status,
      statusLabel: im.status,
      showEdit: false,
      showStatusUpdate: false,
      showResendInvite: true,
      showRemoveInvite: true,
      lastActive: "Invited",
    }));
    setRowData([...members, ...invites]);
  };

  useEffect(() => {
    handleRowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMembers.length, teamInvites.length]);

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-row justify-between">
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "500",
              lineHeight: "28.8px",
              textAlign: "left",
              color: "#1E1E2A",
            }}
          >
            Team
          </h1>
          <InviteNewMemberDialog onAddSuccess={onAddInvite} />
        </div>

        {loading && (
          <div className="w-full flex items-center h-12 justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}

        {!loading && !rowData.length && (
          <div className="w-full flex items-center h-12 justify-center">
            No data found
          </div>
        )}

        {!loading && !!rowData.length && (
          <div className="mt-6 flex gap-1 flex-col items-start">
            <DataTable
              showPagination={false}
              showHeader={true}
              showDownloadButton={false}
              showUploadButton={false}
              columns={teamsColumns}
              data={rowData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
