"use client";
import React from "react";
import Link from "next/link";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { signInSchema } from "@/types/schema-embedded";
import { signup } from "../../signin/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const redirectToSignUp = async (e: { email: string }) => {
    try {
      setLoading(true);
      if (!e.email) {
        toast.error("Please enter a valid email");
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push(`/auth/fill-details?email=${encodeURIComponent(e.email)}`);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error("An error occurred");
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 max-w-lg">
        <h1 className="text-4xl font-bold w-2/3">
          Simplified finances with Clerq
        </h1>
        <p className="w-2/3">
          Apply in 10 minutes for Simple finances that transforms how you
          operate.
        </p>
        <AutoForm
          formSchema={signInSchema}
          onSubmit={(e) => redirectToSignUp(e)}
          className="flex flex-col gap-4 w-2/3"
        >
          <AutoFormSubmit
            disabled={loading}
            className="bg-[#2C2C2C] px-4 w-fit"
          >
            Get Started
          </AutoFormSubmit>
        </AutoForm>
        <div className="flex gap-2">
          Already have an account?
          <Link className="font-bold" href="/signin">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
