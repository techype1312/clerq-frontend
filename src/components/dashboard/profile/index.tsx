"use client";
import React, { useContext } from "react";
import ProfileItem, { rowData } from "./item";
import { UserContext } from "@/context/User";

const ProfileRowContainer = ({ profileData }: { profileData: rowData[] }) => {
  const { updateLocalUserData } = useContext(UserContext);
  return (
    <div className="flex flex-col">
      {profileData.map((data, index) => (
        <div className={`${data.id !== "social" ? "p-4" : ""} border-b pl-0`} key={index}>
          <ProfileItem rowData={data} updateLocalUserData={updateLocalUserData} />
        </div>
      ))}
    </div>
  );
};

export default ProfileRowContainer;
