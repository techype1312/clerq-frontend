"use client";
import AuthApis from "@/actions/apis/AuthApis";
import OtpPage from "@/components/generalComponents/OTP";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState("");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const countryCode = searchParams.get("country_code");
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
        country_code: parseInt(countryCode ?? "91"), //make 1 for us,
      });
      if (res.status === 200) {
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
        country_code: parseInt(countryCode ?? "91"), //make 1 for us,
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
      countryCode={countryCode ?? ""}
      otp={otp}
      setOtp={setOtp}
      error={otpError}
      verifyOtp={verifyOtp}
      disableButton={disableButton}
      resendOtp={resendOtp}
    />
  );
};

export default Page;
