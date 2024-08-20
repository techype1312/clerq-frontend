"use client";

import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { RowData } from "@/types/general";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import { Loader2Icon } from "lucide-react";
import ProfileRowContainer from "@/components/dashboard/profile";
import ProfilePhoto from "@/components/profile-photo";
import { CompanyContextProvider, useCompanyContext } from "@/context/Company";
import { CompanyUpdateSchema } from "@/types/schemas/company";

const CompanyContainer = () => {
  const {
    loading,
    error,
    companyData,
    updateCompanyLogo,
    removeCompanyLogo,
    updateCompanyDetails,
  } = useCompanyContext();
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    if (isEmpty(companyData)) {
      setRowData([]);
    } else {
      setRowData([
        {
          id: "legal_name",
          label: "Legal Name",
          formattedValue: companyData.name,
          type: "text",
          isEditable: false,
          values: {
            legalName: companyData.name,
          },
          schema: CompanyUpdateSchema.legalName,
          actions: {
            onUpdate: updateCompanyDetails,
          },
        },
        {
          id: "dba_name",
          label: "Doing business as (DBA)",
          formattedValue: companyData.name,
          type: "text",
          isEditable: false,
          values: {
            dbaName: companyData.name,
          },
          schema: CompanyUpdateSchema.dbaName,
          actions: {
            onUpdate: updateCompanyDetails,
          },
        },
        {
          id: "ein",
          label: "Fedral EIN",
          formattedValue: companyData.ein,
          type: "text",
          isEditable: true,
          values: {
            fedralEin: companyData.ein,
          },
          schema: CompanyUpdateSchema.ein,
          actions: {
            onUpdate: updateCompanyDetails,
          },
        },
        {
          id: "name",
          label: "Company name",
          description:
            "This is the name that appears on Clerq and in your notifications.",
          formattedValue: companyData.name,
          type: "text",
          isEditable: true,
          values: {
            companyName: companyData.name,
          },
          schema: CompanyUpdateSchema.companyName,
          actions: {
            onUpdate: updateCompanyDetails,
          },
        },
        {
          id: "company_logo",
          label: "Company logo",
          description: "This will appear on Clerq next to your company name.",
          values: {
            logo: companyData.logo,
            name: companyData.name,
          },
          type: "photo",
          isEditable: true,
          actions: {
            updatePhoto: updateCompanyLogo,
            removePhoto: removeCompanyLogo,
          },
        },
        {
          id: "phone",
          label: "Phone number",
          formattedValue: formatPhoneNumber(
            companyData.phone,
            companyData.country_code
          ),
          type: "phone",
          isEditable: true,
          values: {
            phone: {
              phoneWithDialCode: `${companyData.country_code} ${companyData.phone}`,
              countryCode: companyData.country_code,
              phone: companyData.phone,
            },
          },
          schema: CompanyUpdateSchema.phone,
          actions: {
            onUpdate: async (values) => console.log(values),
          },
        },
        {
          id: "email",
          label: "Company Email",
          description:
            "Team members and pre-authorized vendors can forward invoices directly to your Payments page via this address.",
          formattedValue: companyData.email,
          type: "text",
          isEditable: false,
        },
        {
          id: "address",
          label: "Company mailing address",
          description:
            "We’ll send physical cards and surprise gifts to this address.",
          formattedValue: companyData.mailing_address
            ? formatAddress(companyData.mailing_address)
            : "",
          type: "address_modal",
          isEditable: true,
          values: {
            address: {
              country: "United States",
              address_line_1: companyData.mailing_address?.address_line_1,
              address_line_2: companyData.mailing_address?.address_line_2,
              city: companyData.mailing_address?.city,
              postal_code: companyData.mailing_address?.postal_code,
              state: companyData.mailing_address?.state,
            },
            address_id: companyData.mailing_address?.id,
          },
          schema: CompanyUpdateSchema.address,
          actions: {
            onUpdate: async (data: any) => console.log(data),
          },
        },
        {
          id: "legal_address",
          label: "Company legal address",
          description:
            "The billing address for your cards that will appear on bank documents.",
          formattedValue: companyData.legal_address
            ? formatAddress(companyData.legal_address)
            : "",
          type: "address_modal",
          isEditable: true,
          values: {
            address: {
              country: "United States",
              address_line_1: companyData.legal_address?.address_line_1,
              address_line_2: companyData.legal_address?.address_line_2,
              city: companyData.legal_address?.city,
              postal_code: companyData.legal_address?.postal_code,
              state: companyData.legal_address?.state,
            },
            address_id: companyData.legal_address?.id,
          },
          schema: CompanyUpdateSchema.address,
          actions: {
            onUpdate: async (data: any) => console.log(data),
          },
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData]);

  if (loading) {
    return (
      <div className="w-full flex items-center h-12 justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (!loading && !companyData) {
    return (
      <div className="w-full flex items-center h-12 justify-center">
        No data found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:mx-20">
      <div className="mt-auto flex gap-2 items-center border-b pb-4">
        <ProfilePhoto
          firstName={companyData?.name}
          photo={companyData?.logo}
          updatePhoto={updateCompanyLogo}
          removePhoto={removeCompanyLogo}
          canEdit={true}
          showButtons={false}
        />
        <p
          className="ml-2"
          style={{
            fontSize: "28px",
            lineHeight: "36px",
            fontWeight: 380,
          }}
        >
          {companyData?.name}
        </p>
      </div>
      <ProfileRowContainer profileData={rowData} />
    </div>
  );
};

const Page = () => {
  return (
    <CompanyContextProvider>
      <CompanyContainer />
    </CompanyContextProvider>
  );
};

export default Page;