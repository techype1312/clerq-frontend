"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step1Schema, step1Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  // getUserData,
  insertUserData,
  updateOtherUserData,
} from "@/hooks/useUser";
// import {
//   getUserAddressData,
//   insertAddressData,
//   updateAddressData,
// } from "@/hooks/useAddress";
import {
  AutoFormInputComponentProps,
  DependencyType,
} from "../ui/auto-form/types";
import { FormControl, FormItem } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import OnboardingApis from "@/actions/apis/OnboardingApis";
import AuthApis from "@/actions/apis/AuthApis";
import { UserContext } from "@/context/User";
import CompanyApis from "@/actions/apis/CompanyApis";

const Step1 = ({
  changeStep,
  userdata,
  otherUserData,
  setTotalSteps,
  totalSteps,
  staticForFirstTime,
  setStaticForFirstTime,
  setOtherUserData,
}: {
  changeStep: (step: number) => void;
  userdata: any;
  otherUserData: any;
  setTotalSteps: (steps: number) => void;
  totalSteps: number;
  staticForFirstTime: boolean;
  setStaticForFirstTime: (value: boolean) => void;
  setOtherUserData: (data: any) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | any | undefined>();
  const [mailingAddress, setMailingAddress] = useState<
    Address | any | undefined
  >();
  const [otherData, setOtherData] = useState<any>();
  const {
    userdata: user,
    refetchUserData,
    setRefetchUserData,
  } = useContext(UserContext);

  const [companyData, setCompanyData] = useState<any>();

  const handleSubmit = async (e: Step1Schema) => {
    try {
      setLoading(true);
      let userData: any = e;
      console.log(companyData, userData.company, "here");
      if (userData?.company === "No" && companyData?.length === 0) {
        const resCompany = await CompanyApis.createCompany({
          email: userData?.email,
          name: `${userData?.firstName} ${userData?.lastName}`,
          phone: userdata?.phone,
          country_code: 91, // change to 1
          ein: userdata?.phone,
          tax_residence_country: "US",
          tax_classification: "Individual/Sole Proprietor",
        });
        console.log(resCompany)
      } else if (userData?.company === "No" && companyData?.length > 0) {
        const resCompany = await CompanyApis.updateCompany(companyData[0].id, {
          email: userData?.email,
          name: `${userdata?.firstName} ${userdata?.lastName}`,
          phone: userdata?.phone,
          country_code: 91, // change to 1
          ein: userdata?.phone,
          tax_residence_country: "US",
          tax_classification: "Individual/Sole Proprietor",
        });
        console.log(resCompany)
      }
      delete userData.address;
      delete userData.mailing_address;
      delete userData.is_mailing_address_same;
      delete userData.address_id;
      delete userData.mailing_address_id;
      delete userData.company;
      userData.firstName = e.name.firstName;
      userData.lastName = e.name.lastName;
      delete userData.name;
      (userData.tax_residence_country = "US"),
        delete userData.country_of_tax_residence;
      delete userData.email;
      delete userData.phone;
      userData.dob = e.date_of_birth.toUTCString();
      delete userData.date_of_birth;

      // delete userData.lat;
      // delete userData.lng;
      // delete userData.lat1;
      // delete userData.lng1;
      const res = await AuthApis.updateUser(userData);

      if (res && res.status === 200) {
        changeStep(2);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      changeStep(2);
    }
  };
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [changedAddress, setChangedAddress] = useState(false);
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(true);

  useEffect(() => {
    if (addressId && mailingAddressId)
      AuthApis.updateUser({
        permanent_address: {
          id: addressId,
        },
        mailing_address: {
          id: mailingAddressId,
        },
      });
  }, [changedAddress]);

  useEffect(() => {
    if (
      isMailingAddressSame &&
      addressId !== mailingAddressId &&
      addressId &&
      mailingAddressId
    ) {
      const updateAddress = async () => {
        const res = await AuthApis.updateUser({
          mailing_address: {
            id: addressId,
          },
        });
        if (res && res.data.status === 200) {
          setMailingAddress(address);
          setMailingAddressId(addressId);
        }
      };
      updateAddress();
    }
    console.log(addressId, mailingAddressId, isMailingAddressSame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMailingAddressSame, addressId, mailingAddressId]);

  useEffect(() => {
    if (!user) {
      return setRefetchUserData(!refetchUserData);
    } else {
      if (user?.permanent_address?.id)
        setAddressId(user?.permanent_address?.id);
      if (user?.mailing_address?.id)
        setMailingAddressId(user?.mailing_address?.id);
      if (
        user?.permanent_address &&
        user?.permanent_address?.id !== user?.mailing_address.id
      ) {
        setIsMailingAddressSame(false);
      } else {
        setIsMailingAddressSame(true);
      }
      if (user?.permanent_address) setAddress(user?.permanent_address);
      if (user?.mailing_address) setMailingAddress(user?.mailing_address);
    }
  }, [user]);

  useEffect(() => {
    CompanyApis.getAllCompanies().then((res) => {
      setCompanyData(res.data.data);
    });
  }, []);

  return (
    <AutoForm
      formSchema={step1Schema}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      fieldConfig={{
        name: {
          firstName: {
            inputProps: {
              placeholder: "John",
            },
          },
          lastName: {
            inputProps: {
              placeholder: "Doe",
            },
          },
        },
        date_of_birth: {
          inputProps: {
            onChange: (e: any) => {
              console.log(e);
              setOtherUserData({
                ...otherUserData,
                date_of_birth: e.currentTarget.value,
              });
            },
          },
        },
        mailing_address: {
          label: "Mailing address",
          inputProps: {
            onChange: (e: any) => {
              setChangedAddress(!changedAddress);
            },
          },
          fieldType: "modal",
        },
        is_mailing_address_same: {
          fieldType: ({
            label,
            isRequired,
            field,
            fieldConfigItem,
            fieldProps,
          }: AutoFormInputComponentProps) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={() => {
                        console.log(field.value);
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
        address: {
          fieldType: "modal",
          inputProps: {
            showLabel: false,
            isPresent: address ? true : false,
            onChange: (e: any) => {
              setChangedAddress(!changedAddress);
            },
          },
        },
        country_of_tax_residence: {
          inputProps: {
            placeholder: "Select country",
            disabled: true,
          },
        },
        email: {
          inputProps: {
            disabled: true,
          },
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
        phone: {
          fieldType: "phone",
          label: "Phone number",
          inputProps: {
            placeholder: "(123)-456-7890",
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setOtherUserData({
                ...otherUserData,
                phone: e?.target?.value,
              });
            },
          },
        },
        company: {
          fieldType: "radio",
          label:
            "Do you have a company/business (e.g. LLC, Corp, etc.) that you operate your business through?",
          inputProps: {
            className: "flex gap-4",
            onChange: (e) => {
              if (staticForFirstTime) {
                setStaticForFirstTime(false);
                return;
              }
              setTotalSteps(e.target.value === "Yes" ? 3 : 2);
            },
          },
        },
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
        // {
        //   sourceField: "lat",
        //   type: DependencyType.HIDES,
        //   targetField: "lat",
        //   when: () => {
        //     return true;
        //   },
        // },
        // {
        //   sourceField: "lat1",
        //   type: DependencyType.HIDES,
        //   targetField: "lat1",
        //   when: () => {
        //     return true;
        //   },
        // },
        // {
        //   sourceField: "lng",
        //   type: DependencyType.HIDES,
        //   targetField: "lng",
        //   when: () => {
        //     return true;
        //   },
        // },
        // {
        //   sourceField: "lng1",
        //   type: DependencyType.HIDES,
        //   targetField: "lng1",
        //   when: () => {
        //     return true;
        //   },
        // },
      ]}
      values={{
        name: {
          firstName: userdata?.firstName ? userdata?.firstName : "",
          lastName: userdata?.lastName ? userdata?.lastName : "",
        },
        email: userdata?.email ?? "",
        phone: userdata?.phone ?? "",
        country_of_tax_residence: "United States (US)",
        date_of_birth: userdata?.dob
          ? new Date(userdata?.dob ?? "")
          : undefined,
        address: {
          address_line_1: address ? address?.address_line_1 : "",
          address_line_2: address ? address?.address_line_2 : "",
          country: "United States (US)",
          city: address ? address?.city : "",
          state: address ? address?.state : "",
          postal_code: address?.postal_code ?? 0,
        },
        is_mailing_address_same: isMailingAddressSame,
        mailing_address: {
          address_line_1: mailingAddress ? mailingAddress?.address_line_1 : "",
          address_line_2: mailingAddress ? mailingAddress?.address_line_2 : "",
          city: mailingAddress ? mailingAddress?.city : "",
          state: mailingAddress ? mailingAddress?.state : "",
          postal_code: mailingAddress?.postal_code ?? 0,
          country: "United States (US)",
        },
        address_id: addressId ?? "",
        mailing_address_id: mailingAddressId ?? "",
        company: totalSteps === 3 ? "Yes" : "No",
        // lat: address?.latitude ?? 0,
        // lng: address?.longitude ?? 0,
        // lat1: mailingAddress?.latitude ?? 0,
        // lng1: mailingAddress?.longitude ?? 0,
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
