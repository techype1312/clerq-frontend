"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import AutoForm from "@/components/ui/auto-form";
import { signInSchema } from "@/types/schema-embedded";
import { login } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const hasShownError = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (error && !hasShownError.current) {
      if(error === "Signups not allowed for otp")
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
          <h1 className="text-5xl font-normal text-primary">Log In</h1>
          <p className="text-secondary">Log in with phone no. or email.</p>
          <div className="flex items-center gap-1">
            <span className="border-b border-solid w-56 border-input"></span>
            <span className="text-muted">OR</span>
            <span className="border-b w-56 border-input"></span>
          </div>
          <AutoForm
            formSchema={signInSchema}
            formAction={login}
            submitButtonText="Send magic link"
            className="flex flex-col gap-4 max-w-lg"
            withSubmitButton={false}
            labelClass="text-label"
          ></AutoForm>
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

export default Page;