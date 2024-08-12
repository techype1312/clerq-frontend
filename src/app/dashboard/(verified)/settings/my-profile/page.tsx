"use client";

import ProfileRowContainer from "@/components/dashboard/profile";
import { UserContext } from "@/context/User";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
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
        value: userdata?.email ?? "",
        type: "text",
        isEditable: false,
      },
      {
        title: "Preferred name",
        value: userdata?.firstName + " " + userdata?.lastName,
        type: "text",
        isEditable: true,
      },
      {
        title: "Legal name",
        value: userdata?.legalFirstName + " " + userdata?.legalLastName,
        type: "text",
        isEditable: false,
      },
      {
        title: "Date of birth",
        value: userdata?.dob,
        type: "text",
        isEditable: true,
      },
      {
        title: "Phone no.",
        value: formatPhoneNumber(userdata?.phone, userdata?.country_code),
        type: "text",
        isEditable: true,
      },
      {
        title: "Mailing Address",
        value: formatAddress(userdata?.mailing_address),
        type: "text",
        isEditable: true,
      },
      {
        title: "Legal Address",
        value: formatAddress(userdata?.legal_address),
        isEditable: true,
      },
      {
        title: "Social",
        value: userdata?.social,
        type: "text",
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
          {userdata?.firstName} {userdata?.lastName}
        </p>
        <RoleItem label={userdata?.role?.name ?? ""} />
      </div>
      <ProfileRowContainer profileData={rowData} />
    </div>
  );
};

export default Page;
