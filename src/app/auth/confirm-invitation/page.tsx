"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/User";
import InviteTeamApis from "@/actions/apis/InviteApi";

const ConfirmInvitationPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const hash = searchParams.get("hash");
  const userEmail = searchParams.get("email");
  const userFirstName = searchParams.get("firstName");
  const userLasName = searchParams.get("lastName");
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
      const confirmInvitation = async () => {
        const res = await InviteTeamApis.acceptInvite({ hash });
        if (res.data && res.data.token && res.data.refreshToken) {
          toast.success("Invitation confirmed successfully!");
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
      confirmInvitation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hash, error, error_description]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" size={"48px"} />
      <div className="flex flex-col gap-2">
        {`${userFirstName} ${userLasName} (${userEmail})`}
        <h2 className="text-center text-xl font-medium">
          Confirming Invitation <br />
        </h2>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <ConfirmInvitationPage />
    </Suspense>
  );
}
