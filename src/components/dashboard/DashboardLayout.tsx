"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTop from "./DashboardTop";
import Image from "next/image";
import SymbolIcon from "../common/MaterialSymbol/SymbolIcon";
import { isDemoEnv } from "../../../config";

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
        href="https://joinotto.com/"
        target="_blank"
      >
        <span>Open Account</span>
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <main className="h-full w-full bg-white">
      <div className="flex flex-col h-[100svh]">
        <DemoBanner />
        <div className="flex flex-row overflow-y-scroll h-full">
          <DashboardSidebar isOpen={isOpen} setOpen={setOpen} />
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
