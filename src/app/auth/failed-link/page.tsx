"use client";
import { login } from "@/app/auth/signin/actions";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { MainContext } from "@/context/Main";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const [loading, setLoading] = useState(false);
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
  const hasShownError = useRef(false);

  useEffect(() => {
    if (error && !hasShownError.current) {
      toast.error(error_description);
      hasShownError.current = true;
    }
  }, [error, error_description]);
  return (
    <div className="text-center flex gap-20 h-screen max-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-4 items-center">
        <SymbolIcon icon="error" color="#900B09" size={48} />
        <h1 className="text-primary text-3xl w-2/3">Link is invalid</h1>
        <p className="text-base text-label">
          The link you clicked is invalid or expired
        </p>
      </div>
      <div className="flex flex-col gap-4 max-w-xs items-center justify-center">
        <h3 className="text-primary text-xl">Login again to proceed!</h3>
        <button
          disabled={loading}
          onClick={async () => {
            router.push("/auth/signin");
          }}
          className="text-white bg-primary py-2 px-8 rounded-full w-fit focus:outline-none"
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Go to login"}
        </button>
      </div>
    </div>
  );
};

export default Page;
