"use client";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthApis from "@/actions/apis/AuthApis";
import Cookies from "js-cookie";
import { UserContext } from "@/context/User";
import { toast } from "react-toastify";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userdata, setuserdata } = useContext(UserContext);
  const error = searchParams.get("error");
  const hash = searchParams.get("hash");
  const error_description = searchParams.get("error_description");
  const hasRunRef = useRef(false);
  useEffect(() => {
    if (hasRunRef.current) return;
    if (error) {
      router.push(
        "/auth/failed-link?error=" +
          error +
          "&error_description=" +
          error_description
      );
    }
    if (hash) {
      hasRunRef.current = true;
      const confirmEmail = async () => {
        const res = await AuthApis.confirmEmail(hash);
        if (res?.status === 204) {
          toast.success("Email confirmed successfully, please login");
          router.push("/auth/signin");
          //   if (res.data && res.data.token && res.data.refreshToken) {
          //     Cookies.set("refreshToken", res.data.refreshToken, {
          //       expires: res.data.tokenExpiry,
          //     });
          //     Cookies.set("token", res.data.token);
          //     Cookies.set(
          //       "onboarding_completed",
          //       res?.data?.user?.onboarding_completed ? "true" : "false"
          //     );
          //     localStorage.setItem("user", JSON.stringify(res.data.user));
          //     setuserdata(res.data.user);
          //     toast.success("Email confirmed successfully");
          //     router.push("/dashboard");
          //   }
          // }
        }
      };
      confirmEmail();
    }
  }, [searchParams, hash, error, error_description]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" size={"48px"} />
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-xl font-medium">
          Confirming Email <br />
        </h2>
      </div>
    </div>
  );
};

export default Page;
