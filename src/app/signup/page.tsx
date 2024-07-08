"use client";
import AuthApis from "@/actions/apis/AuthApis";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2Icon } from "lucide-react";
import { Form } from "@/components/ui/form";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { signUpSchema } from "@/types/schema-embedded";
import { userType } from "@/types/user";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: userType) => {
    try {
      setLoading(true);
      const requestBody = {
        username: e.email.split("@")[0],
        email: e.email,
        password: e.password,
        first_name: e.firstName,
        last_name: e.lastName,
      };
      const res = await AuthApis.signUp(requestBody);
      if (res.status === 200) {
        if (res.data.jwt) {
          localStorage.setItem("userdata", JSON.stringify(res.data.user));
          Cookies.set("jwtToken", res.data.jwt);
          toast.success("Sign Up Success");
          router.push("/dashboard");
        }
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <AutoForm
          formSchema={signUpSchema}
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4"
        >
          <AutoFormSubmit className="w-full bg-primary-button hover:bg-white text-black border border-black rounded-md">
            {loading ? <Loader2Icon className="animate-spin" /> : "Sign Up"}
          </AutoFormSubmit>
        </AutoForm>
        <div className="flex gap-2">
          Already have an account?
          <Link className="text-orange-500" href="/signin">
            Go to Sign-in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
