"use client";
import { login, resendLogin } from "@/app/auth/signin/actions";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { toast } from "react-toastify";
import { useFormStatus } from "react-dom";
import { useUserContext } from "@/context/User";
import AuthApis from "@/actions/apis/AuthApis";

const initialState = {
  message: "",
};

const LinkSentPage = () => {
  const { pending } = useFormStatus();
  // const [state, formAction] = useFormState(resendLogin, initialState);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const newUser = searchParams.get("newUser") === "true" ? true : false;
  const [loading, setLoading] = React.useState(false);
  const { refreshUser } = useUserContext();
  useEffect(() => {
    const handleFocus = () => {
      refreshUser();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshUser]);
  // useEffect(() => {
  //   if (state.message === "Email sent") {
  //     toast.success("Check your inbox email sent successfully");
  //   } else if (state.message === "Error sending email") {
  //     toast.error("An error occurred");
  //   }
  // }, [state]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const searchParams = "magic_link=true";
    const res = await AuthApis.login(searchParams, e);
    if (res && res.status === 200) {
      toast.success("Check your inbox email sent successfully");
    } else {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="text-center flex gap-20 h-screen max-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <SymbolIcon icon="mark_email_unread" color="#5266EB" size={48} />
        <h1 className="text-primary text-3xl w-2/3">
          Check your inbox to{" "}
          {newUser ? "confirm your email address" : "log in"}
        </h1>
        <p className="text-base text-label">
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
        <form
          onSubmit={handleSubmit}
          // action={formAction}
        >
          <input name="email" type="hidden" defaultValue={email ?? ""} />
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-primary py-2 px-8 rounded-full w-fit focus:outline-none"
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
