"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTop from "./DashboardTop";
import Image from "next/image";
import SymbolIcon from "../common/MaterialSymbol/SymbolIcon";
import { isDemoEnv } from "../../../config";
import CompanyApis from "@/actions/data/company.data";
import Cookies from "js-cookie";
// import { PermissionType } from "@/types/permissions";
import { usePathname, useRouter } from "next/navigation";

const DemoBanner = () => {
  if (!isDemoEnv()) return null;
  return (
    <div className="min-h-14 w-full bg-gray-300 py-3 flex items-center pl-4 md:pl-8 pr-2 md:pr-8 justify-between gap-2">
      <div className="flex flex-row gap-5 items-center">
        <Image src={"/otto_logo_large.png"} alt="Otto" width={60} height={23} />
        <a
          href="https://joinotto.com/"
          target="_blank"
          className="flex items-center gap-2"
        >
          <span className="max-md:hidden">Learn more about Otto</span>
          <span className="md:hidden">Learn more</span>
          <SymbolIcon icon="open_in_new" size={20} />
        </a>
      </div>
      <a
        className="flex items-center rounded-full max-h-8 gap-2 bg-black text-white p-2"
        href="https://joinotto.com/apply"
        target="_blank"
      >
        <span>Talk to us</span>
        <SymbolIcon icon="keyboard_arrow_right" size={20} color="#FFFFFF" />
      </a>
    </div>
  );
};

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [permissions, setPermissions] = useState<any>();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    const fetchPermissions = async () => {
      const ucrmId = Cookies.get("otto-auth-ucrm");
      const data: any = await CompanyApis.getUCRM(ucrmId ?? "");
      console.log(data.permissions.routes);
      if (data?.permissions) setPermissions(data?.permissions);
    };
    fetchPermissions();
  }, []);

  useLayoutEffect(() => {
    if (typeof permissions === "object" && permissions && permissions?.routes) {
      if (!permissions?.routes?.dashboard && pathname === "/dashboard") {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.accounts &&
        pathname === "/dashboard/bank-connections"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.transactions &&
        pathname === "/dashboard/transactions"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.balanceSheet &&
        pathname === "/dashboard/balance-sheet"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.incomeStatement &&
        pathname === "/dashboard/income-statement"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.documents &&
        pathname === "/dashboard/documents"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (!permissions?.routes?.teams && pathname === "/dashboard/team") {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.controls &&
        pathname === "/dashboard/controls"
      ) {
        router.push("/dashboard/my-profile");
      }
      if (
        !permissions?.routes?.companyProfile &&
        pathname === "/dashboard/company-profile"
      ) {
        router.push("/dashboard/my-profile");
      }
    }
  }, [pathname, permissions, router]);

  return (
    <main className="h-full w-full bg-white">
      <div className="flex flex-col h-[100svh]">
        <DemoBanner />
        <div className="flex flex-row overflow-y-scroll h-full">
          <DashboardSidebar
            isOpen={isOpen}
            setOpen={setOpen}
            permissions={permissions}
          />
          <div className="flex flex-col flex-1 bg-white overflow-hidden">
            <DashboardTop toggleDrawer={() => setOpen(!isOpen)} />
            <div
              className={
                "px-4 sm:px-8 pt-4 pb-12 md:mx-8 overflow-y-auto overflow-x-hidden mt-14"
              }
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
