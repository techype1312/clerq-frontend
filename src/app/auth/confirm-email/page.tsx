"use client";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthApis from "@/actions/apis/AuthApis";
import { toast } from "react-toastify";

const ConfirmEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const hash = searchParams.get("hash");
  const error_description = searchParams.get("error_description");
  const hasRunRef = useRef(false);
  useEffect(() => {
    if (hasRunRef.current) return;
    if (error) {
      router.push(
        "/auth/failed-link?error=" +
          error +
          "&error_description=" +
          error_description
      );
    }
    if (hash) {
      hasRunRef.current = true;
      const confirmEmail = async () => {
        const res = await AuthApis.confirmEmail(hash);
        if (res?.status === 204) {
          toast.success("Email confirmed successfully, please login");
          router.push("/auth/signin");
        }
      };
      confirmEmail();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, hash, error, error_description]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" size={"48px"} />
      <div className="flex flex-col gap-2">
        <h2 className="text-center text-xl font-medium">
          Confirming Email <br />
        </h2>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense>
      <ConfirmEmailPage />
    </Suspense>
  );
}
