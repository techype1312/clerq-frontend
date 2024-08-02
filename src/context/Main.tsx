"use client";
import { createContext, useEffect, useState } from "react";
export const MainContext = createContext<any>(null);
import { supabase } from "@/utils/supabase/client";
import { usePathname, useRouter } from "next/navigation";
import { PostgrestSingleResponse, User } from "@supabase/supabase-js";

export const MainContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userdata, setuserdata] = useState<User | null>(null);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [otherUserData, setOtherUserData] = useState<any>(null);

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
      if (pathname.startsWith("/auth") && data.user) {
        router.push("/dashboard");
      } else if (pathname.startsWith("/dashboard") && !data.user) {
        router.push("/auth/signin");
      }
    } else {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userdata) {
      refreshUser();
    }
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", () => {
      setWindowWidth(window.innerWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWindowWidth(window.innerWidth);
      });
    };
  }, []);

  return (
    <MainContext.Provider
      value={
        {
          userdata,
          refreshUser,
          windowWidth,
          otherUserData,
        } as any
      }
    >
      {children}
    </MainContext.Provider>
  );
};
