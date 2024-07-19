"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { step1Schema, step4Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  insertUserData,
  updateOtherUserData,
  updateUserData,
} from "@/hooks/useUser";

const Step4 = ({
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
      if (otherUserData) await updateOtherUserData(e);
      else await insertUserData(e);
      updateUserData({
        id: userdata.id,
        ...userdata.user_metadata,
        is_user_verified: true,
      });
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };
  return (
    <AutoForm
      formSchema={step4Schema}
      onSubmit={(e) => handleSubmit(e)}
      fieldConfig={{}}
      values={{}}
      className="flex flex-col gap-4 mx-auto max-w-96"
      zodItemClass="flex flex-row gap-4 space-y-0"
    >
      <AutoFormSubmit
        disabled={loading}
        className="w-fit bg-primary-button hover:bg-white text-black border border-black rounded-md"
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Go to Dashboard"}
      </AutoFormSubmit>
    </AutoForm>
  );
};

export default Step4;
