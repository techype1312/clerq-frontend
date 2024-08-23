"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step1Schema, step1Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DependencyType } from "../ui/auto-form/types";
import OnboardingApis from "@/actions/apis/OnboardingApis";
import AuthApis from "@/actions/apis/AuthApis";
import { useUserContext } from "@/context/User";
import CompanyApis from "@/actions/apis/CompanyApis";
import { toast } from "react-toastify";

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
  const { refetchUserData, setRefetchUserData, refreshUser } = useUserContext();
  const [localUserData, setLocalUserData] = useState<any>();
  const [companyData, setCompanyData] = useState<any>();

  const handleSubmit = async (e: Step1Schema) => {
    if (!addressId || !mailingAddressId)
      return toast.error(
        addressId
          ? mailingAddressId
            ? "Please add Legal and Mailing address"
            : "Please add Mailing address"
          : "Please add legal address"
      );
    setLoading(true);
    let userData: any = e;
    if (userData?.company === "Yes" && companyData?.length === 0) {
      // Create Company with empty details
      await CompanyApis.createCompany({
        email: userData?.email, // added email as passing nothing was giving error
      });
    } else if (userData?.company === "No" && companyData?.length === 0) {
      // Create Company with User details
      await CompanyApis.createCompany({
        email: userData?.email,
        name: `${userData?.legalFirstName} ${userData?.legalLastName}`,
        phone: userData?.phone,
        country_code: e.country_code,
        ein: userData?.phone,
        tax_residence_country: "US",
        tax_classification: "Individual/Sole Proprietor",
      });
    } else if (userData?.company === "No" && companyData?.length > 0) {
      // Update Existing company details
      await CompanyApis.updateCompany(companyData[0].id, {
        email: userData?.email,
        name: `${localUserData?.legalFirstName} ${localUserData?.legalLastName}`,
        phone: localUserData?.phone,
        country_code: e.country_code,
        ein: localUserData?.phone,
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
    userData.legalFirstName = e.name.legalFirstName ?? localUserData.firstName;
    userData.legalLastName = e.name.legalLastName ?? localUserData.lastName;
    delete userData.name;
    (userData.tax_residence_country = "US"),
      delete userData.tax_residence_country;
    delete userData.email;
    delete userData.phone;
    userData.dob = e.date_of_birth.toUTCString();
    delete userData.date_of_birth;

    const res = await AuthApis.updateUser(userData);

    if (res && res.status === 200) {
      changeStep(2);
    }
    setLoading(false);
  };
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [changedAddress, setChangedAddress] = useState(false);
  const [createdAddress, setCreatedAddress] = useState(false);
  useEffect(() => {
    const updateAndFetchAddress = async () => {
      if (addressId && createdAddress) {
        await AuthApis.updateUser({
          legal_address: {
            id: addressId,
          },
        });
        refreshUser();
        setCreatedAddress(false);
      }
    };
    updateAndFetchAddress();
  }, [addressId, createdAddress]);
  useEffect(() => {
    const updateAndFetchAddress = async () => {
      if (mailingAddressId && createdAddress) {
        await AuthApis.updateUser({
          mailing_address: {
            id: mailingAddressId,
          },
        });
        setCreatedAddress(false);
      }
    };
    updateAndFetchAddress();
  }, [mailingAddressId, createdAddress]);

  const [addressDataLoaded, setAddressDataLoaded] = useState(false);
  const [userRefetch, setUserRefetch] = useState(false);
  useEffect(() => {
    if (!userRefetch) {
      setUserRefetch(true);
      setRefetchUserData(!refetchUserData);
      return;
    } else if (!addressDataLoaded) {
      if(userData){
        setLocalUserData(userData);
      }
      console.log("userData", userData);
      if (userData?.legal_address?.id)
        setAddressId(userData?.legal_address?.id);
      if (userData?.mailing_address?.id)
        setMailingAddressId(userData?.mailing_address?.id);
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

  // const clearAddress = async () => {
  //   setAddress(undefined);
  //   setMailingAddress(undefined);
  //   setAddressId(null);
  //   setMailingAddressId(null);
  //   await AuthApis.updateUser({
  //     legal_address: {
  //       id: null,
  //     },
  //     mailing_address: {
  //       id: null,
  //     },
  //   });
  // };

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
                setLocalUserData({
                  ...localUserData,
                  legalFirstName: e.target.value,
                })
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
                setLocalUserData({
                  ...localUserData,
                  legalLastName: e.target.value,
                })
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
              setLocalUserData({
                ...localUserData,
                dob: e,
              })
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
        address: {
          label: "Legal address",
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
              setLocalUserData({
                ...localUserData,
                tax_residence_country: e.currentTarget.value,
              })
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
      values={{
        name: {
          legalFirstName: localUserData?.legalFirstName
            ? localUserData?.legalFirstName
            : localUserData?.firstName,
          legalLastName: localUserData?.legalLastName
            ? localUserData?.legalLastName
            : localUserData?.lastName,
        },
        email: localUserData?.email,
        phone: localUserData?.phone ?? "",
        country_code: localUserData?.country_code ?? 1,
        tax_residence_country: localUserData?.tax_residence_country ?? "US",
        date_of_birth: localUserData?.dob
          ? new Date(localUserData?.dob ?? "")
          : undefined,
        address: {
          address_line_1: address ? address?.address_line_1 : "",
          address_line_2: address ? address?.address_line_2 : "",
          city: address ? address?.city : "",
          state: address ? address?.state : "",
          postal_code: address?.postal_code ?? "",
          country: address?.country ?? "US",
        },
        mailing_address: {
          address_line_1: mailingAddress ? mailingAddress?.address_line_1 : "",
          address_line_2: mailingAddress ? mailingAddress?.address_line_2 : "",
          city: mailingAddress ? mailingAddress?.city : "",
          state: mailingAddress ? mailingAddress?.state : "",
          postal_code: mailingAddress?.postal_code ?? "",
          country: mailingAddress?.country ?? "US",
        },
        address_id: addressId ?? "",
        mailing_address_id:
          mailingAddressId !== addressId ? mailingAddressId ?? "" : "",
        company: totalSteps === 3 ? "Yes" : "No",
        long: address ? address.longitude : "",
        lat: address ? address.latitude : "",
        long1: mailingAddress ? mailingAddress.longitude : "",
        lat1: mailingAddress ? mailingAddress.latitude : "",
      }}
      className="flex flex-col gap-4 mx-auto max-w-lg"
      zodItemClass="flex flex-row gap-4 space-y-0"
      labelClass="text-label"
      onValuesChange={(values) => {
        if (!addressDataLoaded || values.address_id) {
          if (values.address_id !== addressId && values.address_id) {
            setAddressId(values.address_id);
            setCreatedAddress(true);
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
            updateUserLocalData({
              ...userData,
              legal_address: {
                id: values.address_id,
                address_line_1: values.address.address_line_1,
                address_line_2: values.address.address_line_2,
                city: values.address.city,
                state: values.address.state,
                postal_code: values.address.postal_code,
                longitude: values.long,
                latitude: values.lat,
              },
            });
          }
        }
        if (!addressDataLoaded || values.mailing_address_id) {
          if (values.mailing_address_id !== mailingAddressId && values.mailing_address_id) {
            setMailingAddressId(values.mailing_address_id);
            setCreatedAddress(true);
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
            updateUserLocalData({
              ...userData,
              mailing_address: {
                id: values.mailing_address_id,
                address_line_1: values.mailing_address.address_line_1,
                address_line_2: values.mailing_address.address_line_2,
                city: values.mailing_address.city,
                state: values.mailing_address.state,
                postal_code: values.mailing_address.postal_code,
                longitude: values.long1,
                latitude: values.lat1,
              },
            });
          }
        }
      }}
    >
      <AutoFormSubmit
        disabled={loading}
        className="w-fit background-primary rounded-full h-12"
      >
        {loading ? <Loader2Icon className="animate-spin" /> : "Next"}
      </AutoFormSubmit>
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          clearAddress();
        }}
      >
        clearAddress
      </button> */}
    </AutoForm>
  );
};

export default Step1;
