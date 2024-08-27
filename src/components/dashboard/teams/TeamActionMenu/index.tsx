import React from "react";
import MemberStatusUpdateDialog from "@/components/dashboard/teams/MemberStatusUpdate";
import ResendInviteButton from "@/components/dashboard/teams/ResendInvite";
import RemoveInviteDialog from "@/components/dashboard/teams/RemoveInvite";
import EditMemberDialog from "@/components/dashboard/teams/EditMember";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TeamActionMenu = ({
  row,
  onStatusUpdate,
  onRemoveInvite,
  onRolePermissionsUpdate,
}: {
  row: any;
  onRolePermissionsUpdate: (
    ucrmId: string,
    status: Record<string, any>
  ) => void;
  onStatusUpdate: (ucrmId: string, status: Record<string, any>) => void;
  onRemoveInvite: (inviteId: string) => void;
}) => {
  if (
    !row.showEdit &&
    !row.showStatusUpdate &&
    !row.showRemoveInvite &&
    !row.showResendInvite
  )
    return <div className="ml-8"></div>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="rounded-md flex items-center cursor-pointer mr-4 hover:bg-blue-100">
          <SymbolIcon icon="more_vert" size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-8 p-0">
        <DropdownMenuGroup className="flex flex-col">
          {row.showEdit && (
            <EditMemberDialog row={row} onUpdate={onRolePermissionsUpdate} />
          )}
          {row.showStatusUpdate && (
            <MemberStatusUpdateDialog row={row} onUpdate={onStatusUpdate} />
          )}
          {row.showResendInvite && <ResendInviteButton row={row} />}
          {row.showRemoveInvite && (
            <RemoveInviteDialog row={row} onUpdate={onRemoveInvite} />
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamActionMenu;
