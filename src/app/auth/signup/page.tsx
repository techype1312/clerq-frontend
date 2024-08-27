"use client";

import AuthApis from "@/actions/data/auth.data";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
import { ErrorProps } from "@/types/general";
import { signUpSchema } from "@/types/schema-embedded";
import isObject from "lodash/isObject";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useState } from "react";

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const handleSignupSuccess = (res: any) => {
    router.push(`/auth/link-sent?email=${res.email}&newUser=true`);
  };

  const handleSignup = (values: Record<string, any>) => {
    setServerError("");
    setLoading(true);
    const data = {
      email: values.email,
      password: values.password,
      firstName: values.name.firstName,
      lastName: values.name.lastName,
      phone: values.phone,
      country_code: Number(values.country_code),
    };
    return AuthApis.signUpUser(data).then(handleSignupSuccess, onError);
  };

  React.useEffect(() => {
    setEmail(searchParams.get("email") || "");
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen mt-12 md:my-auto">
      <Image src={"/otto_logo_large.png"} alt="Otto" width={77} height={30} />
      <div className="max-w-md md:max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl md:text-4xl w-2/3 mx-auto md:w-full">
            Simplified finances with Otto
          </h1>
          <p className="text-sm md:text-base text-secondary mx-4">
            Apply in 10 minutes for Simple finances that transforms how you
            operate.
          </p>
        </div>
        <AutoForm
          formSchema={signUpSchema}
          // formAction={signup}
          onSubmit={handleSignup}
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
            phone: {
              fieldType: "phone",
              label: "Phone number",
              inputProps: {
                placeholder: "(123)-456-7890",
              },
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
          defaultValues={{ email }}
          className="flex flex-col gap-4 max-w-lg items-center mx-8 md:mx-auto"
          zodItemClass="flex flex-col md:flex-row grow gap-4 space-y-0 w-full"
          withSubmitButton={false}
          submitButtonText="Get started"
          submitButtonClass="background-primary"
          labelClass="text-primary"
        >
          <AutoFormSubmit className="border py-3 rounded-full background-primary text-white w-fit px-12">
            Get Started
          </AutoFormSubmit>
        </AutoForm>
        <h5 className="text-sm md:text-base text-label flex gap-1 justify-center">
          Already have an account?
          <Link href={"/auth/signin"}>
            <b className="text-black">Log in</b> here.
          </Link>
        </h5>
        <p className="mx-auto text-center text-muted text-[11px] md:text-sm w-4/5 md:w-3/4">
          By clicking “Get started“, I agree to Otto’s{" "}
          <span className="border-b border-muted-text">Terms of Use</span>,{" "}
          <span className="border-b border-muted-text">Privacy Policy</span> and
          to receive electronic communication about my accounts and services per{" "}
          <span className="border-b border-muted-text">
            Otto’s Electronic Communications Agreement
          </span>
          , and acknowledge receipt of{" "}
          <span className="border-b border-muted-text">
            Otto’s USA PATRIOT Act disclosure.
          </span>
        </p>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <SignupPage />
    </Suspense>
  );
}
