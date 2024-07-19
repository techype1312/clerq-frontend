"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { step1Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { insertUserData, updateOtherUserData } from "@/hooks/useUser";

const Step1 = ({
  changeStep,
  userdata,
  otherUserData,
}: {
  changeStep: (step: number) => void;
  userdata: User;
  otherUserData: any;
}) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);
      changeStep(2);
      if (otherUserData) await updateOtherUserData(e);
      else await insertUserData(e);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      changeStep(2);
    }
    changeStep(2);
  };
  return (
    <AutoForm
      formSchema={step1Schema}
      onSubmit={(e) => handleSubmit(e)}
      fieldConfig={{
        address: {
          fieldType: "textarea",
        },
        phone: {
          fieldType: "number",
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
      }}
      className="flex flex-col gap-4 mx-auto max-w-96"
      zodItemClass="flex flex-row gap-4 space-y-0"
    >
      <AutoFormSubmit
        disabled={loading}
        className="w-full bg-primary-button hover:bg-white text-black border border-black rounded-md"
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Submit"}
      </AutoFormSubmit>
    </AutoForm>
  );
};

export default Step1;
