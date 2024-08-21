"use client";
import AuthApis from "@/actions/apis/AuthApis";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
import { signUpSchema } from "@/types/schema-embedded";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState(searchParams.get("email") || "");

  React.useEffect(() => {
    setEmail(searchParams.get("email") || "");
    // const res = async () => {
    //   const res1 = await AuthApis.healthCheck();
    //   return res1;
    // };
    // res();
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-12 items-center justify-center mt-12 md:my-auto">
      <Image
        className="md:hidden"
        src={"/clerq_logo.png"}
        alt="Clerq"
        width={75}
        height={30}
      />
      <div className="max-w-md md:max-w-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl md:text-4xl w-2/3 mx-auto md:w-full">Simplified finances with Clerq</h1>
          <p className="text-sm md:text-base text-secondary mx-4">
            Apply in 10 minutes for Simple finances that transforms how you
            operate.
          </p>
        </div>
        <AutoForm
          formSchema={signUpSchema}
          // formAction={signup}
          onSubmit={async (e) => {
            const data = {
              email: e.email,
              password: e.password,
              firstName: e.name.firstName,
              lastName: e.name.lastName,
              phone: e.phone,
              country_code: 91,
            };
            const res = await AuthApis.signUp(data);
            if (res.status === 204) {
              router.push(`/auth/link-sent?email=${e.email}&newUser=true`);
            }
          }}
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

export default function Page() {
  return (
    <Suspense>
      <SignupPage />
    </Suspense>
  );
}
