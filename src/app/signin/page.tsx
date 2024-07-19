"use client";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import AutoForm from "@/components/ui/auto-form";
import { signInSchema } from "@/types/schema-embedded";
import { login } from "./actions";
import { MainContext } from "@/context/Main";

const Page = () => {
  const { refreshUser } = useContext(MainContext);
  useEffect(() => {
    refreshUser();
  }, [window.onfocus]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 max-w-lg">
        <h1 className="text-4xl font-bold">Sign In</h1>
        <AutoForm
          formSchema={signInSchema}
          formAction={login}
          submitButtonText="Sign In"
          className="flex flex-col gap-4 mt-2 max-w-72"
          withSubmitButton={false}
        ></AutoForm>
        <div className="flex gap-2">
          Not signed up yet?
          <Link className="text-orange-500" href="/auth/signup">
            Sign-up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
