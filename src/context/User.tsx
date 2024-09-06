/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { usePathname, useRouter } from "next/navigation";
import { ErrorProps } from "@/types/general";
import { IImageFileType } from "@/types/file";
import { IUser, IUserContext } from "@/types/user";
import AuthApis from "@/actions/data/auth.data";
import localStorage from "@/utils/storage/local-storage.util";
import {
  getAuthToken,
  setAuthOnboardingStatus,
  setAuthToken,
} from "@/utils/session-manager.util";
import { isDemoEnv, Servers } from "../../config";
import { Loader2Icon } from "lucide-react";

export const UserContext = createContext<IUserContext>({} as IUserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [userData, setUserData] = useState<IUser>();
  const [refetchUserData, setRefetchUserData] = useState<boolean>(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchUserDetailsError = (err: string | ErrorProps) => {
    if (localStorage.get("user") && localStorage.get("user").val) {
      setUserData(JSON.parse(localStorage.get("user").val));
    }
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchUserDetailsSuccess = (res: any) => {
    setLoading(false);
    setUserData(res);
    localStorage.set("user", JSON.stringify(res));
    if (pathname.startsWith("/auth")) {
      router.push("/dashboard");
    }
  };

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (loading || !token) return false;
    setLoading(true);
    return AuthApis.getMyprofile().then(
      onFetchUserDetailsSuccess,
      onFetchUserDetailsError
    );
  }, [refetchUserData]);

  // ? Don't touch this DemoEnv AutoLogin
  useEffect(() => {
    if (isDemoEnv() && Servers.DemoEnvToken) {
      localStorage.remove("user");
      setAuthToken(Servers.DemoEnvToken);
      setAuthOnboardingStatus(true);
    }
  }, []);

  useEffect(() => {
    if (!userData) {
      if (localStorage.get("user") && localStorage.get("user").val) {
        setUserData(JSON.parse(localStorage.get("user").val));
      } else {
        setRefetchUserData(true);
        refreshUser();
      }
    }
  }, []);

  const updateUserLocalData = (data: any) => {
    setUserData(data);
    localStorage.set("user", JSON.stringify(data));
  };

  const onUpdateUserDataSuccess = (res: any, onboarding?: boolean) => {
    updateUserLocalData(res);
    if (onboarding && pathname.startsWith("/auth")) {
      setAuthOnboardingStatus(true);
      router.push("/dashboard");
    }
  };

  const updateUserDataDetails = async (
    payload: Record<string, any>,
    onboarding?: boolean
  ) => {
    if (loading) return false;
    return AuthApis.updateMyProfile(payload).then(
      (res) => onUpdateUserDataSuccess(res, onboarding),
      onError
    );
  };

  const updateUserData = async (
    values: Partial<IUser>,
    onboarding?: boolean
  ) => {
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
    if (values.photo) {
      payload.photo = values.photo;
    }
    if (values.onboarding_completed) {
      payload.onboarding_completed = values.onboarding_completed;
    }

    if (!isEmpty(payload)) {
      return updateUserDataDetails(payload, onboarding);
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
      value={{
        loading,
        error: serverError,
        userData,
        userRoleId: userData?.role?.id,
        refetchUserData,
        refreshUser,
        setRefetchUserData,
        updateUserLocalData,
        updateUserPhoto,
        removeUserPhoto,
        updateUserData,
      }}
    >
      {loading && (
        <div
          style={{
            height: "100%",
            width: "100%",
            zIndex: 999,
            position: "fixed",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Loader2Icon
            className="animate-spin absolute top-[50%] left-[50%] stroke-[#233ED6] z-[1000]"
            size={"48px"}
          />
        </div>
      )}
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUserContext = () => useContext(UserContext);
