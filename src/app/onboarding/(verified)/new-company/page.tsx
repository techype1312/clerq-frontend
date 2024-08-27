"use client";

import React from "react";
import { useUserContext } from "@/context/User";
import ProfileSkeleton from "@/components/skeletons/dashboard/ProfileSkeleton";
import NewCompany from "@/components/onboarding/NewCompany";

const Page = () => {
  const {
    loading: userDataLoading,
    userData,
  } = useUserContext();

  if (!userDataLoading && !userData) {
    return null;
  }

  return (
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full max-w-[550px]">
        <div className="flex flex-col gap-4">
          <h1 className="text-primary text-2xl font-medium">
            New Company info
          </h1>
          <NewCompany />
        </div>
      </div>
    </div>
  );
};

export default Page;
