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
        }
        if (res && res.status === 401) {
          localStorage.removeItem("user");
          Cookies.remove("token");
          Cookies.remove("refresh_token");
          router.push("/auth/login");
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
      if (localStorage.getItem("user")) { 
        setuserdata(JSON.parse(localStorage.getItem("user") as string));
      } else{
        refreshUser(); //This causes the search params to be cleared
      }
    }
  }, []);

  const updateLocalUserData = (data: any) => {
    setuserdata(data);
    localStorage.setItem("user", JSON.stringify(data));
  }

  return (
    <UserContext.Provider
      value={
        {
          userdata,
          setuserdata,
          refreshUser,
          refetchUserData,
          setRefetchUserData,
          updateLocalUserData
        } as any
      }
    >
      {children}
    </UserContext.Provider>
  );
};
