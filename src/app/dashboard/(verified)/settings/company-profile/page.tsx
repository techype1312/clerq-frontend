"use client";
import CompanyProfileRowContainer from "@/components/dashboard/company-profile";
import Image from "next/image";
import React from "react";

const formatPhoneNumber = (phone: string, countryCode: number | string) => {
  const phoneStr = phone.toString();
  const formattedPhone = `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
    3,
    6
  )}-${phoneStr.slice(6)}`;

  const result = `+${countryCode} ${formattedPhone}`;
  return result;
};

interface Address {
  country: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
}

const formatAddress = (address: Address) => {
  const { country, address_line_1, address_line_2, city, state, postal_code } =
    address;

  return `${address_line_1}
${address_line_2}
${city}, ${state} ${postal_code}
${country}`;
};

const Page = () => {
  const userdata = {
    legal_name: "Clerq, Incroporated",
    name: "Clerq",
    ein: "123456789",
    email: "anurag@joinclerq.com",
    company_logo: "",
    phone: "8000000000",
    country_code: 1,
    mailing_address: {
      country: "US",
      address_line_1: "920 SW 6th Ave",
      address_line_2: "Floor 7",
      city: "Portland",
      state: "OR",
      postal_code: "97204",
    },
    legal_address: {
      country: "US",
      address_line_1: "920 SW 6th Ave",
      address_line_2: "Floor 7",
      city: "Portland",
      state: "OR",
      postal_code: "97204",
    },
  };

  const rowData = [
    {
      id: "legal_name",
      title: "Legal Name",
      value: userdata.legal_name,
      type: "text",
      isEditable: false,
    },
    {
      id: "dba_name",
      title: "Doing business as (DBA)",
      value: userdata.legal_name,
      type: "text",
      isEditable: false,
    },
    {
      id: "ein",
      title: "Fedral EIN",
      value: userdata.ein,
      type: "text",
      isEditable: false,
    },
    {
      id: "name",
      title: "Company name",
      description:
        "This is the name that appears on Clerq and in your notifications.",
      value: userdata.name,
      type: "text",
      isEditable: true,
    },
    {
      id: "company_logo",
      title: "Company logo",
      description: "This will appear on Clerq next to your company name.",
      value: userdata.company_logo,
      type: "logo",
      isEditable: true,
    },
    {
      id: "phone",
      title: "Phone number",
      value: formatPhoneNumber(userdata.phone, userdata.country_code),
      type: "phone",
      isEditable: true,
    },
    {
      id: "email",
      title: "Company Email",
      description:
        "Team members and pre-authorized vendors can forward invoices directly to your Payments page via this address.",
      value: userdata.email,
      type: "email",
      isEditable: true,
    },
    {
      id: "mailing_address",
      title: "Company mailing address",
      description:
        "We’ll send physical cards and surprise gifts to this address.",
      value: formatAddress(userdata.mailing_address),
      type: "address",
      isEditable: true,
    },
    {
      id: "legal_address",
      title: "Company legal address",
      description:
        "The billing address for your cards that will appear on bank documents.",
      value: formatAddress(userdata.legal_address),
      type: "address",
      isEditable: true,
    },
  ];

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
          {userdata.name}
        </p>
      </div>
      <CompanyProfileRowContainer profileData={rowData} />
    </div>
  );
};

export default Page;
