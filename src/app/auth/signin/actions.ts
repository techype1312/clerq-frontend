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

export async function signup(formData: FormData) {
  const supabase = createClient();
  console.log("signup");
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    first_name: formData.get("name.first_name") as string,
    last_name: formData.get("name.last_name") as string,
    phone: formData.get("phone") as string,
  };

  const { data: data1, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        is_user_verified: false,
      },
      emailRedirectTo: process.env.NEXT_BASE_URL + `/auth/confirm-email`,
    },
  });
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect(`/auth/link-sent?email=${data.email}&newUser=true`);
}
