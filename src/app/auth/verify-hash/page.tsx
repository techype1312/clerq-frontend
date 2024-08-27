"use client";

import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/User";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";
import { toast } from "react-toastify";
import {
  setAuthOnboardingStatus,
  setAuthRefreshToken,
  setAuthToken,
} from "@/utils/session-manager.util";
import localStorage from "@/utils/storage/local-storage.util";
import AuthApis from "@/actions/data/auth.data";
import Image from "next/image";

const VerifyHashPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUserLocalData } = useUserContext();
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

  const handleVerifyMagicLinkSuccess = (res: any) => {
    toast.success("Logged in successfully!");
    setAuthToken(res.token, res.tokenExpires);
    setAuthRefreshToken(res.refreshToken);
    setAuthOnboardingStatus(res.user?.onboarding_completed);
    localStorage.set("user", res.user);
    updateUserLocalData(res.user);
    router.push("/dashboard");
    setLoading(false);
  };

  const handleVerifyMagicLink = (hash: string) => {
    setServerError("");
    setLoading(true);
    return AuthApis.verifyMagicLinkHash(hash).then(
      handleVerifyMagicLinkSuccess,
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
      handleVerifyMagicLink(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!hash || serverError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-xl font-medium">
            Failed to login! <br />
          </h2>
          <button
            disabled={loading}
            onClick={async () => {
              router.push("/auth/signin");
            }}
            className="text-white bg-primary py-2 px-8 rounded-full w-fit focus:outline-none"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Go to login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      {loading && <Loader2Icon className="animate-spin" size={"48px"} />}
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
