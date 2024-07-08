"use client";
import AuthApis from "@/actions/apis/AuthApis";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Loader2Icon } from "lucide-react";
import { signInSchema, signUpSchema } from "@/types/schema-embedded";
import { signInSchemaType, userType } from "@/types/user";
import { MainContext } from "@/context/Main";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {setuserdata} = useContext(MainContext);
  const handleSubmit = async (e: signInSchemaType) => {
    try {
      setLoading(true);
      const requestBody = {
        identifier: e.usernameOrEmail,
        password: e.password,
      }
      const res = await AuthApis.signIn(requestBody);
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("userdata", JSON.stringify(res.data.user));
        setuserdata(res.data.user);
        Cookies.set("jwtToken", res.data.jwt);
        router.push("/dashboard");
        toast.success("Sign In Success");
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Sign In</h1>
        <AutoForm
          formSchema={signInSchema.pick({ usernameOrEmail: true, password: true })}
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4 mt-2 max-w-72"
        >
          <AutoFormSubmit
            disabled={loading}
            className="w-full bg-primary-button hover:bg-white text-black border border-black rounded-md"
          >
            {loading ? <Loader2Icon className="animate-spin" /> : "Sign In"}
          </AutoFormSubmit>
        </AutoForm>
        <div className="flex gap-2">
          Not signed up yet?
          <Link className="text-orange-500" href="/signup">
            Sign-up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
