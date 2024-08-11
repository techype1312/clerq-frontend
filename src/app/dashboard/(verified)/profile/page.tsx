"use client";
import ProfileRowContainer from "@/components/dashboard/profile/ProfileRowContainer";
import { UserContext } from "@/context/User";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";

const RoleItem = ({ label }: { label: string }) => {
  return (
    <div
      className="flex w-full items-center justify-between"
      style={{
        width: "160px",
      }}
    >
      <div
        className="flex flex-col justify-center"
        style={{
          borderRadius: "4px",
          whiteSpace: "nowrap",
          color: "#1e1e2a",
          textTransform: "capitalize",
        }}
      >
        <span
          style={{
            border: "1px solid #cce8ea",
            borderRadius: "4px",
            padding: "0 8px",
            fontWeight: 400,
            fontSize: "12px",
            letterSpacing: ".2px",
            lineHeight: "20px",
          }}
          className="hover:bg-teal-100"
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const Page = () => {
  const { userdata, otherUserData } = useContext(UserContext);
  const [rowData, setRowData] = useState<any>([]);

  useEffect(() => {
    setRowData([
      {
        title: "Email",
        value: [userdata?.email ?? ""],
        isEditable: false,
      },
      {
        title: "Preferred name",
        value: [userdata?.legalFirstName + " " + userdata?.legalLastName],
        isEditable: true,
      },
      {
        title: "Legal name",
        value: [userdata?.legalFirstName + " " + userdata?.legalLastName],
        isEditable: true,
      },
      // {
      //   title: "Date of birth",
      //   value: [otherUserData?.dob],
      //   type: "date",
      //   isEditable: true,
      // },
      {
        title: "Phone no.",
        value: [
          userdata?.phone !== "" ? userdata?.phone : otherUserData?.phone,
        ],
        type: "phone",
        isEditable: true,
      },
      {
        title: "Mailing Address",
        value: [userdata?.legal_address],
        isEditable: true,
      },
      {
        title: "Legal Address",
        value: [userdata?.legal_address],
        isEditable: true,
      },
      {
        title: "Instagram",
        value: [userdata?.instagram ?? "https://www.instagram.com/google"],
        type: "social-link",
        isEditable: true,
      },
      {
        title: "Social",
        value: [userdata?.social],
        type: "social",
        isEditable: true,
      },
    ]);
  }, [userdata, otherUserData]);

  if (!userdata) return null;

  return (
    <div className="flex flex-col gap-4 lg:mx-20">
      <div className="mt-auto flex gap-2 cursor-pointer items-center border-b pb-4">
        <Image
          src="/profile.png"
          className="rounded-lg"
          alt="logo"
          width={40}
          height={40}
        />
        <p
          className="ml-2"
          style={{
            fontSize: "28px",
            lineHeight: "36px",
            fontWeight: 380,
          }}
        >
          {userdata?.firstName}{" "}
          {userdata?.lastName}
        </p>
        <RoleItem label={userdata?.role?.name ?? ""}/>
      </div>
      <ProfileRowContainer profileData={rowData} />
    </div>
  );
};

export default Page;
