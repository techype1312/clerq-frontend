"use client";

import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import {
  Address,
  NewCompanychema,
  newCompanySchema,
} from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import CompanyApis from "@/actions/data/company.data";
import { DependencyType } from "../ui/auto-form/types";
import { ErrorProps } from "@/types/general";
import { isObject } from "lodash";
import { ICompany } from "@/types/company";
import { useCompanySessionContext } from "@/context/CompanySession";
import { IAddress } from "@/types/address";
import { DEFAULT_COUNTRY_CODE, DEFAULT_DIAL_CODE } from "@/utils/constants";

const NewCompany = () => {
  const { addNewCompanyMapping } = useCompanySessionContext();
  const [companyData, setCompanyData] = useState<
    NewCompanychema | any | undefined
  >();
  const [localCompanyData, setLocalCompanyData] = useState<any>({});
  const [address, setAddress] = useState<Address | any>();
  const [mailingAddress, setMailingAddress] = useState<Address | any>();
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onUpdateAddressSuccess = (res: any) => {
    setLoading(false);
    setCompanyData(res.company);
    addNewCompanyMapping(res.ucrm)
    return res;
  };

  const handleUpdateAddress = async (values: ICompany) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return CompanyApis.createCompany(values).then(
      onUpdateAddressSuccess,
      onError
    );
  };

  const handleSubmit = async (e: NewCompanychema) => {
    if (!addressId || !mailingAddressId) {
      return toast.error(
        addressId
          ? mailingAddressId
            ? "Please add Legal and Mailing address"
            : "Please add Mailing address"
          : "Please add legal address"
      );
    }
    const newCompanyData = {
      name: localCompanyData.name,
      email: localCompanyData.email,
      phone: localCompanyData.phone,
      country_code: 1,
      ein: localCompanyData.ein,
      tax_residence_country: localCompanyData.tax_residence_country,
      tax_classification: localCompanyData.tax_classification,
      legal_address: {
        id: addressId,
      } as IAddress,
      mailing_address: {
        id: mailingAddressId,
      } as IAddress,
    };
    return handleUpdateAddress(newCompanyData);
  };

  return (
    <div className="w-full">
      <AutoForm
        formSchema={newCompanySchema}
        onSubmit={handleSubmit}
        fieldConfig={{
          name: {
            inputProps: {
              placeholder: "Your company name",
            },
          },
          email: {
            inputProps: {
              placeholder: "Your company email",
            },
          },
          phone: {
            fieldType: "phone",
            label: "Phone number",
            inputProps: {
              placeholder: "(123)-456-7890",
            },
          },
          tax_residence_country: {
            inputProps: {
              placeholder: "Select country",
              disabled: true,
            },
          },
          address: {
            label: "Company Address",
            fieldType: "modal",
            inputProps: {
              isPresent: address ? true : false,
            },
          },
          ein: {
            label: "EIN (Employer Identification no.)",
            inputProps: {
              placeholder: "Your EIN",
            },
          },
          tax_classification: {
            inputProps: {
              placeholder: "Individual/sole proprietor or single-member LLC",
            },
          },
          mailing_address: {
            label: "Mailing address",
            inputProps: {
              isPresent: mailingAddress ? true : false,
            },
            fieldType: "modal",
          },

          address_id: {
            inputProps: {},
          },
          mailing_address_id: {
            inputProps: {},
          },
        }}
        values={{
          name: localCompanyData?.name ? localCompanyData?.name : "",
          ein: localCompanyData?.ein ? localCompanyData?.ein : "",
          email: localCompanyData?.email ? localCompanyData?.email : "",
          tax_classification: localCompanyData?.tax_classification
            ? localCompanyData?.tax_classification
            : "",
          phone: localCompanyData?.phone ?? "",
          tax_residence_country:
            localCompanyData?.tax_residence_country ?? DEFAULT_COUNTRY_CODE,
          address: {
            address_line_1: address ? address?.address_line_1 : "",
            address_line_2: address ? address?.address_line_2 : "",
            city: address ? address?.city : "",
            state: address ? address?.state : "",
            postal_code: address?.postal_code ?? "",
            country: address?.country ?? DEFAULT_COUNTRY_CODE,
          },
          mailing_address: {
            address_line_1: mailingAddress
              ? mailingAddress?.address_line_1
              : "",
            address_line_2: mailingAddress
              ? mailingAddress?.address_line_2
              : "",
            city: mailingAddress ? mailingAddress?.city : "",
            state: mailingAddress ? mailingAddress?.state : "",
            postal_code: mailingAddress?.postal_code ?? "",
            country: mailingAddress?.country ?? DEFAULT_COUNTRY_CODE,
          },
          address_id: addressId ?? "",
          mailing_address_id:
            mailingAddressId !== addressId ? mailingAddressId ?? "" : "",
          long: address ? address.longitude : "",
          lat: address ? address.latitude : "",
          long1: mailingAddress ? mailingAddress.longitude : "",
          lat1: mailingAddress ? mailingAddress.latitude : "",
          country_code:
            Number(localCompanyData?.country_code) ??
            DEFAULT_DIAL_CODE,
        }}
        dependencies={[
          {
            sourceField: "address_id",
            type: DependencyType.HIDES,
            targetField: "address_id",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "mailing_address_id",
            type: DependencyType.HIDES,
            targetField: "mailing_address_id",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "country_code",
            type: DependencyType.HIDES,
            targetField: "country_code",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "long",
            type: DependencyType.HIDES,
            targetField: "long",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "lat",
            type: DependencyType.HIDES,
            targetField: "lat",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "long1",
            type: DependencyType.HIDES,
            targetField: "long1",
            when: () => {
              return true;
            },
          },
          {
            sourceField: "lat1",
            type: DependencyType.HIDES,
            targetField: "lat1",
            when: () => {
              return true;
            },
          },
        ]}
        className="flex flex-col gap-4 mx-auto xs:w-96 max-w-xl"
        zodItemClass="flex flex-row gap-4 space-y-0"
        labelClass="text-label"
        onValuesChange={(values) => {
          setLocalCompanyData((prevData: any) => ({
            ...prevData,
            name: values?.name,
            ein: values?.ein,
            email: values?.email,
            phone: values?.phone,
            country_code: Number(values?.country_code),
            tax_residence_country: values?.tax_residence_country,
            tax_classification: values?.tax_classification,
          }));
          if (values.address_id && values.address_id !== addressId) {
            setAddressId(values.address_id);
          }
          if (values.address) {
            setAddress({
              address_line_1: values.address.address_line_1,
              address_line_2: values.address.address_line_2,
              city: values.address.city,
              state: values.address.state,
              postal_code: values.address.postal_code,
              longitude: values.long,
              latitude: values.lat,
            });
          }
          if (
            values.mailing_address_id &&
            values.mailing_address_id !== mailingAddressId
          ) {
            setMailingAddressId(values.mailing_address_id);
          }
          if (values.mailing_address) {
            setMailingAddress({
              address_line_1: values.mailing_address.address_line_1,
              address_line_2: values.mailing_address.address_line_2,
              city: values.mailing_address.city,
              state: values.mailing_address.state,
              postal_code: values.mailing_address.postal_code,
              longitude: values.long1,
              latitude: values.lat1,
            });
          }
        }}
      >
        <div className="flex gap-4 justify-end">
          <AutoFormSubmit
            disabled={loading}
            className="background-primary px-10 rounded-full h-12 box-border w-40"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </AutoFormSubmit>
        </div>
      </AutoForm>
    </div>
  );
};

export default NewCompany;
