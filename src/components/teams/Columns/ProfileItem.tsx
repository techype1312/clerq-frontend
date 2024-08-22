import React from "react";
import Avatar from "../Avatar";
import ProfilePhotoPreview from "@/components/profile-photo/ProfilePhotoPreview";

const ColumnProfileItem = ({ label, row }: { label: string; row: any }) => {
  return (
    <div
      className="flex w-full items-center justify-between min-w-56"
      style={{
        color: "#535460",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "22.4px",
        textAlign: "left",
      }}
    >
      <div className="flex text-label text-base gap-4 items-center">
        <ProfilePhotoPreview
          firstName={label}
          photo={row?.photo}
          size={32}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center">
          <span
            style={{
              color: "#363644",
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: "#70707d",
              fontSize: "13px",
              letterSpacing: ".1px",
              lineHeight: "20px",
            }}
          >
            {row.email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ColumnProfileItem;
