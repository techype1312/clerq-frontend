"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step1Schema, step1Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  AutoFormInputComponentProps,
  DependencyType,
} from "../ui/auto-form/types";
import { FormControl, FormItem } from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import OnboardingApis from "@/actions/apis/OnboardingApis";
import AuthApis from "@/actions/apis/AuthApis";
import { useUserContext } from "@/context/User";
import CompanyApis from "@/actions/apis/CompanyApis";

const Step1 = ({
  changeStep,
  userData,
  updateUserLocalData,
  setTotalSteps,
  totalSteps,
  staticForFirstTime,
  setStaticForFirstTime,
}: {
  changeStep: (step: number) => void;
  userData: any;
  updateUserLocalData: any;
  setTotalSteps: (steps: number) => void;
  totalSteps: number;
  staticForFirstTime: boolean;
  setStaticForFirstTime: (value: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address | any | undefined>();
  const [mailingAddress, setMailingAddress] = useState<
    Address | any | undefined
  >();
  const { refetchUserData, setRefetchUserData, refreshUser } =
    useUserContext();

  const [companyData, setCompanyData] = useState<any>();

  const handleSubmit = async (e: Step1Schema) => {
    setLoading(true);
    let userData: any = e;
    if (userData?.company === "Yes" && companyData?.length === 0) {
      // Create Company with empty details
      await CompanyApis.createCompany({});
    } else if (userData?.company === "No" && companyData?.length === 0) {
      // Create Company with User details
      await CompanyApis.createCompany({
        email: userData?.email,
        name: `${userData?.legalFirstName} ${userData?.legalLastName}`,
        phone: userData?.phone,
        country_code: 91, // change to 1
        ein: userData?.phone,
        tax_residence_country: "US",
        tax_classification: "Individual/Sole Proprietor",
      });
    } else if (userData?.company === "No" && companyData?.length > 0) {
      // Update Existings company details
      await CompanyApis.updateCompany(companyData[0].id, {
        email: userData?.email,
        name: `${userData?.legalFirstName} ${userData?.legalLastName}`,
        phone: userData?.phone,
        country_code: 91, // change to 1
        ein: userData?.phone,
        tax_residence_country: "US",
        tax_classification: "Individual/Sole Proprietor",
      });
    }
    delete userData.address;
    delete userData.mailing_address;
    delete userData.is_mailing_address_same;
    delete userData.address_id;
    delete userData.mailing_address_id;
    delete userData.company;
    userData.legalFirstName = e.name.legalFirstName ?? userData.firstName;
    userData.legalLastName = e.name.legalLastName ?? userData.lastName;
    delete userData.name;
    (userData.tax_residence_country = "US"),
      delete userData.tax_residence_country;
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
  };
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [changedAddress, setChangedAddress] = useState(false);
  const [isMailingAddressSame, setIsMailingAddressSame] = useState(true);

  useEffect(() => {
    if (addressId && mailingAddressId) {
      const updateAndFetchAddress = async () => {
        await AuthApis.updateUser({
          legal_address: {
            id: addressId,
          },
          mailing_address: {
            id: mailingAddressId,
          },
        });
        refreshUser()
        const res = await OnboardingApis.getAddress(addressId);
        if (res && res.data.status === 200) {
          setAddress(res.data);
        }
        const res1 = await OnboardingApis.getAddress(mailingAddressId);
        if (res1 && res1.data.status === 200) {
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
  }, [addressId, mailingAddressId]);

  useEffect(() => {
    if (isMailingAddressSame && addressId !== mailingAddressId && addressId) {
      const updateAddress = async () => {
        const res = await AuthApis.updateUser({
          mailing_address: {
            id: addressId,
          },
        });
        const fetchMailingAddress = await OnboardingApis.getAddress(addressId);
        if (res && res.status === 200 && fetchMailingAddress) {
          setMailingAddress(fetchMailingAddress.data);
          setMailingAddressId(addressId);
        }
      };
      updateAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMailingAddressSame]);

  const [addressDataLoaded, setAddressDataLoaded] = useState(false);
  const [userRefetch, setUserRefetch] = useState(false);
  useEffect(() => {
    if (!userRefetch) {
      setUserRefetch(true);
      setRefetchUserData(!refetchUserData);
      return;
    } else if (!addressDataLoaded) {
      if (userData?.legal_address?.id)
        setAddressId(userData?.legal_address?.id);
      if (userData?.mailing_address?.id)
        setMailingAddressId(userData?.mailing_address?.id);
      if (
        userData?.legal_address &&
        userData?.legal_address?.id !== userData?.mailing_address.id
      ) {
        setIsMailingAddressSame(false);
      } else {
        setIsMailingAddressSame(true);
      }
      if (userData?.legal_address) setAddress(userData?.legal_address);
      if (userData?.mailing_address)
        setMailingAddress(userData?.mailing_address);
      setAddressDataLoaded(true);
    }
  }, [userData, userRefetch, addressDataLoaded]);

  useEffect(() => {
    CompanyApis.getAllCompanies().then((res) => {
      setCompanyData(res.data?.data);
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
          legalFirstName: {
            inputProps: {
              placeholder: "John",
              onChange: (e: any) => {
                updateUserLocalData({
                  ...userData,
                  legalFirstName: e.target.value,
                });
              },
            },
          },
          legalLastName: {
            inputProps: {
              placeholder: "Doe",
              onChange: (e: any) => {
                updateUserLocalData({
                  ...userData,
                  legalLastName: e.target.value,
                });
              },
            },
          },
        },
        date_of_birth: {
          inputProps: {
            // date component uses onSelect instead of onChange
            onSelect: (e: any) => {
              updateUserLocalData({
                ...userData,
                dob: e,
              });
            },
          },
        },
        mailing_address: {
          label: "Mailing address",
          inputProps: {
            isPresent: mailingAddress ? true : false,
            onChange: (e: any) => {
              setMailingAddress(e);
            },
          },
          fieldType: "modal",
        },
        is_mailing_address_same: {
          fieldType: ({ field, fieldProps }: AutoFormInputComponentProps) => (
            <FormItem id="is_mailing_address_same">
              <FormControl>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={() => {
                        if (!field.value) {
                          setIsMailingAddressSame(true);
                        }
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
              setAddress(e);
            },
          },
        },
        tax_residence_country: {
          inputProps: {
            placeholder: "Select country",
            disabled: true,
            onChange: (e: any) => {
              updateUserLocalData({
                ...userData,
                tax_residence_country: e.currentTarget.value,
              });
            },
          },
        },
        email: {
          inputProps: {
            disabled: true,
          },
        },
        address_id: {
          inputProps: {
            onChangeCapture: (e: any) => {
              setChangedAddress(!changedAddress);
              setAddressId(e.target.value);
            },
          },
        },
        mailing_address_id: {
          inputProps: {
            onChange: (e: any) => {
              setChangedAddress(!changedAddress);
              setMailingAddressId(e.target.value);
            },
          },
        },
        phone: {
          fieldType: "phone",
          label: "Phone number",
          inputProps: {
            disabled: true,
            placeholder: "(123)-456-7890",
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
      ]}
      values={{
        name: {
          legalFirstName: userData?.legalFirstName
            ? userData?.legalFirstName
            : userData?.firstName,
          legalLastName: userData?.legalLastName
            ? userData?.legalLastName
            : userData?.lastName,
        },
        email: userData?.email,
        phone: userData?.phone ?? "",
        tax_residence_country:
          userData?.tax_residence_country ?? "United States (US)",
        date_of_birth: userData?.dob
          ? new Date(userData?.dob ?? "")
          : undefined,
        address: {
          address_line_1: address ? address?.address_line_1 : "",
          address_line_2: address ? address?.address_line_2 : "",
          city: address ? address?.city : "",
          state: address ? address?.state : "",
          postal_code: address?.postal_code ?? "",
          country: "United States",
        },
        is_mailing_address_same: isMailingAddressSame,
        mailing_address: {
          address_line_1: mailingAddress ? mailingAddress?.address_line_1 : "",
          address_line_2: mailingAddress ? mailingAddress?.address_line_2 : "",
          city: mailingAddress ? mailingAddress?.city : "",
          state: mailingAddress ? mailingAddress?.state : "",
          postal_code: mailingAddress?.postal_code ?? "",
          country: "United States",
        },
        address_id: addressId ?? "",
        mailing_address_id:
          mailingAddressId !== addressId ? mailingAddressId ?? "" : "",
        company: totalSteps === 3 ? "Yes" : "No",
        // lat: address?.latitude ?? 0,
        // lng: address?.longitude ?? 0,
        // lat1: mailingAddress?.latitude ?? 0,
        // lng1: mailingAddress?.longitude ?? 0,
      }}
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
        if (!addressDataLoaded) {
          if (values.address) {
            setAddress({
              address_line_1: values.address.address_line_1,
              address_line_2: values.address.address_line_2,
              city: values.address.city,
              state: values.address.state,
              postal_code: values.address.postal_code,
            });
          }
          if (values.mailing_address) {
            setMailingAddress({
              address_line_1: values.mailing_address.address_line_1,
              address_line_2: values.mailing_address.address_line_2,
              city: values.mailing_address.city,
              state: values.mailing_address.state,
              postal_code: values.mailing_address.postal_code,
            });
          }
        }
      }}
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
