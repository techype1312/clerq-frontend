"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import SymbolIcon from "./MaterialSymbol/SymbolIcon";

const OtpPageProps = z.object({
  title: z.string(),
  phone: z.string(),
  otp: z.string(),
  setOtp: z.function().args(z.string()).returns(z.void()),
  error: z.string().nullable(),
  countryCode: z.string(),
  verifyOtp: z.function().args(z.void()).returns(z.void()),
  resendOtp: z.function().args(z.void()).returns(z.void()),
  disableButton: z.boolean(),
});

const OtpPage = ({
  title,
  phone,
  otp,
  setOtp,
  error,
  countryCode,
  verifyOtp,
  disableButton,
  resendOtp,
}: z.infer<typeof OtpPageProps>) => {
  //   const resendOtp = async () => {
  //     try {
  //       const deviceId = localStorage.getItem("deviceId");
  //       const preAuthSessionId = localStorage.getItem("preAuthSessionId");
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_DOMAIN}/baseauth/signinup/code/resend`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             deviceId: deviceId,
  //             preAuthSessionId: preAuthSessionId,
  //           }),
  //         }
  //       );
  //       const data = await res.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  return (
    <div className="flex flex-col gap-40 items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <SymbolIcon icon="key" color="#5266EB" size={40} />
        <h1 className="text-3xl text-primary">{title}</h1>
        <p className="text-label text-xl">
          We&apos;ve sent a code to +{countryCode + " " + phone}{" "}
        </p>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props, index) => {
            return (
              <input
                {...props}
                style={{
                  border: props.value
                    ? "1px solid #5266EB"
                    : "1px solid #DCDCE4",
                  borderRadius: "0.375rem",
                  background: "white",
                  color: "#535460",
                  width: "2.625rem",
                  height: "2.5rem",
                  textAlign: "center",
                }}
              />
            );
          }}
          containerStyle={{
            padding: "1.25rem",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.625rem",
            margin: "0 auto 0.75rem auto",
          }}
          inputStyle={{
            border: error ? "1px solid #900B09" : "1px solid #DCDCE4",
          }}
          shouldAutoFocus
          inputType="tel"
        />
        <Button
          onClick={() => verifyOtp()}
          className="border py-3 rounded-full background-primary text-white w-fit px-12"
          disabled={disableButton}
        >
          Verify otp
        </Button>
        {/* {error && <InputError error={error} />} */}
      </div>
      <div className="flex flex-col gap-6 items-center justify-center">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl text-primary">Didn&apos;t get the code?</h2>
          <p className="text-sm text-label">
            it&apos;s been longer than 30 seconds? tap on {`"Resend"`}
          </p>
        </div>
        <Button
          onClick={() => resendOtp()}
          disabled={disableButton}
          className="border py-3 rounded-full background-primary text-white w-fit px-12"
        >
          Resent
        </Button>
      </div>
    </div>
  );
};

export default OtpPage;
