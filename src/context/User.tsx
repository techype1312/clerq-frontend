"use client";
import { createContext, useCallback, useEffect, useState } from "react";
export const UserContext = createContext<any>(null);
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthApis from "@/actions/apis/AuthApis";
import { supabase } from "@/utils/supabase/client";

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
  // const refreshUser = useCallback(async () => {
  //   const token = Cookies.get("token");
  //   if (token) {
  //     try {
  //       const res = await AuthApis.profile();
  //       if (pathname.startsWith("/auth") && res.data.user) {
  //         localStorage.setItem("user", JSON.stringify(res.data.user));
  //         router.push("/dashboard");
  //       } else if (pathname.startsWith("/dashboard") && res.data.user) {
  //         router.push("/auth/signin");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // },[refetchUserData]);
  const refreshUser = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (data) {
      setuserdata(data.user);
      supabase
        .from("other_user_info")
        .select("*")
        .eq("user_id", data?.user?.id)
        .then(({ data, error }) => {
          if (data) {
            console.log(data);
            setOtherUserData(data[0]);
          } else {
            console.log(error);
          }
        });
      // if (pathname.startsWith("/auth") && data.user) {
      //   router.push("/dashboard");
      // } else if (pathname.startsWith("/dashboard") && !data.user) {
      //   router.push("/auth/signin");
      // }
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userdata) {
      if(localStorage.getItem("user")) {
        localStorage.getItem("user") &&
        setuserdata(JSON.parse(localStorage.getItem("user") as string));
      } else{
        refreshUser();
      }
    }
  }, [userdata]);

  return (
    <UserContext.Provider
      value={
        {
          userdata,
          refreshUser,
          otherUserData,
          setRefetchUserData
        } as any
      }
    >
      {children}
    </UserContext.Provider>
  );
};
