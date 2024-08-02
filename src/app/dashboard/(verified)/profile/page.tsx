"use client";
import ProfileRow from "@/components/dashboard/profile/ProfileRow";
import ProfileRowContainer from "@/components/dashboard/profile/ProfileRowContainer";
import { MainContext } from "@/context/Main";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";
import { title } from "process";
import React, { useContext, useEffect, useState } from "react";

const Page = () => {
  const { userdata, otherUserData } = useContext(MainContext);
  const [rowData, setRowData] = useState<any>([]);
  useEffect(()=>{
    setRowData([
      {
        title: "Email",
        value: [userdata?.email ?? ""],
        isEditable: false,
      },
      {
        title: "Point of contact",
        value: [userdata?.email ?? ""
          // otherUserData?.point_of_contact &&
            // otherUserData?.point_of_contact?.length > 0 &&
            // otherUserData?.point_of_contact[0],
          // otherUserData?.point_of_contact &&
            // otherUserData?.point_of_contact?.length > 1 &&
            // otherUserData?.point_of_contact[1],
        ],
        isEditable: true,
      },
      {
        title: "Legal name",
        value: [
          userdata?.user_metadata?.first_name +
            " " +
            userdata?.user_metadata?.last_name,
        ],
        isEditable: true,
      },
      {
        title: "Instagram",
        value: [userdata?.user_metadata?.instagram ?? "https://www.instagram.com/google"], // needs to be an array
        type: "social-link",
        isEditable: true,
      },
      {
        title: "Social",
        value: [userdata?.user_metadata?.social], // needs to be an array
        type: "social",
        isEditable: true,
      },
      {
        title: "Date of birth",
        value: [otherUserData?.date_of_birth], // needs to be an array
        type: "date",
        isEditable: true,
      },
      {
        title: "Phone no.",
        value: [userdata?.phone !== '' ? userdata?.phone : otherUserData?.phone], // needs to be an array
        type: "phone",
        isEditable: true,
      },
      {
        title: "Address",
        value: [userdata?.user_metadata?.address], // needs to be an array
        isEditable: true,
      },
    ]);
  },[userdata, otherUserData])
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-primary text-2xl font-medium ml-1">Profile</h1>
      <div className="mt-auto flex gap-4 cursor-pointer items-center">
        <Image
          src="/profile.png"
          className="rounded-full"
          alt="logo"
          width={40}
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
