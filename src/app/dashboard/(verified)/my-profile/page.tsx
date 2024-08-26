"use client";

import React, { Fragment, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useUserContext } from "@/context/User";
import { ErrorProps, RowData } from "@/types/general";
import { formatAddress, formatPhoneNumber } from "@/utils/utils";
import { UserUpdateSchema } from "@/types/schemas/user";
import ProfileRowContainer from "@/components/dashboard/profile";
import ProfilePhotoEditModel from "@/components/profile-photo";
import ProfileSkeleton from "@/components/skeletonLoading/dashboard/ProfileSkeleton";
import { isObject } from "lodash";
import AddressApis from "@/actions/data/address.data";

const RoleItem = ({ label }: { label: string }) => {
  return (
    <div className="flex w-40 md:w-full items-center justify-between">
      <div
        className="flex flex-col justify-center rounded whitespace-nowrap text-primary"
        style={{
          textTransform: "capitalize",
        }}
      >
        <span
          style={{
            letterSpacing: ".2px",
          }}
          className="hover:bg-teal-100 rounded px-2 text-xs font-normal border border-[#cce8ea]"
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const Page = () => {
  const {
    loading: userDataLoading,
    error,
    userData,
    updateUserPhoto,
    removeUserPhoto,
    updateUserData,
    updateUserLocalData,
  } = useUserContext();
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onUpdateAddressSuccess = (addressType: string, res: any) => {
    if (!userData) return;
    setLoading(false);
    updateUserLocalData({
      ...userData,
      [addressType]: res,
    });
    return res;
  };

  const handleUpdateAddress = async (
    addressId: string,
    address: any,
    addressType: "legal_address" | "mailing_address"
  ) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    return AddressApis.updateAddress(addressId, address).then(
      (res) => onUpdateAddressSuccess(addressType, res),
      onError
    );
  };

  useEffect(() => {
    if (isEmpty(userData)) {
      setRowData([]);
    } else {
      setRowData([
        {
          id: "email",
          label: "Email",
          formattedValue: userData?.email ?? "",
          values: { email: userData?.email ?? "" },
          type: "text",
          isEditable: false,
        },
        {
          id: "legal_name",
          label: "Legal name",
          formattedValue:
            userData?.legalFirstName + " " + userData?.legalLastName,
          values: {
            legalFirstName: userData?.legalFirstName,
            legalLastName: userData?.legalLastName,
          },
          type: "text",
          isEditable: true,
          schema: UserUpdateSchema.legalName,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "preferred_name",
          label: "Preferred name",
          formattedValue: userData?.firstName + " " + userData?.lastName,
          type: "text",
          isEditable: true,
          values: {
            firstName: userData?.firstName,
            lastName: userData?.lastName,
          },
          schema: UserUpdateSchema.preferredName,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "photo",
          label: "Profile Image",
          description: "This will appear on Otto next to your profile name.",
          values: {
            logo: userData?.photo,
            name: userData?.firstName,
          },
          type: "photo",
          isEditable: true,
          actions: {
            updatePhoto: updateUserPhoto,
            removePhoto: removeUserPhoto,
          },
        },
        {
          id: "dob",
          label: "Date of birth",
          formattedValue: userData?.dob,
          values: { dob: userData?.dob },
          type: "date",
          isEditable: true,
          schema: UserUpdateSchema.dob,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "phone",
          label: "Phone no.",
          values: {
            country_code: userData?.country_code,
            phone: userData?.phone,
          },
          formattedValue: formatPhoneNumber(
            userData?.phone,
            userData?.country_code
          ),
          type: "phone",
          isEditable: true,
          schema: UserUpdateSchema.phone,
          actions: {
            onUpdate: updateUserData,
          },
        },
        {
          id: "mailing_address",
          label: "Mailing Address",
          values: {
            address: {
              country:
                userData?.mailing_address?.country?.toUpperCase() ?? "US",
              address_line_1: userData?.mailing_address?.address_line_1,
              address_line_2: userData?.mailing_address?.address_line_2,
              city: userData?.mailing_address?.city,
              postal_code: userData?.mailing_address?.postal_code,
              state: userData?.mailing_address?.state,
            },
            legal_address: {
              ...userData?.legal_address,
            },
            address_id: userData?.mailing_address?.id,
          },
          formattedValue: userData.mailing_address
            ? formatAddress(userData.mailing_address)
            : "",
          type: "address_modal",
          isEditable: true,
          schema: UserUpdateSchema.address,
          actions: {
            onUpdate: async (data: any) => {
              return handleUpdateAddress(
                data.address_id,
                data.address,
                "mailing_address"
              );
            },
          },
        },
        {
          id: "legal_address",
          label: "Legal Address",
          values: {
            address: {
              country: userData?.legal_address?.country?.toUpperCase() ?? "",
              address_line_1: userData?.legal_address?.address_line_1,
              address_line_2: userData?.legal_address?.address_line_2,
              city: userData?.legal_address?.city,
              postal_code: userData?.legal_address?.postal_code,
              state: userData?.legal_address?.state,
            },
            mailing_address: {
              ...userData?.mailing_address,
            },
            address_id: userData?.legal_address?.id,
          },
          formattedValue: userData.legal_address
            ? formatAddress(userData.legal_address)
            : "",
          type: "address_modal",
          isEditable: true,
          schema: UserUpdateSchema.address,
          actions: {
            onUpdate: async (data: any) => {
              return handleUpdateAddress(
                data.address_id,
                data.address,
                "legal_address"
              );
            },
          },
        },
        // {
        //   id: "social",
        //   label: "Social",
        //   // value: userData?.social,
        //   value: [
        //     { facebook: "https://www.facebook.com/" },
        //     { twitter: "https://www.twitter.com/" },
        //   ],
        //   type: "text",
        //   isEditable: true,
        //   company: false,
        // },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const loadingState = () => {
    if (userDataLoading && !userData) {
      return <ProfileSkeleton />;
    }

    if (!userDataLoading && !userData) {
      return (
        <div className="w-full flex items-center h-12 justify-center">
          No data found
        </div>
      );
    }
  };

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex flex-col gap-4">
          <h1 className="text-primary text-2xl font-medium max-md:hidden">
            Profile
          </h1>
          {loadingState()}
          {userData && (
            <Fragment>
              <div className="mt-auto flex gap-2 cursor-pointer items-center border-b pb-4">
                <ProfilePhotoEditModel
                  firstName={userData?.firstName}
                  lastName={userData?.lastName}
                  photo={userData?.photo}
                  updatePhoto={updateUserPhoto}
                  removePhoto={removeUserPhoto}
                  canEdit={true}
                  showButtons={false}
                />
                <p className="ml-2 text-lg text-nowrap mr-2 md:text-[28px] font-[380]">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <RoleItem label={userData?.role?.name ?? ""} />
              </div>
              <ProfileRowContainer profileData={rowData} />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
