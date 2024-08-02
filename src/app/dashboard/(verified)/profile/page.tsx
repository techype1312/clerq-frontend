"use client";
import ProfileRow from "@/components/dashboard/profile/ProfileRow";
import ProfileRowContainer from "@/components/dashboard/profile/ProfileRowContainer";
import { MainContext } from "@/context/Main";
import Image from "next/image";
import React, { useContext } from "react";

const Page = () => {
  const { userdata } = useContext(MainContext);
  const rowData = [
    {
      title: "First Name",
      value: [
        userdata?.user_metadata?.first_name ?? "",
        userdata?.user_metadata?.last_name ?? "",
      ],
      isEditable: true,
    },
    {
      title: "Email",
      value: [userdata?.email ?? ""],
      isEditable: false,
    },
    {
      title: "Role",
      value: [userdata?.user_metadata?.role ?? "Admin"], // needs to be an array
      isEditable: false,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-primary text-2xl font-medium ml-1">Profile</h1>
      <div className="mt-auto flex gap-4 cursor-pointer items-center">
        <Image
          src="/profile.png"
          className="rounded-full"
          alt="logo"
          width={50}
          height={40}
        />
        <p className="text-primary font-semibold">
          {userdata?.user_metadata?.first_name}{" "}
          {userdata?.user_metadata?.last_name}
        </p>
        <div className="ml-2 background-muted text-primary px-2 py-1 rounded-md">
          {userdata?.user_metadata.role ?? "Admin"}
        </div>
      </div>
      {/* <ProfileRow
        rowData={{
          title: "First Name",
          value: [
            userdata?.user_metadata?.first_name ?? "",
            userdata?.user_metadata?.last_name ?? "",
          ],
          isEditable: true,
        }}
      /> */}
      <ProfileRowContainer profileData={rowData} />
    </div>
  );
};

export default Page;
