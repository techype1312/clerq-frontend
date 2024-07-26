'use client'
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  useEffect(() => {
    if (error) {
      router.push(
        "/auth/failed-link?error=" +
          error +
          "&error_description=" +
          error_description
      );
    }
  }, [searchParams]);
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" size={"48px"} />
      <p>Logging in with magic link</p>
    </div>
  );
};

export default Page;
