"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import isObject from "lodash/isObject";
import { ErrorProps } from "@/types/general";
import AuthApis from "@/actions/data/auth.data";
import {
  setAuthOnboardingStatus,
  setAuthRefreshToken,
  setAuthToken,
} from "@/utils/session-manager.util";
import localStorage from "@/utils/storage/local-storage.util";
import { useUserContext } from "@/context/User";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const hash = searchParams.get("hash");
  const error_description = searchParams.get("error_description");
  const hasRunRef = useRef(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const handleConfirmEmailSuccess = (res: any) => {
    toast.success("Email confirmed successfully!");
    setAuthToken(res.token, res.tokenExpires);
    setAuthRefreshToken(res.refreshToken);
    setAuthOnboardingStatus(res.user?.onboarding_completed);
    localStorage.set("user", res.user);
    updateUserLocalData(res.user);
    router.push("/dashboard");
    setLoading(false);
  };

  const handleConfirmEmail = (hash: string) => {
    setServerError("");
    setLoading(true);
    return AuthApis.confirmUserEmail(hash).then(
      handleConfirmEmailSuccess,
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
      handleConfirmEmail(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hash, error, error_description]);

  if (!hash || error || serverError) {
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
      {loading && <Loader2Icon className="animate-spin" size={"48px"} />}
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
