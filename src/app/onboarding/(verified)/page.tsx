"use client";
import React from "react";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";

const Page = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-center justify-center h-[70vh] w-full">
      <SymbolIcon icon="error" size={60} color="#900B09" />
      <h1 className="text-primary text-2xl font-medium">
        404 - Page not found
      </h1>
      <p className="max-w-md text-label">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
    </div>
  );
};

export default Page;
