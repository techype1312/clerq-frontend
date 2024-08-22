"use client";
import AuthApis from "@/actions/apis/AuthApis";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { DependencyType } from "@/components/ui/auto-form/types";
import { useUserContext } from "@/context/User";
import { signUpSchema } from "@/types/schema-embedded";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Loader2Icon } from "lucide-react";
import { ErrorProps } from "@/types/general";
import { isObject } from "lodash";
import InviteTeamApis from "@/actions/apis/InviteApi";

const AcceptInvitationPage = () => {
  const router = useRouter();
  const { updateUserLocalData } = useUserContext();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get("error"));
  const hash = searchParams.get("hash");
  const userEmail = searchParams.get("email") || "";
  const userFirstName = searchParams.get("firstName") || "";
  const userLasName = searchParams.get("lastName") || "";
  const error_description = searchParams.get("error_description");
  const hasRunRef = useRef(false);

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchCompanyDetailsSuccess = (res: any) => {
    if (res.data && res.data.token && res.data.refreshToken) {
      toast.success("Invitation accepted successfully!");
      Cookies.set("refreshToken", res.data.refreshToken, {
        expires: res.data.tokenExpiry,
      });
      Cookies.set("token", res.data.token);
      Cookies.set(
        "onboarding_completed",
        res?.data?.user?.onboarding_completed ? "true" : "false"
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      updateUserLocalData(res.data.user);
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleAcceptInvitation = (values: any) => {
    if (loading || !hash) return false;
    setLoading(true);
    const data = {
      hash: hash as string,
      email: values.email,
      password: values.password,
      firstName: values.name.firstName,
      lastName: values.name.lastName,
      phone: values.phone,
      country_code: 91,
    };
    return InviteTeamApis.acceptInvite(data).then(
      onFetchCompanyDetailsSuccess,
      onError
    );
  };

  useEffect(() => {
    if (hasRunRef.current) return;
    if (error) {
      router.push(
        "/auth/failed-link?error=" +
          error +
          "&error_description=" +
          error_description
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, error_description]);

  return (
    <div className="flex flex-col gap-12 items-center justify-center mt-12 md:my-auto">
      <Image
        className="md:hidden"
        src={"/clerq_logo.png"}
        alt="Clerq"
        width={75}
        height={30}
      />
      <div className="max-w-md md:max-w-2xl flex flex-col gap-8 lg:mt-8">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-2xl md:text-4xl w-2/3 mx-auto md:w-full">
            Simplified finances with Clerq
          </h1>
          <p className="text-sm md:text-base text-secondary mx-4">
            Apply in 10 minutes for Simple finances that transforms how you
            operate.
          </p>
        </div>
        <AutoForm
          formSchema={signUpSchema}
          // formAction={signup}
          onSubmit={handleAcceptInvitation}
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
            email: {
              inputProps: {
                disabled: true,
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
          defaultValues={{
            email: userEmail,
            name: { firstName: userFirstName, lastName: userLasName },
          }}
          className="flex flex-col gap-4 max-w-lg items-center mx-8 md:mx-auto"
          zodItemClass="flex flex-col md:flex-row grow gap-4 space-y-0 w-full"
          withSubmitButton={false}
          submitButtonText="Accept Invitation"
          submitButtonClass="background-primary"
          labelClass="text-primary"
        >
          <AutoFormSubmit className="border py-3 rounded-full background-primary text-white w-fit px-12 gap-2">
            {loading && <Loader2Icon className="animate-spin" size={"48px"} />}
            Accept Invitation
          </AutoFormSubmit>
        </AutoForm>
        <p className="mx-auto text-center text-muted text-[11px] md:text-sm w-4/5 md:w-3/4">
          By clicking “Accept Invitation“, I agree to Clerq’s{" "}
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
      <AcceptInvitationPage />
    </Suspense>
  );
}
