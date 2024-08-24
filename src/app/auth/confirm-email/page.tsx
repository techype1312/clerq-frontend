"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import AuthApis from "@/actions/apis/AuthApis";
import { useUserContext } from "@/context/User";
import Image from "next/image";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const searchParams = useSearchParams();
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
        if (res.data && res.data.token && res.data.refreshToken) {
          toast.success("Email confirmed successfully!");
          Cookies.set("refreshToken", res.data.refreshToken, {
            expires: res.data.tokenExpiry,
          });
          Cookies.set("token", res.data.token);
          Cookies.set(
            "onboarding_completed",
            res?.data?.user?.onboarding_completed ? "true" : "false"
          );
          localStorage.setItem("user", JSON.stringify(res.data.user));
          updateUserLocalData(res.data.user);
          router.push("/dashboard");
        }
      };
      confirmEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hash, error, error_description]);

  if (!hash || error) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-xl font-medium">
            Failed to confirm Email! <br />
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
      <Loader2Icon className="animate-spin" size={"48px"} />
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-xl font-medium">
          Confirming Email <br />
        </h2>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <ConfirmEmailPage />
    </Suspense>
  );
}
