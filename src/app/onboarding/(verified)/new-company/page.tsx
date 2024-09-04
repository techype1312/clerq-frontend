"use client";

import React, { useLayoutEffect } from "react";
import { useUserContext } from "@/context/User";
// import ProfileSkeleton from "@/components/skeletons/dashboard/ProfileSkeleton";
import NewCompany from "@/components/onboarding/NewCompany";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CompanyApis from "@/actions/data/company.data";

const Page = () => {
  const { loading: userDataLoading, userData } = useUserContext();
  const pathname = usePathname();
  const router = useRouter();
  useLayoutEffect(() => {
    const fetchPermissions = async () => {
      const ucrmId = Cookies.get("otto-auth-ucrm");
      const data: any = await CompanyApis.getUCRM(ucrmId ?? "");
      if (
        !data.permissions?.routes?.newCompany &&
        pathname === "/onboarding/new-company"
      ) {
        router.push("/dashboard/my-profile");
      }
    };
    fetchPermissions();
  }, [pathname]);

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
