"use client";

import React from "react";
import { RowData } from "@/types/general";
import ProfileItem from "./item";

const ProfileRowContainer = ({ profileData }: { profileData: RowData[] }) => {
  return (
    <div className="flex flex-col">
      {profileData.map((data, index) => (
        <div
          className={`${data.id !== "social" ? "pt-4 md:p-4" : ""} border-b pl-0`}
          key={index}
        >
          <ProfileItem rowData={data} />
        </div>
      ))}
    </div>
  );
};

export default ProfileRowContainer;
