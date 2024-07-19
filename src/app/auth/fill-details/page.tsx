"use client";
import { signup } from "@/app/signin/actions";
import AutoForm from "@/components/ui/auto-form";
import { signUpSchema } from "@/types/schema-embedded";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState(searchParams.get("email") || "");
  React.useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="max-w-2xl text-center">
        <h1 className="font-bold text-2xl">Get Started</h1>
        <p>
          Apply in 10 minutes for Simple finances that transforms how you
          operate.
        </p>
        <AutoForm
          formSchema={signUpSchema}
          formAction={signup}
          defaultValues={{ email }}
          className="flex flex-col gap-4 max-w-2xl items-center"
          innerClassName="w-full"
          withSubmitButton={false}
        ></AutoForm>
        <p>
          By clicking “Get started“, I agree to Clerq’s Terms of Use, Privacy
          Policy and to receive electronic communication about my accounts and
          services per Clerq’s Electronic Communications Agreement, and
          acknowledge receipt of Clerq’s USA PATRIOT Act disclosure.
        </p>
      </div>
    </div>
  );
};

export default Page;
