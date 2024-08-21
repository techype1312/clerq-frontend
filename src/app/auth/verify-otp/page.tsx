"use client";
import AuthApis from "@/actions/apis/AuthApis";
import OtpPage from "@/components/generalComponents/OTP";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/User";
const VerifyOtpPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const country_code = searchParams.get("country_code");
  const [disableButton, setDisableButton] = React.useState(false);
  const verifyOtp = async () => {
    setDisableButton(true);
    if (otp.length !== 6) {
      setDisableButton(false);
      toast.error("Invalid OTP");
      return;
    }
    try {
      const res = await AuthApis.verifyOtp({
        phone,
        otp,
        country_code: parseInt(country_code ?? "91"), //make 1 for us,
      });
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
        router.push("/dashboard");
      }
      setDisableButton(false);
    } catch (e) {
      setOtpError("Invalid OTP");
      setDisableButton(false);
    }
  };
  const resendOtp = async () => {
    setDisableButton(true);
    try {
      const res = await AuthApis.loginWithOtp({
        phone,
        country_code: parseInt(country_code ?? "91"), //make 1 for us,
      });
      if (res.status === 200) {
        toast.success("Resent the OTP successfully");
        setDisableButton(false);
      }
    } catch (e) {
      toast.error("Error sending OTP");
      setDisableButton(false);
    }
  };

  return (
    <OtpPage
      title={"Enter code"}
      phone={phone ?? ""}
      country_code={country_code ?? ""}
      otp={otp}
      setOtp={setOtp}
      error={otpError}
      verifyOtp={verifyOtp}
      disableButton={disableButton}
      resendOtp={resendOtp}
    />
  );
};

export default function Page() {
  return (
    <Suspense>
      <VerifyOtpPage />
    </Suspense>
  );
}
