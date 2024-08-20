/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthApis from "@/actions/apis/AuthApis";
import { ErrorProps } from "@/types/general";
import { IImageFileType } from "@/types/file";
import { IUser, IUserContext } from "@/types/user";

export const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<IUser>();
  const [refetchUserData, setRefetchUserData] = useState<boolean>(false);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchUserDetailsError = (err: string | ErrorProps) => {
    if (localStorage.getItem("user")) {
      setUserData(JSON.parse(localStorage.getItem("user") as string));
    }
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchUserDetailsSuccess = (res: any) => {
    if (res.data) {
      setUserData(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    if (pathname.startsWith("/auth")) {
      router.push("/dashboard");
    }
    if (res && res.status === 401) {
      localStorage.removeItem("user");
      Cookies.remove("token");
      Cookies.remove("refresh_token");
      Cookies.remove("onboarding_completed");
      Cookies.remove("otto_ucrm");
      router.push("/auth/login");
    }
    setLoading(false);
  };

  const refreshUser = useCallback(async () => {
      const token = Cookies.get("token");
      if (loading || !token) return false;
      setLoading(true);
      return AuthApis.profile().then(
      onFetchUserDetailsSuccess,
      onFetchUserDetailsError
    );
  }, [refetchUserData]);

  useEffect(() => {
    if (!userData) {
      if (localStorage.getItem("user")) { 
        setUserData(JSON.parse(localStorage.getItem("user") as string));
      } else{
        refreshUser(); //This causes the search params to be cleared
      }
    }
  }, []);

  const updateUserLocalData = (data: any) => {
    setUserData(data);
    localStorage.setItem("user", JSON.stringify(data));
  }

  const onUpdateUserDataSuccess = (res: any) => {
    if (res.data) {
      updateUserLocalData(res.data);
    }
    return res
  };

  const updateUserDataDetails = async (payload: Record<string, any>) => {
    const token = Cookies.get("token");
    if (loading || !token) return false;
    return AuthApis.updateUser(payload).then(
      onUpdateUserDataSuccess,
      onError
    );
  };

  const updateUserData = async (values: Partial<IUser>) => {
    const payload: Partial<IUser> = {};
    if (values.firstName) {
      payload.firstName = values.firstName;
    }
    if (values.lastName) {
      payload.lastName = values.lastName;
    }
    if (values.legalFirstName) {
      payload.legalFirstName = values.legalFirstName;
    }
    if (values.legalLastName) {
      payload.legalLastName = values.legalLastName;
    }
    if (values.phone) {
      payload.phone = values.phone;
      payload.country_code = values.country_code;
    }
    if (values.dob) {
      payload.dob = values.dob;
    }
    if (!isEmpty(payload)) {
      return updateUserDataDetails(payload);
    }
  };

  const updateUserPhoto = async (photo: IImageFileType) => {
    return updateUserData({ photo });
  };

  const removeUserPhoto = async () => {
    return updateUserData({ photo: {} as IImageFileType });
  };

  return (
    <UserContext.Provider
      value={
        {
          loading,
          error,
          userData,
          refetchUserData,
          refreshUser,
          setRefetchUserData,
          updateUserLocalData,
          updateUserPhoto,
          removeUserPhoto,
          updateUserData,
        }
      }
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUserContext = () => useContext(UserContext);
