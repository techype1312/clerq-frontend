"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step2Schema, step2Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  getCompanyData,
  insertCompanyData,
  updateCompanyData,
} from "@/hooks/useCompany";
import {
  getCompanyAddressData,
  insertAddressData,
  updateAddressData,
} from "@/hooks/useAddress";

const Step2 = ({
  changeStep,
  step,
}: {
  changeStep: (step: number) => void;
  step: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<Step2Schema | undefined>();
  const [address, setAddress] = useState<Address | undefined>();
  const handleSubmit = async (e: Step2Schema) => {
    try {
      setLoading(true);
      const address = e.address;
      if (companyData) await updateCompanyData(e);
      else await insertCompanyData(e, address);
      if (address) await updateAddressData(address);
      setLoading(false);
      changeStep(step + 1);
    } catch (error: any) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompanyData();
      const addressData = await getCompanyAddressData();
      if (data) {
        setCompanyData(data[0]);
      }
      if (addressData) {
        setAddress(addressData[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <AutoForm
        formSchema={step2Schema}
        onSubmit={(e) => handleSubmit(e)}
        fieldConfig={{
          company_name: {
            inputProps: {
              placeholder: "Value",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setCompanyData({
                  ...companyData,
                  company_name: e.currentTarget.value,
                } as Step2Schema);
              },
            },
          },
          company_email: {
            inputProps: {
              placeholder: "Value",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setCompanyData({
                  ...companyData,
                  company_email: e.currentTarget.value,
                } as Step2Schema);
              },
            },
          },
          phone: {
            fieldType: "phone",
            label: "Phone number",
            inputProps: {
              placeholder: "(123)-456-7890",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e)
                setCompanyData({
                  ...companyData,
                  phone: e?.currentTarget?.value,
                } as Step2Schema);
              },
            },
          },
          country_of_tax_residence: {
            inputProps: {
              placeholder: "Select country",
              disabled: true,
            },
          },
          address: {
            label: "Company Address",
            fieldType: "modal",
          },
          ein: {
            label: "EIN (Employer Identification no.)",
            inputProps: {
              placeholder: "Value",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setCompanyData({
                  ...companyData,
                  ein: e.currentTarget.value,
                } as Step2Schema);
              },
            },
          },
          federal_tax_classification: {
            inputProps: {
              placeholder: "Individual/sole proprietor or single-member LLC",
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setCompanyData({
                  ...companyData,
                  federal_tax_classification: e.currentTarget.value,
                } as Step2Schema);
              },
            },
          },
        }}
        values={{
          company_name: companyData?.company_name ?? "",
          ein: companyData?.ein ?? "",
          company_email: companyData?.company_email ?? "",
          federal_tax_classification: companyData?.federal_tax_classification,
          phone: companyData?.phone ?? "",
          country_of_tax_residence: "United States (US)",
          address: {
            legal_address_1: address ? address?.legal_address_1 : "",
            legal_address_2: address ? address?.legal_address_2 : "",
            country: "United States (US)",
            city: address ? address?.city : "",
            state: address ? address?.state : "",
            zip_code: address?.zip_code ?? 0,
          },
        }}
        defaultValues={{
          country_of_tax_residence: "United States (US)",
        }}
        className="flex flex-col gap-4 mx-auto max-w-lg"
        zodItemClass="flex flex-row gap-4 space-y-0"
        labelClass="text-label"
      >
        <div className="flex gap-4">
          <Button
            onClick={() => {
              changeStep(1);
            }}
            variant="ghost"
            className="background-muted text-label hover:!background-muted h-12 px-10 rounded-full"
          >
            Previous
          </Button>
          <AutoFormSubmit
            disabled={loading}
            className="background-primary px-10 rounded-full h-12"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Next"}
          </AutoFormSubmit>
        </div>
      </AutoForm>
    </div>
  );
};

export default Step2;
