"use client";

import React, { useCallback, useEffect, useState } from "react";
import { find, findIndex, isObject, reject } from "lodash";
import { Loader2Icon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { ErrorProps } from "@/types/general";
import { useUserContext } from "@/context/User";
import { allRoles, statuses } from "@/utils/constants";
import InviteNewMemberDialog from "@/components/dashboard/teams/InviteNewMember";
import ColumnProfileItem from "@/components/dashboard/teams/Columns/ProfileItem";
import ColumnRoleItem from "@/components/dashboard/teams/Columns/RoleItem";
import TeamActionMenu from "@/components/dashboard/teams/TeamActionMenu";
import { useCompanySessionContext } from "@/context/CompanySession";
import { useMainContext } from "@/context/Main";
import InviteTeamApis from "@/actions/data/invite.data";
import TeamApis from "@/actions/data/team-data";

const getTableColumns = ({
  windowWidth,
  onStatusUpdate,
  onRemoveInvite,
  onRolePermissionsUpdate,
}: {
  windowWidth: number;
  onRolePermissionsUpdate: (
    ucrmId: string,
    status: Record<string, any>
  ) => void;
  onStatusUpdate: (ucrmId: string, status: Record<string, any>) => void;
  onRemoveInvite: (inviteId: string) => void;
}): ColumnDef<any>[] => {
  const userProfileCol: ColumnDef<any> = {
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
  };
  const userStatusCol: ColumnDef<any> = {
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
  };
  const userRoleCol: ColumnDef<any> = {
    accessorKey: "role",
    header: "Role",
    cell: ({ cell, row }) => {
      return (
        <ColumnRoleItem label={row.original.roleLabel} row={row.original} />
      );
    },
  };
  const userActionsCol: ColumnDef<any> = {
    accessorKey: "lastActive",
    header: () => <div className="text-center">{"Last Active"}</div>,
    cell: ({ cell, row }) => {
      return (
        <div className="flex flex-row gap-2 justify-end">
          <span
            style={{
              letterSpacing: ".2px",
            }}
            className="text-xs text-[#535461] font-normal"
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
  };
  if (windowWidth < 576) {
    return [userProfileCol, userActionsCol];
  }
  if (windowWidth < 768) {
    return [userProfileCol, userStatusCol, userActionsCol];
  }
  return [userProfileCol, userRoleCol, userStatusCol, userActionsCol];
};

const Page = () => {
  const { windowWidth } = useMainContext();
  const { userData } = useUserContext();
  const { currentUcrm } = useCompanySessionContext();
  const [teamMembers, setTeamMembers] = useState<Record<string, any>[]>([]);
  const [teamInvites, setTeamInvites] = useState<Record<string, any>[]>([]);
  const [rowData, setRowData] = useState<Record<string, any>[]>([]);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchTeamMembersSuccess = (res: any) => {
    setTeamMembers(res.data);
    setLoading(false);
  };

  const fetchTeamMembers = useCallback(() => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return TeamApis.getAllTeamMembers({}).then(
      onFetchTeamMembersSuccess,
      onError
    );
  }, [loading]);

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

  const onRemoveInvite = (inviteId: string) => {
    const updatedInvites = reject(teamInvites, { id: inviteId });
    setTeamInvites(updatedInvites);
  };

  const onAddInvite = (data: Record<string, any>) => {
    setTeamInvites([...teamInvites, data]);
  };

  const onFetchInvitesSuccess = (res: any) => {
    setTeamInvites(res.data);
  };

  const fetchInvites = useCallback(() => {
    setServerError("");
    return InviteTeamApis.getAllInvites({}).then(
      onFetchInvitesSuccess,
      onError
    );
  }, []);

  useEffect(() => {
    if (!currentUcrm?.company?.id) return;
    fetchTeamMembers();
    fetchInvites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

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
        tm.role?.id !== 3 &&
        userData?.id !== tm.user?.id &&
        tm.status?.id === 1,
      showStatusUpdate: tm.role?.id !== 3 && userData?.id !== tm.user?.id,
      lastActive: "Yesterday",
      photo: tm.user?.photo,
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
          <h1 className="text-2xl font-medium text-primary text-left max-md:hidden">
            Team
          </h1>
          <InviteNewMemberDialog onAddSuccess={onAddInvite} />
        </div>

        {/* {!dataFetched && (
          <div className="w-full flex items-center h-12 justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )} */}

        {!loading && !rowData.length && (
          <div className="w-full flex items-center h-[10vh] justify-center">
            Click on the button above to invite a new team member.
          </div>
        )}
        <div className="mt-6 flex gap-1 flex-col items-start">
          <DataTable
            showPagination={false}
            showHeader={true}
            showDownloadButton={false}
            showUploadButton={false}
            columns={getTableColumns({
              windowWidth,
              onRemoveInvite,
              onRolePermissionsUpdate,
              onStatusUpdate,
            })}
            data={rowData}
            showDownload={false}
            type="team"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
