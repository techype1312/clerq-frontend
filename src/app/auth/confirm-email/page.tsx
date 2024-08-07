"use client";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthApis from "@/actions/apis/AuthApis";
import Cookies from "js-cookie";
import { MainContext } from "@/context/Main";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {userdata, setuserdata} = useContext(MainContext);
  const error = searchParams.get("error");
  const hash = searchParams.get("hash");
  const error_description = searchParams.get("error_description");
  useEffect(() => {
    if (error) {
      router.push(
        "/auth/failed-link?error=" +
          error +
          "&error_description=" +
          error_description
      );
    } else if (hash) {
      const verifyMagicLinkHash = async () => {
        const res = await AuthApis.verifyMagicLinkHash(hash);
        if (res.status === 200) {
          if (res.data && res.data.jwtToken && res.data.refreshToken) {
            Cookies.set("refreshToken", res.data.refreshToken, {
              expires: res.data.tokenExpiry,
            });
            Cookies.set("token", res.data.jwtToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setuserdata(res.data.user)
            router.push('/dashboard')
          }
        }
      };
      verifyMagicLinkHash();
    }
  }, [searchParams]);
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" size={"48px"} />
      <p>Logging in with magic link</p>
    </div>
  );
};

export default Page;
