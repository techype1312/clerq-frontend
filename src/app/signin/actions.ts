"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: "http://localhost:3000/dashboard",
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(`/auth/link-sent?email=${data.email}`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  console.log("signup");
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    firstName: formData.get("name.firstName") as string,
    lastName: formData.get("name.lastName") as string,
    phone: formData.get("phone") as string,
  };

  const { data: data1, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        is_user_verified: false,
      },
      emailRedirectTo: `http://localhost:3000/dashboard/verify-user`,
    },
  });
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect(`/auth/link-sent?email=${data.email}`);
}
