"use client";

import React, { useEffect, useState } from "react";
import DashboardTop from "../dashboard/DashboardTop";
import OnboardingHeader from "./Header";

export const NewCompanyLayout = ({
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
      <div className="flex flex-col flex-1 bg-white overflow-hidden">
        <OnboardingHeader />
        <div
          className={
            "px-4 sm:px-8 pt-4 md:mx-8 overflow-y-auto overflow-x-hidden"
          }
        >
          {children}
        </div>
      </div>
    </main>
  );
};
