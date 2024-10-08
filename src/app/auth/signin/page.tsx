"use client";
import Link from "next/link";
import React, { Suspense, useEffect, useRef } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { signInSchema, signInWithPhoneSchema } from "@/types/schema-embedded";
import { login } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthApis from "@/actions/apis/AuthApis";
import { formatPhone } from "@/utils/utils";

const SigninPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const hasShownError = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (error && !hasShownError.current) {
      if (error === "Signups not allowed for otp")
        toast.error("User not found. Please sign up first.");
      hasShownError.current = true;
      router.push("/auth/signin");
    }
  }, [error]);

  return (
    <div className="flex h-screen w-full gap-12">
      <div className="background-placeholder w-1/2"></div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-normal text-primary">Log In</h1>
          <p className="text-secondary">Log in with email or phone no</p>

          <AutoForm
            formSchema={signInSchema}
            //  formAction={login}
            onSubmit={async (e) => {
              const searchParams = "magic_link=true";
              const res = await AuthApis.login(searchParams, e);
              if (res.status === 200) {
                router.push(`/auth/link-sent?email=${e.email}`);
              }
            }}
            className="flex flex-col gap-4 max-w-lg"
            withSubmitButton={false}
            labelClass="text-label"
          >
            <AutoFormSubmit className="border py-3 rounded-full background-text-primary text-white w-fit px-12">
              Send magic link
            </AutoFormSubmit>
          </AutoForm>

          <div className="flex items-center gap-1">
            <span className="border-b border-solid w-56 border-input"></span>
            <span className="text-muted">OR</span>
            <span className="border-b w-56 border-input"></span>
          </div>

          <AutoForm
            formSchema={signInWithPhoneSchema}
            // formAction={login}
            onSubmit={async (e) => {
              const { localNumber, countryCode } = formatPhone(e.phone);
              const data = {
                phone: localNumber,
                country_code: 91, //countryCode,
              };
              const res = await AuthApis.loginWithOtp(data);
              if (res.status === 200) {
                router.push(
                  `/auth/verify-otp?phone=${localNumber}&country_code=${countryCode}`
                );
              }
            }}
            fieldConfig={{
              phone: {
                fieldType: "phone",
              },
            }}
            className="flex flex-col gap-4 max-w-lg"
            withSubmitButton={false}
            labelClass="text-label"
          >
            <AutoFormSubmit className="border py-3 rounded-full background-text-primary text-white w-fit px-12">
              Send code
            </AutoFormSubmit>
          </AutoForm>
          <h5 className="text-label flex gap-1 mt-4">
            Don&apos;t have an account?
            <Link href={"/auth/signup"}>
              <b className="text-black">Sign up</b> here.
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <SigninPage />
    </Suspense>
  );
}
