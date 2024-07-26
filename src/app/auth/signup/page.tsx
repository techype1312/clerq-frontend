"use client";
import { signup } from "@/app/auth/signin/actions";
import AutoForm from "@/components/ui/auto-form";
import { signUpSchema } from "@/types/schema-embedded";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState(searchParams.get("email") || "");
  React.useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-w-2xl flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-5xl">Simplified finances with Clerq</h1>
          <p className="text-secondary">
            Apply in 10 minutes for Simple finances that transforms how you
            operate.
          </p>
        </div>
        <AutoForm
          formSchema={signUpSchema}
          formAction={signup}
          fieldConfig={{
            password: {
              inputProps: {
                type: "password",
              },
            },
            confirmPassword: {
              inputProps: {
                type: "password",
              },
            },
          }}
          defaultValues={{ email }}
          className="flex flex-col gap-4 max-w-lg items-center mx-auto"
          zodItemClass="flex flex-row grow gap-4 space-y-0 w-full"
          withSubmitButton={false}
          submitButtonText="Get started"
          submitButtonClass="background-primary"
          labelClass="text-primary"
        ></AutoForm>
        <h5 className="text-label flex gap-1 justify-center">
          Already have an account?
          <Link href={"/auth/signin"}>
            <b className="text-black">Log in</b> here.
          </Link>
        </h5>
        <p className="mx-auto text-center text-muted text-sm w-3/4">
          By clicking “Get started“, I agree to Clerq’s{" "}
          <span className="border-b border-muted-text">Terms of Use</span>,{" "}
          <span className="border-b border-muted-text">Privacy Policy</span> and
          to receive electronic communication about my accounts and services per{" "}
          <span className="border-b border-muted-text">
            Clerq’s Electronic Communications Agreement
          </span>
          , and acknowledge receipt of{" "}
          <span className="border-b border-muted-text">
            Clerq’s USA PATRIOT Act disclosure.
          </span>
        </p>
      </div>
    </div>
  );
};

export default Page;
