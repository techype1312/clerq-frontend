"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/User";
import Image from "next/image";
import {
  setAuthOnboardingStatus,
  setAuthRefreshToken,
  setAuthToken,
} from "@/utils/session-manager.util";
import { ErrorProps } from "@/types/general";
import { isObject } from "lodash";
import InviteTeamApis from "@/actions/data/invite.data";
import localStorage from "@/utils/storage/local-storage.util";

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
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onAcceptInviteSuccess = (res: any) => {
    toast.success("Invite accepted successfully!");
    setAuthToken(res.token, res.tokenExpires);
    setAuthRefreshToken(res.refreshToken);
    setAuthOnboardingStatus(res.user?.onboarding_completed);
    localStorage.set("user", res.user);
    updateUserLocalData(res.user);
    router.push("/dashboard");
    setLoading(false);
  };

  const handleAcceptInvitation = () => {
    if (loading || !hash) return false;
    setLoading(true);
    setServerError("");
    const data = {
      hash: hash as string,
    };
    return InviteTeamApis.acceptInvite(data).then(
      onAcceptInviteSuccess,
      onError
    );
  };

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
      handleAcceptInvitation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hash, error, error_description]);

  if (!hash || error || serverError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-xl font-medium">
            Failed to verify Invite! <br />
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
        {userFirstName ? `${userFirstName} ${userLasName} (${userEmail})`: ''}
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
