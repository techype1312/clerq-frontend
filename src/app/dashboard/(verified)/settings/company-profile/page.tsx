"use client";
import CompanyApis from "@/actions/apis/CompanyApis";
import ProfileRowContainer from "@/components/dashboard/profile";
import { useCompanySession } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import _, { isEmpty } from "lodash";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [error, setError] = useState("");
  const { currentUcrm } = useCompanySession();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<Record<string, any>>();
  const [rowData, setRowData] = useState<any>([]);

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
  }, [currentUcrm?.company?.id, loading]);

  useEffect(() => {
    fetchCompanyData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmpty(companyData)) {
      setRowData([]);
    } else {
      setRowData([
        {
          id: "legal_name",
          title: "Legal Name",
          value: companyData.name,
          type: "text",
          isEditable: false,
        },
        {
          id: "dba_name",
          title: "Doing business as (DBA)",
          value: companyData.name,
          type: "text",
          isEditable: false,
        },
        {
          id: "ein",
          title: "Fedral EIN",
          value: companyData.ein,
          type: "text",
          isEditable: false,
        },
        {
          id: "name",
          title: "Company name",
          description:
            "This is the name that appears on Clerq and in your notifications.",
          value: companyData.name,
          type: "text",
          isEditable: true,
        },
        {
          id: "company_logo",
          title: "Company logo",
          description: "This will appear on Clerq next to your company name.",
          value: companyData.company_logo,
          type: "logo",
          isEditable: true,
        },
        {
          id: "phone",
          title: "Phone number",
          value: formatPhoneNumber(companyData.phone, companyData.country_code),
          type: "phone",
          isEditable: true,
        },
        {
          id: "email",
          title: "Company Email",
          description:
            "Team members and pre-authorized vendors can forward invoices directly to your Payments page via this address.",
          value: companyData.email,
          type: "email",
          isEditable: true,
        },
        {
          id: "mailing_address",
          title: "Company mailing address",
          description:
            "We’ll send physical cards and surprise gifts to this address.",
          value: formatAddress(companyData.mailing_address),
          type: "address",
          isEditable: true,
        },
        {
          id: "legal_address",
          title: "Company legal address",
          description:
            "The billing address for your cards that will appear on bank documents.",
          value: formatAddress(companyData.legal_address),
          type: "address",
          isEditable: true,
        },
      ]);
    }
  }, [companyData]);

  if (!companyData) return null;

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
          {companyData.name}
        </p>
      </div>
      <ProfileRowContainer profileData={rowData} />
    </div>
  );
};

export default Page;
