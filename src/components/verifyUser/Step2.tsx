"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step2Schema, step2Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  getCompanyData,
  insertCompanyData,
  updateCompanyData,
} from "@/hooks/useCompany";
import { getCompanyAddressData, insertAddressData } from "@/hooks/useAddress";
import CompanyApis from "@/actions/apis/CompanyApis";
import { UserContext } from "@/context/User";
import {
  AutoFormInputComponentProps,
  DependencyType,
} from "../ui/auto-form/types";
import { FormControl, FormItem } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import OnboardingApis from "@/actions/apis/OnboardingApis";

const Step2 = ({
  changeStep,
  step,
}: {
  changeStep: (step: number) => void;
  step: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<
    Step2Schema | any | undefined
  >();
  const [localCompanyData, setLocalCompanyData] = useState<Step2Schema | any>();
  const {
    userdata: user,
    refetchUserData,
    setRefetchUserData,
  } = useContext(UserContext);
  const [address, setAddress] = useState<Address | undefined>();
  const [mailingAddress, setMailingAddress] = useState<Address | undefined>();
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [changedAddress, setChangedAddress] = useState(false);
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const handleSubmit = async (e: Step2Schema) => {
    try {
      setLoading(true);
      // const address = e.address;
      // if (companyData) await updateCompanyData(e);
      // else await insertCompanyData(e, address);
      let res;
      if (companyData && companyId) {
        let companyUpdateData: any = e;
        companyUpdateData.country_code = 91;
        delete companyUpdateData.address;
        delete companyUpdateData.mailing_address;
        delete companyUpdateData.address_id;
        delete companyUpdateData.mailing_address_id;
        delete companyUpdateData.is_mailing_address_same;
        res = await CompanyApis.updateCompany(companyId, companyUpdateData);
      } else {
        res = await CompanyApis.createCompany(companyData);
      }

      setCompanyData(res);
      setLoading(false);
      if (res && res.data && res.status === 200) changeStep(step + 1);
    } catch (error: any) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      CompanyApis.getAllCompanies().then((res) => {
        setCompanyData(res.data.data[0]);
        setCompanyId(res.data.data[0].id);
      });
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (addressId && mailingAddressId && companyId)
  //     CompanyApis.updateCompany(companyId, {
  //       legal_address: {
  //         id: addressId,
  //       },
  //       mailing_address: {
  //         id: mailingAddressId,
  //       },
  //     });
  // }, [changedAddress]);

  useEffect(() => {
    if (addressId && mailingAddressId && companyId) {
      const updateAndFetchAddress = async () => {
        await CompanyApis.updateCompany(companyId, {
          legal_address: {
            id: addressId,
          },
          mailing_address: {
            id: mailingAddressId,
          },
        });
        const res = await OnboardingApis.getAddress(addressId);
        if (res && res.status === 200) {
          setAddress(res.data);
        }
        const res1 = await OnboardingApis.getAddress(mailingAddressId);
        if (res1 && res1.status === 200) {
          setMailingAddress(res1.data);
        }
        if (addressId === mailingAddressId) {
          setIsMailingAddressSame(true);
        } else {
          setIsMailingAddressSame(false);
        }
      };
      updateAndFetchAddress();
    }
  }, [addressId, companyId, mailingAddressId]);

  useEffect(() => {
    if (
      isMailingAddressSame &&
      addressId !== mailingAddressId &&
      companyId &&
      addressId
    ) {
      const updateAddress = async () => {
        const res = await CompanyApis.updateCompany(companyId, {
          mailing_address: {
            id: addressId,
          },
        });
        const fetchMailingAddress = await OnboardingApis.getAddress(addressId);
        if (res && res.status === 200) {
          setMailingAddress(fetchMailingAddress.data);
          setMailingAddressId(addressId);
        }
      };
      updateAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMailingAddressSame]);

  useEffect(() => {
    if (!companyData) {
      return setRefetchUserData(!refetchUserData);
    } else {
      if (companyData?.legal_address?.id)
        setAddressId(companyData?.legal_address?.id);
      if (companyData?.mailing_address?.id)
        setMailingAddressId(companyData?.mailing_address?.id);
      if (
        companyData?.company?.legal_address?.id !== null &&
        companyData?.company?.legal_address?.id !==
          companyData?.company?.mailing_address?.id
      ) {
        setIsMailingAddressSame(false);
      } else {
        setIsMailingAddressSame(true);
      }
      if (companyData?.legal_address) setAddress(companyData?.legal_address);
      if (companyData?.mailing_address)
        setMailingAddress(companyData?.mailing_address);
    }
  }, [companyData]);

  return (
    <div className="w-full">
      <AutoForm
        formSchema={step2Schema}
        onSubmit={(e) => handleSubmit(e)}
        fieldConfig={{
          name: {
            inputProps: {
              placeholder: "Value",
              onChange: (e: any) => {
                setLocalCompanyData({ ...localCompanyData, name: e.target.value });
              },
            },
          },
          email: {
            inputProps: {
              placeholder: "Value",
              onChange: (e: any) => {
                setLocalCompanyData({ ...localCompanyData, email: e.target.value });
              },
            },
          },
          phone: {
            fieldType: "phone",
            label: "Phone number",
            inputProps: {
              placeholder: "(123)-456-7890",
              onChange: (e: any) => {
                console.log(e);
                setLocalCompanyData({ ...localCompanyData, phone: e });
              },
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
              onChange: (e: any) => {
                setChangedAddress(!changedAddress);
                setAddress(e);
              },
            },
          },
          ein: {
            label: "EIN (Employer Identification no.)",
            inputProps: {
              placeholder: "Value",
              onChange: (e: any) => {
                setLocalCompanyData({ ...localCompanyData, ein: e.target.value });
              },
            },
          },
          tax_classification: {
            inputProps: {
              placeholder: "Individual/sole proprietor or single-member LLC",
              onChange: (e: any) => {
                setLocalCompanyData({
                  ...localCompanyData,
                  tax_classification: e.target.value,
                });
              },
            },
          },
          mailing_address: {
            label: "Mailing address",
            inputProps: {
              isPresent: mailingAddress ? true : false,
              onChange: (e: any) => {
                setChangedAddress(!changedAddress);
                setMailingAddress(e);
              },
            },
            fieldType: "modal",
          },
          is_mailing_address_same: {
            fieldType: ({ field, fieldProps }: AutoFormInputComponentProps) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          if (!field.value) setIsMailingAddressSame(true);
                          field.onChange(!field.value);
                        }}
                        {...fieldProps}
                      />
                      Set as mailing address
                    </div>
                    {field.value && (
                      <Button
                        onClick={() => {
                          field.onChange(!field.value);
                          setIsMailingAddressSame(false);
                        }}
                        variant={"ghost"}
                        className="text-label"
                      >
                        + Add mailing address
                      </Button>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            ),
          },
          address_id: {
            inputProps: {
              onChange: (e: any) => {
                setAddressId(e.target.value);
              },
            },
          },
          mailing_address_id: {
            inputProps: {
              onChange: (e: any) => {
                setMailingAddressId(e.target.value);
              },
            },
          },
        }}
        values={{
          name: localCompanyData?.name
            ? localCompanyData?.name
            : "",
          ein: localCompanyData?.ein
            ? localCompanyData?.ein
            : companyData?.ein ?? "",
          email: localCompanyData?.email
            ? localCompanyData?.email
            : companyData?.email ?? "",
          tax_classification: localCompanyData?.tax_classification
            ? localCompanyData?.tax_classification
            : companyData?.tax_classification,
          phone: localCompanyData?.phone
            ? localCompanyData?.phone
            : companyData?.phone ?? "",
          tax_residence_country: "United States (US)",
          is_mailing_address_same: isMailingAddressSame,
          address: {
            address_line_1: address ? address?.address_line_1 : "",
            address_line_2: address ? address?.address_line_2 : "",
            city: address ? address?.city : "",
            state: address ? address?.state : "",
            postal_code: address?.postal_code ?? "",
            country: "United States",
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
            country: "United States",
          },
          address_id: addressId ?? "",
          mailing_address_id:
            mailingAddressId !== addressId ? mailingAddressId ?? "" : "",
        }}
        defaultValues={{
          tax_residence_country: "United States (US)",
        }}
        dependencies={[
          {
            sourceField: "is_mailing_address_same",
            type: DependencyType.HIDES,
            targetField: "mailing_address",
            when: (is_mailing_address_same) => is_mailing_address_same,
          },
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
        ]}
        className="flex flex-col gap-4 mx-auto max-w-lg"
        zodItemClass="flex flex-row gap-4 space-y-0"
        labelClass="text-label"
        onValuesChange={(values) => {
          if (values.address_id) {
            setAddressId(values.address_id);
          }
          if (values.mailing_address_id) {
            setMailingAddressId(values.mailing_address_id);
          }
        }}
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
