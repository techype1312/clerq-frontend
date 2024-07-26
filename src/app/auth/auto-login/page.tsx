import { supabase } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const autoLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email: searchParams.get("email") as string,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: process.env.NEXT_BASE_URL + "/dashboard",
      },
    });
  };
  useEffect(() => {
    autoLogin();
  }, []);
  return (
    <div>
      Thanks for confirming your email A login link has been sent to your email.
      Please check your email and click on the link to login.
    </div>
  );
};

export default Page;
