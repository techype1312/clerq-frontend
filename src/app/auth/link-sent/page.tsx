"use client";
import { login } from "@/app/signin/actions";
import { MainContext } from "@/context/Main";
import { supabase } from "@/utils/supabase/client";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = React.useState(false);
  const { refreshUser } = useContext(MainContext);
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
    <div className="text-center flex gap-6 h-screen max-h-screen flex-col items-center justify-center">
      <div>
        <h1>Check your inbox to confirm your email address</h1>
        <p>We’ve sent a confirmation email to {email}</p>
      </div>
      <div className="flex flex-col gap-4 max-w-sm">
        <h4>Didn’t receive the email?</h4>
        <p>
          If it&apos;s not in your inbox or spam folder, click the button below
          and we&apos;ll send you another one.
        </p>
        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOtp({
              email: email as string,
              options: {
                shouldCreateUser: false,
                emailRedirectTo: "http://localhost:3000/dashboard",
              },
            });
            if (error) {
              setLoading(false);
              toast.error("An error occurred");
            } else {
              setLoading(false);
              toast.success("Check your inbox email sent successfully");
            }
          }}
          className="text-blue-500"
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Resend email"}
        </button>
      </div>
    </div>
  );
};

export default Page;
