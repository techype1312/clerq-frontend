"use client";

import OtpPage from "@/components/common/OTP";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/User";
import Image from "next/image";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";
import { setAuthOnboardingStatus, setAuthRefreshToken, setAuthToken } from "@/utils/session-manager.util";
import AuthApis from "@/actions/data/auth.data";
import localStorage from "@/utils/storage/local-storage.util";

const VerifyOtpPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const country_code = searchParams.get("country_code");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const handleVerifyOtpSuccess = (res: any) => {
    toast.success("Logged in successfully!");
    setAuthToken(res.token, res.tokenExpires);
    setAuthRefreshToken(res.refreshToken);
    setAuthOnboardingStatus(res.user?.onboarding_completed);
    localStorage.set("user", res.user);
    updateUserLocalData(res.user);
    router.push("/dashboard");
    setLoading(false);
  };

  const handleVerifyOtp = () => {
    setLoading(true);
    if (otp.length !== 6) {
      setLoading(false);
      toast.error("Invalid OTP");
      return;
    }
    setServerError("");
    setLoading(true);
    return AuthApis.verifyOtp({
      phone,
      otp,
      country_code: parseInt(country_code ?? "91"),
    }).then(handleVerifyOtpSuccess, onError);
  };

  const handleResendOtpSuccess = (res: any) => {
    toast.success("OTP sent successfully!");
    setLoading(false);
  };

  const handleResendOtp = () => {
    setServerError("");
    setLoading(true);
    return AuthApis.loginUserWithOtp({
      phone,
      country_code: parseInt(country_code ?? "91"),
    }).then(handleResendOtpSuccess, onError);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-screen">
      <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
      <OtpPage
        title={"Enter code"}
        phone={phone ?? ""}
        country_code={country_code ?? ""}
        otp={otp}
        setOtp={setOtp}
        error={serverError}
        verifyOtp={handleVerifyOtp}
        disableButton={loading}
        resendOtp={handleResendOtp}
      />
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <VerifyOtpPage />
    </Suspense>
  );
}
