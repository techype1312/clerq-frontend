"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { toast } from "react-toastify";
import { NextResponse } from "next/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: process.env.NEXT_BASE_URL + "/auth/confirm-email",
    },
  });

  if (error) {
    redirect("/auth/signin?error="+error.message);
  }

  revalidatePath("/", "layout");
  redirect(`/auth/link-sent?email=${data.email}`);
}

export async function resendLogin(prevState: any, formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: process.env.NEXT_BASE_URL + "/auth/confirm-email",
    },
  });

  if (error) {
    return {
      message: "Error sending email",
    };
    // redirect("/error");
  } else {
    return {
      message: "Email sent",
    };
  }
}
