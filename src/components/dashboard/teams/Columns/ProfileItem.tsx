import React from "react";
import ProfilePhotoPreview from "@/components/common/profile-photo/ProfilePhotoPreview";
import ColumnRoleItem from "./RoleItem";

const ColumnProfileItem = ({ label, row }: { label: string; row: any }) => {
  return (
    <div className="flex w-full items-center justify-between min-w-56">
      <div className="flex text-label text-base gap-4 items-center">
        <ProfilePhotoPreview
          firstName={label?.split(' ')?.[0]}
          lastName={label?.split(' ')?.[1]}
          photo={row?.photo}
          size={32}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center gap-1">
          <span className="text-base">{label}</span>
          <span className="text-xs text-muted">{row.email}</span>
          <div className="md:hidden">
            <ColumnRoleItem label={row.roleLabel} row={row} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnProfileItem;
