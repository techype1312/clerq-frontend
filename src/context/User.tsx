/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthApis from "@/actions/apis/AuthApis";

export const UserContext = createContext<any>(null);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userdata, setuserdata] = useState<any | null>(null);
  const [otherUserData, setOtherUserData] = useState<any>(null);
  const [refetchUserData, setRefetchUserData] = useState<boolean>(false);

  const refreshUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const res = await AuthApis.profile();
        if (pathname.startsWith("/auth") && res && res.data) {
          setuserdata(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          router.push("/dashboard");
        } else if (pathname.startsWith("/dashboard") && res && res.data) {
          setuserdata(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          router.push("/auth/signin");
        }
      } catch (error) {
        if (localStorage.getItem("user")) {
          setuserdata(JSON.parse(localStorage.getItem("user") as string));
        }
        console.log(error);
      }
    }
  }, [refetchUserData]);

  useEffect(() => {
    if (!userdata) {
      refreshUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={
        {
          userdata,
          setuserdata,
          refreshUser,
          otherUserData,
          refetchUserData,
          setRefetchUserData,
        } as any
      }
    >
      {children}
    </UserContext.Provider>
  );
};
