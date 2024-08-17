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
        id: "email",
        title: "Email",
        value: userdata?.email ?? "",
        type: "text",
        isEditable: false,
        company: false,
      },
      {
        id: "firstName, lastName",
        title: "Preferred name",
        value: userdata?.firstName + " " + userdata?.lastName,
        type: "text",
        isEditable: true,
        company: false,
      },
      {
        id: "legalFirstName, legalLastName",
        title: "Legal name",
        value: userdata?.legalFirstName + " " + userdata?.legalLastName,
        type: "text",
        isEditable: false,
        company: false,
      },
      {
        id: "dob",
        title: "Date of birth",
        value: userdata?.dob,
        type: "date",
        isEditable: true,
        company: false,
      },
      {
        id: "phone",
        title: "Phone no.",
        value: userdata?.country_code + userdata?.phone, 
        // formatPhoneNumber(userdata?.phone, userdata?.country_code),
        type: "phone",
        isEditable: true,
        company: false,
      },
      {
        id: "address", // doesn't matter if it's mailing or legal address 
        title: "Mailing Address",
        value: formatAddress(userdata?.mailing_address),
        unFormattedValue: userdata?.mailing_address,
        type: "address_modal",
        isEditable: true,
        company: false,
      },
      {
        id: "address",
        title: "Legal Address",
        value: formatAddress(userdata?.legal_address),
        unFormattedValue: userdata?.legal_address,
        type: "address_modal", // this is the new modal for address only
        isEditable: true,
        company: false,
      },
      {
        id: "social",
        title: "Social",
        // value: userdata?.social,
        value: [
          { facebook: "https://www.facebook.com/" },
          { twitter: "https://www.twitter.com/" },
        ],
        type: "text",
        isEditable: true,
        company: false,
      },
    ]);
  }, [userdata, otherUserData]);

  if (!userdata) {
    return (
      <div className="w-full flex items-center h-12 justify-center">
        No data found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:mx-20">
      <div className="mt-auto flex gap-2 cursor-pointer items-center border-b pb-4">
        <Image
          onClick={()=>{
            console.log("clicked")
          }}
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
