"use client";
import React from "react";
import ProfileItem, { rowData } from "./item";

const ProfileRowContainer = ({
  profileData,
}: {
  profileData: rowData[];
}) => {
  return (
    <div className="flex flex-col">
      {profileData.map((data, index) => (
        <div className="border-b p-4 pl-0" key={index}>
          <ProfileItem rowData={data} />
        </div>
      ))}
    </div>
  );
};

export default ProfileRowContainer;
