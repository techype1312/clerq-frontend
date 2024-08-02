"use client";
import React from "react";
import ProfileRow, { rowData } from "./ProfileRow";

const ProfileRowContainer = ({ profileData }: { profileData: rowData[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {profileData.map((data, index) => (
        <div className="border-b mt-2" key={index}>
          <ProfileRow rowData={data} />
        </div>
      ))}
    </div>
  );
};

export default ProfileRowContainer;
