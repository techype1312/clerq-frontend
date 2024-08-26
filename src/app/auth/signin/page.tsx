"use client";
import Link from "next/link";
import React, { Suspense, useEffect, useRef, useState } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { signInSchema, signInWithPhoneSchema } from "@/types/schema-embedded";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DependencyType } from "@/components/ui/auto-form/types";
import Image from "next/image";
import { ErrorProps } from "@/types/general";
import { isObject } from "lodash";
import AuthApis from "@/actions/data/auth.data";

const SigninPage = () => {
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchError = searchParams.get("error");
  const hasShownError = useRef(false);
  const router = useRouter();

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const handleEmailLoginRequestSuccess = ({ email }: { email: string }) => {
    router.push(`/auth/link-sent?email=${email}`);
  };

  const handleEmailLoginRequest = (e: { email: string }) => {
    const email = e.email.trim().toLowerCase();
    setServerError("");
    setLoading(true);
    return AuthApis.loginUserWithEmail("magic_link=true", { email }).then(
      handleEmailLoginRequestSuccess,
      onError
    );
  };

  const handlePhoneLoginRequestSuccess = (data: {
    phone: string;
    country_code: number;
  }) => {
    router.push(
      `/auth/verify-otp?phone=${data.phone}&country_code=${data.country_code}`
    );
  };

  const handlePhoneLoginRequest = (data: {
    phone: string;
    country_code: number;
  }) => {
    setServerError("");
    setLoading(true);
    return AuthApis.loginUserWithOtp(data).then(
      handlePhoneLoginRequestSuccess,
      onError
    );
  };

  useEffect(() => {
    if (searchError && !hasShownError.current) {
      if (searchError === "Signups not allowed for otp")
        toast.error("User not found. Please sign up first.");
      hasShownError.current = true;
      router.push("/auth/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchError]);

  return (
    <div className="flex h-screen w-full items-center justify-center md:items-stretch md:justify-normal gap-12">
      <div className="hidden md:block background-placeholder w-1/2"></div>
      <div className="flex flex-col justify-center items-center gap-6">
        <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
        <div className="flex flex-col gap-4 w-full items-start">
          <h1 className="text-2xl md:text-4xl font-normal text-primary">
            Log In
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Log in with email or phone no
          </p>

          <AutoForm
            formSchema={signInSchema}
            onSubmit={handleEmailLoginRequest}
            fieldConfig={{
              email: {
                inputProps: {
                  placeholder: "your@email.com",
                },
              },
            }}
            className="flex flex-col gap-4 max-w-sm md:max-w-lg mr-2"
            withSubmitButton={false}
            labelClass="text-label"
          >
            <AutoFormSubmit className="mx-auto md:m-0 border py-3 rounded-full background-text-primary text-white box-border w-48 px-12">
              Send magic link
            </AutoFormSubmit>
          </AutoForm>

          <div className="flex items-center gap-1 mr-2">
            <span className="border-b w-36 md:w-56 border-input"></span>
            <span className="text-muted">OR</span>
            <span className="border-b w-36 md:w-56 border-input"></span>
          </div>

          <AutoForm
            formSchema={signInWithPhoneSchema}
            onSubmit={handlePhoneLoginRequest}
            fieldConfig={{
              phone: {
                fieldType: "phone",
              },
            }}
            dependencies={[
              {
                sourceField: "country_code",
                type: DependencyType.HIDES,
                targetField: "country_code",
                when: () => {
                  return true;
                },
              },
            ]}
            className="flex flex-col gap-4 max-w-sm md:max-w-lg mr-2"
            withSubmitButton={false}
            labelClass="text-label"
          >
            <AutoFormSubmit className="mx-auto md:m-0 border py-3 rounded-full background-text-primary text-white box-border px-12 w-48">
              Send code
            </AutoFormSubmit>
          </AutoForm>
          <h5 className="text-sm md:text-base text-label flex gap-1 mt-4">
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
