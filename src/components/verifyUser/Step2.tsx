"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { step2Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BusinessSVG from "../svgComponents/BusinessSVG";
import { getCompanyData, insertCompanyData, updateCompanyData } from "@/hooks/useCompany";

const Step2 = ({ changeStep }: { changeStep: (step: number) => void }) => {
  const [loading, setLoading] = useState(false);
  const openTab = "business";
  const [companyData, setCompanyData] = useState<any>({});
  const handleSubmit = async (e: any) => {
    try {
      setLoading(true);
      console.log(e);
      changeStep(3);
      if (companyData) await insertCompanyData(e);
      else await updateCompanyData(e);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await getCompanyData();
      if (data) {
        setCompanyData(data[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <Tabs className="w-full flex flex-col gap-4 items-center justify-center">
      <TabsList
        className="flex gap-4 w-full bg-white shadow-none max-w-96"
        defaultValue={openTab}
      >
        {/* <TabsTrigger
          className="w-full border flex justify-between"
          value="individual"
        >
          <div className="flex flex-col text-start">
            Individual
            <p className="text-[#757575]">Personal</p>
          </div>
          <IndividualSVG />
        </TabsTrigger> */}
        <TabsTrigger
          className="w-full border flex justify-between"
          value={openTab}
        >
          <div className="flex flex-col text-start">
            Business
            <p className="text-[#757575]">Company or an entity</p>
          </div>
          <BusinessSVG />
        </TabsTrigger>
      </TabsList>
      {/* <TabsContent className="w-full" value="individual">
        <AutoForm
          formSchema={step2Schema}
          onSubmit={(e) => handleSubmit(e)}
          fieldConfig={{}}
          className="flex flex-col gap-4 mx-auto max-w-96"
          zodItemClass="flex flex-row gap-4 space-y-0"
        >
          <AutoFormSubmit
            disabled={loading}
            className="w-full bg-primary-button hover:bg-white text-black border border-black rounded-md"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Submit"}
          </AutoFormSubmit>
          <Button
            onClick={() => {
              changeStep(3);
            }}
          >
            Skip
          </Button>
        </AutoForm>
      </TabsContent> */}
      <TabsContent className="w-full" value="business">
        <AutoForm
          formSchema={step2Schema}
          onSubmit={(e) => handleSubmit(e)}
          fieldConfig={{}}
          values={{
            company_name: companyData?.company_name,
            ein: companyData?.ein,
            company_email: companyData?.company_email,
            federal_tax_classification: companyData?.federal_tax_classification,
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
          <Button
            onClick={() => {
              changeStep(3);
            }}
          >
            Skip
          </Button>
        </AutoForm>
      </TabsContent>
    </Tabs>
  );
};

export default Step2;
