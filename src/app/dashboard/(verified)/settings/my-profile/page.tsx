"use client";

import ProfileRowContainer from "@/components/dashboard/profile";
import { UserContext } from "@/context/User";
import { addressSchema } from "@/types/schema-embedded";
import { RowData } from "@/utils/types";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";

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

const preferred_name_schema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
const legal_name_schema = z.object({
  legalFirstName: z.string(),
  legalLastName: z.string(),
});
const dob_schem = z.object({
  dob: z
    .date()
    .min(new Date("1900-01-01"), {
      message: "A valid date of birth is required",
    })
    .refine(
      (value) =>
        value < new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      {
        message: "Date of birth cannot be less than 18 years ago",
      }
    ),
});
const phone_schema = z.object({ phone: z.string() });

const Page = () => {
  const { userdata, otherUserData } = useContext(UserContext);
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    setRowData([
      {
        id: "email",
        label: "Email",
        formattedValue: userdata?.email ?? "",
        values: { email: userdata?.email ?? "" },
        type: "text",
        isEditable: false,
      },
      {
        id: "preferred_name",
        label: "Preferred name",
        formattedValue: userdata?.firstName + " " + userdata?.lastName,
        type: "text",
        isEditable: true,
        values: {
          firstName: userdata?.firstName,
          lastName: userdata?.lastName,
        },
        schema: preferred_name_schema,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      {
        id: "legal_name",
        label: "Legal name",
        formattedValue:
          userdata?.legalFirstName + " " + userdata?.legalLastName,
        values: {
          legalFirstName: userdata?.legalFirstName,
          legalLastName: userdata?.legalLastName,
        },
        type: "text",
        isEditable: true,
        schema: legal_name_schema,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      {
        id: "photo",
        label: "Profile Image",
        description: "This will appear on Otto next to your profile name.",
        values: {
          logo: userdata?.logo,
          name: userdata?.firstName,
        },
        type: "photo",
        isEditable: true,
        actions: {
          updatePhoto: async (data: any) => console.log(data),
          removePhoto: async (data: any) => console.log(data),
        },
      },
      {
        id: "dob",
        label: "Date of birth",
        formattedValue: userdata?.dob,
        values: { dob: userdata?.dob },
        type: "date",
        isEditable: true,
        schema: dob_schem,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      {
        id: "phone",
        label: "Phone no.",
        values: {
          country_code: userdata?.country_code,
          phone: userdata?.phone,
        },
        formattedValue: userdata?.country_code + userdata?.phone,
        type: "phone",
        isEditable: true,
        schema: phone_schema,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      {
        id: "mailing_address",
        label: "Mailing Address",
        values: {
          address: {
            country: "United States",
            address_line_1: userdata?.mailing_address?.address_line_1,
            address_line_2: userdata?.mailing_address?.address_line_2,
            city: userdata?.mailing_address?.city,
            postal_code: userdata?.mailing_address?.postal_code,
            state: userdata?.mailing_address?.state,
          },
          address_id: userdata?.mailing_address?.id,
        },
        formattedValue: formatAddress(userdata?.mailing_address),
        type: "address_modal",
        isEditable: true,
        schema: addressSchema,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      {
        id: "legal_address",
        label: "Legal Address",
        values: {
          address: {
            country: "United States",
            address_line_1: userdata?.legal_address?.address_line_1,
            address_line_2: userdata?.legal_address?.address_line_2,
            city: userdata?.legal_address?.city,
            postal_code: userdata?.legal_address?.postal_code,
            state: userdata?.legal_address?.state,
          },
          address_id: userdata?.legal_address?.id,
        },
        formattedValue: formatAddress(userdata?.legal_address),
        type: "address_modal",
        isEditable: true,
        schema: addressSchema,
        actions: {
          onUpdate: async (data: any) => console.log(data),
        },
      },
      // {
      //   id: "social",
      //   label: "Social",
      //   // value: userdata?.social,
      //   value: [
      //     { facebook: "https://www.facebook.com/" },
      //     { twitter: "https://www.twitter.com/" },
      //   ],
      //   type: "text",
      //   isEditable: true,
      //   company: false,
      // },
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
          onClick={() => {
            console.log("clicked");
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
