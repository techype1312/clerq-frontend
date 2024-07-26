"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step1Schema, step1Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getUserData, insertUserData, updateOtherUserData } from "@/hooks/useUser";
import {
  getUserAddressData,
  insertAddressData,
  updateAddressData,
} from "@/hooks/useAddress";

const Step1 = ({
  changeStep,
  userdata,
  otherUserData,
  setTotalSteps,
  totalSteps,
  staticForFirstTime,
  setStaticForFirstTime,
}: {
  changeStep: (step: number) => void;
  userdata: User;
  otherUserData: any;
  setTotalSteps: (steps: number) => void;
  totalSteps: number;
  staticForFirstTime: boolean;
  setStaticForFirstTime: (value: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | undefined>();
  const [otherData, setOtherData] = useState<any>();
  useEffect(() => {
    const fetchUserAddress = async () => {
      const data = await getUserAddressData();
      if (data) {
        setAddress(data[0]);
      }
    };
    const fetchUserData = async () => {
      const data = await getUserData();
      if (data) {
        setOtherData(data[0]);
      }
    }
    fetchUserData()
    fetchUserAddress();
  }, []);
  const handleSubmit = async (e: Step1Schema) => {
    try {
      setLoading(true);
      const address1 = e.address;
      if (otherData) await updateOtherUserData(e);
      else await insertUserData(e,address1);
      if (address) await updateAddressData(address1);
      else await insertAddressData(address1, false);
      setLoading(false);
      changeStep(2);
    } catch (error: any) {
      setLoading(false);
      changeStep(2);
    }
  };
  return (
    <AutoForm
      formSchema={step1Schema}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      fieldConfig={{
        name: {
          first_name: {
            inputProps: {
              placeholder: "John",
            },
          },
          last_name: {
            inputProps: {
              placeholder: "Doe",
            },
          },
        },
        address: {
          fieldType: "modal",
          showLabel: false,
          legal_address_1: {
            inputProps: {
              label: "Legal address (Line 1)",
            },
          },
          legal_address_2: {
            inputProps: {
              label: "Legal address (Line 2)",
            },
          },
        },
        country_of_tax_residence: {
          inputProps: {
            placeholder: "Select country",
          },
        },
        phone: {
          fieldType: "phone",
          label: "Phone number",
          inputProps: {
            placeholder: "(123)-456-7890",
          },
        },
        company: {
          fieldType: "radio",
          label:
            "Do you have a company/business (e.g. LLC, Corp, etc.) that you operate your business through?",
          inputProps: {
            onChange: (e) => {
              if (staticForFirstTime) {
                setStaticForFirstTime(false);
                return;
              }
              setTotalSteps(e.target.value === "Yes" ? 5 : 4);
            },
          },
        },
      }}
      values={{
        name: {
          first_name: otherUserData
            ? otherUserData.first_name
            : userdata?.user_metadata?.first_name ?? "",
          last_name: otherUserData
            ? otherUserData.last_name
            : userdata?.user_metadata?.last_name ?? "",
        },
        email: otherUserData ? otherUserData.email : userdata?.email ?? "",
        phone: otherUserData ? otherUserData.phone : userdata?.phone ?? "",
        country_of_tax_residence: otherUserData?.country_of_tax_residence,
        date_of_birth: otherUserData
          ? new Date(otherUserData ? otherUserData.date_of_birth : "")
          : undefined,
        address: {
          legal_address_1: address ? address?.legal_address_1 : "",
          legal_address_2: address ? address?.legal_address_2 : "",
          country: address ? address?.country : "",
          city: address ? address?.city : "",
          state: address ? address?.state : "",
          zip_code: address?.zip_code ?? 0,
        },
        company: totalSteps === 5 ? "Yes" : "No",
      }}
      className="flex flex-col gap-4 mx-auto max-w-lg"
      zodItemClass="flex flex-row gap-4 space-y-0"
      labelClass="text-label"
    >
      <AutoFormSubmit
        disabled={loading}
        className="w-fit background-primary px-10 rounded-full h-12"
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Next"}
      </AutoFormSubmit>
    </AutoForm>
  );
};

export default Step1;
