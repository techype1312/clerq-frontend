"use client";

import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/User";
import AuthApis from "@/actions/data/auth.data";
import { ErrorProps } from "@/types/general";
import isObject from "lodash/isObject";

const LinkSentPage = () => {
  const router = useRouter()
  const { refreshUser } = useUserContext();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const newUser = searchParams.get("newUser") === "true" ? true : false;
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const handleEmailLoginRequestSuccess = (data: { email: string }) => {
    toast.success("Check your inbox email sent successfully");
  };

  const handleEmailLoginRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      setLoading(false);
      return router.push("/auth/signin");
    } else {
      const formattedEmail = email.trim().toLowerCase();
      setServerError("");
      setLoading(true);
      return AuthApis.loginUserWithEmail("magic_link=true", { email: formattedEmail }).then(
        handleEmailLoginRequestSuccess,
        onError
      );
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      refreshUser();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshUser]);

  return (
    <div className="text-center flex gap-20 h-screen max-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <SymbolIcon icon="mark_email_unread" color="#5266EB" size={48} />
        <h1 className="text-primary text-2xl md:text-3xl w-2/3">
          Check your inbox to{" "}
          {newUser ? "confirm your email address" : "log in"}
        </h1>
        <p className="text-sm md:text-base text-label">
          We&apos;ve sent a {newUser ? "confirmation email" : "magic link"} to{" "}
          {email}
        </p>
      </div>
      <div className="flex flex-col gap-4 max-w-xs items-center justify-center">
        <h3 className="text-primary text-xl">Didn&apos;t receive the email?</h3>
        <p className="text-sm text-label">
          If it&apos;s not in your inbox or spam folder, click the button below
          and we&apos;ll send you another one.
        </p>
        <form onSubmit={handleEmailLoginRequest}>
          <input
            id="email"
            name="email"
            type="hidden"
            defaultValue={email ?? ""}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-primary py-2 px-24 md:px-8 rounded-full md:w-fit focus:outline-none"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Resend"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <LinkSentPage />
    </Suspense>
  );
}
