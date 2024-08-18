"use client";

import React from "react";
import ProfileItem from "./item";
import { RowData } from "@/utils/types";

const ProfileRowContainer = ({ profileData }: { profileData: RowData[] }) => {
  return (
    <div className="flex flex-col">
      {profileData.map((data, index) => (
        <div
          className={`${data.id !== "social" ? "p-4" : ""} border-b pl-0`}
          key={index}
        >
          <ProfileItem rowData={data} />
        </div>
      ))}
    </div>
  );
};

export default ProfileRowContainer;
