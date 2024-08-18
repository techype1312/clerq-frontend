"use client";
import CompanyApis from "@/actions/apis/CompanyApis";
import ProfileRowContainer from "@/components/dashboard/profile";
import ProfilePhoto from "@/components/profile-photo";
import { useCompanySession } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import { addressSchema } from "@/types/schema-embedded";
import { RowData } from "@/utils/types";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import _, { isEmpty } from "lodash";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const company_name_schema = z.object({
  companyName: z.string(),
});

const dba_name_schema = z.object({
  dbaName: z.string(),
});

const legal_name_schema = z.object({
  legalName: z.string(),
});

const ein_schema = z.object({
  fedralEin: z.string(),
});

const phone_schema = z.object({ phone: z.string() });

interface Photo {
  id: string;
  path: string;
}

const Page = () => {
  const { currentUcrm } = useCompanySession();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<Record<string, any>>();
  const [rowData, setRowData] = useState<RowData[]>([]);

  const onError = (err: string | ErrorProps) => {
    setError(_.isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchCompanyDetailsSuccess = (res: any) => {
    if (res.data) {
      setCompanyData(res.data);
    }
    setLoading(false);
  };

  const fetchCompanyData = useCallback(async () => {
    if (loading || !currentUcrm?.company?.id) return false;
    setLoading(true);
    return CompanyApis.getCompany(currentUcrm?.company?.id).then(
      onFetchCompanyDetailsSuccess,
      onError
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const onUpdateCompanyDataSuccess = (res: any) => {
    if (res.data) {
      setCompanyData(res.data);
    }
  };

  const updateCompanyData = async (payload: Record<string, any>) => {
    if (!currentUcrm?.company?.id) return false;
    return CompanyApis.updateCompany(currentUcrm?.company?.id, payload).then(
      onUpdateCompanyDataSuccess,
      onError
    );
  };

  const updateCompanyDetails = async (values: any) => {
    const payload: Record<string, any> = {};
    if (values.companyName) {
      payload.name = values.companyName;
    }
    if (!isEmpty(payload)) {
      return updateCompanyData(payload);
    }
  };

  const updateCompanyLogo = async (logo: Photo) => {
    return updateCompanyData({ logo });
  };

  const removeCompanyLogo = async () => {
    return updateCompanyData({ logo: {} });
  };

  useEffect(() => {
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

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
          schema: legal_name_schema,
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
          schema: dba_name_schema,
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
          schema: ein_schema,
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
          schema: company_name_schema,
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
          formattedValue: formatPhoneNumber(companyData.phone, companyData.country_code),
          type: "phone",
          isEditable: true,
          values: {
            country_code: companyData.country_code,
            phone: companyData.phone,
          },
          schema: phone_schema,
          actions: {
            onUpdate: updateCompanyDetails,
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
          formattedValue: formatAddress(companyData.mailing_address),
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
          schema: addressSchema,
          actions: {
            onUpdate: async (data: any) => console.log(data),
          },
        },
        {
          id: "legal_address",
          label: "Company legal address",
          description:
            "The billing address for your cards that will appear on bank documents.",
          formattedValue: formatAddress(companyData.legal_address),
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
          schema: addressSchema,
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

export default Page;
