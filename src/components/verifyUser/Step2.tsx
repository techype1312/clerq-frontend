"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Address, Step2Schema, step2Schema } from "@/types/schema-embedded";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import CompanyApis from "@/actions/apis/CompanyApis";
import { useUserContext } from "@/context/User";
import { DependencyType } from "../ui/auto-form/types";
import { toast } from "react-toastify";

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
  const [localCompanyData, setLocalCompanyData] = useState<any>({
    name: "",
    phone: "",
    country_code: 91,
  });
  const {
    userData: user,
    refetchUserData,
    setRefetchUserData,
  } = useUserContext();
  const [address, setAddress] = useState<Address | any>();
  const [mailingAddress, setMailingAddress] = useState<Address | any>();
  const [addressId, setAddressId] = useState<string | null>(null);
  const [mailingAddressId, setMailingAddressId] = useState<string | null>(null);
  const [changedAddress, setChangedAddress] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [addressDataLoaded, setAddressDataLoaded] = useState(false);
  const [createdAddress, setCreatedAddress] = useState(false);
  const handleSubmit = async (e: Step2Schema) => {
    if (!addressId || !mailingAddressId)
      return toast.error(
        addressId
          ? mailingAddressId
            ? "Please add Legal and Mailing address"
            : "Please add Mailing address"
          : "Please add legal address"
      );
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
        setLocalCompanyData(res.data.data[0]);
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
    if (addressId && companyId && createdAddress) {
      const updateAndFetchAddress = async () => {
        await CompanyApis.updateCompany(companyId, {
          legal_address: {
            id: addressId,
          },
        });
        setCreatedAddress(false);
      };
      updateAndFetchAddress();
    }
  }, [addressId, companyId, createdAddress]);
  useEffect(() => {
    if (mailingAddressId && companyId && createdAddress) {
      const updateAndFetchAddress = async () => {
        await CompanyApis.updateCompany(companyId, {
          mailing_address: {
            id: mailingAddressId,
          },
        });

        setCreatedAddress(false);
      };
      updateAndFetchAddress();
    }
  }, [mailingAddressId, companyId, createdAddress]);

  useEffect(() => {
    if (!companyData) {
      return setRefetchUserData(!refetchUserData);
    } else if (!addressDataLoaded) {
      if (companyData?.legal_address?.id)
        setAddressId(companyData?.legal_address?.id);
      if (companyData?.mailing_address?.id)
        setMailingAddressId(companyData?.mailing_address?.id);
      if (companyData?.legal_address) setAddress(companyData?.legal_address);
      if (companyData?.mailing_address)
        setMailingAddress(companyData?.mailing_address);
      setAddressDataLoaded(true);
    }
  }, [companyData, addressDataLoaded]);
  useEffect(()=>{
    console.log(localCompanyData, 'localCompanyData')
  },[localCompanyData])

  return (
    <div className="w-full">
      <AutoForm
        formSchema={step2Schema}
        onSubmit={(e) => handleSubmit(e)}
        fieldConfig={{
          name: {
            inputProps: {
              placeholder: "Your company name",
            },
          },
          email: {
            inputProps: {
              placeholder: "Your company email",
            },
          },
          phone: {
            fieldType: "phone",
            label: "Phone number",
            inputProps: {
              placeholder: "(123)-456-7890",
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
              // onChange: (e: any) => {
              //   setChangedAddress(!changedAddress);
              //   setAddress(e);
              // },
            },
          },
          ein: {
            label: "EIN (Employer Identification no.)",
            inputProps: {
              placeholder: "Your EIN",
            },
          },
          tax_classification: {
            inputProps: {
              placeholder: "Individual/sole proprietor or single-member LLC",
            },
          },
          mailing_address: {
            label: "Mailing address",
            inputProps: {
              isPresent: mailingAddress ? true : false,
              // onChange: (e: any) => {
              //   setChangedAddress(!changedAddress);
              //   setMailingAddress(e);
              // },
            },
            fieldType: "modal",
          },

          address_id: {
            inputProps: {
              // onChange: (e: any) => {
              //   setAddressId(e.target.value);
              // },
            },
          },
          mailing_address_id: {
            inputProps: {
              // onChange: (e: any) => {
              //   setMailingAddressId(e.target.value);
              // },
            },
          },
        }}
        values={{
          name: localCompanyData?.name ? localCompanyData?.name : "",
          ein: localCompanyData?.ein ? localCompanyData?.ein : "",
          email: localCompanyData?.email ? localCompanyData?.email : "",
          tax_classification: localCompanyData?.tax_classification
            ? localCompanyData?.tax_classification
            : "",
          phone: localCompanyData?.phone ?? "",
          tax_residence_country:
            localCompanyData?.tax_residence_country ?? "US",
          address: {
            address_line_1: address ? address?.address_line_1 : "",
            address_line_2: address ? address?.address_line_2 : "",
            city: address ? address?.city : "",
            state: address ? address?.state : "",
            postal_code: address?.postal_code ?? "",
            country: address?.country ?? "US",
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
            country: mailingAddress?.country ?? "US",
          },
          address_id: addressId ?? "",
          mailing_address_id:
            mailingAddressId !== addressId ? mailingAddressId ?? "" : "",
          long: address ? address.longitude : "",
          lat: address ? address.latitude : "",
          long1: mailingAddress ? mailingAddress.longitude : "",
          lat1: mailingAddress ? mailingAddress.latitude : "",
          country_code: user?.country_code ?? 1,
        }}
        dependencies={[
          // {
          //   sourceField: "is_mailing_address_same",
          //   type: DependencyType.HIDES,
          //   targetField: "mailing_address",
          //   when: (is_mailing_address_same) => is_mailing_address_same,
          // },
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
        className="flex flex-col gap-4 mx-auto xs:w-96 max-w-xl"
        zodItemClass="flex flex-row gap-4 space-y-0"
        labelClass="text-label"
        onValuesChange={(values) => {
            setLocalCompanyData((prevData: any) => ({
              ...prevData,
              name: values?.name,
              ein: values?.ein,
              email: values?.email,
              tax_classification: values?.tax_classification,
              phone: values?.phone,
              country_code: values?.country_code,
            }));
          if (!addressDataLoaded || values.address_id) {
            if (values.address_id && values.address_id !== addressId) {
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
            }
          }
          if (!addressDataLoaded || values.mailing_address_id) {
            if (
              values.mailing_address_id &&
              values.mailing_address_id !== mailingAddressId
            ) {
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
            }
          }
          if (values.phone) {
            setLocalCompanyData({
              ...localCompanyData,
              phone: values.phone,
              country_code: values.country_code,
            });
          }
          if (values.email) {
            setLocalCompanyData({
              ...localCompanyData,
              email: values.email,
            });
          }
          if (values.phone) {
            setLocalCompanyData({
              ...localCompanyData,
              phone: values.phone,
            });
          }
          if (values.ein) {
            console.log(values.ein);
            console.log(localCompanyData);
            setLocalCompanyData((prevData: any) => ({
              ...prevData,
              ein: values.ein,
              name: values.name,
              email: values.email,
              phone: values.phone,
              tax_classification: values.tax_classification,
              country_code: values.country_code,
            }));
          }
          if (values.tax_classification) {
            console.log(values.tax_classification, localCompanyData, 'tax');
            setLocalCompanyData({
              ...localCompanyData,
              tax_classification: values.tax_classification,
            });
          }
        }}
      >
        <div className="flex gap-4">
          <Button
            onClick={() => {
              changeStep(1);
            }}
            variant="ghost"
            className="background-muted text-label hover:!background-muted box-border w-40 h-12 px-10 rounded-full"
          >
            Previous
          </Button>
          <AutoFormSubmit
            disabled={loading}
            className="background-primary px-10 rounded-full h-12 box-border w-40"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Next"}
          </AutoFormSubmit>
        </div>
      </AutoForm>
    </div>
  );
};

export default Step2;
