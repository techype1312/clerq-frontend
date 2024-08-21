"use client";

import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import Image from "next/image";
import { useUserContext } from "@/context/User";
import { RowData } from "@/types/general";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import { UserUpdateSchema } from "@/types/schemas/user";
import ProfileRowContainer from "@/components/dashboard/profile";
import { Loader2Icon } from "lucide-react";

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
  const {
    loading,
    error,
    userData,
    updateUserPhoto,
    removeUserPhoto,
    updateUserData,
  } = useUserContext();
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    if (isEmpty(userData)) {
      setRowData([]);
    } else {
      setRowData([
        {
          id: "email",
          label: "Email",
          formattedValue: userData?.email ?? "",
          values: { email: userData?.email ?? "" },
          type: "text",
          isEditable: false,
        },
        {
          id: "legal_name",
          label: "Legal name",
          formattedValue:
            userData?.legalFirstName + " " + userData?.legalLastName,
          values: {
            legalFirstName: userData?.legalFirstName,
            legalLastName: userData?.legalLastName,
          },
          type: "text",
          isEditable: true,
          schema: UserUpdateSchema.legalName,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "preferred_name",
          label: "Preferred name",
          formattedValue: userData?.firstName + " " + userData?.lastName,
          type: "text",
          isEditable: true,
          values: {
            firstName: userData?.firstName,
            lastName: userData?.lastName,
          },
          schema: UserUpdateSchema.preferredName,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "photo",
          label: "Profile Image",
          description: "This will appear on Otto next to your profile name.",
          values: {
            logo: userData?.photo,
            name: userData?.firstName,
          },
          type: "photo",
          isEditable: true,
          actions: {
            updatePhoto: updateUserPhoto,
            removePhoto: removeUserPhoto,
          },
        },
        {
          id: "dob",
          label: "Date of birth",
          formattedValue: userData?.dob,
          values: { dob: userData?.dob },
          type: "date",
          isEditable: true,
          schema: UserUpdateSchema.dob,
          actions: {
            onUpdate: async (data: any) => console.log(data),
          },
        },
        {
          id: "phone",
          label: "Phone no.",
          values: {
            phone: {
              phoneWithDialCode: `${userData?.country_code} ${userData?.phone}`,
              countryCode: userData?.country_code,
              phone: userData?.phone,
            },
          },
          formattedValue: formatPhoneNumber(
            userData?.phone,
            userData?.country_code
          ),
          type: "phone",
          isEditable: true,
          schema: UserUpdateSchema.phone,
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
              address_line_1: userData?.mailing_address?.address_line_1,
              address_line_2: userData?.mailing_address?.address_line_2,
              city: userData?.mailing_address?.city,
              postal_code: userData?.mailing_address?.postal_code,
              state: userData?.mailing_address?.state,
            },
            address_id: userData?.mailing_address?.id,
          },
          formattedValue: userData.mailing_address
            ? formatAddress(userData.mailing_address)
            : "",
          type: "address_modal",
          isEditable: true,
          schema: UserUpdateSchema.address,
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
              address_line_1: userData?.legal_address?.address_line_1,
              address_line_2: userData?.legal_address?.address_line_2,
              city: userData?.legal_address?.city,
              postal_code: userData?.legal_address?.postal_code,
              state: userData?.legal_address?.state,
            },
            address_id: userData?.legal_address?.id,
          },
          formattedValue: userData.legal_address
            ? formatAddress(userData.legal_address)
            : "",
          type: "address_modal",
          isEditable: true,
          schema: UserUpdateSchema.address,
          actions: {
            onUpdate: async (data: any) => console.log(data),
          },
        },
        // {
        //   id: "social",
        //   label: "Social",
        //   // value: userData?.social,
        //   value: [
        //     { facebook: "https://www.facebook.com/" },
        //     { twitter: "https://www.twitter.com/" },
        //   ],
        //   type: "text",
        //   isEditable: true,
        //   company: false,
        // },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  if (loading) {
    return (
      <div className="w-full flex items-center h-12 justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!loading && !userData) {
    return (
      <div className="w-full flex items-center h-12 justify-center">
        No data found
      </div>
    );
  }

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
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
              {userData?.firstName} {userData?.lastName}
            </p>
            <RoleItem label={userData?.role?.name ?? ""} />
          </div>
          <ProfileRowContainer profileData={rowData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
