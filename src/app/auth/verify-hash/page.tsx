"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthApis from "@/actions/apis/AuthApis";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/User";

const VerifyHashPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserLocalData } = useUserContext();
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
      const verifyMagicLinkHash = async () => {
        const res = await AuthApis.verifyMagicLinkHash(hash);
        if (res.status === 200) {
          if (res.data && res.data.token && res.data.refreshToken) {
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

export default function Page() {
  return (
    <Suspense>
      <VerifyHashPage />
    </Suspense>
  );
}
