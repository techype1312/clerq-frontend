"use client";

import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTop from "./DashboardTop";
import { usePathname } from "next/navigation";
import SettingsSidebar from "./SettingsSidebar";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const showSettingsSideBar = pathname.startsWith("/dashboard/settings");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <main className="flex min-h-screen max-h-screen bg-white">
      {showSettingsSideBar ? (
        <SettingsSidebar isOpen={isOpen} setOpen={setOpen} />
      ) : (
        <DashboardSidebar isOpen={isOpen} setOpen={setOpen} />
      )}

      <button
        className="absolute top-5 left-4 block lg:hidden z-10"
        onClick={() => setOpen(!isOpen)}
      >
        <Menu size={30} />
      </button>

      <div className="flex flex-col flex-1 bg-white overflow-hidden">
        <DashboardTop />
        <div
          className={
            "px-4 sm:px-8 pt-4 pb-12 mx-8 overflow-y-auto overflow-x-hidden"
          }
        >
          {children}
        </div>
      </div>
    </main>
  );
};
