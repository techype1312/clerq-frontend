"use client";
import CompanyApis from "@/actions/apis/CompanyApis";
import ProfileRowContainer from "@/components/dashboard/profile";
import ProfilePhoto from "@/components/profile-photo";
import { useCompanySession } from "@/context/CompanySession";
import { ErrorProps } from "@/types/general";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import _, { isEmpty } from "lodash";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";

interface Photo {
  id: string;
  path: string;
}

const Page = () => {
  const { currentUcrm } = useCompanySession();
  const [error, setError] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUcrm?.company?.id]);

  const onUpdateCompanyDataSuccess = (res: any) => {
    if (res.data) {
      setCompanyData(res.data);
    }
  };

  const updateCompanyData = async (p0: { logo: {} }) => {
    if (!currentUcrm?.company?.id) return false;
    return CompanyApis.updateCompany(currentUcrm?.company?.id, p0).then(
      onUpdateCompanyDataSuccess,
      onError
    );
  };

  const updatePhoto = async (logo: Photo) => {
    return updateCompanyData({ logo });
  };

  const removePhoto = async () => {
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
          value: {
            logo: companyData.logo,
            name: companyData.name,
          },
          type: "photo",
          isEditable: true,
          actions: {
            updatePhoto: updatePhoto,
            removePhoto: updatePhoto,
          },
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
          updatePhoto={updatePhoto}
          removePhoto={removePhoto}
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
