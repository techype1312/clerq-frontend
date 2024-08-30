"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTop from "./DashboardTop";

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
    <main className="flex min-h-screen max-h-screen bg-white">
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
    </main>
  );
};
