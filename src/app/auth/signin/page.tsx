"use client";
import Link from "next/link";
import React, { Suspense, useEffect, useRef } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { signInSchema, signInWithPhoneSchema } from "@/types/schema-embedded";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthApis from "@/actions/apis/AuthApis";
import { DependencyType } from "@/components/ui/auto-form/types";
import Image from "next/image";

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
    <div className="flex h-screen w-full items-center justify-center md:items-stretch md:justify-normal gap-12">
      <div className="hidden md:block background-placeholder w-1/2"></div>
      <div className="flex flex-col justify-center items-center gap-24">
        <Image className="md:hidden" src={"/clerq_logo.png"} alt="Clerq" width={75} height={30} />
        <div className="flex flex-col gap-4 w-full items-center md:items-start">
          <h1 className="text-2xl md:text-4xl font-normal text-primary">
            Log In
          </h1>
          <p className="text-sm md:text-base text-secondary">
            Log in with email or phone no
          </p>

          <AutoForm
            formSchema={signInSchema}
            onSubmit={async (e) => {
              const searchParams = "magic_link=true";
              const res = await AuthApis.login(searchParams, e);
              if (res.status === 200) {
                router.push(`/auth/link-sent?email=${e.email}`);
              }
            }}
            fieldConfig={{
              email: {
                inputProps:{
                  placeholder: "your@email.com",
                }
              }
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
            onSubmit={async (e) => {
              console.log(e);
              const data = {
                phone: e.phone,
                country_code: e.country_code, //country_code,
              };
              const res = await AuthApis.loginWithOtp(data);
              if (res.status === 200) {
                router.push(
                  `/auth/verify-otp?phone=${e.phone}&country_code=${e.country_code}`
                );
              }
            }}
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
