"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { step5Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  insertUserData,
  updateOtherUserData,
  updateUserData,
} from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { AutoFormInputComponentProps } from "../ui/auto-form/types";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import AutoFormEnum from "../ui/auto-form/fields/enum";
import FormSelect from "../ui/FormSelect";
import { MainContext } from "@/context/Main";

const Step5 = ({
  changeStep,
  userdata,
  otherUserData,
  step,
}: {
  changeStep: (step: number) => void;
  userdata: User;
  otherUserData: any;
  step: number;
}) => {
  const router = useRouter();
  const [dropdown, setDropdown] = useState<any>({});
  const [fetchingDropdown, setFetchingDropdown] = useState(true);
  const [loading, setLoading] = useState(false);
  const { refetchUser } = useContext(MainContext);
  useEffect(() => {
    const fetchDropdown = async () => {
      const res = await supabase.from("dropdown").select("*");
      if (res.error) {
        console.log(res.error);
        return;
      } else {
        setFetchingDropdown(false);
        setDropdown(res.data);
      }
    };
    fetchDropdown();
  }, []);
  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);
      console.log(e);
      await e.management_company
        .filter(
          (item: string) => !dropdown[0]?.management_company.includes(item)
        )
        .forEach(async (item: string) => {
          await supabase.functions.invoke("dynamic-dropdown", {
            method: "POST",
            body: { management_company: item },
          });
        });
      await e.agency
        .filter((item: string) => !dropdown[0]?.agency.includes(item))
        .forEach(async (item: string) => {
          await supabase.functions.invoke("dynamic-dropdown", {
            method: "POST",
            body: { agency: item },
          });
        });
      await e.legal
        .filter((item: string) => !dropdown[0]?.legal.includes(item))
        .forEach(async (item: string) => {
          await supabase.functions.invoke("dynamic-dropdown", {
            method: "POST",
            body: { legal: item },
          });
        });
      await updateOtherUserData({
        id: userdata.id,
        ...otherUserData,
        management_company: e.management_company,
        agency: e.agency,
        legal: e.legal,
      });
      await updateUserData({
        id: userdata.id,
        ...userdata.user_metadata,
        is_user_verified: true,
      });
      refetchUser();
      router.push("/dashboard");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };
  const [managementCompany, setManagementCompany] = useState<string[]>([]);
  const [agency, setAgency] = useState<string[]>([]);
  const [legal, setLegal] = useState<string[]>([]);
  return (
    <>
      {fetchingDropdown ? (
        <Loader2Icon className="mx-auto animate-spin" />
      ) : (

        <AutoForm
          formSchema={step5Schema}
          onSubmit={(e) => handleSubmit(e)}
          fieldConfig={{
            management_company: {
              fieldType: ({
                label,
                field,
                fieldConfigItem,
                fieldProps,
              }: AutoFormInputComponentProps) => (
                <FormItem className="flex flex-col gap-1 w-full rounded-md">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 w-full">
                      {dropdown[0] && (
                        <FormSelect
                          baseValues={[
                            ...dropdown[0].management_company,
                            "Other",
                          ]}
                          field={field}
                          fieldConfigItem={fieldConfigItem}
                          fieldProps={fieldProps}
                          setValues={setManagementCompany}
                          value={managementCompany}
                        />
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              ),
            },
            agency: {
              fieldType: ({
                label,
                field,
                fieldConfigItem,
                fieldProps,
              }: AutoFormInputComponentProps) => (
                <FormItem className="flex flex-col gap-1 w-full rounded-md">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    {dropdown[0] && (
                      <FormSelect
                        baseValues={[...dropdown[0].agency, "Other"]}
                        field={field}
                        fieldConfigItem={fieldConfigItem}
                        fieldProps={fieldProps}
                        setValues={setAgency}
                        value={agency}
                      />
                    )}
                  </FormControl>
                </FormItem>
              ),
            },
            legal: {
              fieldType: ({
                label,
                field,
                fieldConfigItem,
                fieldProps,
              }: AutoFormInputComponentProps) => (
                <FormItem className="flex flex-col gap-1 w-full rounded-md">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    {dropdown[0] && (
                      <FormSelect
                        baseValues={[...dropdown[0].legal, "Other"]}
                        field={field}
                        fieldConfigItem={fieldConfigItem}
                        fieldProps={fieldProps}
                        setValues={setLegal}
                        value={legal}
                      />
                    )}
                  </FormControl>
                </FormItem>
              ),
            },
          }}
          values={{}}
          className="flex flex-col gap-4 mx-auto max-w-lg"
          zodItemClass="flex flex-row gap-4 space-y-0"
        >
          <div className="flex gap-4">
            <Button
              onClick={() => {
                changeStep(step - 1);
              }}
              variant="ghost"
              className="background-muted text-label hover:!background-muted h-12 px-10 rounded-full"
            >
              Previous
            </Button>
            <AutoFormSubmit
              disabled={loading}
              className="w-fit background-primary px-10 rounded-full h-12"
            >
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Go to Dashboard"
              )}
            </AutoFormSubmit>
          </div>
        </AutoForm>
      )}
    </>
  );
};

export default Step5;
